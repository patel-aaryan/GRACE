"""remove_profiles_created_at

Revision ID: 6046a425e14e
Revises: 7512b87205dd
Create Date: 2025-06-28 12:17:04.551481

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
import sqlmodel


# revision identifiers, used by Alembic.
revision: str = '6046a425e14e'
down_revision: Union[str, None] = '7512b87205dd'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Remove created_at column from profiles table since it's redundant with auth.users.created_at."""

    # Drop the created_at column from profiles
    op.drop_column('profiles', 'created_at')

    # Update the trigger function to not insert created_at
    op.execute("""
        CREATE OR REPLACE FUNCTION public.create_user_profile()
        RETURNS TRIGGER AS $$
        BEGIN
            INSERT INTO public.profiles (
                id,
                preferred_speech_speed,
                preferred_avatar_type,
                accessibility_preferences,
                updated_at
            )
            VALUES (
                NEW.id,
                1.0,  -- default speech speed
                '3D', -- default avatar type
                '{}'::jsonb, -- default empty accessibility preferences
                NOW()
            );
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER;
    """)


def downgrade() -> None:
    """Add back the created_at column."""

    # Add back the created_at column
    op.add_column('profiles', sa.Column('created_at', sa.TIMESTAMP(timezone=True),
                                        server_default=sa.text('now()'), nullable=False))

    # Restore the trigger function to include created_at
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
