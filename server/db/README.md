# TONAJ.B2B — Veritabanı Kurulumu

## Gereksinim
PostgreSQL 15+

## Adımlar

### 1. Veritabanı oluştur
```bash
psql -U postgres -c "CREATE DATABASE tonaj;"
```

### 2. Şemayı uygula
```bash
psql -U postgres -d tonaj -f server/db/schema.sql
```

### 3. Seed verisini yükle
```bash
psql -U postgres -d tonaj -f server/db/seed.sql
```

### 4. Ortam değişkenlerini ayarla
```bash
cp server/.env.example server/.env
# .env dosyasını düzenle
```

### 5. Sunucuyu başlat
```bash
cd server
go mod download
go run main.go
```

## Tablolar

| Tablo | Açıklama |
|---|---|
| `sectors` | 7 sektör master verisi |
| `users` | Kullanıcılar (bcrypt şifre) |
| `companies` | B2B şirket defteri |
| `vehicles` | Araç + IoT SHA-256 parmak izi |
| `materials` | Sektör bazlı malzeme kataloğu |
| `weighing_records` | Ana tartım işlemi tablosu |
| `company_risk_profiles` | Tonaj Skor™ kredi risk profilleri |
| `risk_profile_audit` | Risk profili değişim log'u (immutable) |
| `backhaul_loads` | Boş dönüş pazaryeri ilanları |
| `compliance_alerts` | Mevzuat uyarıları |
| `dispute_settlements` | Tartım uyuşmazlık mutabakatları |
| `invoices` | Fatura kayıtları |
| `early_payment_submissions` | Faktoring/erken ödeme talepleri |
| `uetds_submissions` | T.C. Ulaştırma Bakanlığı U-ETDS bildirimleri |
| `gib_e_irsaliye` | GİB e-İrsaliye geçmişi |
| `mapeg_shipments` | MAPEG maden sevk & rüsum takibi |
| `motat_records` | Çevre Bakanlığı MoTAT atık formları |
| `sector_telemetry` | Sektörel telemetri zaman serisi |
| `sector_telemetry_latest` | Son telemetri snapshot'ı (hızlı okuma) |
| `onboarding_steps` | Sektör bazlı onboarding adımları |
