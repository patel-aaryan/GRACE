"""create_user_profile_trigger

Revision ID: fb35bbfccc83
Revises: be7413591d74
Create Date: 2025-06-28 11:37:58.251725

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
import sqlmodel


# revision identifiers, used by Alembic.
revision: str = 'fb35bbfccc83'
down_revision: Union[str, None] = 'be7413591d74'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""

    # First, modify the profiles table to work with Supabase auth
    # Remove the hashed_password column since Supabase manages passwords
    op.drop_column('profiles', 'hashed_password')

    # Add created_at and updated_at columns for better tracking
    op.add_column('profiles', sa.Column('created_at', sa.TIMESTAMP(timezone=True),
                                        server_default=sa.text('now()'), nullable=False))
    op.add_column('profiles', sa.Column('updated_at', sa.TIMESTAMP(timezone=True),
                                        server_default=sa.text('now()'), nullable=False))

    # Add a foreign key constraint to auth.users
    # Note: This assumes auth.users table exists (standard in Supabase)
    op.execute("ALTER TABLE profiles ADD CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users (id) ON DELETE CASCADE")

    # Create the trigger function that will create a profile when a user signs up
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

    # Create the trigger that fires when a new user is created in auth.users
    op.execute("""
        CREATE TRIGGER create_user_profile_trigger
        AFTER INSERT ON auth.users
        FOR EACH ROW
        EXECUTE FUNCTION public.create_user_profile();
    """)

    # Create a trigger function for updating the updated_at column
    op.execute("""
        CREATE OR REPLACE FUNCTION public.update_updated_at_column()
        RETURNS TRIGGER AS $$
        BEGIN
            NEW.updated_at = NOW();
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;
    """)

    # Create trigger to automatically update the updated_at column on profile updates
    op.execute("""
        CREATE TRIGGER update_profiles_updated_at
        BEFORE UPDATE ON public.profiles
        FOR EACH ROW
        EXECUTE FUNCTION public.update_updated_at_column();
    """)


def downgrade() -> None:
    """Downgrade schema."""

    # Drop the triggers first
    op.execute("DROP TRIGGER IF EXISTS create_user_profile_trigger ON auth.users")
    op.execute(
        "DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles")

    # Drop the trigger functions
    op.execute("DROP FUNCTION IF EXISTS public.create_user_profile()")
    op.execute("DROP FUNCTION IF EXISTS public.update_updated_at_column()")

    # Remove the foreign key constraint
    op.execute("ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey")

    # Remove the added columns
    op.drop_column('profiles', 'updated_at')
    op.drop_column('profiles', 'created_at')

    # Add back the hashed_password column (though this would break existing data)
    op.add_column('profiles', sa.Column(
        'hashed_password', sa.String(), nullable=True))
