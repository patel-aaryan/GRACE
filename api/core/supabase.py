from supabase import create_client, Client
from api.core.config import settings


def get_supabase_client() -> Client:
    """Get Supabase client with service role key for elevated privileges"""
    return create_client(
        settings.SUPABASE_URL,
        settings.SUPABASE_SERVICE_ROLE_KEY
    )
