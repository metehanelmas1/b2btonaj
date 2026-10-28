-- ============================================================
-- TONAJ.B2B — Seed Data
-- Run AFTER schema.sql
-- ============================================================

-- ============================================================
-- 1. SECTORS
-- ============================================================
INSERT INTO sectors (id, name, tagline, icon, primary_metric_label, primary_metric_value, risk_factor, compliance_key) VALUES
('beton',           'Hazır Beton Santralleri',      'Priz Süresi (Slump) & Şantiye Dijital Kabul Ağı',                  'Building2',  'Aktif Mikser / Dökülen',         '42 Mikser (2.840 m³)',         'Priz Süresi Aşımı (<90 Dk)',                    'GİB e-İrsaliye + U-ETDS Beton Kodlu'),
('tas_ocagi',       'Taş Ocakları & Madenler',      'Kantar IoT, MAPEG Sevk Fişi & Aks Aşımı Kalkanı',                 'Mountain',   'Günlük Kırılan / Sevk',           '18.450 Ton Sevk',              'Karayolları Aşırı Tonaj Cezası',                'MAPEG Maden Sevk İzinleri'),
('hurda',           'Hurda & Metal Geri Dönüşüm',   'Fire/Nem Analizi, %90 Tevkifat & MoTAT Entegrasyonu',              'Recycle',    'İşlenen DKP/E1 Hurda',            '3.120 Ton',                    'Tevkifatlı Fatura & Kaçak Mal Girişi',           'ÇŞB MoTAT Atık Taşıma Formu'),
('antrepo_gumruk',  'Antrepolar & Gümrük',          'Dijital Kapı Randevusu (VBS) & Ardiye/Demurrage Sayacı',           'Warehouse',  'Gümrüklü Saha Doluluk',           '%84 (1.240 TEU / Palet)',      'Ardiye & Bekleme (Demurrage) Maliyeti',          'Gümrük Özet Beyan & Serbest Bölge'),
('demir',           'Demir Çelik Sanayi',           'Nervürlü Donatı Demiri, Kangal, Metraj/Tonaj Hesabı & Şantiye Sevk İrsaliyesi', 'Layers', 'Günlük Sevk Edilen Donatı', '1.420 Ton Demir',              'Eksik İndirme & Vadeli Çek Tahsilatı',           'TS 708 Nervürlü Çelik & GİB e-İrsaliye'),
('kereste',         'Kereste & Orman Ürünleri',     'm³ Hacim ➔ Tonaj Çevirici, 5x10 Kalıp Kerestesi & OGM Nakliye Tezkeresi', 'Trees', 'İşlenen / Sevk Tomruk & Kereste', '680 m³ (490 Ton)',             'Fırın/Nem Oranı Sapması & Kaçak Kesim',          'OGM Orman Nakliye Tezkeresi'),
('nakliye_lojistik','Ağır Yük & Damper Filoları',   'Boş Dönüş (Backhaul) Bitişi & U-ETDS Tek Tık Otomasyonu',         'Truck',      'Dönüş Doluluk Oranı',             '%91 (Boş Dönüş Azaltıldı)',    'Gidiş Dolu Dönüş Boş Mazot İsrafı',             'U-ETDS Sefer Bildirim Sicili');

-- ============================================================
-- 2. COMPANIES
-- ============================================================
INSERT INTO companies (id, name, tax_no, sector) VALUES
('a0000000-0000-0000-0000-000000000001', 'Oyak Beton Ataşehir',                     '5840192841', 'Hazır Beton'),
('a0000000-0000-0000-0000-000000000002', 'Gebze Agrega & Taş İşletmeleri A.Ş.',     '4410291840', 'Taş Ocağı & Maden'),
('a0000000-0000-0000-0000-000000000003', 'Kroman Çelik Döküm Fabrikası',            '6120394812', 'Demir Çelik'),
('a0000000-0000-0000-0000-000000000004', 'Ambarlı Lojistik ve Antrepo Tesisleri',   '4920148293', 'Antrepo'),
('a0000000-0000-0000-0000-000000000005', 'İnegöl Keresteciler Sanayi Sitesi',       '3841029481', 'Kereste'),
('a0000000-0000-0000-0000-000000000006', 'Kroman Çelik Sanayi A.Ş. Gebze Fabrikası','6120394813','Demir Çelik'),
-- Receiver companies
('a0000000-0000-0000-0000-000000000011', 'Çimsa Çimento Dilovası Santrali',         '2110482910', 'Çimento'),
('a0000000-0000-0000-0000-000000000012', 'Aliağa Ağır Haddecilik Sanayi',           '3920491840', 'Haddecilik'),
('a0000000-0000-0000-0000-000000000013', 'Kolin-Kalyon Metro Konsorsiyumu A.Ş.',    '5840192841', 'İnşaat'),
('a0000000-0000-0000-0000-000000000014', 'Marmara İthalat & Dış Ticaret A.Ş.',     '2940182749', 'İthalat'),
('a0000000-0000-0000-0000-000000000015', 'Rönesans Konut Projesi 2. Etap',          '7740194820', 'İnşaat'),
('a0000000-0000-0000-0000-000000000016', 'Kalyon Metro İstasyon Şantiyesi',         '5840192842', 'İnşaat'),
-- Backhaul companies
('a0000000-0000-0000-0000-000000000021', 'Körfez Hafriyat & Altyapı Ltd.',          '3940182749', 'Hafriyat'),
('a0000000-0000-0000-0000-000000000022', 'Çimsa Lojistik A.Ş.',                     '2110482911', 'Lojistik'),
('a0000000-0000-0000-0000-000000000023', 'Ege Demir Çelik Pazarlama',               '4820391840', 'Demir Çelik'),
('a0000000-0000-0000-0000-000000000024', 'Marmara Metal Geri Dönüşüm',              '3920481840', 'Geri Dönüşüm');

-- ============================================================
-- 3. USERS (password_hash = bcrypt("123456") placeholder)
-- In production: generate real bcrypt hashes via application
-- ============================================================
INSERT INTO users (id, email, name, password_hash, company_name, tax_no, sector, role, has_completed_onboarding) VALUES
('b0000000-0000-0000-0000-000000000001', 'orhan.karadag@oyakbeton.com.tr',   'Orhan Karadağ',   '$2a$10$placeholder_bcrypt_hash_here_1', 'Oyak Beton Ataşehir',               '5840192841', 'beton',           'Santral Operasyon Şefi',   TRUE),
('b0000000-0000-0000-0000-000000000002', 'selim.taskin@gebzemaden.com.tr',   'Selim Taşkın',    '$2a$10$placeholder_bcrypt_hash_here_2', 'Gebze Agrega & Taş İşletmeleri',    '4410291840', 'tas_ocagi',       'Ocak ve Kantar Müdürü',    TRUE),
('b0000000-0000-0000-0000-000000000003', 'mustafa.yildirim@kromancelik.com.tr','Mustafa Yıldırım','$2a$10$placeholder_bcrypt_hash_here_3','Kroman Çelik Hurda Sahası',         '6120394812', 'hurda',           'Hurda Mal Kabul Eksperi',  TRUE),
('b0000000-0000-0000-0000-000000000004', 'serdar.altun@ambarlilog.com.tr',   'Serdar Altun',    '$2a$10$placeholder_bcrypt_hash_here_4', 'Ambarlı Lojistik ve Antrepo',       '4920148293', 'antrepo_gumruk',  'Antrepo Müdürü',           TRUE),
('b0000000-0000-0000-0000-000000000005', 'hasan.cetin@inegolkereste.com.tr', 'Hasan Çetin',     '$2a$10$placeholder_bcrypt_hash_here_5', 'İnegöl Keresteciler Sanayi',        '3841029481', 'kereste',         'Kereste Sevk Sorumlusu',   TRUE),
('b0000000-0000-0000-0000-000000000006', 'admin@tonaj.com.tr',               'Tonaj Admin',     '$2a$10$placeholder_bcrypt_hash_here_6', 'TONAJ Teknoloji A.Ş.',              '9910000001', 'nakliye_lojistik','Platform Yöneticisi',      TRUE);

-- ============================================================
-- 4. VEHICLES
-- ============================================================
INSERT INTO vehicles (plate, trailer_plate, company_id, iot_hardware_sha, max_legal_weight_kg, axle_count) VALUES
('34 ENR 819', '34 DMR 104', 'a0000000-0000-0000-0000-000000000002', 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', 42000, 5),
('41 KRM 920', NULL,         'a0000000-0000-0000-0000-000000000003', '5f4dcc3b5aa765d61d8327deb882cf99aabbccdd112233445566778899aabbcc', 42000, 5),
('34 BTR 402', NULL,         'a0000000-0000-0000-0000-000000000001', '9a5304b35e0b0468305c4d0263f684c9aabbccdd112233445566778899112233', 32000, 4),
('06 ANK 771', '06 DOR 912', 'a0000000-0000-0000-0000-000000000004', '2c6ee2a6f3a53ee812f8a1fd80e60803aabbccdd112233445566778899445566', 42000, 5),
('16 İNE 332', NULL,         'a0000000-0000-0000-0000-000000000005', '8f14e45fceea167a5a36dedd4bea2543aabbccdd112233445566778899778899', 32000, 4),
('41 KRM 921', NULL,         'a0000000-0000-0000-0000-000000000006', 'e5c010a30ab78f7e914041a87b32609aaabbccdd112233445566778899aabbee', 42000, 5);

-- ============================================================
-- 5. WEIGHING RECORDS
-- ============================================================
INSERT INTO weighing_records (
    id, ticket_no, plate, trailer_plate,
    driver_name, driver_phone,
    company_sender_id, company_sender_name,
    company_receiver_id, company_receiver_name,
    material, sector,
    gross_weight_kg, tare_weight_kg,
    axle_count, max_legal_weight_kg,
    moisture_waste_percent, final_payable_kg,
    uetds_status, uetds_code,
    e_waybill_status, e_waybill_no,
    status, site_name,
    concrete_slump_minutes_remaining,
    customs_declaration_no,
    site_approved, site_approved_at, site_approver_name,
    iot_hardware_sha,
    created_by_user_id,
    created_at
) VALUES
(
    'c0000000-0000-0000-0000-000000000001',
    'KNT-084912', '34 ENR 819', '34 DMR 104',
    'Ahmet Karaduman', '0532 411 90 82',
    'a0000000-0000-0000-0000-000000000002', 'Gebze Agrega & Taş İşletmeleri A.Ş.',
    'a0000000-0000-0000-0000-000000000011', 'Çimsa Çimento Dilovası Santrali',
    'Agrega (Kırma Taş 0-32 mm)', 'tas_ocagi',
    41850, 14200, 5, 42000,
    1.2, 27318,
    'APPROVED', 'UETDS-TR-2026-8819401',
    'SENT', 'GIB202600008419',
    'IN_TRANSIT', 'Dilovası Santral Girişi',
    NULL, NULL,
    FALSE, NULL, NULL,
    'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    'b0000000-0000-0000-0000-000000000002',
    NOW() - INTERVAL '1 hour'
),
(
    'c0000000-0000-0000-0000-000000000002',
    'KNT-084913', '41 KRM 920', NULL,
    'Mustafa Yıldırım', '0544 322 19 04',
    'a0000000-0000-0000-0000-000000000003', 'Kroman Çelik Döküm Fabrikası',
    'a0000000-0000-0000-0000-000000000012', 'Aliağa Ağır Haddecilik Sanayi',
    'DKP ve Ekstra Ağır Hurda Demir', 'hurda',
    43900, 15100, 5, 42000,
    3.5, 27792,
    'APPROVED', 'UETDS-TR-2026-8819402',
    'SENT', 'GIB202600008420',
    'DISPUTED', 'Dilovası Hurda Sahası',
    NULL, NULL,
    FALSE, NULL, NULL,
    '5f4dcc3b5aa765d61d8327deb882cf99aabbccdd112233445566778899aabbcc',
    'b0000000-0000-0000-0000-000000000003',
    NOW() - INTERVAL '80 minutes'
),
(
    'c0000000-0000-0000-0000-000000000003',
    'KNT-084914', '34 BTR 402', NULL,
    'Cemil Korkmaz', '0533 911 20 45',
    'a0000000-0000-0000-0000-000000000001', 'Oyak Beton Ataşehir Tesisi',
    'a0000000-0000-0000-0000-000000000013', 'Kolin-Kalyon Metro Konsorsiyumu',
    'C35/45 S4 Kıvam Hazır Beton', 'beton',
    32000, 12800, 4, 32000,
    0.0, 19200,
    'APPROVED', 'UETDS-TR-2026-8819403',
    'SENT', 'GIB202600008421',
    'IN_TRANSIT', 'Göztepe Metro İstasyon Sahası',
    28, NULL,
    FALSE, NULL, NULL,
    '9a5304b35e0b0468305c4d0263f684c9aabbccdd112233445566778899112233',
    'b0000000-0000-0000-0000-000000000001',
    NOW() - INTERVAL '100 minutes'
),
(
    'c0000000-0000-0000-0000-000000000004',
    'KNT-084915', '06 ANK 771', '06 DOR 912',
    'Serdar Altun', '0505 882 12 39',
    'a0000000-0000-0000-0000-000000000004', 'Ambarlı Lojistik ve Antrepo Tesisleri',
    'a0000000-0000-0000-0000-000000000014', 'Marmara İthalat & Dış Ticaret A.Ş.',
    'İthal Rulo Sac & Dökme Hammadde (Konteyner)', 'antrepo_gumruk',
    38400, 14900, 5, 42000,
    0.0, 23500,
    'APPROVED', 'UETDS-TR-2026-8819404',
    'SENT', 'GIB202600008422',
    'DELIVERED', 'Ambarlı Antrepo Kapı 3',
    NULL, 'GUM-2026-08841-A',
    TRUE, NOW() - INTERVAL '45 minutes', 'Engin Yılmaz (Antrepo Şefi)',
    '2c6ee2a6f3a53ee812f8a1fd80e60803aabbccdd112233445566778899445566',
    'b0000000-0000-0000-0000-000000000004',
    NOW() - INTERVAL '130 minutes'
),
(
    'c0000000-0000-0000-0000-000000000005',
    'KNT-084916', '16 İNE 332', NULL,
    'Hasan Çetin', '0535 777 41 29',
    'a0000000-0000-0000-0000-000000000005', 'İnegöl Keresteciler Sanayi Sitesi',
    'a0000000-0000-0000-0000-000000000015', 'Rönesans Konut Projesi 2. Etap',
    'Kalıp Kereste 5x10 (1. Sınıf)', 'kereste',
    29500, 11400, 4, 32000,
    0.0, 18100,
    'APPROVED', 'UETDS-TR-2026-8819405',
    'SENT', 'GIB202600008423',
    'IN_TRANSIT', 'Bursa Osmangazi Şantiyesi',
    NULL, NULL,
    FALSE, NULL, NULL,
    '8f14e45fceea167a5a36dedd4bea2543aabbccdd112233445566778899778899',
    'b0000000-0000-0000-0000-000000000005',
    NOW() - INTERVAL '160 minutes'
),
(
    'c0000000-0000-0000-0000-000000000006',
    'KNT-084917', '41 KRM 921', NULL,
    'Murat Karakaş', '0533 819 02 11',
    'a0000000-0000-0000-0000-000000000006', 'Kroman Çelik Sanayi A.Ş. Gebze Fabrikası',
    'a0000000-0000-0000-0000-000000000016', 'Kalyon Metro İstasyon Şantiyesi',
    'Ø16 B420C Nervürlü İnşaat Demiri (12 Metre Bağ)', 'demir',
    39800, 13600, 5, 42000,
    0.0, 26200,
    'APPROVED', 'UETDS-TR-2026-8819406',
    'SENT', 'GIB202600009104',
    'IN_TRANSIT', 'Göztepe Metro Şantiyesi',
    NULL, NULL,
    FALSE, NULL, NULL,
    'e5c010a30ab78f7e914041a87b32609aaabbccdd112233445566778899aabbee',
    'b0000000-0000-0000-0000-000000000003',
    NOW() - INTERVAL '200 minutes'
);

-- ============================================================
-- 6. COMPANY RISK PROFILES
-- ============================================================
INSERT INTO company_risk_profiles (company_id, tonaj_score, risk_status, credit_term_days, unpaid_dispute_count, total_delivered_volume_ton, last_payment_status, credit_limit_tl, lock_status) VALUES
('a0000000-0000-0000-0000-000000000013', 98, 'GREEN',  30,  0, 148500,  'Zamanında Ödendi (Kusursuz)',                25000000, FALSE),
('a0000000-0000-0000-0000-000000000011', 96, 'GREEN',  45,  0, 320000,  'Kantar Onaylı 24 Saat İskonto',              50000000, FALSE),
('a0000000-0000-0000-0000-000000000015', 84, 'YELLOW', 60,  1, 42100,   '1 İrsaliye Mutabakat İncelemesinde',         8000000,  FALSE),
('a0000000-0000-0000-0000-000000000021', 41, 'RED',    0,   4, 18400,   '2 Karşılıksız Çek Bildirimi Mevcut',         0,        TRUE),
('a0000000-0000-0000-0000-000000000005', 92, 'GREEN',  45,  0, 64200,   'Düzenli Cari Ödeme',                         15000000, FALSE);

-- ============================================================
-- 7. BACKHAUL LOADS
-- ============================================================
INSERT INTO backhaul_loads (id, origin, destination, material, tonnage, rate_per_ton, vehicle_type, urgency, owner_company_id, owner_company_name, distance_km, pickup_window, is_booked) VALUES
('d0000000-0000-0000-0000-000000000001', 'Dilovası Liman Bölgesi (Kocaeli)', 'Gebze Taş Ocakları Sahası',   'Dolgu Malzemesi & Moloz',          28, 240, 'Damperli Kamyon', 'HIGH',   'a0000000-0000-0000-0000-000000000021', 'Körfez Hafriyat & Altyapı Ltd.', 26,  '11:00 - 13:00 Bugün',       FALSE),
('d0000000-0000-0000-0000-000000000002', 'Çimsa Dilovası Tesisleri',         'Eskişehir Çimento Fabrikası', 'Klinker & Katkı Maddesi',          30, 580, 'Silobas',         'NORMAL', 'a0000000-0000-0000-0000-000000000022', 'Çimsa Lojistik A.Ş.',            195, '14:00 - 18:00 Bugün',       FALSE),
('d0000000-0000-0000-0000-000000000003', 'İÇDAŞ Biga Çelik Fabrikası',       'İzmir Menemen Organize Sanayi','Nervürlü Kangal & Profil Demir',   27, 620, 'Sal Kasa Tır',    'HIGH',   'a0000000-0000-0000-0000-000000000023', 'Ege Demir Çelik Pazarlama',      280, 'Hemen (Hazır Araç Aranıyor)',FALSE),
('d0000000-0000-0000-0000-000000000004', 'Aliağa Geri Dönüşüm Bölgesi',      'Bursa Demirtaş OSB',          'Preslenmiş Sac ve DKP Hurda',      26, 510, 'Damperli Kamyon', 'MEDIUM', 'a0000000-0000-0000-0000-000000000024', 'Marmara Metal Geri Dönüşüm',     290, '16:00 Yarın',               FALSE);

-- ============================================================
-- 8. COMPLIANCE ALERTS
-- ============================================================
INSERT INTO compliance_alerts (id, type, title, severity, message, plate, weighing_id, penalty_prevented_amount_tl) VALUES
(
    'e0000000-0000-0000-0000-000000000001',
    'AXLE_LIMIT', 'Aşırı Aks Tonajı Engellendi (41 KRM 920)', 'CRITICAL',
    'Kantar tartımında 42.000 Kg yasal limiti 1.900 Kg aşıldı. Bariyer kilitlenerek 58.400 TL Karayolları cezası engellendi.',
    '41 KRM 920', 'c0000000-0000-0000-0000-000000000002', 58400
),
(
    'e0000000-0000-0000-0000-000000000002',
    'SLUMP_TIMEOUT', 'Kritik Beton Priz Süresi Alarmı (34 BTR 402)', 'WARNING',
    'Oyak Beton Ataşehir çıkışlı mikserin priz süresi son 28 dakikaya girdi. Şantiye trafiği nedeniyle şantiye şefine acil döküm QR bildirimi SMS ile iletildi.',
    '34 BTR 402', 'c0000000-0000-0000-0000-000000000003', 24000
),
(
    'e0000000-0000-0000-0000-000000000003',
    'U_ETDS', 'U-ETDS Bakanlık Onayı 4.2 Saniyede Tamamlandı', 'INFO',
    '34 ENR 819 plakalı agrega kamyonu kantardan indiği anda U-ETDS kodu veri tabanına mühürlendi.',
    '34 ENR 819', 'c0000000-0000-0000-0000-000000000001', 9600
),
(
    'e0000000-0000-0000-0000-000000000004',
    'MOTAT_WASTE', 'MoTAT Atık Taşıma Kodu Doğrulandı', 'INFO',
    'Tehlikesiz demir-çelik cürufu sevkiyatında Çevre Bakanlığı MoTAT referans no (TR-MT-8491) e-İrsaliye ile mühürlendi.',
    '35 MT 901', NULL, 45000
);

-- ============================================================
-- 9. DISPUTE SETTLEMENTS
-- ============================================================
INSERT INTO dispute_settlements (weighing_id, sender_weight_kg, receiver_weight_kg, tolerance_limit_kg, is_within_tolerance, financial_impact_tl, status, resolved_at) VALUES
('c0000000-0000-0000-0000-000000000002', 28800, 28680, 144.0,   TRUE,  0,    'APPROVED', NOW() - INTERVAL '10 minutes'),
('c0000000-0000-0000-0000-000000000001', 27650, 27620, 138.25,  TRUE,  0,    'APPROVED', NOW() - INTERVAL '5 minutes');

-- ============================================================
-- 10. INVOICES + EARLY PAYMENT SUBMISSIONS
-- ============================================================
INSERT INTO invoices (id, weighing_id, invoice_no, amount_tl, company_id) VALUES
('f0000000-0000-0000-0000-000000000001',
 'c0000000-0000-0000-0000-000000000006',
 'FTR-2026-88194', 748500,
 'a0000000-0000-0000-0000-000000000016');

INSERT INTO early_payment_submissions (weighing_id, invoice_id, invoice_no, invoice_amount, advance_rate, fee_rate, advance_amount, fee_amount, payout_amount, bank_code, status, transferred_at) VALUES
(
    'c0000000-0000-0000-0000-000000000006',
    'f0000000-0000-0000-0000-000000000001',
    'FTR-2026-88194',
    748500, 80.0, 2.4,
    598800, 17964, 580836,
    'GARANTI_BBVA_FACTORING',
    'TRANSFERRED_T1',
    NOW() - INTERVAL '90 minutes'
);

-- ============================================================
-- 11. SECTOR TELEMETRY (latest snapshots)
-- ============================================================
INSERT INTO sector_telemetry_latest (sector, data) VALUES
('beton', '{
    "cementSilo1": 28,
    "cementSilo2": 82,
    "admixtureTank": 64,
    "sand04Silo": 35,
    "aggregateSilo": 82,
    "testSlumpCm": 14,
    "testTemp": 21.5,
    "returnedM3": 4.0,
    "mixers": [
        {"plate": "34 BTR 819", "driver": "Cemil Karadağ", "concreteClass": "C35/45 Hazır Beton", "volumeM3": 8.5, "site": "Göztepe Metro İstasyon Şantiyesi", "minutesRemaining": 28, "temperatureC": 21.4, "status": "CRITICAL"},
        {"plate": "34 BTR 402", "driver": "Hasan Çelik",   "concreteClass": "C30/37 Katlı Otopark", "volumeM3": 9.0, "site": "Kartal Kentsel Dönüşüm 2. Etap", "minutesRemaining": 62, "temperatureC": 20.8, "status": "NORMAL"},
        {"plate": "34 BTR 110", "driver": "Murat Şahin",   "concreteClass": "C25/30 Zemin Betonu",  "volumeM3": 9.5, "site": "Maltepe Konut Projesi Sahası",    "minutesRemaining": 84, "temperatureC": 19.9, "status": "SAFE"}
    ]
}'),
('tas_ocagi', '{
    "crusherFeedTpH": 420,
    "bunker0_4": 78, "bunker7_15": 64, "bunker15_25": 45, "bunkerBalast": 30,
    "screenWearHours": 680,
    "mapegRuhsatNo": "IR-2026/894-K",
    "annualQuotaTons": 1200000, "shippedTons": 845200,
    "mineralUnitPriceTL": 185.0, "mapegRusumRate": 0.045,
    "frontAxleKg": 6850, "driveAxleKg": 11200, "trailerAxleKg": 23200,
    "blastBatch": "PATLATMA-2026-B12", "blastYieldTons": 38500, "pasaWastePercent": 6.5
}'),
('hurda', '{
    "radiationCps": 14, "radiationAlarmThreshold": 60,
    "shredderTonnageToday": 185, "shredderEfficiencyPercent": 78,
    "experCutPercent": 4.5,
    "magneticIronPercent": 68, "eddyNonFerrousPercent": 18, "asrPasaPercent": 14,
    "kdvTevkifatRate": 0.9
}'),
('antrepo_gumruk', '{
    "occupancyPercent": 84, "totalTeu": 1240,
    "vbsQueueCount": 7,
    "avgDemurrageHours": 12.4,
    "pendingCustomsClearance": 3,
    "greenLaneClearance": 18
}'),
('demir', '{
    "heatNo": "ST-2026-H881", "steelGrade": "B500C",
    "yieldStrengthRe": 534, "tensileStrengthRm": 648,
    "elongationAgt": 8.4, "carbonEqCev": 0.39,
    "selectedDiameter": 16,
    "ts708Compliant": true
}'),
('kereste', '{
    "huberVolumeM3": 680,
    "sawMillYieldPercent": 62,
    "dryingKilnMoisturePercent": 13.5,
    "targetMoisturePercent": 12,
    "speciesDensity": {"sariCam": 680, "ladin": 430, "kestane": 600}
}'),
('nakliye_lojistik', '{
    "backhaulFillRate": 91,
    "emptyKmReduced": 38400,
    "uetdsPendingCount": 2,
    "fuelTheftAlerts": 0,
    "avgTireDepthMm": 4.8
}');

-- ============================================================
-- 12. ONBOARDING STEPS (per sector)
-- ============================================================
INSERT INTO onboarding_steps (sector, step_number, title, description, icon) VALUES
-- beton
('beton', 1, 'Kantar Bağlantısı',    'RS-232/RS-485 kantar indikatörünü TONAJ API ile eşleştirin.',               'Scale'),
('beton', 2, 'U-ETDS Kodu',          'Bakanlık verdiği şirket kodunu girin, sefer bildirimi otomasyonu hazır.',    'ShieldCheck'),
('beton', 3, 'Şantiye QR Ağı',       'Şantiye şeflerinin mobil onay ağına QR davetiyesi gönderin.',                'QrCode'),
('beton', 4, 'e-İrsaliye GİB Kodu',  'GİB Portal entegrasyon şifrenizi girerek e-İrsaliye otomasyonunu aktifleştirin.','FileCheck'),
-- tas_ocagi
('tas_ocagi', 1, 'MAPEG Ruhsat No',  'MAPEG sistemindeki maden ruhsat numaranızı tanımlayın.',                    'Mountain'),
('tas_ocagi', 2, 'Aks Bariyer',      '42T yasal sınır için otomatik bariyer kilitleme sistemini devreye alın.',   'Barrier'),
('tas_ocagi', 3, 'Kantar IoT',       'Sahada yerleşik IoT tartım sensörünü TONAJ ağına ekleyin.',                 'Cpu'),
('tas_ocagi', 4, 'U-ETDS Kodu',      'Sevk bildirimi için U-ETDS şirket kodunu tanımlayın.',                      'ShieldCheck'),
-- hurda
('hurda', 1, 'MoTAT Entegrasyonu',   'Çevre Bakanlığı MoTAT portalı erişim bilgilerini girin.',                   'Recycle'),
('hurda', 2, 'Radyasyon Kapısı',     'Radyasyon kapı spektrometresini TONAJ alarm sistemine bağlayın.',           'RadioTower'),
('hurda', 3, 'KDV Tevkifat Oranı',   '9/10 tevkifat oranını fatura şablonunuza tanımlayın.',                      'Receipt'),
('hurda', 4, 'e-İrsaliye GİB',       'GİB entegrasyonunu aktifleştirin.',                                         'FileCheck'),
-- antrepo_gumruk
('antrepo_gumruk', 1, 'BİLGE Entegrasyonu', 'Gümrük BİLGE sistemi erişim anahtarını girin.',                     'Key'),
('antrepo_gumruk', 2, 'VBS Kapı Randevu',   'Dijital kapı randevu ve tır parkı sıramatik sistemini aktifleştirin.','CalendarCheck'),
('antrepo_gumruk', 3, 'Ardiye Sayacı',      'Demurrage/ardiye ücret tarifenizi tanımlayın.',                      'Clock'),
('antrepo_gumruk', 4, 'Kantar IoT',         'Gümrük kantarı IoT bağlantısını yapılandırın.',                      'Cpu'),
-- demir
('demir', 1, 'TS 708 Sertifikası',   'Çelik kalite sertifikası doğrulama parametrelerini girin.',                 'Award'),
('demir', 2, 'Kangal/Bağ Hesabı',   'Metraj-tonaj çevirici katsayılarını çap bazında tanımlayın.',               'Layers'),
('demir', 3, 'e-İrsaliye GİB',      'GİB entegrasyonunu aktifleştirin.',                                          'FileCheck'),
('demir', 4, 'Şantiye Onay Ağı',    'Şantiye şeflerinin dijital kabul ağına kayıt yaptırın.',                     'QrCode'),
-- kereste
('kereste', 1, 'OGM Nakliye Tezkeresi', 'Orman İşletme Müdürlüğü tezkereleri için API bağlantısını yapılandırın.','Trees'),
('kereste', 2, 'Huber Formülü',        '3D hacim ölçüm kalibrasyonunu tomruk türüne göre ayarlayın.',             'Ruler'),
('kereste', 3, 'Kurutma Fırını Nem',   'Nem radar sensörünü TONAJ sistemine bağlayın.',                           'Thermometer'),
('kereste', 4, 'e-İrsaliye GİB',       'GİB entegrasyonunu aktifleştirin.',                                       'FileCheck'),
-- nakliye_lojistik
('nakliye_lojistik', 1, 'U-ETDS Kodu',     'Bakanlık verdiği şirket kodunu girerek toplu sefer bildirim otomasyonunu aktifleştirin.', 'ShieldCheck'),
('nakliye_lojistik', 2, 'Araç Filosu',     'Araç plakaları ve CAN-Bus mazot sensör ID lerini sisteme ekleyin.',   'Truck'),
('nakliye_lojistik', 3, 'Backhaul Profili','Araç tipi ve tercih rotalarınızı Backhaul Pazaryeri profiline girin.',  'Map'),
('nakliye_lojistik', 4, 'Navlun Hesabı',   'Kilometre bazlı fiyat tarifenizi ve erken ödeme bankası tercihini tanımlayın.', 'Coins');
