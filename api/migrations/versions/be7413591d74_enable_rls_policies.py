"""enable_rls_policies

Revision ID: be7413591d74
Revises: 70369e29012e
Create Date: 2025-06-27 22:42:24.292155

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
import sqlmodel


# revision identifiers, used by Alembic.
revision: str = 'be7413591d74'
down_revision: Union[str, None] = '70369e29012e'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Enable RLS and create security policies for all tables."""

    # Enable RLS on all tables
    op.execute("ALTER TABLE profiles ENABLE ROW LEVEL SECURITY")
    op.execute("ALTER TABLE caregivers ENABLE ROW LEVEL SECURITY")
    op.execute("ALTER TABLE sessions ENABLE ROW LEVEL SECURITY")
    op.execute("ALTER TABLE chat_turns ENABLE ROW LEVEL SECURITY")
    op.execute("ALTER TABLE medications ENABLE ROW LEVEL SECURITY")
    op.execute("ALTER TABLE medication_reminders ENABLE ROW LEVEL SECURITY")
    op.execute("ALTER TABLE notes ENABLE ROW LEVEL SECURITY")
    op.execute("ALTER TABLE session_activities ENABLE ROW LEVEL SECURITY")
    op.execute("ALTER TABLE session_topics ENABLE ROW LEVEL SECURITY")

    # Activities and topics are public read for authenticated users
    op.execute("ALTER TABLE activities ENABLE ROW LEVEL SECURITY")
    op.execute("ALTER TABLE topics ENABLE ROW LEVEL SECURITY")

    # Profiles policies - users can only access their own profile
    op.execute("""
        CREATE POLICY "Users can view own profile" ON profiles
        FOR SELECT USING (auth.uid()::text = id::text)
    """)

    op.execute("""
        CREATE POLICY "Users can update own profile" ON profiles
        FOR UPDATE USING (auth.uid()::text = id::text)
    """)

    op.execute("""
        CREATE POLICY "Users can insert own profile" ON profiles
        FOR INSERT WITH CHECK (auth.uid()::text = id::text)
    """)

    # Caregivers can view profiles they manage
    op.execute("""
        CREATE POLICY "Caregivers can view managed profiles" ON profiles
        FOR SELECT USING (
            EXISTS (
                SELECT 1 FROM caregivers c 
                WHERE c.id = profiles.caregiver_id 
                AND auth.uid()::text = c.id::text
            )
        )
    """)

    # Caregiver policies - caregivers can only access their own data
    op.execute("""
        CREATE POLICY "Caregivers can view own data" ON caregivers
        FOR SELECT USING (auth.uid()::text = id::text)
    """)

    op.execute("""
        CREATE POLICY "Caregivers can update own data" ON caregivers
        FOR UPDATE USING (auth.uid()::text = id::text)
    """)

    op.execute("""
        CREATE POLICY "Caregivers can insert own data" ON caregivers
        FOR INSERT WITH CHECK (auth.uid()::text = id::text)
    """)

    # Sessions policies - users can only access their own sessions
    op.execute("""
        CREATE POLICY "Users can view own sessions" ON sessions
        FOR SELECT USING (auth.uid()::text = profile_id::text)
    """)

    op.execute("""
        CREATE POLICY "Users can insert own sessions" ON sessions
        FOR INSERT WITH CHECK (auth.uid()::text = profile_id::text)
    """)

    op.execute("""
        CREATE POLICY "Users can update own sessions" ON sessions
        FOR UPDATE USING (auth.uid()::text = profile_id::text)
    """)

    # Caregivers can view sessions of managed profiles
    op.execute("""
        CREATE POLICY "Caregivers can view managed sessions" ON sessions
        FOR SELECT USING (
            EXISTS (
                SELECT 1 FROM profiles p 
                JOIN caregivers c ON p.caregiver_id = c.id
                WHERE p.id = sessions.profile_id 
                AND auth.uid()::text = c.id::text
            )
        )
    """)

    # Chat turns policies - users can only access chat turns from their sessions
    op.execute("""
        CREATE POLICY "Users can view own chat turns" ON chat_turns
        FOR SELECT USING (
            EXISTS (
                SELECT 1 FROM sessions s 
                WHERE s.id = chat_turns.session_id 
                AND auth.uid()::text = s.profile_id::text
            )
        )
    """)

    op.execute("""
        CREATE POLICY "Users can insert own chat turns" ON chat_turns
        FOR INSERT WITH CHECK (
            EXISTS (
                SELECT 1 FROM sessions s 
                WHERE s.id = chat_turns.session_id 
                AND auth.uid()::text = s.profile_id::text
            )
        )
    """)

    # Caregivers can view chat turns of managed profiles
    op.execute("""
        CREATE POLICY "Caregivers can view managed chat turns" ON chat_turns
        FOR SELECT USING (
            EXISTS (
                SELECT 1 FROM sessions s 
                JOIN profiles p ON s.profile_id = p.id
                JOIN caregivers c ON p.caregiver_id = c.id
                WHERE s.id = chat_turns.session_id 
                AND auth.uid()::text = c.id::text
            )
        )
    """)

    # Medications policies
    op.execute("""
        CREATE POLICY "Users can view own medications" ON medications
        FOR SELECT USING (auth.uid()::text = profile_id::text)
    """)

    op.execute("""
        CREATE POLICY "Users can manage own medications" ON medications
        FOR ALL USING (auth.uid()::text = profile_id::text)
    """)

    # Caregivers can view medications of managed profiles
    op.execute("""
        CREATE POLICY "Caregivers can view managed medications" ON medications
        FOR SELECT USING (
            EXISTS (
                SELECT 1 FROM profiles p 
                JOIN caregivers c ON p.caregiver_id = c.id
                WHERE p.id = medications.profile_id 
                AND auth.uid()::text = c.id::text
            )
        )
    """)

    # Medication reminders policies
    op.execute("""
        CREATE POLICY "Users can view own medication reminders" ON medication_reminders
        FOR SELECT USING (
            EXISTS (
                SELECT 1 FROM medications m 
                WHERE m.id = medication_reminders.medication_id 
                AND auth.uid()::text = m.profile_id::text
            )
        )
    """)

    op.execute("""
        CREATE POLICY "Users can manage own medication reminders" ON medication_reminders
        FOR ALL USING (
            EXISTS (
                SELECT 1 FROM medications m 
                WHERE m.id = medication_reminders.medication_id 
                AND auth.uid()::text = m.profile_id::text
            )
        )
    """)

    # Notes policies
    op.execute("""
        CREATE POLICY "Users can view own notes" ON notes
        FOR SELECT USING (
            EXISTS (
                SELECT 1 FROM sessions s 
                WHERE s.id = notes.session_id 
                AND auth.uid()::text = s.profile_id::text
            )
        )
    """)

    op.execute("""
        CREATE POLICY "Users can manage own notes" ON notes
        FOR ALL USING (
            EXISTS (
                SELECT 1 FROM sessions s 
                WHERE s.id = notes.session_id 
                AND auth.uid()::text = s.profile_id::text
            )
        )
    """)

    # Session activities policies
    op.execute("""
        CREATE POLICY "Users can view own session activities" ON session_activities
        FOR SELECT USING (
            EXISTS (
                SELECT 1 FROM sessions s 
                WHERE s.id = session_activities.session_id 
                AND auth.uid()::text = s.profile_id::text
            )
        )
    """)

    op.execute("""
        CREATE POLICY "Users can manage own session activities" ON session_activities
        FOR ALL USING (
            EXISTS (
                SELECT 1 FROM sessions s 
                WHERE s.id = session_activities.session_id 
                AND auth.uid()::text = s.profile_id::text
            )
        )
    """)

    # Session topics policies
    op.execute("""
        CREATE POLICY "Users can view own session topics" ON session_topics
        FOR SELECT USING (
            EXISTS (
                SELECT 1 FROM sessions s 
                WHERE s.id = session_topics.session_id 
                AND auth.uid()::text = s.profile_id::text
            )
        )
    """)

    op.execute("""
        CREATE POLICY "Users can manage own session topics" ON session_topics
        FOR ALL USING (
            EXISTS (
                SELECT 1 FROM sessions s 
                WHERE s.id = session_topics.session_id 
                AND auth.uid()::text = s.profile_id::text
            )
        )
    """)

    # Activities - public read for authenticated users
    op.execute("""
        CREATE POLICY "Authenticated users can view activities" ON activities
        FOR SELECT USING (auth.role() = 'authenticated')
    """)

    # Topics - public read for authenticated users
    op.execute("""
        CREATE POLICY "Authenticated users can view topics" ON topics
        FOR SELECT USING (auth.role() = 'authenticated')
    """)

    # Service role can bypass RLS for admin operations
    op.execute("""
        CREATE POLICY "Service role bypass" ON profiles
        FOR ALL USING (auth.role() = 'service_role')
    """)

    op.execute("""
        CREATE POLICY "Service role bypass" ON caregivers
        FOR ALL USING (auth.role() = 'service_role')
    """)

    op.execute("""
        CREATE POLICY "Service role bypass" ON sessions
        FOR ALL USING (auth.role() = 'service_role')
    """)

    op.execute("""
        CREATE POLICY "Service role bypass" ON chat_turns
        FOR ALL USING (auth.role() = 'service_role')
    """)

    op.execute("""
        CREATE POLICY "Service role bypass" ON medications
        FOR ALL USING (auth.role() = 'service_role')
    """)

    op.execute("""
        CREATE POLICY "Service role bypass" ON medication_reminders
        FOR ALL USING (auth.role() = 'service_role')
    """)

    op.execute("""
        CREATE POLICY "Service role bypass" ON notes
        FOR ALL USING (auth.role() = 'service_role')
    """)

    op.execute("""
        CREATE POLICY "Service role bypass" ON session_activities
        FOR ALL USING (auth.role() = 'service_role')
    """)

    op.execute("""
        CREATE POLICY "Service role bypass" ON session_topics
        FOR ALL USING (auth.role() = 'service_role')
    """)

    op.execute("""
        CREATE POLICY "Service role bypass" ON activities
        FOR ALL USING (auth.role() = 'service_role')
    """)

    op.execute("""
        CREATE POLICY "Service role bypass" ON topics
        FOR ALL USING (auth.role() = 'service_role')
    """)


def downgrade() -> None:
    """Disable RLS and drop all security policies."""

    # Drop all policies first
    op.execute("DROP POLICY IF EXISTS \"Users can view own profile\" ON profiles")
    op.execute(
        "DROP POLICY IF EXISTS \"Users can update own profile\" ON profiles")
    op.execute(
        "DROP POLICY IF EXISTS \"Users can insert own profile\" ON profiles")
    op.execute(
        "DROP POLICY IF EXISTS \"Caregivers can view managed profiles\" ON profiles")
    op.execute("DROP POLICY IF EXISTS \"Service role bypass\" ON profiles")

    op.execute(
        "DROP POLICY IF EXISTS \"Caregivers can view own data\" ON caregivers")
    op.execute(
        "DROP POLICY IF EXISTS \"Caregivers can update own data\" ON caregivers")
    op.execute(
        "DROP POLICY IF EXISTS \"Caregivers can insert own data\" ON caregivers")
    op.execute("DROP POLICY IF EXISTS \"Service role bypass\" ON caregivers")

    op.execute("DROP POLICY IF EXISTS \"Users can view own sessions\" ON sessions")
    op.execute(
        "DROP POLICY IF EXISTS \"Users can insert own sessions\" ON sessions")
    op.execute(
        "DROP POLICY IF EXISTS \"Users can update own sessions\" ON sessions")
    op.execute(
        "DROP POLICY IF EXISTS \"Caregivers can view managed sessions\" ON sessions")
    op.execute("DROP POLICY IF EXISTS \"Service role bypass\" ON sessions")

    op.execute(
        "DROP POLICY IF EXISTS \"Users can view own chat turns\" ON chat_turns")
    op.execute(
        "DROP POLICY IF EXISTS \"Users can insert own chat turns\" ON chat_turns")
    op.execute(
        "DROP POLICY IF EXISTS \"Caregivers can view managed chat turns\" ON chat_turns")
    op.execute("DROP POLICY IF EXISTS \"Service role bypass\" ON chat_turns")

    op.execute(
        "DROP POLICY IF EXISTS \"Users can view own medications\" ON medications")
    op.execute(
        "DROP POLICY IF EXISTS \"Users can manage own medications\" ON medications")
    op.execute(
        "DROP POLICY IF EXISTS \"Caregivers can view managed medications\" ON medications")
    op.execute("DROP POLICY IF EXISTS \"Service role bypass\" ON medications")

    op.execute(
        "DROP POLICY IF EXISTS \"Users can view own medication reminders\" ON medication_reminders")
    op.execute(
        "DROP POLICY IF EXISTS \"Users can manage own medication reminders\" ON medication_reminders")
    op.execute(
        "DROP POLICY IF EXISTS \"Service role bypass\" ON medication_reminders")

    op.execute("DROP POLICY IF EXISTS \"Users can view own notes\" ON notes")
    op.execute("DROP POLICY IF EXISTS \"Users can manage own notes\" ON notes")
    op.execute("DROP POLICY IF EXISTS \"Service role bypass\" ON notes")

    op.execute(
        "DROP POLICY IF EXISTS \"Users can view own session activities\" ON session_activities")
    op.execute(
        "DROP POLICY IF EXISTS \"Users can manage own session activities\" ON session_activities")
    op.execute(
        "DROP POLICY IF EXISTS \"Service role bypass\" ON session_activities")

    op.execute(
        "DROP POLICY IF EXISTS \"Users can view own session topics\" ON session_topics")
    op.execute(
        "DROP POLICY IF EXISTS \"Users can manage own session topics\" ON session_topics")
    op.execute("DROP POLICY IF EXISTS \"Service role bypass\" ON session_topics")

    op.execute(
        "DROP POLICY IF EXISTS \"Authenticated users can view activities\" ON activities")
    op.execute("DROP POLICY IF EXISTS \"Service role bypass\" ON activities")

    op.execute(
        "DROP POLICY IF EXISTS \"Authenticated users can view topics\" ON topics")
    op.execute("DROP POLICY IF EXISTS \"Service role bypass\" ON topics")

    # Disable RLS on all tables
    op.execute("ALTER TABLE profiles DISABLE ROW LEVEL SECURITY")
    op.execute("ALTER TABLE caregivers DISABLE ROW LEVEL SECURITY")
    op.execute("ALTER TABLE sessions DISABLE ROW LEVEL SECURITY")
    op.execute("ALTER TABLE chat_turns DISABLE ROW LEVEL SECURITY")
    op.execute("ALTER TABLE medications DISABLE ROW LEVEL SECURITY")
    op.execute("ALTER TABLE medication_reminders DISABLE ROW LEVEL SECURITY")
    op.execute("ALTER TABLE notes DISABLE ROW LEVEL SECURITY")
    op.execute("ALTER TABLE session_activities DISABLE ROW LEVEL SECURITY")
    op.execute("ALTER TABLE session_topics DISABLE ROW LEVEL SECURITY")
    op.execute("ALTER TABLE activities DISABLE ROW LEVEL SECURITY")
    op.execute("ALTER TABLE topics DISABLE ROW LEVEL SECURITY")
