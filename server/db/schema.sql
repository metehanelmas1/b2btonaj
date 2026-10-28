-- ============================================================
-- TONAJ.B2B — PostgreSQL Database Schema
-- Engine: PostgreSQL 15+
-- ============================================================

-- ============================================================
-- EXTENSIONS
-- ============================================================
CREATE EXTENSION IF NOT EXISTS "pgcrypto";   -- gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "pg_trgm";    -- full-text trigram search

-- ============================================================
-- ENUMS
-- ============================================================

CREATE TYPE sector_type AS ENUM (
    'beton',
    'tas_ocagi',
    'hurda',
    'antrepo_gumruk',
    'demir',
    'kereste',
    'nakliye_lojistik'
);

CREATE TYPE weighing_status AS ENUM (
    'IN_TRANSIT',
    'WEIGHED',
    'DELIVERED',
    'DISPUTED'
);

CREATE TYPE uetds_status AS ENUM (
    'APPROVED',
    'PENDING',
    'ERROR'
);

CREATE TYPE ewaybill_status AS ENUM (
    'SENT',
    'PENDING',
    'DRAFT'
);

CREATE TYPE risk_status AS ENUM (
    'GREEN',
    'YELLOW',
    'RED'
);

CREATE TYPE compliance_alert_type AS ENUM (
    'U_ETDS',
    'MAPEG',
    'AXLE_LIMIT',
    'SLUMP_TIMEOUT',
    'MOTAT_WASTE'
);

CREATE TYPE severity_level AS ENUM (
    'CRITICAL',
    'WARNING',
    'INFO'
);

CREATE TYPE settlement_status AS ENUM (
    'APPROVED',
    'DISPUTED',
    'ADJUSTED'
);

CREATE TYPE payment_status AS ENUM (
    'TRANSFERRED_T1',
    'PENDING',
    'REJECTED',
    'CANCELLED'
);

CREATE TYPE vehicle_type AS ENUM (
    'Damperli Kamyon',
    'Mikser',
    'Sal Kasa Tır',
    'Silobas',
    'Konteyner Taşıyıcı'
);

CREATE TYPE urgency_level AS ENUM (
    'HIGH',
    'MEDIUM',
    'NORMAL'
);

-- ============================================================
-- CORE TABLES
-- ============================================================

-- 1. SECTORS (master data, rarely changes)
CREATE TABLE sectors (
    id              sector_type     PRIMARY KEY,
    name            VARCHAR(120)    NOT NULL,
    tagline         VARCHAR(255)    NOT NULL,
    icon            VARCHAR(64)     NOT NULL,
    primary_metric_label  VARCHAR(100) NOT NULL,
    primary_metric_value  VARCHAR(100) NOT NULL,
    risk_factor     VARCHAR(120)    NOT NULL,
    compliance_key  VARCHAR(255)    NOT NULL,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

-- 2. USERS
CREATE TABLE users (
    id                        UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    email                     VARCHAR(255)    NOT NULL UNIQUE,
    name                      VARCHAR(120)    NOT NULL,
    password_hash             VARCHAR(255)    NOT NULL,   -- bcrypt hash
    company_name              VARCHAR(200)    NOT NULL,
    tax_no                    VARCHAR(20)     NOT NULL,
    sector                    sector_type     NOT NULL DEFAULT 'beton',
    role                      VARCHAR(100)    NOT NULL DEFAULT 'Tesis Yöneticisi',
    token                     VARCHAR(512),              -- JWT token (rotated on login)
    has_completed_onboarding  BOOLEAN         NOT NULL DEFAULT FALSE,
    weighbridge_model         VARCHAR(120),
    uetds_company_code        VARCHAR(64),
    created_at                TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at                TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_email     ON users (email);
CREATE INDEX idx_users_tax_no    ON users (tax_no);
CREATE INDEX idx_users_sector    ON users (sector);

-- 3. COMPANIES (separate from users — companies are B2B parties in transactions)
CREATE TABLE companies (
    id              UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(200)    NOT NULL,
    tax_no          VARCHAR(20)     NOT NULL UNIQUE,
    sector          VARCHAR(120),
    phone           VARCHAR(20),
    email           VARCHAR(255),
    address         TEXT,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_companies_tax_no ON companies (tax_no);
CREATE INDEX idx_companies_name   ON companies USING gin (name gin_trgm_ops);

-- 4. VEHICLES
CREATE TABLE vehicles (
    id                  UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    plate               VARCHAR(20)     NOT NULL UNIQUE,
    trailer_plate       VARCHAR(20),
    company_id          UUID            REFERENCES companies (id) ON DELETE SET NULL,
    iot_hardware_sha    VARCHAR(128),   -- SHA-256 hardware fingerprint (immutable once set)
    weighbridge_model   VARCHAR(120),
    max_legal_weight_kg INT             NOT NULL DEFAULT 42000,
    axle_count          INT             NOT NULL DEFAULT 5,
    created_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_vehicles_plate    ON vehicles (plate);
CREATE INDEX idx_vehicles_company  ON vehicles (company_id);

-- 5. MATERIALS (sector-specific material catalog)
CREATE TABLE materials (
    id                  UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    name                VARCHAR(200)    NOT NULL,
    sector              sector_type     NOT NULL,
    unit_price_tl       NUMERIC(12,2),
    fire_percent_default NUMERIC(5,2)   NOT NULL DEFAULT 0.0,   -- default moisture/waste deduction %
    created_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_materials_sector ON materials (sector);

-- 6. WEIGHING RECORDS (core transaction table)
CREATE TABLE weighing_records (
    id                              UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_no                       VARCHAR(30)     NOT NULL UNIQUE,
    plate                           VARCHAR(20)     NOT NULL,
    trailer_plate                   VARCHAR(20),
    driver_name                     VARCHAR(120)    NOT NULL,
    driver_phone                    VARCHAR(20)     NOT NULL,
    company_sender_id               UUID            REFERENCES companies (id) ON DELETE SET NULL,
    company_sender_name             VARCHAR(200)    NOT NULL,   -- denormalized for immutability
    company_receiver_id             UUID            REFERENCES companies (id) ON DELETE SET NULL,
    company_receiver_name           VARCHAR(200)    NOT NULL,  -- denormalized for immutability
    material                        VARCHAR(200)    NOT NULL,
    sector                          sector_type     NOT NULL,
    gross_weight_kg                 INT             NOT NULL,
    tare_weight_kg                  INT             NOT NULL,
    net_weight_kg                   INT             NOT NULL GENERATED ALWAYS AS (gross_weight_kg - tare_weight_kg) STORED,
    axle_count                      INT             NOT NULL DEFAULT 5,
    max_legal_weight_kg             INT             NOT NULL DEFAULT 42000,
    is_overweight                   BOOLEAN         NOT NULL GENERATED ALWAYS AS (gross_weight_kg > max_legal_weight_kg) STORED,
    moisture_waste_percent          NUMERIC(5,2)    NOT NULL DEFAULT 0.0,
    final_payable_kg                INT             NOT NULL,
    uetds_status                    uetds_status    NOT NULL DEFAULT 'PENDING',
    uetds_code                      VARCHAR(64)     UNIQUE,
    e_waybill_status                ewaybill_status NOT NULL DEFAULT 'DRAFT',
    e_waybill_no                    VARCHAR(64)     UNIQUE,
    status                          weighing_status NOT NULL DEFAULT 'IN_TRANSIT',
    site_name                       VARCHAR(200)    NOT NULL,
    -- Sector-specific nullable fields
    concrete_slump_minutes_remaining INT,                       -- beton: priz süresi
    customs_declaration_no          VARCHAR(64),                -- antrepo: gümrük beyan no
    -- Site delivery approval
    site_approved                   BOOLEAN         NOT NULL DEFAULT FALSE,
    site_approved_at                TIMESTAMPTZ,
    site_approver_name              VARCHAR(120),
    -- IoT hardware integrity hash (tamper-proof)
    iot_hardware_sha                VARCHAR(128),
    -- Audit timestamps
    created_by_user_id              UUID            REFERENCES users (id) ON DELETE SET NULL,
    created_at                      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at                      TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_weighings_sector      ON weighing_records (sector);
CREATE INDEX idx_weighings_status      ON weighing_records (status);
CREATE INDEX idx_weighings_plate       ON weighing_records (plate);
CREATE INDEX idx_weighings_created_at  ON weighing_records (created_at DESC);
CREATE INDEX idx_weighings_uetds_code  ON weighing_records (uetds_code) WHERE uetds_code IS NOT NULL;
CREATE INDEX idx_weighings_sender      ON weighing_records (company_sender_id);
CREATE INDEX idx_weighings_receiver    ON weighing_records (company_receiver_id);
-- Full-text search across plate + driver + company names
CREATE INDEX idx_weighings_search      ON weighing_records USING gin (
    (plate || ' ' || driver_name || ' ' || company_sender_name || ' ' || company_receiver_name || ' ' || ticket_no) gin_trgm_ops
);

-- 7. COMPANY RISK PROFILES
CREATE TABLE company_risk_profiles (
    id                          UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id                  UUID            NOT NULL REFERENCES companies (id) ON DELETE CASCADE,
    tonaj_score                 INT             NOT NULL DEFAULT 50 CHECK (tonaj_score BETWEEN 0 AND 100),
    risk_status                 risk_status     NOT NULL DEFAULT 'GREEN',
    credit_term_days            INT             NOT NULL DEFAULT 30,
    unpaid_dispute_count        INT             NOT NULL DEFAULT 0,
    total_delivered_volume_ton  NUMERIC(14,2)   NOT NULL DEFAULT 0,
    last_payment_status         VARCHAR(255),
    credit_limit_tl             NUMERIC(14,2)   NOT NULL DEFAULT 0,
    lock_status                 BOOLEAN         NOT NULL DEFAULT FALSE,
    updated_at                  TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    UNIQUE (company_id)
);

CREATE INDEX idx_risk_company    ON company_risk_profiles (company_id);
CREATE INDEX idx_risk_status     ON company_risk_profiles (risk_status);

-- 8. RISK PROFILE AUDIT LOG (immutable — append only)
CREATE TABLE risk_profile_audit (
    id              UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id      UUID            NOT NULL REFERENCES companies (id),
    tonaj_score     INT             NOT NULL,
    risk_status     risk_status     NOT NULL,
    credit_limit_tl NUMERIC(14,2)   NOT NULL,
    lock_status     BOOLEAN         NOT NULL,
    change_reason   VARCHAR(255),
    changed_by      UUID            REFERENCES users (id),
    changed_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_risk_audit_company ON risk_profile_audit (company_id, changed_at DESC);

-- 9. BACKHAUL LOADS
CREATE TABLE backhaul_loads (
    id              UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    origin          VARCHAR(200)    NOT NULL,
    destination     VARCHAR(200)    NOT NULL,
    material        VARCHAR(200)    NOT NULL,
    tonnage         NUMERIC(10,2)   NOT NULL,
    rate_per_ton    NUMERIC(10,2)   NOT NULL,
    total_freight   NUMERIC(12,2)   NOT NULL GENERATED ALWAYS AS (tonnage * rate_per_ton) STORED,
    vehicle_type    vehicle_type    NOT NULL,
    urgency         urgency_level   NOT NULL DEFAULT 'NORMAL',
    owner_company_id UUID           REFERENCES companies (id) ON DELETE SET NULL,
    owner_company_name VARCHAR(200) NOT NULL,
    distance_km     INT             NOT NULL,
    pickup_window   VARCHAR(100)    NOT NULL,
    is_booked       BOOLEAN         NOT NULL DEFAULT FALSE,
    booked_by       UUID            REFERENCES users (id) ON DELETE SET NULL,
    booked_at       TIMESTAMPTZ,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_backhaul_urgency   ON backhaul_loads (urgency);
CREATE INDEX idx_backhaul_booked    ON backhaul_loads (is_booked);
CREATE INDEX idx_backhaul_created   ON backhaul_loads (created_at DESC);

-- 10. COMPLIANCE ALERTS
CREATE TABLE compliance_alerts (
    id                          UUID                    PRIMARY KEY DEFAULT gen_random_uuid(),
    type                        compliance_alert_type   NOT NULL,
    title                       VARCHAR(255)            NOT NULL,
    severity                    severity_level          NOT NULL,
    message                     TEXT                    NOT NULL,
    plate                       VARCHAR(20),
    weighing_id                 UUID                    REFERENCES weighing_records (id) ON DELETE SET NULL,
    penalty_prevented_amount_tl INT                     NOT NULL DEFAULT 0,
    acknowledged                BOOLEAN                 NOT NULL DEFAULT FALSE,
    acknowledged_by             UUID                    REFERENCES users (id),
    acknowledged_at             TIMESTAMPTZ,
    created_at                  TIMESTAMPTZ             NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_alerts_type        ON compliance_alerts (type);
CREATE INDEX idx_alerts_severity    ON compliance_alerts (severity);
CREATE INDEX idx_alerts_created     ON compliance_alerts (created_at DESC);
CREATE INDEX idx_alerts_ack         ON compliance_alerts (acknowledged) WHERE acknowledged = FALSE;

-- 11. DISPUTE SETTLEMENTS
CREATE TABLE dispute_settlements (
    id                  UUID                PRIMARY KEY DEFAULT gen_random_uuid(),
    weighing_id         UUID                NOT NULL REFERENCES weighing_records (id),
    sender_weight_kg    INT                 NOT NULL,
    receiver_weight_kg  INT                 NOT NULL,
    difference_kg       INT                 NOT NULL GENERATED ALWAYS AS (ABS(sender_weight_kg - receiver_weight_kg)) STORED,
    tolerance_limit_kg  NUMERIC(10,2)       NOT NULL,
    is_within_tolerance BOOLEAN             NOT NULL,
    unit_price_tl       NUMERIC(10,2),
    financial_impact_tl NUMERIC(12,2)       NOT NULL DEFAULT 0,
    status              settlement_status   NOT NULL DEFAULT 'DISPUTED',
    resolved_by         UUID                REFERENCES users (id),
    resolved_at         TIMESTAMPTZ,
    created_at          TIMESTAMPTZ         NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_settlements_weighing ON dispute_settlements (weighing_id);
CREATE INDEX idx_settlements_status   ON dispute_settlements (status);

-- 12. INVOICES
CREATE TABLE invoices (
    id              UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    weighing_id     UUID            REFERENCES weighing_records (id) ON DELETE SET NULL,
    invoice_no      VARCHAR(64)     NOT NULL UNIQUE,
    amount_tl       NUMERIC(14,2)   NOT NULL,
    company_id      UUID            REFERENCES companies (id) ON DELETE SET NULL,
    due_date        DATE,
    paid_at         TIMESTAMPTZ,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_invoices_company   ON invoices (company_id);
CREATE INDEX idx_invoices_weighing  ON invoices (weighing_id);

-- 13. EARLY PAYMENT SUBMISSIONS (factoring)
CREATE TABLE early_payment_submissions (
    id              UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    weighing_id     UUID            REFERENCES weighing_records (id) ON DELETE SET NULL,
    invoice_id      UUID            REFERENCES invoices (id) ON DELETE SET NULL,
    invoice_no      VARCHAR(64)     NOT NULL,
    invoice_amount  NUMERIC(14,2)   NOT NULL,
    advance_rate    NUMERIC(5,2)    NOT NULL DEFAULT 80.0,  -- %80 advance rate
    fee_rate        NUMERIC(5,2)    NOT NULL DEFAULT 2.4,   -- %2.4 factoring fee
    advance_amount  NUMERIC(14,2)   NOT NULL,
    fee_amount      NUMERIC(14,2)   NOT NULL,
    payout_amount   NUMERIC(14,2)   NOT NULL,
    bank_code       VARCHAR(64)     NOT NULL,
    status          payment_status  NOT NULL DEFAULT 'PENDING',
    submitted_by    UUID            REFERENCES users (id),
    transferred_at  TIMESTAMPTZ,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_ep_weighing ON early_payment_submissions (weighing_id);
CREATE INDEX idx_ep_status   ON early_payment_submissions (status);

-- ============================================================
-- REGULATORY / COMPLIANCE TABLES
-- ============================================================

-- 14. U-ETDS SUBMISSIONS (T.C. Ulaştırma Bakanlığı)
CREATE TABLE uetds_submissions (
    id                      UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    weighing_id             UUID        NOT NULL REFERENCES weighing_records (id),
    trip_code               VARCHAR(64) NOT NULL UNIQUE,     -- UETDS-TR-YYYY-XXXXXXX
    plate                   VARCHAR(20) NOT NULL,
    driver_tc               VARCHAR(20),                     -- TC Kimlik No (optional)
    submission_status       VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    response_code           VARCHAR(20),
    ministry_response_json  JSONB,
    submitted_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    confirmed_at            TIMESTAMPTZ
);

CREATE INDEX idx_uetds_weighing  ON uetds_submissions (weighing_id);
CREATE INDEX idx_uetds_code      ON uetds_submissions (trip_code);

-- 15. GİB E-İRSALİYE HISTORY
CREATE TABLE gib_e_irsaliye (
    id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    weighing_id         UUID        NOT NULL REFERENCES weighing_records (id),
    document_no         VARCHAR(64) NOT NULL UNIQUE,        -- GIBYYYYXXXXXxxxx
    submission_status   VARCHAR(30) NOT NULL DEFAULT 'DRAFT',
    gib_response_json   JSONB,
    submitted_at        TIMESTAMPTZ,
    confirmed_at        TIMESTAMPTZ,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_gib_weighing ON gib_e_irsaliye (weighing_id);

-- 16. MAPEG SHIPMENTS (Maden sevk + rüsum takibi)
CREATE TABLE mapeg_shipments (
    id                  UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    weighing_id         UUID            REFERENCES weighing_records (id) ON DELETE SET NULL,
    company_id          UUID            REFERENCES companies (id) ON DELETE SET NULL,
    permit_no           VARCHAR(64)     NOT NULL,           -- MAPEG ruhsat no
    annual_quota_tons   NUMERIC(14,2)   NOT NULL,
    shipped_tons        NUMERIC(14,2)   NOT NULL DEFAULT 0,
    unit_price_tl       NUMERIC(10,2)   NOT NULL,
    rusum_rate          NUMERIC(6,4)    NOT NULL DEFAULT 0.045,
    rusum_amount_tl     NUMERIC(12,2)   GENERATED ALWAYS AS (shipped_tons * unit_price_tl * rusum_rate) STORED,
    created_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

-- 17. MOTAT RECORDS (Çevre Bakanlığı atık taşıma formları)
CREATE TABLE motat_records (
    id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    weighing_id         UUID        REFERENCES weighing_records (id) ON DELETE SET NULL,
    waste_catalog_code  VARCHAR(20) NOT NULL,               -- e.g. "16 01 17" EWC code
    motat_ref_no        VARCHAR(64),                        -- TR-MT-XXXXX
    form_status         VARCHAR(30) NOT NULL DEFAULT 'DRAFT',
    submitted_at        TIMESTAMPTZ,
    ministry_response   JSONB,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- SECTOR TELEMETRY (time-series data per sector)
-- ============================================================

-- 18. SECTOR TELEMETRY SNAPSHOTS
CREATE TABLE sector_telemetry (
    id              UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    sector          sector_type     NOT NULL,
    metric_key      VARCHAR(120)    NOT NULL,
    metric_value    NUMERIC(16,4),
    metric_text     VARCHAR(255),                           -- for non-numeric values
    metric_json     JSONB,                                  -- for complex/nested data
    recorded_at     TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_telemetry_sector      ON sector_telemetry (sector, recorded_at DESC);
CREATE INDEX idx_telemetry_metric_key  ON sector_telemetry (sector, metric_key, recorded_at DESC);

-- 19. SECTOR TELEMETRY LATEST (materialized for fast reads)
-- Stores the latest snapshot per sector as raw JSON (fast API response)
CREATE TABLE sector_telemetry_latest (
    sector          sector_type     PRIMARY KEY,
    data            JSONB           NOT NULL,
    updated_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

-- ============================================================
-- ONBOARDING
-- ============================================================

-- 20. ONBOARDING STEPS (per sector, master data)
CREATE TABLE onboarding_steps (
    id              UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    sector          sector_type     NOT NULL,
    step_number     INT             NOT NULL,
    title           VARCHAR(200)    NOT NULL,
    description     TEXT            NOT NULL,
    icon            VARCHAR(64)     NOT NULL,
    UNIQUE (sector, step_number)
);

-- ============================================================
-- TRIGGERS
-- ============================================================

-- Auto-update updated_at columns
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_companies_updated_at
    BEFORE UPDATE ON companies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_weighings_updated_at
    BEFORE UPDATE ON weighing_records
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_risk_updated_at
    BEFORE UPDATE ON company_risk_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-write risk profile audit log on any change
CREATE OR REPLACE FUNCTION audit_risk_profile_change()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'UPDATE') AND (
        OLD.tonaj_score     IS DISTINCT FROM NEW.tonaj_score OR
        OLD.risk_status     IS DISTINCT FROM NEW.risk_status OR
        OLD.credit_limit_tl IS DISTINCT FROM NEW.credit_limit_tl OR
        OLD.lock_status     IS DISTINCT FROM NEW.lock_status
    ) THEN
        INSERT INTO risk_profile_audit
            (company_id, tonaj_score, risk_status, credit_limit_tl, lock_status)
        VALUES
            (NEW.company_id, NEW.tonaj_score, NEW.risk_status, NEW.credit_limit_tl, NEW.lock_status);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_risk_audit
    AFTER UPDATE ON company_risk_profiles
    FOR EACH ROW EXECUTE FUNCTION audit_risk_profile_change();
