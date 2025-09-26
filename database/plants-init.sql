-- PostgreSQL Schema & Tables für Cannabispflanzen-Datenbank

-- 1. ENUM-Typen
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'strain_type') THEN
    CREATE TYPE strain_type AS ENUM ('Sativa','Indica','Hybrid');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'shop_type') THEN
    CREATE TYPE shop_type AS ENUM ('Store','Online');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'climate_type') THEN
    CREATE TYPE climate_type AS ENUM ('heiss','warm','mild','kalt');
  END IF;
END
$$;

-- 2. strains
CREATE TABLE IF NOT EXISTS strains (
  strain_id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  automatic BOOLEAN NOT NULL,
  type strain_type NOT NULL,
  percent_sativa NUMERIC(5,2) CHECK (percent_sativa BETWEEN 0 AND 100),
  percent_indica NUMERIC(5,2) CHECK (percent_indica BETWEEN 0 AND 100),
  percent_hybrid NUMERIC(5,2) CHECK (percent_hybrid BETWEEN 0 AND 100),
  growth_duration_min INTEGER NOT NULL,
  growth_duration_max INTEGER NOT NULL,
  flower_duration_min INTEGER NOT NULL,
  flower_duration_max INTEGER NOT NULL,
  height_min_cm INTEGER NOT NULL,
  height_max_cm INTEGER NOT NULL,
  origin VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. strain_climates
CREATE TABLE IF NOT EXISTS strain_climates (
  climate_id SERIAL PRIMARY KEY,
  name climate_type UNIQUE NOT NULL
);

-- 4. strain_herkunft
CREATE TABLE IF NOT EXISTS strain_herkunft (
  strain_id INTEGER REFERENCES strains(strain_id) ON DELETE CASCADE,
  climate_id INTEGER REFERENCES strain_climates(climate_id),
  PRIMARY KEY (strain_id, climate_id)
);

-- 5. terpenes
CREATE TABLE IF NOT EXISTS terpenes (
  terpene_id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL
);

-- 6. strain_terpenes
CREATE TABLE IF NOT EXISTS strain_terpenes (
  strain_id INTEGER REFERENCES strains(strain_id) ON DELETE CASCADE,
  terpene_id INTEGER REFERENCES terpenes(terpene_id),
  percent NUMERIC(5,2) CHECK (percent BETWEEN 0 AND 100),
  PRIMARY KEY (strain_id, terpene_id)
);

-- 7. anbau_records
CREATE TABLE IF NOT EXISTS anbau_records (
  record_id SERIAL PRIMARY KEY,
  strain_id INTEGER REFERENCES strains(strain_id) ON DELETE CASCADE,
  actual_height_cm INTEGER,
  actual_growth_days INTEGER,
  actual_flower_days INTEGER,
  actual_temp_c NUMERIC(5,2),
  actual_terpenes JSONB,
  smell TEXT,
  appearance TEXT,
  effect TEXT,
  rating SMALLINT CHECK (rating BETWEEN 1 AND 5),
  harvest_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. anbau_shops
CREATE TABLE IF NOT EXISTS anbau_shops (
  shop_id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  type shop_type NOT NULL,
  url VARCHAR(255)
);

-- 9. anbau_records_shops
CREATE TABLE IF NOT EXISTS anbau_records_shops (
  record_id INTEGER REFERENCES anbau_records(record_id) ON DELETE CASCADE,
  shop_id INTEGER REFERENCES anbau_shops(shop_id),
  price_eur NUMERIC(8,2),
  PRIMARY KEY (record_id, shop_id)
);

-- 10. dünger_sets
CREATE TABLE IF NOT EXISTS dünger_sets (
  dünger_id SERIAL PRIMARY KEY,
  manufacturer VARCHAR(100) NOT NULL,
  name VARCHAR(100),
  components JSONB
);

-- 11. anbau_records_dünger
CREATE TABLE IF NOT EXISTS anbau_records_dünger (
  record_id INTEGER REFERENCES anbau_records(record_id) ON DELETE CASCADE,
  dünger_id INTEGER REFERENCES dünger_sets(dünger_id),
  PRIMARY KEY (record_id, dünger_id)
);

-- 12. strain_prices
CREATE TABLE IF NOT EXISTS strain_prices (
  strain_id INTEGER PRIMARY KEY REFERENCES strains(strain_id) ON DELETE CASCADE,
  price_eur NUMERIC(8,2)
);

-- 13. strain_images
CREATE TABLE IF NOT EXISTS strain_images (
  image_id SERIAL PRIMARY KEY,
  strain_id INTEGER REFERENCES strains(strain_id) ON DELETE CASCADE,
  url VARCHAR(255) NOT NULL,
  description VARCHAR(255),
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 14. Indizes
CREATE INDEX IF NOT EXISTS idx_anbau_records_strain ON anbau_records(strain_id);
CREATE INDEX IF NOT EXISTS idx_herkunft_strain ON strain_herkunft(strain_id);
CREATE INDEX IF NOT EXISTS idx_terpenes_name ON terpenes(name);
