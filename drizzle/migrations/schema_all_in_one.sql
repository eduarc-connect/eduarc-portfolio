-- ============================================================================
-- EduArc Complete Database Schema (One-Shot Initializer & Migration)
-- Target Platform: Supabase / PostgreSQL 14+
-- Generated Date: 2026-11-02
--
-- Includes all features:
--   1. Editable Brochure Content (public.site_content)
--   2. PBKDF2 Encrypted Admin Credentials (public.admin_credentials)
--   3. PBKDF2 Encrypted Reception Credentials (public.reception_credentials)
--   4. Partner Enquiries & Lead Tracking with Consent (public.partner_enquiries)
--   5. Privacy-First Website Analytics (public.analytics_events)
--   6. WAF Security Incidents & Threat Logs (public.security_events)
--   7. IP Blocklist & Defense Engine (public.blocked_ips)
--   8. Row Level Security (RLS) Policies & Role Grants
--   9. Supabase Storage Buckets ('programs' & 'testimonials') Configuration
-- ============================================================================

-- 0. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ----------------------------------------------------------------------------
-- 1. SITE CONTENT (Publicly readable brochure CMS, Admin-only writes)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.site_content (
  id text PRIMARY KEY DEFAULT 'main',
  data jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Seed initial row if absent
INSERT INTO public.site_content (id, data, updated_at)
VALUES ('main', '{}'::jsonb, now())
ON CONFLICT (id) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 2. ADMIN CREDENTIALS (PBKDF2 salted credentials, single row id=1)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.admin_credentials (
  id integer PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  username text NOT NULL DEFAULT 'eduarc',
  password_hash text NOT NULL,
  salt text NOT NULL,
  iterations integer NOT NULL,
  failed_attempts integer NOT NULL DEFAULT 0,
  locked_until timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 3. RECEPTION CREDENTIALS (PBKDF2 salted credentials, single row id=1)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.reception_credentials (
  id integer PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  username text NOT NULL DEFAULT 'reception',
  password_hash text NOT NULL,
  salt text NOT NULL,
  iterations integer NOT NULL,
  failed_attempts integer NOT NULL DEFAULT 0,
  locked_until timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 4. PARTNER ENQUIRIES (Public submission, role-based metadata, consent)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.partner_enquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL CHECK (char_length(full_name) BETWEEN 2 AND 100),
  phone text NOT NULL CHECK (char_length(phone) BETWEEN 10 AND 15),
  whatsapp text NOT NULL CHECK (char_length(whatsapp) BETWEEN 10 AND 15),
  email text NOT NULL CHECK (char_length(email) BETWEEN 5 AND 255),
  college text CHECK (char_length(college) BETWEEN 2 AND 150),
  education text CHECK (char_length(education) BETWEEN 2 AND 100),
  status text CHECK (status IS NULL OR status IN ('done', 'contact_again', 'not_available', 'contacted', 'follow_up', 'resolved')),
  status_updated_at timestamptz,
  role text DEFAULT 'Unknown',
  child_name text,
  designation text,
  mentor_expertise text,
  remarks text,
  consent_given boolean DEFAULT true,
  consent_timestamp timestamptz DEFAULT now(),
  consent_version text DEFAULT '2026.1',
  marketing_consent boolean DEFAULT false,
  marketing_consent_timestamp timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Ensure upgrade safety for pre-existing partner_enquiries tables
ALTER TABLE public.partner_enquiries
  ADD COLUMN IF NOT EXISTS role text DEFAULT 'Unknown',
  ADD COLUMN IF NOT EXISTS child_name text,
  ADD COLUMN IF NOT EXISTS designation text,
  ADD COLUMN IF NOT EXISTS mentor_expertise text,
  ADD COLUMN IF NOT EXISTS remarks text,
  ADD COLUMN IF NOT EXISTS consent_given boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS consent_timestamp timestamptz DEFAULT now(),
  ADD COLUMN IF NOT EXISTS consent_version text DEFAULT '2026.1',
  ADD COLUMN IF NOT EXISTS marketing_consent boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS marketing_consent_timestamp timestamptz;

-- Ensure college and education are nullable for parents/mentors
ALTER TABLE public.partner_enquiries ALTER COLUMN college DROP NOT NULL;
ALTER TABLE public.partner_enquiries ALTER COLUMN education DROP NOT NULL;

-- Update status check constraint if table already existed with legacy statuses
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'partner_enquiries_status_check'
  ) THEN
    ALTER TABLE public.partner_enquiries DROP CONSTRAINT partner_enquiries_status_check;
  END IF;
  ALTER TABLE public.partner_enquiries
    ADD CONSTRAINT partner_enquiries_status_check
    CHECK (status IS NULL OR status IN ('done', 'contact_again', 'not_available', 'contacted', 'follow_up', 'resolved'));
EXCEPTION WHEN OTHERS THEN
  NULL;
END $$;

-- Indices for partner_enquiries
CREATE INDEX IF NOT EXISTS partner_enquiries_created_at_idx ON public.partner_enquiries (created_at DESC);
CREATE INDEX IF NOT EXISTS partner_enquiries_role_idx ON public.partner_enquiries (role);
CREATE INDEX IF NOT EXISTS partner_enquiries_marketing_consent_idx ON public.partner_enquiries (marketing_consent);

-- ----------------------------------------------------------------------------
-- 5. ESSENTIAL WEBSITE ANALYTICS (Zero-PII events & visitor tracking)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.analytics_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  visitor_id text NOT NULL,
  event_type text NOT NULL, -- 'page_view', 'cta_click', 'contact_click', 'enquiry_submit'
  path text NOT NULL,
  referrer text,
  source text DEFAULT 'direct',      -- 'direct', 'organic', 'referral', 'social'
  device_type text DEFAULT 'desktop', -- 'mobile', 'tablet', 'desktop'
  browser text DEFAULT 'other',
  os text DEFAULT 'other',
  country text DEFAULT 'IN',
  event_label text,                 -- 'cta:book_mentor', 'link:tel', 'form:partner_enquiry'
  duration_seconds integer DEFAULT 0,
  is_new_visitor boolean DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Indices for rapid querying in analytics dashboard
CREATE INDEX IF NOT EXISTS analytics_events_created_at_idx ON public.analytics_events (created_at DESC);
CREATE INDEX IF NOT EXISTS analytics_events_event_type_idx ON public.analytics_events (event_type);
CREATE INDEX IF NOT EXISTS analytics_events_path_idx ON public.analytics_events (path);
CREATE INDEX IF NOT EXISTS analytics_events_visitor_id_idx ON public.analytics_events (visitor_id);
CREATE INDEX IF NOT EXISTS analytics_events_session_id_idx ON public.analytics_events (session_id);

-- ----------------------------------------------------------------------------
-- 6. SECURITY MONITORING & WAF THREAT LOGS (Layer 7 incident logs)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.security_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ip text NOT NULL,
  event_type text NOT NULL, -- 'failed_login', 'rate_limit_exceeded', 'sql_injection_attempt', 'xss_attempt', 'probing_attempt', 'unauthorized_access', 'bot_abuse', 'suspicious_request'
  severity text NOT NULL,   -- 'low', 'medium', 'high', 'critical'
  description text NOT NULL,
  path text NOT NULL,
  method text NOT NULL DEFAULT 'GET',
  status_code integer NOT NULL DEFAULT 200,
  user_agent text,
  country text DEFAULT 'IN',
  action_taken text NOT NULL DEFAULT 'logged', -- 'logged', 'blocked', 'rate_limited', 'locked_out'
  details jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Indices for rapid security forensics
CREATE INDEX IF NOT EXISTS security_events_created_at_idx ON public.security_events (created_at DESC);
CREATE INDEX IF NOT EXISTS security_events_ip_idx ON public.security_events (ip);
CREATE INDEX IF NOT EXISTS security_events_event_type_idx ON public.security_events (event_type);
CREATE INDEX IF NOT EXISTS security_events_severity_idx ON public.security_events (severity);

-- ----------------------------------------------------------------------------
-- 7. BLOCKED IP ADDRESSES (In-memory & persistent IP blocklist)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.blocked_ips (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ip text NOT NULL UNIQUE,
  reason text NOT NULL,
  severity text NOT NULL DEFAULT 'high',
  blocked_by text NOT NULL DEFAULT 'system', -- 'system' | 'admin'
  expires_at timestamptz,                   -- NULL = permanent, or timestamp for auto-expiry
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Indices for blocklist lookups
CREATE INDEX IF NOT EXISTS blocked_ips_ip_idx ON public.blocked_ips (ip);
CREATE INDEX IF NOT EXISTS blocked_ips_expires_at_idx ON public.blocked_ips (expires_at);

-- ----------------------------------------------------------------------------
-- 8. ROW LEVEL SECURITY (RLS) POLICIES
-- ----------------------------------------------------------------------------
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_credentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reception_credentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blocked_ips ENABLE ROW LEVEL SECURITY;

-- 8a. Site Content: Public read, Service Role write
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'site_content' AND policyname = 'Site content is publicly readable'
  ) THEN
    CREATE POLICY "Site content is publicly readable" ON public.site_content
      FOR SELECT TO anon, authenticated
      USING (true);
  END IF;
END $$;

-- 8b. Analytics Events: Public insert, Service Role read
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'analytics_events' AND policyname = 'Allow public insert of analytics'
  ) THEN
    CREATE POLICY "Allow public insert of analytics" ON public.analytics_events
      FOR INSERT TO public
      WITH CHECK (true);
  END IF;
END $$;

-- 8c. Security Events: Public insert, Service Role read
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'security_events' AND policyname = 'Allow public insert of security events'
  ) THEN
    CREATE POLICY "Allow public insert of security events" ON public.security_events
      FOR INSERT TO public
      WITH CHECK (true);
  END IF;
END $$;

-- 8d. Blocked IPs: Public read (for edge sync), Service Role write
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'blocked_ips' AND policyname = 'Allow public read of blocked ips'
  ) THEN
    CREATE POLICY "Allow public read of blocked ips" ON public.blocked_ips
      FOR SELECT TO public
      USING (true);
  END IF;
END $$;

-- ----------------------------------------------------------------------------
-- 9. PERMISSIONS & ROLE GRANTS
-- ----------------------------------------------------------------------------
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

-- Public read for brochure site content
GRANT SELECT ON public.site_content TO anon, authenticated;
GRANT ALL ON public.site_content TO service_role;

-- Full service_role access on credentials (no anon/authenticated access)
GRANT ALL ON public.admin_credentials TO service_role;
GRANT ALL ON public.reception_credentials TO service_role;

-- Service role access on enquiries (public submits via server function)
GRANT ALL ON public.partner_enquiries TO service_role;

-- Analytics: public insert, service_role full management
GRANT INSERT ON public.analytics_events TO anon, authenticated;
GRANT ALL ON public.analytics_events TO service_role;

-- Security Events: public insert, service_role full management
GRANT INSERT ON public.security_events TO anon, authenticated;
GRANT ALL ON public.security_events TO service_role;

-- Blocked IPs: public select, service_role full management
GRANT SELECT ON public.blocked_ips TO anon, authenticated;
GRANT ALL ON public.blocked_ips TO service_role;

-- ----------------------------------------------------------------------------
-- 10. SUPABASE STORAGE (Buckets for programs & testimonials assets)
-- ----------------------------------------------------------------------------
DO $$
BEGIN
  -- Insert buckets if storage schema exists (standard Supabase managed instances)
  IF EXISTS (SELECT 1 FROM information_schema.schemata WHERE schema_name = 'storage') THEN
    INSERT INTO storage.buckets (id, name, public)
    VALUES ('programs', 'programs', true)
    ON CONFLICT (id) DO NOTHING;

    INSERT INTO storage.buckets (id, name, public)
    VALUES ('testimonials', 'testimonials', true)
    ON CONFLICT (id) DO NOTHING;

    -- Storage policy: Allow public read of programs and testimonials bucket assets
    IF NOT EXISTS (
      SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Public Access Programs'
    ) THEN
      CREATE POLICY "Public Access Programs" ON storage.objects
        FOR SELECT TO public
        USING (bucket_id = 'programs');
    END IF;

    IF NOT EXISTS (
      SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Public Access Testimonials'
    ) THEN
      CREATE POLICY "Public Access Testimonials" ON storage.objects
        FOR SELECT TO public
        USING (bucket_id = 'testimonials');
    END IF;
  END IF;
EXCEPTION WHEN OTHERS THEN
  -- Safe fallback if storage schema is managed differently by cloud provider
  NULL;
END $$;

-- ============================================================================
-- Schema initialization complete!
-- All 7 tables, indices, RLS policies, grants, and storage buckets are ready.
-- ============================================================================

