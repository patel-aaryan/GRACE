"""remove_duplicate_auth_fields

Revision ID: 7512b87205dd
Revises: fb35bbfccc83
Create Date: 2025-06-28 11:48:19.485158

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
import sqlmodel
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '7512b87205dd'
down_revision: Union[str, None] = 'fb35bbfccc83'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Remove duplicate fields that are already in auth.users."""

    # Drop columns that duplicate auth.users data
    op.drop_index('ix_profiles_email', table_name='profiles')
    op.drop_column('profiles', 'email')
    op.drop_index('ix_profiles_full_name', table_name='profiles')
    op.drop_column('profiles', 'full_name')
    op.drop_column('profiles', 'phone_number')

    # Update the trigger function to only insert profile-specific data
    op.execute("""
        CREATE OR REPLACE FUNCTION public.create_user_profile()
        RETURNS TRIGGER AS $$
        BEGIN
            INSERT INTO public.profiles (
                id,
                preferred_speech_speed,
                preferred_avatar_type,
                accessibility_preferences,
                created_at,
                updated_at
            )
            VALUES (
                NEW.id,
                1.0,  -- default speech speed
                '3D', -- default avatar type
                '{}'::jsonb, -- default empty accessibility preferences
                NOW(),
                NOW()
            );
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER;
    """)


def downgrade() -> None:
    """Add back the duplicate fields."""

    # Add back the columns
    op.add_column('profiles', sa.Column('email', sa.String(), nullable=True))
    op.add_column('profiles', sa.Column(
        'full_name', sa.String(), nullable=True))
    op.add_column('profiles', sa.Column(
        'phone_number', sa.String(), nullable=True))

    # Recreate the indexes
    op.create_index('ix_profiles_email', 'profiles', ['email'], unique=True)
    op.create_index('ix_profiles_full_name', 'profiles',
                    ['full_name'], unique=False)

    # Restore the original trigger function
    op.execute("""
        CREATE OR REPLACE FUNCTION public.create_user_profile()
        RETURNS TRIGGER AS $$
        BEGIN
            INSERT INTO public.profiles (
                id,
                email,
                full_name,
                preferred_speech_speed,
                preferred_avatar_type,
                accessibility_preferences,
                created_at,
                updated_at
            )
            VALUES (
                NEW.id,
                NEW.email,
                COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
                1.0,  -- default speech speed
                '3D', -- default avatar type
                '{}'::jsonb, -- default empty accessibility preferences
                NOW(),
                NOW()
            );
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER;
    """)
