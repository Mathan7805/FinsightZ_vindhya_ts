-- Create users table for password-based authentication
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  persona TEXT NOT NULL CHECK (persona IN ('ceo', 'cfo', 'finance', 'it', 'operations', 'facilities')),
  name TEXT NOT NULL,
  must_change_password BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for email lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users (email);

-- Seed default users with temp password "temp123"
-- SHA-256 hash of "temp123" = 0a19533d8eae0719d0e75b3cfb2d80808111b7612756418145cc7103e621f352
INSERT INTO public.users (email, password_hash, persona, name, must_change_password) VALUES
  ('ceo@finsightz.io', '0a19533d8eae0719d0e75b3cfb2d80808111b7612756418145cc7103e621f352', 'ceo', 'CEO', true),
  ('cfo@finsightz.io', '0a19533d8eae0719d0e75b3cfb2d80808111b7612756418145cc7103e621f352', 'cfo', 'CFO', true),
  ('finance@finsightz.io', '0a19533d8eae0719d0e75b3cfb2d80808111b7612756418145cc7103e621f352', 'finance', 'Finance Lead', true),
  ('it@finsightz.io', '0a19533d8eae0719d0e75b3cfb2d80808111b7612756418145cc7103e621f352', 'it', 'IT Admin', true),
  ('operations@finsightz.io', '0a19533d8eae0719d0e75b3cfb2d80808111b7612756418145cc7103e621f352', 'operations', 'Operations Head', true),
  ('facilities@finsightz.io', '0a19533d8eae0719d0e75b3cfb2d80808111b7612756418145cc7103e621f352', 'facilities', 'Facilities Head', true)
ON CONFLICT (email) DO NOTHING;

-- Enable RLS (service role bypasses this, so server functions still work)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- No public read policy — only service role can query this table
