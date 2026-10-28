package main

import (
	"crypto/sha256"
	"database/sql"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"log"
	"math/rand"
	"net/http"
	"os"
	"strings"
	"time"

	_ "github.com/lib/pq"
	"golang.org/x/crypto/bcrypt"
)

// ============================================================
// CONFIG
// ============================================================

func dbConnStr() string {
	if v := os.Getenv("DATABASE_URL"); v != "" {
		return v
	}
	host := getenv("DB_HOST", "localhost")
	port := getenv("DB_PORT", "5432")
	user := getenv("DB_USER", "postgres")
	pass := getenv("DB_PASS", "postgres")
	name := getenv("DB_NAME", "tonaj")
	ssl := getenv("DB_SSLMODE", "disable")
	return fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
		host, port, user, pass, name, ssl)
}

func getenv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}

// ============================================================
// DATABASE
// ============================================================

var db *sql.DB

func initDB() {
	var err error
	db, err = sql.Open("postgres", dbConnStr())
	if err != nil {
		log.Fatalf("DB open error: %v", err)
	}
	db.SetMaxOpenConns(25)
	db.SetMaxIdleConns(5)
	db.SetConnMaxLifetime(5 * time.Minute)

	if err = db.Ping(); err != nil {
		log.Fatalf("DB ping error: %v", err)
	}
	log.Println("PostgreSQL bağlantısı kuruldu.")
}

// ============================================================
// MODELS
// ============================================================

type SectorMeta struct {
	ID                 string `json:"id"`
	Name               string `json:"name"`
	Tagline            string `json:"tagline"`
	Icon               string `json:"icon"`
	PrimaryMetricLabel string `json:"primaryMetricLabel"`
	PrimaryMetricValue string `json:"primaryMetricValue"`
	RiskFactor         string `json:"riskFactor"`
	ComplianceKey      string `json:"complianceKey"`
}

type User struct {
	ID                     string `json:"id"`
	Email                  string `json:"email"`
	Name                   string `json:"name"`
	PasswordHash           string `json:"-"`
	CompanyName            string `json:"companyName"`
	TaxNo                  string `json:"taxNo"`
	Sector                 string `json:"sector"`
	Role                   string `json:"role"`
	Token                  string `json:"token,omitempty"`
	CreatedAt              string `json:"createdAt"`
	HasCompletedOnboarding bool   `json:"hasCompletedOnboarding"`
	WeighbridgeModel       string `json:"weighbridgeModel,omitempty"`
	UetdsCompanyCode       string `json:"uetdsCompanyCode,omitempty"`
}

type WeighingRecord struct {
	ID                            string  `json:"id"`
	TicketNo                      string  `json:"ticketNo"`
	Plate                         string  `json:"plate"`
	TrailerPlate                  string  `json:"trailerPlate,omitempty"`
	DriverName                    string  `json:"driverName"`
	DriverPhone                   string  `json:"driverPhone"`
	CompanySender                 string  `json:"companySender"`
	CompanyReceiver               string  `json:"companyReceiver"`
	Material                      string  `json:"material"`
	Sector                        string  `json:"sector"`
	GrossWeightKg                 int     `json:"grossWeightKg"`
	TareWeightKg                  int     `json:"tareWeightKg"`
	NetWeightKg                   int     `json:"netWeightKg"`
	AxleCount                     int     `json:"axleCount"`
	MaxLegalWeightKg              int     `json:"maxLegalWeightKg"`
	IsOverweight                  bool    `json:"isOverweight"`
	MoistureWastePercent          float64 `json:"moistureWastePercent"`
	FinalPayableKg                int     `json:"finalPayableKg"`
	UetdsStatus                   string  `json:"uetdsStatus"`
	UetdsCode                     string  `json:"uetdsCode,omitempty"`
	EWaybillStatus                string  `json:"eWaybillStatus"`
	EWaybillNo                    string  `json:"eWaybillNo,omitempty"`
	Status                        string  `json:"status"`
	SiteName                      string  `json:"siteName"`
	Timestamp                     string  `json:"timestamp"`
	ConcreteSlumpMinutesRemaining *int    `json:"concreteSlumpMinutesRemaining,omitempty"`
	CustomsDeclarationNo          string  `json:"customsDeclarationNo,omitempty"`
	SiteApproved                  bool    `json:"siteApproved"`
	SiteApprovedAt                string  `json:"siteApprovedAt,omitempty"`
	SiteApproverName              string  `json:"siteApproverName,omitempty"`
	IotHardwareSha                string  `json:"iotHardwareSha,omitempty"`
}

type BackhaulLoad struct {
	ID            string  `json:"id"`
	Origin        string  `json:"origin"`
	Destination   string  `json:"destination"`
	Material      string  `json:"material"`
	Tonnage       float64 `json:"tonnage"`
	RatePerTon    float64 `json:"ratePerTon"`
	TotalFreight  float64 `json:"totalFreight"`
	VehicleType   string  `json:"vehicleType"`
	Urgency       string  `json:"urgency"`
	OwnerCompany  string  `json:"ownerCompany"`
	DistanceKm    int     `json:"distanceKm"`
	PickupWindow  string  `json:"pickupWindow"`
	IsBooked      bool    `json:"isBooked"`
}

type CompanyRiskProfile struct {
	ID                      string  `json:"id"`
	CompanyName             string  `json:"companyName"`
	TaxNo                   string  `json:"taxNo"`
	Sector                  string  `json:"sector"`
	TonajScore              int     `json:"tonajScore"`
	RiskStatus              string  `json:"riskStatus"`
	CreditTermDays          int     `json:"creditTermDays"`
	UnpaidDisputeCount      int     `json:"unpaidDisputeCount"`
	TotalDeliveredVolumeTon float64 `json:"totalDeliveredVolumeTon"`
	LastPaymentStatus       string  `json:"lastPaymentStatus"`
	CreditLimitTl           float64 `json:"creditLimitTl"`
	LockStatus              bool    `json:"lockStatus"`
}

type ComplianceAlert struct {
	ID                       string `json:"id"`
	Type                     string `json:"type"`
	Title                    string `json:"title"`
	Severity                 string `json:"severity"`
	Message                  string `json:"message"`
	Plate                    string `json:"plate"`
	Timestamp                string `json:"timestamp"`
	PenaltyPreventedAmountTl int    `json:"penaltyPreventedAmountTl"`
}

type DisputeSettlement struct {
	ID                string  `json:"id"`
	TicketID          string  `json:"ticketId"`
	SenderWeightKg    int     `json:"senderWeightKg"`
	ReceiverWeightKg  int     `json:"receiverWeightKg"`
	DifferenceKg      int     `json:"differenceKg"`
	ToleranceLimitKg  float64 `json:"toleranceLimitKg"`
	IsWithinTolerance bool    `json:"isWithinTolerance"`
	FinancialImpactTL float64 `json:"financialImpactTL"`
	ResolvedAt        string  `json:"resolvedAt"`
	Status            string  `json:"status"`
}

type EarlyPaymentSubmission struct {
	ID            string  `json:"id"`
	TicketID      string  `json:"ticketId"`
	InvoiceNo     string  `json:"invoiceNo"`
	InvoiceAmount float64 `json:"invoiceAmount"`
	AdvanceAmount float64 `json:"advanceAmount"`
	FeeAmount     float64 `json:"feeAmount"`
	PayoutAmount  float64 `json:"payoutAmount"`
	BankCode      string  `json:"bankCode"`
	Status        string  `json:"status"`
	CreatedAt     string  `json:"createdAt"`
}

type FinancialSummary struct {
	TotalResolvedVolumeTL float64                  `json:"totalResolvedVolumeTL"`
	ActiveFactoringRate   float64                  `json:"activeFactoringRate"`
	FactoringFeeRate      float64                  `json:"factoringFeeRate"`
	DisputedWeighings     []WeighingRecord         `json:"disputedWeighings"`
	Settlements           []DisputeSettlement      `json:"settlements"`
	EarlyPayments         []EarlyPaymentSubmission `json:"earlyPayments"`
}

type ComplianceSummary struct {
	TotalPreventedTL   int               `json:"totalPreventedTL"`
	UetdsTotalApproved int               `json:"uetdsTotalApproved"`
	MapegTotalTickets  int               `json:"mapegTotalTickets"`
	MotatTotalTickets  int               `json:"motatTotalTickets"`
	ActiveAlertsCount  int               `json:"activeAlertsCount"`
	Alerts             []ComplianceAlert `json:"alerts"`
}

type LiveScaleIndicator struct {
	IndicatorModel string  `json:"indicatorModel"`
	SerialNo       string  `json:"serialNo"`
	GrossWeightKg  float64 `json:"grossWeightKg"`
	TareWeightKg   float64 `json:"tareWeightKg"`
	NetWeightKg    float64 `json:"netWeightKg"`
	IsCalibrated   bool    `json:"isCalibrated"`
	LastCalibrated string  `json:"lastCalibrated"`
	IsScaleZeroed  bool    `json:"isScaleZeroed"`
	MaxCapacityKg  float64 `json:"maxCapacityKg"`
	ReadTimestamp  string  `json:"readTimestamp"`
}

type OnboardingStep struct {
	StepNumber  int    `json:"stepNumber"`
	Title       string `json:"title"`
	Description string `json:"description"`
	Icon        string `json:"icon"`
}

// ============================================================
// HELPERS
// ============================================================

func writeJSON(w http.ResponseWriter, status int, v any) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(v)
}

func writeError(w http.ResponseWriter, status int, msg string) {
	writeJSON(w, status, map[string]string{"error": msg})
}

func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}
		next.ServeHTTP(w, r)
	})
}

func generateToken(email string) string {
	h := sha256.New()
	h.Write([]byte(email + time.Now().String() + fmt.Sprintf("%d", rand.Int63())))
	return "tok_" + hex.EncodeToString(h.Sum(nil))[:32]
}

func generateUetdsCode() string {
	return fmt.Sprintf("UETDS-TR-%d-%d", time.Now().Year(), 8000000+rand.Intn(999999))
}

func generateEWaybillNo() string {
	return fmt.Sprintf("GIB%d%08d", time.Now().Year(), rand.Intn(99999999))
}

func generateTicketNo() string {
	return fmt.Sprintf("KNT-%06d", rand.Intn(999999))
}

func nullString(s string) sql.NullString {
	if s == "" {
		return sql.NullString{}
	}
	return sql.NullString{String: s, Valid: true}
}

func nullInt(i *int) sql.NullInt32 {
	if i == nil {
		return sql.NullInt32{}
	}
	return sql.NullInt32{Int32: int32(*i), Valid: true}
}

// ============================================================
// HANDLERS
// ============================================================

// GET /api/health
func handleHealth(w http.ResponseWriter, r *http.Request) {
	if err := db.Ping(); err != nil {
		writeJSON(w, http.StatusServiceUnavailable, map[string]string{
			"status": "DB Bağlantısı Yok", "engine": "PostgreSQL",
		})
		return
	}
	writeJSON(w, http.StatusOK, map[string]string{
		"status": "Go API + PostgreSQL Canlı", "engine": "PostgreSQL 15",
	})
}

// GET /api/sectors
func handleGetSectors(w http.ResponseWriter, r *http.Request) {
	rows, err := db.Query(`
		SELECT id, name, tagline, icon,
		       primary_metric_label, primary_metric_value,
		       risk_factor, compliance_key
		FROM sectors ORDER BY id`)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "Sektörler okunamadı")
		return
	}
	defer rows.Close()

	var sectors []SectorMeta
	for rows.Next() {
		var s SectorMeta
		if err := rows.Scan(&s.ID, &s.Name, &s.Tagline, &s.Icon,
			&s.PrimaryMetricLabel, &s.PrimaryMetricValue,
			&s.RiskFactor, &s.ComplianceKey); err != nil {
			continue
		}
		sectors = append(sectors, s)
	}
	if sectors == nil {
		sectors = []SectorMeta{}
	}
	writeJSON(w, http.StatusOK, sectors)
}

// POST /api/auth/login
func handleLogin(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, "Geçersiz istek")
		return
	}

	var u User
	var passwordHash string
	err := db.QueryRow(`
		SELECT id, email, name, password_hash, company_name, tax_no,
		       sector, role, created_at, has_completed_onboarding,
		       COALESCE(weighbridge_model,''), COALESCE(uetds_company_code,'')
		FROM users WHERE email = $1`, req.Email).
		Scan(&u.ID, &u.Email, &u.Name, &passwordHash, &u.CompanyName, &u.TaxNo,
			&u.Sector, &u.Role, &u.CreatedAt, &u.HasCompletedOnboarding,
			&u.WeighbridgeModel, &u.UetdsCompanyCode)
	if err == sql.ErrNoRows {
		writeError(w, http.StatusUnauthorized, "E-posta veya şifre hatalı")
		return
	}
	if err != nil {
		writeError(w, http.StatusInternalServerError, "Sunucu hatası")
		return
	}

	// bcrypt compare — seed data has placeholder hashes, accept "123456" for dev
	if bcrypt.CompareHashAndPassword([]byte(passwordHash), []byte(req.Password)) != nil {
		// Dev fallback: accept plain "123456" if hash is placeholder
		if req.Password != "123456" || !strings.HasPrefix(passwordHash, "$2a$10$placeholder") {
			writeError(w, http.StatusUnauthorized, "E-posta veya şifre hatalı")
			return
		}
	}

	token := generateToken(req.Email)
	db.Exec(`UPDATE users SET token = $1 WHERE id = $2`, token, u.ID)
	u.Token = token

	writeJSON(w, http.StatusOK, map[string]any{"user": u, "token": token})
}

// POST /api/auth/register
func handleRegister(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Email       string `json:"email"`
		Password    string `json:"password"`
		CompanyName string `json:"companyName"`
		TaxNo       string `json:"taxNo"`
		Role        string `json:"role"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, "Geçersiz istek")
		return
	}
	if req.Email == "" || req.Password == "" || req.CompanyName == "" || req.TaxNo == "" {
		writeError(w, http.StatusBadRequest, "Zorunlu alanlar eksik")
		return
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "Şifre işlenemedi")
		return
	}

	role := req.Role
	if role == "" {
		role = "Tesis Yöneticisi"
	}
	name := strings.Split(req.Email, "@")[0]
	token := generateToken(req.Email)

	var u User
	err = db.QueryRow(`
		INSERT INTO users (email, name, password_hash, company_name, tax_no, role, token)
		VALUES ($1, $2, $3, $4, $5, $6, $7)
		RETURNING id, email, name, company_name, tax_no, sector, role, token, created_at, has_completed_onboarding`,
		req.Email, name, string(hash), req.CompanyName, req.TaxNo, role, token).
		Scan(&u.ID, &u.Email, &u.Name, &u.CompanyName, &u.TaxNo,
			&u.Sector, &u.Role, &u.Token, &u.CreatedAt, &u.HasCompletedOnboarding)
	if err != nil {
		if strings.Contains(err.Error(), "unique") {
			writeError(w, http.StatusConflict, "Bu e-posta zaten kayıtlı")
			return
		}
		writeError(w, http.StatusInternalServerError, "Kayıt oluşturulamadı")
		return
	}

	writeJSON(w, http.StatusCreated, map[string]any{"user": u, "token": token})
}

// GET /api/weighings
func handleGetWeighings(w http.ResponseWriter, r *http.Request) {
	sector := r.URL.Query().Get("sector")
	search := r.URL.Query().Get("search")

	query := `
		SELECT id, ticket_no, plate, COALESCE(trailer_plate,''),
		       driver_name, driver_phone,
		       company_sender_name, company_receiver_name,
		       material, sector,
		       gross_weight_kg, tare_weight_kg, net_weight_kg,
		       axle_count, max_legal_weight_kg, is_overweight,
		       moisture_waste_percent, final_payable_kg,
		       uetds_status, COALESCE(uetds_code,''),
		       e_waybill_status, COALESCE(e_waybill_no,''),
		       status, site_name,
		       concrete_slump_minutes_remaining,
		       COALESCE(customs_declaration_no,''),
		       site_approved,
		       COALESCE(to_char(site_approved_at,'HH24:MI DD.MM.YYYY'),''),
		       COALESCE(site_approver_name,''),
		       COALESCE(iot_hardware_sha,''),
		       to_char(created_at,'HH24:MI DD.MM.YYYY')
		FROM weighing_records
		WHERE ($1 = '' OR sector::text = $1)
		  AND ($2 = '' OR (plate || ' ' || driver_name || ' ' || company_sender_name || ' ' || ticket_no) ILIKE '%' || $2 || '%')
		ORDER BY created_at DESC
		LIMIT 200`

	rows, err := db.Query(query, sector, search)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "Tartım verileri okunamadı")
		return
	}
	defer rows.Close()

	var records []WeighingRecord
	for rows.Next() {
		var rec WeighingRecord
		var slump sql.NullInt32
		if err := rows.Scan(
			&rec.ID, &rec.TicketNo, &rec.Plate, &rec.TrailerPlate,
			&rec.DriverName, &rec.DriverPhone,
			&rec.CompanySender, &rec.CompanyReceiver,
			&rec.Material, &rec.Sector,
			&rec.GrossWeightKg, &rec.TareWeightKg, &rec.NetWeightKg,
			&rec.AxleCount, &rec.MaxLegalWeightKg, &rec.IsOverweight,
			&rec.MoistureWastePercent, &rec.FinalPayableKg,
			&rec.UetdsStatus, &rec.UetdsCode,
			&rec.EWaybillStatus, &rec.EWaybillNo,
			&rec.Status, &rec.SiteName,
			&slump,
			&rec.CustomsDeclarationNo,
			&rec.SiteApproved, &rec.SiteApprovedAt, &rec.SiteApproverName,
			&rec.IotHardwareSha,
			&rec.Timestamp,
		); err != nil {
			log.Printf("scan error: %v", err)
			continue
		}
		if slump.Valid {
			v := int(slump.Int32)
			rec.ConcreteSlumpMinutesRemaining = &v
		}
		records = append(records, rec)
	}
	if records == nil {
		records = []WeighingRecord{}
	}
	writeJSON(w, http.StatusOK, records)
}

// POST /api/weighings
func handleCreateWeighing(w http.ResponseWriter, r *http.Request) {
	var req WeighingRecord
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, "Geçersiz istek")
		return
	}

	ticketNo := generateTicketNo()
	eWaybillNo := generateEWaybillNo()

	net := req.GrossWeightKg - req.TareWeightKg
	finalKg := int(float64(net) * (1 - req.MoistureWastePercent/100))
	if req.FinalPayableKg > 0 {
		finalKg = req.FinalPayableKg
	}

	var rec WeighingRecord
	var slump sql.NullInt32
	err := db.QueryRow(`
		INSERT INTO weighing_records (
			ticket_no, plate, trailer_plate,
			driver_name, driver_phone,
			company_sender_name, company_receiver_name,
			material, sector,
			gross_weight_kg, tare_weight_kg,
			axle_count, max_legal_weight_kg,
			moisture_waste_percent, final_payable_kg,
			uetds_status, e_waybill_status, e_waybill_no,
			status, site_name,
			concrete_slump_minutes_remaining,
			customs_declaration_no,
			iot_hardware_sha
		) VALUES (
			$1, $2, NULLIF($3,''),
			$4, $5, $6, $7,
			$8, $9,
			$10, $11, $12, $13,
			$14, $15,
			'PENDING', 'PENDING', $16,
			COALESCE(NULLIF($17,''),'IN_TRANSIT'), $18,
			$19,
			NULLIF($20,''),
			NULLIF($21,'')
		)
		RETURNING id, ticket_no, plate, COALESCE(trailer_plate,''),
		          driver_name, driver_phone,
		          company_sender_name, company_receiver_name,
		          material, sector,
		          gross_weight_kg, tare_weight_kg, net_weight_kg,
		          axle_count, max_legal_weight_kg, is_overweight,
		          moisture_waste_percent, final_payable_kg,
		          uetds_status, COALESCE(uetds_code,''),
		          e_waybill_status, COALESCE(e_waybill_no,''),
		          status, site_name,
		          concrete_slump_minutes_remaining,
		          COALESCE(customs_declaration_no,''),
		          site_approved,
		          COALESCE(to_char(site_approved_at,'HH24:MI DD.MM.YYYY'),''),
		          COALESCE(site_approver_name,''),
		          COALESCE(iot_hardware_sha,''),
		          to_char(created_at,'HH24:MI DD.MM.YYYY')`,
		ticketNo, req.Plate, req.TrailerPlate,
		req.DriverName, req.DriverPhone,
		req.CompanySender, req.CompanyReceiver,
		req.Material, req.Sector,
		req.GrossWeightKg, req.TareWeightKg,
		req.AxleCount, req.MaxLegalWeightKg,
		req.MoistureWastePercent, finalKg,
		eWaybillNo,
		req.Status, req.SiteName,
		nullInt(req.ConcreteSlumpMinutesRemaining),
		req.CustomsDeclarationNo,
		req.IotHardwareSha,
	).Scan(
		&rec.ID, &rec.TicketNo, &rec.Plate, &rec.TrailerPlate,
		&rec.DriverName, &rec.DriverPhone,
		&rec.CompanySender, &rec.CompanyReceiver,
		&rec.Material, &rec.Sector,
		&rec.GrossWeightKg, &rec.TareWeightKg, &rec.NetWeightKg,
		&rec.AxleCount, &rec.MaxLegalWeightKg, &rec.IsOverweight,
		&rec.MoistureWastePercent, &rec.FinalPayableKg,
		&rec.UetdsStatus, &rec.UetdsCode,
		&rec.EWaybillStatus, &rec.EWaybillNo,
		&rec.Status, &rec.SiteName,
		&slump,
		&rec.CustomsDeclarationNo,
		&rec.SiteApproved, &rec.SiteApprovedAt, &rec.SiteApproverName,
		&rec.IotHardwareSha,
		&rec.Timestamp,
	)
	if err != nil {
		log.Printf("createWeighing error: %v", err)
		writeError(w, http.StatusInternalServerError, "Tartım fişi oluşturulamadı")
		return
	}
	if slump.Valid {
		v := int(slump.Int32)
		rec.ConcreteSlumpMinutesRemaining = &v
	}
	writeJSON(w, http.StatusCreated, rec)
}

// POST /api/weighings/approve-uetds
func handleApproveUetds(w http.ResponseWriter, r *http.Request) {
	var req struct {
		TicketID string `json:"ticketId"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, "Geçersiz istek")
		return
	}

	code := generateUetdsCode()
	res, err := db.Exec(`
		UPDATE weighing_records
		SET uetds_status = 'APPROVED', uetds_code = $1, updated_at = NOW()
		WHERE id = $2 AND uetds_status != 'APPROVED'`,
		code, req.TicketID)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "U-ETDS güncellenemedi")
		return
	}
	n, _ := res.RowsAffected()
	if n == 0 {
		// Already approved — return existing code
		var existing string
		db.QueryRow(`SELECT COALESCE(uetds_code,'') FROM weighing_records WHERE id = $1`, req.TicketID).Scan(&existing)
		writeJSON(w, http.StatusOK, map[string]any{"success": true, "uetdsCode": existing})
		return
	}
	writeJSON(w, http.StatusOK, map[string]any{"success": true, "uetdsCode": code})
}

// POST /api/weighings/site-delivery
func handleSiteDelivery(w http.ResponseWriter, r *http.Request) {
	var req struct {
		TicketID     string  `json:"ticketId"`
		ApproverName string  `json:"approverName"`
		SlumpCm      float64 `json:"slumpCm"`
		Temperature  float64 `json:"temperature"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, "Geçersiz istek")
		return
	}

	_, err := db.Exec(`
		UPDATE weighing_records
		SET site_approved = TRUE,
		    site_approved_at = NOW(),
		    site_approver_name = $1,
		    status = 'DELIVERED',
		    updated_at = NOW()
		WHERE id = $2`,
		req.ApproverName, req.TicketID)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "Teslimat güncellenemedi")
		return
	}

	// Return updated record
	r2, _ := http.NewRequest("GET", "/api/weighings", nil)
	q := r2.URL.Query()
	q.Set("id", req.TicketID)
	r2.URL.RawQuery = q.Encode()

	var rec WeighingRecord
	var slump sql.NullInt32
	db.QueryRow(`
		SELECT id, ticket_no, plate, COALESCE(trailer_plate,''),
		       driver_name, driver_phone,
		       company_sender_name, company_receiver_name,
		       material, sector,
		       gross_weight_kg, tare_weight_kg, net_weight_kg,
		       axle_count, max_legal_weight_kg, is_overweight,
		       moisture_waste_percent, final_payable_kg,
		       uetds_status, COALESCE(uetds_code,''),
		       e_waybill_status, COALESCE(e_waybill_no,''),
		       status, site_name,
		       concrete_slump_minutes_remaining,
		       COALESCE(customs_declaration_no,''),
		       site_approved,
		       COALESCE(to_char(site_approved_at,'HH24:MI DD.MM.YYYY'),''),
		       COALESCE(site_approver_name,''),
		       COALESCE(iot_hardware_sha,''),
		       to_char(created_at,'HH24:MI DD.MM.YYYY')
		FROM weighing_records WHERE id = $1`, req.TicketID).
		Scan(
			&rec.ID, &rec.TicketNo, &rec.Plate, &rec.TrailerPlate,
			&rec.DriverName, &rec.DriverPhone,
			&rec.CompanySender, &rec.CompanyReceiver,
			&rec.Material, &rec.Sector,
			&rec.GrossWeightKg, &rec.TareWeightKg, &rec.NetWeightKg,
			&rec.AxleCount, &rec.MaxLegalWeightKg, &rec.IsOverweight,
			&rec.MoistureWastePercent, &rec.FinalPayableKg,
			&rec.UetdsStatus, &rec.UetdsCode,
			&rec.EWaybillStatus, &rec.EWaybillNo,
			&rec.Status, &rec.SiteName,
			&slump,
			&rec.CustomsDeclarationNo,
			&rec.SiteApproved, &rec.SiteApprovedAt, &rec.SiteApproverName,
			&rec.IotHardwareSha,
			&rec.Timestamp,
		)
	if slump.Valid {
		v := int(slump.Int32)
		rec.ConcreteSlumpMinutesRemaining = &v
	}
	writeJSON(w, http.StatusOK, map[string]any{"success": true, "record": rec})
}

// GET /api/risk/companies
func handleGetRiskProfiles(w http.ResponseWriter, r *http.Request) {
	rows, err := db.Query(`
		SELECT rp.id, c.name, c.tax_no, COALESCE(c.sector,''),
		       rp.tonaj_score, rp.risk_status, rp.credit_term_days,
		       rp.unpaid_dispute_count, rp.total_delivered_volume_ton,
		       COALESCE(rp.last_payment_status,''), rp.credit_limit_tl, rp.lock_status
		FROM company_risk_profiles rp
		JOIN companies c ON c.id = rp.company_id
		ORDER BY rp.tonaj_score DESC`)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "Risk profilleri okunamadı")
		return
	}
	defer rows.Close()

	var profiles []CompanyRiskProfile
	for rows.Next() {
		var p CompanyRiskProfile
		rows.Scan(&p.ID, &p.CompanyName, &p.TaxNo, &p.Sector,
			&p.TonajScore, &p.RiskStatus, &p.CreditTermDays,
			&p.UnpaidDisputeCount, &p.TotalDeliveredVolumeTon,
			&p.LastPaymentStatus, &p.CreditLimitTl, &p.LockStatus)
		profiles = append(profiles, p)
	}
	if profiles == nil {
		profiles = []CompanyRiskProfile{}
	}
	writeJSON(w, http.StatusOK, profiles)
}

// POST /api/risk/toggle-lock
func handleToggleLock(w http.ResponseWriter, r *http.Request) {
	var req struct {
		CompanyID string `json:"companyId"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, "Geçersiz istek")
		return
	}

	var p CompanyRiskProfile
	err := db.QueryRow(`
		UPDATE company_risk_profiles
		SET lock_status = NOT lock_status, updated_at = NOW()
		WHERE id = $1
		RETURNING id, lock_status`, req.CompanyID).
		Scan(&p.ID, &p.LockStatus)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "Kilit durumu güncellenemedi")
		return
	}

	msg := "Kredi kilidi açıldı"
	if p.LockStatus {
		msg = "Kredi kilidi aktifleştirildi"
	}
	writeJSON(w, http.StatusOK, map[string]any{"success": true, "company": p, "message": msg})
}

// GET /api/backhaul/loads
func handleGetBackhaulLoads(w http.ResponseWriter, r *http.Request) {
	rows, err := db.Query(`
		SELECT id, origin, destination, material,
		       tonnage, rate_per_ton, total_freight,
		       vehicle_type, urgency, owner_company_name,
		       distance_km, pickup_window, is_booked
		FROM backhaul_loads
		ORDER BY
		    CASE urgency WHEN 'HIGH' THEN 1 WHEN 'MEDIUM' THEN 2 ELSE 3 END,
		    created_at DESC`)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "Backhaul yükleri okunamadı")
		return
	}
	defer rows.Close()

	var loads []BackhaulLoad
	for rows.Next() {
		var l BackhaulLoad
		rows.Scan(&l.ID, &l.Origin, &l.Destination, &l.Material,
			&l.Tonnage, &l.RatePerTon, &l.TotalFreight,
			&l.VehicleType, &l.Urgency, &l.OwnerCompany,
			&l.DistanceKm, &l.PickupWindow, &l.IsBooked)
		loads = append(loads, l)
	}
	if loads == nil {
		loads = []BackhaulLoad{}
	}
	writeJSON(w, http.StatusOK, loads)
}

// POST /api/backhaul/book
func handleBookBackhaul(w http.ResponseWriter, r *http.Request) {
	var req struct {
		LoadID string `json:"loadId"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, "Geçersiz istek")
		return
	}

	var l BackhaulLoad
	err := db.QueryRow(`
		UPDATE backhaul_loads
		SET is_booked = TRUE
		WHERE id = $1 AND is_booked = FALSE
		RETURNING id, origin, destination, material,
		          tonnage, rate_per_ton, total_freight,
		          vehicle_type, urgency, owner_company_name,
		          distance_km, pickup_window, is_booked`,
		req.LoadID).
		Scan(&l.ID, &l.Origin, &l.Destination, &l.Material,
			&l.Tonnage, &l.RatePerTon, &l.TotalFreight,
			&l.VehicleType, &l.Urgency, &l.OwnerCompany,
			&l.DistanceKm, &l.PickupWindow, &l.IsBooked)
	if err != nil {
		writeError(w, http.StatusConflict, "Yük zaten rezerve edilmiş veya bulunamadı")
		return
	}
	writeJSON(w, http.StatusOK, map[string]any{"success": true, "load": l})
}

// GET /api/compliance/alerts
func handleGetAlerts(w http.ResponseWriter, r *http.Request) {
	rows, err := db.Query(`
		SELECT id, type, title, severity, message,
		       COALESCE(plate,''),
		       to_char(created_at,'HH24:MI'),
		       penalty_prevented_amount_tl
		FROM compliance_alerts
		ORDER BY
		    CASE severity WHEN 'CRITICAL' THEN 1 WHEN 'WARNING' THEN 2 ELSE 3 END,
		    created_at DESC
		LIMIT 50`)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "Uyarılar okunamadı")
		return
	}
	defer rows.Close()

	var alerts []ComplianceAlert
	for rows.Next() {
		var a ComplianceAlert
		rows.Scan(&a.ID, &a.Type, &a.Title, &a.Severity, &a.Message,
			&a.Plate, &a.Timestamp, &a.PenaltyPreventedAmountTl)
		alerts = append(alerts, a)
	}
	if alerts == nil {
		alerts = []ComplianceAlert{}
	}
	writeJSON(w, http.StatusOK, alerts)
}

// GET /api/compliance/summary
func handleGetComplianceSummary(w http.ResponseWriter, r *http.Request) {
	var summary ComplianceSummary

	db.QueryRow(`SELECT COALESCE(SUM(penalty_prevented_amount_tl),0) FROM compliance_alerts`).
		Scan(&summary.TotalPreventedTL)
	db.QueryRow(`SELECT COUNT(*) FROM weighing_records WHERE uetds_status='APPROVED'`).
		Scan(&summary.UetdsTotalApproved)
	db.QueryRow(`SELECT COUNT(*) FROM mapeg_shipments`).
		Scan(&summary.MapegTotalTickets)
	db.QueryRow(`SELECT COUNT(*) FROM motat_records`).
		Scan(&summary.MotatTotalTickets)
	db.QueryRow(`SELECT COUNT(*) FROM compliance_alerts WHERE acknowledged=FALSE`).
		Scan(&summary.ActiveAlertsCount)

	rows, _ := db.Query(`
		SELECT id, type, title, severity, message,
		       COALESCE(plate,''), to_char(created_at,'HH24:MI'),
		       penalty_prevented_amount_tl
		FROM compliance_alerts ORDER BY created_at DESC LIMIT 20`)
	if rows != nil {
		defer rows.Close()
		for rows.Next() {
			var a ComplianceAlert
			rows.Scan(&a.ID, &a.Type, &a.Title, &a.Severity, &a.Message,
				&a.Plate, &a.Timestamp, &a.PenaltyPreventedAmountTl)
			summary.Alerts = append(summary.Alerts, a)
		}
	}
	if summary.Alerts == nil {
		summary.Alerts = []ComplianceAlert{}
	}
	writeJSON(w, http.StatusOK, summary)
}

// GET /api/financial/summary
func handleGetFinancialSummary(w http.ResponseWriter, r *http.Request) {
	var summary FinancialSummary
	summary.ActiveFactoringRate = 80.0
	summary.FactoringFeeRate = 2.4

	db.QueryRow(`SELECT COALESCE(SUM(invoice_amount),0) FROM early_payment_submissions WHERE status='TRANSFERRED_T1'`).
		Scan(&summary.TotalResolvedVolumeTL)

	// Disputed weighings
	rows, _ := db.Query(`
		SELECT id, ticket_no, plate, COALESCE(trailer_plate,''),
		       driver_name, driver_phone,
		       company_sender_name, company_receiver_name,
		       material, sector,
		       gross_weight_kg, tare_weight_kg, net_weight_kg,
		       axle_count, max_legal_weight_kg, is_overweight,
		       moisture_waste_percent, final_payable_kg,
		       uetds_status, COALESCE(uetds_code,''),
		       e_waybill_status, COALESCE(e_waybill_no,''),
		       status, site_name,
		       concrete_slump_minutes_remaining,
		       COALESCE(customs_declaration_no,''),
		       site_approved,
		       COALESCE(to_char(site_approved_at,'HH24:MI DD.MM.YYYY'),''),
		       COALESCE(site_approver_name,''),
		       COALESCE(iot_hardware_sha,''),
		       to_char(created_at,'HH24:MI DD.MM.YYYY')
		FROM weighing_records WHERE status='DISPUTED' ORDER BY created_at DESC`)
	if rows != nil {
		defer rows.Close()
		for rows.Next() {
			var rec WeighingRecord
			var slump sql.NullInt32
			rows.Scan(
				&rec.ID, &rec.TicketNo, &rec.Plate, &rec.TrailerPlate,
				&rec.DriverName, &rec.DriverPhone,
				&rec.CompanySender, &rec.CompanyReceiver,
				&rec.Material, &rec.Sector,
				&rec.GrossWeightKg, &rec.TareWeightKg, &rec.NetWeightKg,
				&rec.AxleCount, &rec.MaxLegalWeightKg, &rec.IsOverweight,
				&rec.MoistureWastePercent, &rec.FinalPayableKg,
				&rec.UetdsStatus, &rec.UetdsCode,
				&rec.EWaybillStatus, &rec.EWaybillNo,
				&rec.Status, &rec.SiteName,
				&slump,
				&rec.CustomsDeclarationNo,
				&rec.SiteApproved, &rec.SiteApprovedAt, &rec.SiteApproverName,
				&rec.IotHardwareSha,
				&rec.Timestamp,
			)
			if slump.Valid {
				v := int(slump.Int32)
				rec.ConcreteSlumpMinutesRemaining = &v
			}
			summary.DisputedWeighings = append(summary.DisputedWeighings, rec)
		}
	}

	// Settlements
	srows, _ := db.Query(`
		SELECT ds.id, w.id, ds.sender_weight_kg, ds.receiver_weight_kg, ds.difference_kg,
		       ds.tolerance_limit_kg, ds.is_within_tolerance, ds.financial_impact_tl,
		       COALESCE(to_char(ds.resolved_at,'HH24:MI DD.MM.YYYY'),''), ds.status
		FROM dispute_settlements ds
		JOIN weighing_records w ON w.id = ds.weighing_id
		ORDER BY ds.created_at DESC LIMIT 20`)
	if srows != nil {
		defer srows.Close()
		for srows.Next() {
			var s DisputeSettlement
			srows.Scan(&s.ID, &s.TicketID, &s.SenderWeightKg, &s.ReceiverWeightKg, &s.DifferenceKg,
				&s.ToleranceLimitKg, &s.IsWithinTolerance, &s.FinancialImpactTL,
				&s.ResolvedAt, &s.Status)
			summary.Settlements = append(summary.Settlements, s)
		}
	}

	// Early payments
	erows, _ := db.Query(`
		SELECT id, COALESCE(weighing_id::text,''), invoice_no, invoice_amount,
		       advance_amount, fee_amount, payout_amount, bank_code,
		       status, to_char(created_at,'HH24:MI DD.MM.YYYY')
		FROM early_payment_submissions ORDER BY created_at DESC LIMIT 20`)
	if erows != nil {
		defer erows.Close()
		for erows.Next() {
			var ep EarlyPaymentSubmission
			erows.Scan(&ep.ID, &ep.TicketID, &ep.InvoiceNo, &ep.InvoiceAmount,
				&ep.AdvanceAmount, &ep.FeeAmount, &ep.PayoutAmount,
				&ep.BankCode, &ep.Status, &ep.CreatedAt)
			summary.EarlyPayments = append(summary.EarlyPayments, ep)
		}
	}

	if summary.DisputedWeighings == nil {
		summary.DisputedWeighings = []WeighingRecord{}
	}
	if summary.Settlements == nil {
		summary.Settlements = []DisputeSettlement{}
	}
	if summary.EarlyPayments == nil {
		summary.EarlyPayments = []EarlyPaymentSubmission{}
	}

	writeJSON(w, http.StatusOK, summary)
}

// POST /api/financial/resolve-dispute
func handleResolveDispute(w http.ResponseWriter, r *http.Request) {
	var req struct {
		TicketID         string  `json:"ticketId"`
		SenderWeightKg   int     `json:"senderWeightKg"`
		ReceiverWeightKg int     `json:"receiverWeightKg"`
		UnitPriceTl      float64 `json:"unitPriceTl"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, "Geçersiz istek")
		return
	}

	diff := req.SenderWeightKg - req.ReceiverWeightKg
	if diff < 0 {
		diff = -diff
	}
	toleranceKg := float64(req.SenderWeightKg) * 0.005
	withinTol := float64(diff) <= toleranceKg
	financialImpact := 0.0
	status := "APPROVED"
	if !withinTol {
		financialImpact = float64(diff) * req.UnitPriceTl / 1000
		status = "DISPUTED"
	}

	var settlement DisputeSettlement
	err := db.QueryRow(`
		INSERT INTO dispute_settlements
		    (weighing_id, sender_weight_kg, receiver_weight_kg,
		     tolerance_limit_kg, is_within_tolerance,
		     unit_price_tl, financial_impact_tl, status, resolved_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
		RETURNING id, weighing_id::text, sender_weight_kg, receiver_weight_kg,
		          difference_kg, tolerance_limit_kg, is_within_tolerance,
		          financial_impact_tl, to_char(resolved_at,'HH24:MI DD.MM.YYYY'), status`,
		req.TicketID, req.SenderWeightKg, req.ReceiverWeightKg,
		toleranceKg, withinTol, req.UnitPriceTl, financialImpact, status).
		Scan(&settlement.ID, &settlement.TicketID,
			&settlement.SenderWeightKg, &settlement.ReceiverWeightKg,
			&settlement.DifferenceKg, &settlement.ToleranceLimitKg,
			&settlement.IsWithinTolerance, &settlement.FinancialImpactTL,
			&settlement.ResolvedAt, &settlement.Status)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "Mutabakat kaydedilemedi")
		return
	}

	// Update weighing status
	if withinTol {
		db.Exec(`UPDATE weighing_records SET status='DELIVERED', updated_at=NOW() WHERE id=$1`, req.TicketID)
	}

	msg := "Fark tolerans içinde, otomatik onaylandı"
	if !withinTol {
		msg = fmt.Sprintf("%.0f kg fark toleransı aşıyor, manuel inceleme başlatıldı", float64(diff))
	}
	writeJSON(w, http.StatusOK, map[string]any{"success": true, "settlement": settlement, "message": msg})
}

// POST /api/financial/request-early-payment
func handleEarlyPayment(w http.ResponseWriter, r *http.Request) {
	var req struct {
		TicketID      string  `json:"ticketId"`
		InvoiceNo     string  `json:"invoiceNo"`
		InvoiceAmount float64 `json:"invoiceAmount"`
		BankCode      string  `json:"bankCode"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, "Geçersiz istek")
		return
	}

	advanceRate := 80.0
	feeRate := 2.4
	advanceAmt := req.InvoiceAmount * advanceRate / 100
	feeAmt := advanceAmt * feeRate / 100
	payoutAmt := advanceAmt - feeAmt

	bankCode := req.BankCode
	if bankCode == "" {
		bankCode = "GARANTI_BBVA_FACTORING"
	}

	var ep EarlyPaymentSubmission
	err := db.QueryRow(`
		INSERT INTO early_payment_submissions
		    (weighing_id, invoice_no, invoice_amount,
		     advance_rate, fee_rate,
		     advance_amount, fee_amount, payout_amount,
		     bank_code, status)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'TRANSFERRED_T1')
		RETURNING id, COALESCE(weighing_id::text,''), invoice_no, invoice_amount,
		          advance_amount, fee_amount, payout_amount, bank_code,
		          status, to_char(created_at,'HH24:MI DD.MM.YYYY')`,
		nullString(req.TicketID), req.InvoiceNo, req.InvoiceAmount,
		advanceRate, feeRate, advanceAmt, feeAmt, payoutAmt, bankCode).
		Scan(&ep.ID, &ep.TicketID, &ep.InvoiceNo, &ep.InvoiceAmount,
			&ep.AdvanceAmount, &ep.FeeAmount, &ep.PayoutAmount,
			&ep.BankCode, &ep.Status, &ep.CreatedAt)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "Erken ödeme talebi kaydedilemedi")
		return
	}
	writeJSON(w, http.StatusCreated, map[string]any{
		"success":    true,
		"submission": ep,
		"message":    fmt.Sprintf("%.0f TL erken ödeme talebi %s bankasına iletildi", payoutAmt, bankCode),
	})
}

// GET /api/onboarding/steps
func handleGetOnboardingSteps(w http.ResponseWriter, r *http.Request) {
	sector := r.URL.Query().Get("sector")
	if sector == "" {
		sector = "beton"
	}

	rows, err := db.Query(`
		SELECT step_number, title, description, icon
		FROM onboarding_steps WHERE sector = $1
		ORDER BY step_number`, sector)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "Onboarding adımları okunamadı")
		return
	}
	defer rows.Close()

	var steps []OnboardingStep
	for rows.Next() {
		var s OnboardingStep
		rows.Scan(&s.StepNumber, &s.Title, &s.Description, &s.Icon)
		steps = append(steps, s)
	}
	if steps == nil {
		steps = []OnboardingStep{}
	}
	writeJSON(w, http.StatusOK, map[string]any{"sector": sector, "steps": steps})
}

// POST /api/onboarding/complete
func handleCompleteOnboarding(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Token            string `json:"token"`
		Sector           string `json:"sector"`
		WeighbridgeModel string `json:"weighbridgeModel"`
		UetdsCompanyCode string `json:"uetdsCompanyCode"`
		EnableBarrier    bool   `json:"enableBarrier"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, "Geçersiz istek")
		return
	}

	var u User
	err := db.QueryRow(`
		UPDATE users
		SET has_completed_onboarding = TRUE,
		    sector = $1,
		    weighbridge_model = NULLIF($2,''),
		    uetds_company_code = NULLIF($3,''),
		    updated_at = NOW()
		WHERE token = $4
		RETURNING id, email, name, company_name, tax_no,
		          sector, role, token, created_at, has_completed_onboarding,
		          COALESCE(weighbridge_model,''), COALESCE(uetds_company_code,'')`,
		req.Sector, req.WeighbridgeModel, req.UetdsCompanyCode, req.Token).
		Scan(&u.ID, &u.Email, &u.Name, &u.CompanyName, &u.TaxNo,
			&u.Sector, &u.Role, &u.Token, &u.CreatedAt, &u.HasCompletedOnboarding,
			&u.WeighbridgeModel, &u.UetdsCompanyCode)
	if err != nil {
		writeError(w, http.StatusUnauthorized, "Geçersiz oturum")
		return
	}
	writeJSON(w, http.StatusOK, map[string]any{
		"success": true,
		"message": "Onboarding tamamlandı",
		"user":    u,
	})
}

// GET /api/sectors/telemetry
func handleGetTelemetry(w http.ResponseWriter, r *http.Request) {
	sector := r.URL.Query().Get("sector")
	if sector == "" {
		writeError(w, http.StatusBadRequest, "sector parametresi gerekli")
		return
	}

	var data json.RawMessage
	var updatedAt time.Time
	err := db.QueryRow(`
		SELECT data, updated_at FROM sector_telemetry_latest WHERE sector = $1`, sector).
		Scan(&data, &updatedAt)
	if err != nil {
		writeError(w, http.StatusNotFound, "Telemetri verisi bulunamadı")
		return
	}
	writeJSON(w, http.StatusOK, map[string]any{
		"sector":    sector,
		"timestamp": updatedAt.Format("15:04 02.01.2006"),
		"data":      data,
	})
}

// POST /api/sectors/telemetry
func handleUpdateTelemetry(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Sector string          `json:"sector"`
		Data   json.RawMessage `json:"data"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, "Geçersiz istek")
		return
	}

	_, err := db.Exec(`
		INSERT INTO sector_telemetry_latest (sector, data, updated_at)
		VALUES ($1, $2, NOW())
		ON CONFLICT (sector) DO UPDATE
		SET data = EXCLUDED.data, updated_at = NOW()`,
		req.Sector, req.Data)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "Telemetri güncellenemedi")
		return
	}
	writeJSON(w, http.StatusOK, map[string]any{
		"success":   true,
		"sector":    req.Sector,
		"telemetry": req.Data,
		"message":   "Telemetri güncellendi",
	})
}

// GET /api/scale/live-indicator
func handleLiveScale(w http.ResponseWriter, r *http.Request) {
	// IoT hardware gerçek entegrasyon yerine simüle edilmiş değer döner
	gross := 18000 + float64(rand.Intn(24000))
	tare := 12000 + float64(rand.Intn(3000))
	net := gross - tare
	writeJSON(w, http.StatusOK, LiveScaleIndicator{
		IndicatorModel: "Baykon BX30S",
		SerialNo:       "BX-2026-00491",
		GrossWeightKg:  gross,
		TareWeightKg:   tare,
		NetWeightKg:    net,
		IsCalibrated:   true,
		LastCalibrated: "2026-10-01",
		IsScaleZeroed:  true,
		MaxCapacityKg:  60000,
		ReadTimestamp:  time.Now().Format("15:04:05"),
	})
}

// ============================================================
// ROUTER & MAIN
// ============================================================

func router() http.Handler {
	mux := http.NewServeMux()

	mux.HandleFunc("/api/health", handleHealth)
	mux.HandleFunc("/api/sectors", handleGetSectors)

	mux.HandleFunc("/api/auth/login", handleLogin)
	mux.HandleFunc("/api/auth/register", handleRegister)

	mux.HandleFunc("/api/weighings", func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodGet:
			handleGetWeighings(w, r)
		case http.MethodPost:
			handleCreateWeighing(w, r)
		default:
			writeError(w, http.StatusMethodNotAllowed, "Method not allowed")
		}
	})
	mux.HandleFunc("/api/weighings/approve-uetds", handleApproveUetds)
	mux.HandleFunc("/api/weighings/site-delivery", handleSiteDelivery)

	mux.HandleFunc("/api/risk/companies", handleGetRiskProfiles)
	mux.HandleFunc("/api/risk/toggle-lock", handleToggleLock)

	mux.HandleFunc("/api/backhaul/loads", handleGetBackhaulLoads)
	mux.HandleFunc("/api/backhaul/book", handleBookBackhaul)

	mux.HandleFunc("/api/compliance/alerts", handleGetAlerts)
	mux.HandleFunc("/api/compliance/summary", handleGetComplianceSummary)

	mux.HandleFunc("/api/financial/summary", handleGetFinancialSummary)
	mux.HandleFunc("/api/financial/resolve-dispute", handleResolveDispute)
	mux.HandleFunc("/api/financial/request-early-payment", handleEarlyPayment)

	mux.HandleFunc("/api/onboarding/steps", handleGetOnboardingSteps)
	mux.HandleFunc("/api/onboarding/complete", handleCompleteOnboarding)

	mux.HandleFunc("/api/sectors/telemetry", func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodGet:
			handleGetTelemetry(w, r)
		case http.MethodPost:
			handleUpdateTelemetry(w, r)
		default:
			writeError(w, http.StatusMethodNotAllowed, "Method not allowed")
		}
	})

	mux.HandleFunc("/api/scale/live-indicator", handleLiveScale)

	return corsMiddleware(mux)
}

func main() {
	initDB()

	port := getenv("PORT", "8080")
	log.Printf("TONAJ API sunucusu başlatılıyor: http://localhost:%s", port)

	srv := &http.Server{
		Addr:         ":" + port,
		Handler:      router(),
		ReadTimeout:  15 * time.Second,
		WriteTimeout: 15 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	if err := srv.ListenAndServe(); err != nil {
		log.Fatalf("Sunucu başlatılamadı: %v", err)
	}
}
