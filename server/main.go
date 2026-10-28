package main

import (
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"log"
	"math/rand"
	"net/http"
	"strings"
	"sync"
	"time"
)

// Data Models
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
	Password               string `json:"-"`
	CompanyName            string `json:"companyName"`
	TaxNo                  string `json:"taxNo"`
	Sector                 string `json:"sector"`
	Role                   string `json:"role"`
	Token                  string `json:"token"`
	CreatedAt              string `json:"createdAt"`
	HasCompletedOnboarding bool   `json:"hasCompletedOnboarding"`
	WeighbridgeModel       string `json:"weighbridgeModel,omitempty"`
	UetdsCompanyCode       string `json:"uetdsCompanyCode,omitempty"`
}

type OnboardingConfig struct {
	Sector      string `json:"sector"`
	Steps       []OnboardingStep `json:"steps"`
}

type OnboardingStep struct {
	StepNumber  int    `json:"stepNumber"`
	Title       string `json:"title"`
	Description string `json:"description"`
	Icon        string `json:"icon"`
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
	Status                        string  `json:"status"` // IN_TRANSIT, DELIVERED, DISPUTED
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
	ID           string  `json:"id"`
	Origin       string  `json:"origin"`
	Destination  string  `json:"destination"`
	Material     string  `json:"material"`
	Tonnage      float64 `json:"tonnage"`
	RatePerTon   float64 `json:"ratePerTon"`
	TotalFreight float64 `json:"totalFreight"`
	VehicleType  string  `json:"vehicleType"`
	Urgency      string  `json:"urgency"`
	OwnerCompany string  `json:"ownerCompany"`
	DistanceKm   int     `json:"distanceKm"`
	PickupWindow string  `json:"pickupWindow"`
	IsBooked     bool    `json:"isBooked"`
}

type CompanyRiskProfile struct {
	ID                      string  `json:"id"`
	CompanyName             string  `json:"companyName"`
	TaxNo                   string  `json:"taxNo"`
	Sector                  string  `json:"sector"`
	TonajScore              int     `json:"tonajScore"`
	RiskStatus              string  `json:"riskStatus"` // GREEN, YELLOW, RED
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
	Status            string  `json:"status"` // APPROVED, DISPUTED, ADJUSTED
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
	Status        string  `json:"status"` // TRANSFERRED_T1, PENDING
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

type SectorLiveStats struct {
	SectorID       string                 `json:"sectorId"`
	DailyVolume    string                 `json:"dailyVolume"`
	ActiveVehicles int                    `json:"activeVehicles"`
	CriticalAlerts int                    `json:"criticalAlerts"`
	Details        map[string]interface{} `json:"details"`
}

// In-Memory Thread-Safe Database Store
type AppStore struct {
	mu            sync.RWMutex
	sectors       []SectorMeta
	users         map[string]User
	weighings     []WeighingRecord
	backhauls     []BackhaulLoad
	riskProfiles  []CompanyRiskProfile
	alerts        []ComplianceAlert
	telemetry     map[string]map[string]interface{}
	settlements   []DisputeSettlement
	earlyPayments []EarlyPaymentSubmission
}

var store *AppStore

func initStore() {
	store = &AppStore{
		users:     make(map[string]User),
		telemetry: make(map[string]map[string]interface{}),
	}

	// 1. Sectors Master Data
	store.sectors = []SectorMeta{
		{
			ID:                 "beton",
			Name:               "Hazır Beton Santralleri",
			Tagline:            "Priz Süresi (Slump) & Şantiye Dijital Kabul Ağı",
			Icon:               "Building2",
			PrimaryMetricLabel: "Aktif Mikser / Dökülen",
			PrimaryMetricValue: "42 Mikser (2.840 m³)",
			RiskFactor:         "Priz Süresi Aşımı (<90 Dk)",
			ComplianceKey:      "GİB e-İrsaliye + U-ETDS Beton Kodlu",
		},
		{
			ID:                 "tas_ocagi",
			Name:               "Taş Ocakları & Madenler",
			Tagline:            "Kantar IoT, MAPEG Sevk Fişi & Aks Aşımı Kalkanı",
			Icon:               "Mountain",
			PrimaryMetricLabel: "Günlük Kırılan / Sevk",
			PrimaryMetricValue: "18.450 Ton Sevk",
			RiskFactor:         "Karayolları Aşırı Tonaj Cezası",
			ComplianceKey:      "MAPEG Maden Sevk İzinleri",
		},
		{
			ID:                 "hurda",
			Name:               "Hurda & Metal Geri Dönüşüm",
			Tagline:            "Fire/Nem Analizi, %90 Tevkifat & MoTAT Entegrasyonu",
			Icon:               "Recycle",
			PrimaryMetricLabel: "İşlenen DKP/E1 Hurda",
			PrimaryMetricValue: "3.120 Ton",
			RiskFactor:         "Tevkifatlı Fatura & Kaçak Mal Girişi",
			ComplianceKey:      "ÇŞB MoTAT Atık Taşıma Formu",
		},
		{
			ID:                 "antrepo_gumruk",
			Name:               "Antrepolar & Gümrük",
			Tagline:            "Dijital Kapı Randevusu (VBS) & Ardiye/Demurrage Sayacı",
			Icon:               "Warehouse",
			PrimaryMetricLabel: "Gümrüklü Saha Doluluk",
			PrimaryMetricValue: "%84 (1.240 TEU / Palet)",
			RiskFactor:         "Ardiye & Bekleme (Demurrage) Maliyeti",
			ComplianceKey:      "Gümrük Özet Beyan & Serbest Bölge",
		},
		{
			ID:                 "demir",
			Name:               "Demir Çelik Sanayi",
			Tagline:            "Nervürlü Donatı Demiri, Kangal, Metraj/Tonaj Hesabı & Şantiye Sevk İrsaliyesi",
			Icon:               "Layers",
			PrimaryMetricLabel: "Günlük Sevk Edilen Donatı",
			PrimaryMetricValue: "1.420 Ton Demir",
			RiskFactor:         "Eksik İndirme & Vadeli Çek Tahsilatı",
			ComplianceKey:      "TS 708 Nervürlü Çelik & GİB e-İrsaliye",
		},
		{
			ID:                 "kereste",
			Name:               "Kereste & Orman Ürünleri",
			Tagline:            "m³ Hacim ➔ Tonaj Çevirici, 5x10 Kalıp Kerestesi & OGM Nakliye Tezkeresi",
			Icon:               "Trees",
			PrimaryMetricLabel: "İşlenen / Sevk Tomruk & Kereste",
			PrimaryMetricValue: "680 m³ (490 Ton)",
			RiskFactor:         "Fırın/Nem Oranı Sapması & Kaçak Kesim",
			ComplianceKey:      "OGM Orman Nakliye Tezkeresi",
		},
		{
			ID:                 "nakliye_lojistik",
			Name:               "Ağır Yük & Damper Filoları",
			Tagline:            "Boş Dönüş (Backhaul) Bitişi & U-ETDS Tek Tık Otomasyonu",
			Icon:               "Truck",
			PrimaryMetricLabel: "Dönüş Doluluk Oranı",
			PrimaryMetricValue: "%91 (Boş Dönüş Azaltıldı)",
			RiskFactor:         "Gidiş Dolu Dönüş Boş Mazot İsrafı",
			ComplianceKey:      "U-ETDS Sefer Bildirim Sicili",
		},
	}

	// 2. Users Database
	seedUsers := []User{
		{
			ID:          "USR-001",
			Email:       "orhan.karadag@oyakbeton.com.tr",
			Name:        "Orhan Karadağ",
			Password:    "123456",
			CompanyName: "Oyak Beton Ataşehir",
			TaxNo:       "5840192841",
			Sector:      "beton",
			Role:        "Santral Operasyon Şefi",
			Token:       "tok_oyak_beton_2026",
			CreatedAt:   time.Now().Format("2006-01-02 15:04"),
		},
		{
			ID:          "USR-002",
			Email:       "selim.taskin@gebzemaden.com.tr",
			Name:        "Selim Taşkın",
			Password:    "123456",
			CompanyName: "Gebze Agrega & Taş İşletmeleri",
			TaxNo:       "4410291840",
			Sector:      "tas_ocagi",
			Role:        "Ocak ve Kantar Müdürü",
			Token:       "tok_gebze_agrega_2026",
			CreatedAt:   time.Now().Format("2006-01-02 15:04"),
		},
		{
			ID:          "USR-003",
			Email:       "mustafa.yildirim@kromancelik.com.tr",
			Name:        "Mustafa Yıldırım",
			Password:    "123456",
			CompanyName: "Kroman Çelik Hurda Sahası",
			TaxNo:       "6120394812",
			Sector:      "hurda",
			Role:        "Hurda Mal Kabul Eksperi",
			Token:       "tok_kroman_hurda_2026",
			CreatedAt:   time.Now().Format("2006-01-02 15:04"),
		},
	}
	for _, u := range seedUsers {
		store.users[u.Email] = u
		store.users[u.Token] = u
	}

	// 3. Live Weighing Records
	slumpRemaining := 28
	store.weighings = []WeighingRecord{
		{
			ID:                   "TKT-2026-9041",
			TicketNo:             "KNT-084912",
			Plate:                "34 ENR 819",
			TrailerPlate:         "34 DMR 104",
			DriverName:           "Ahmet Karaduman",
			DriverPhone:          "0532 411 90 82",
			CompanySender:        "Gebze Agrega & Taş İşletmeleri A.Ş.",
			CompanyReceiver:      "Çimsa Çimento Dilovası Santrali",
			Material:             "Agrega (Kırma Taş 0-32 mm)",
			Sector:               "tas_ocagi",
			GrossWeightKg:        41850,
			TareWeightKg:         14200,
			NetWeightKg:          27650,
			AxleCount:            5,
			MaxLegalWeightKg:     42000,
			IsOverweight:         false,
			MoistureWastePercent: 1.2,
			FinalPayableKg:       27318,
			UetdsStatus:          "APPROVED",
			UetdsCode:            "UETDS-TR-2026-8819401",
			EWaybillStatus:       "SENT",
			EWaybillNo:           "GIB202600008419",
			Status:               "IN_TRANSIT",
			SiteName:             "Dilovası Santral Girişi",
			Timestamp:            "10:42 Bugün",
			IotHardwareSha:       "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
			SiteApproved:         false,
		},
		{
			ID:                   "TKT-2026-9042",
			TicketNo:             "KNT-084913",
			Plate:                "41 KRM 920",
			DriverName:           "Mustafa Yıldırım",
			DriverPhone:          "0544 322 19 04",
			CompanySender:        "Kroman Çelik Döküm Fabrikası",
			CompanyReceiver:      "Aliağa Ağır Haddecilik Sanayi",
			Material:             "DKP ve Ekstra Ağır Hurda Demir",
			Sector:               "hurda",
			GrossWeightKg:        43900,
			TareWeightKg:         15100,
			NetWeightKg:          28800,
			AxleCount:            5,
			MaxLegalWeightKg:     42000,
			IsOverweight:         true,
			MoistureWastePercent: 3.5,
			FinalPayableKg:       27792,
			UetdsStatus:          "APPROVED",
			UetdsCode:            "UETDS-TR-2026-8819402",
			EWaybillStatus:       "SENT",
			EWaybillNo:           "GIB202600008420",
			Status:               "DISPUTED",
			SiteName:             "Dilovası Hurda Sahası",
			Timestamp:            "10:35 Bugün",
			IotHardwareSha:       "5f4dcc3b5aa765d61d8327deb882cf99",
			SiteApproved:         false,
		},
		{
			ID:                            "TKT-2026-9043",
			TicketNo:                      "KNT-084914",
			Plate:                         "34 BTR 402",
			DriverName:                    "Cemil Korkmaz",
			DriverPhone:                   "0533 911 20 45",
			CompanySender:                 "Oyak Beton Ataşehir Tesisi",
			CompanyReceiver:               "Kolin-Kalyon Metro Konsorsiyumu",
			Material:                      "C35/45 S4 Kıvam Hazır Beton",
			Sector:                        "beton",
			GrossWeightKg:                 32000,
			TareWeightKg:                  12800,
			NetWeightKg:                   19200,
			AxleCount:                     4,
			MaxLegalWeightKg:              32000,
			IsOverweight:                  false,
			MoistureWastePercent:          0,
			FinalPayableKg:                19200,
			UetdsStatus:                   "APPROVED",
			UetdsCode:                     "UETDS-TR-2026-8819403",
			EWaybillStatus:                "SENT",
			EWaybillNo:                    "GIB202600008421",
			Status:                        "IN_TRANSIT",
			SiteName:                      "Göztepe Metro İstasyon Sahası",
			Timestamp:                     "10:18 Bugün",
			ConcreteSlumpMinutesRemaining: &slumpRemaining,
			IotHardwareSha:                "9a5304b35e0b0468305c4d0263f684c9",
			SiteApproved:                  false,
		},
		{
			ID:                   "TKT-2026-9044",
			TicketNo:             "KNT-084915",
			Plate:                "06 ANK 771",
			TrailerPlate:         "06 DOR 912",
			DriverName:           "Serdar Altun",
			DriverPhone:          "0505 882 12 39",
			CompanySender:        "Ambarlı Lojistik ve Antrepo Tesisleri",
			CompanyReceiver:      "Marmara İthalat & Dış Ticaret A.Ş.",
			Material:             "İthal Rulo Sac & Dökme Hammadde (Konteyner)",
			Sector:               "antrepo_gumruk",
			GrossWeightKg:        38400,
			TareWeightKg:         14900,
			NetWeightKg:          23500,
			AxleCount:            5,
			MaxLegalWeightKg:     42000,
			IsOverweight:         false,
			MoistureWastePercent: 0,
			FinalPayableKg:       23500,
			UetdsStatus:          "APPROVED",
			UetdsCode:            "UETDS-TR-2026-8819404",
			EWaybillStatus:       "SENT",
			EWaybillNo:           "GIB202600008422",
			Status:               "DELIVERED",
			SiteName:             "Ambarlı Antrepo Kapı 3",
			Timestamp:            "09:50 Bugün",
			CustomsDeclarationNo: "GUM-2026-08841-A",
			IotHardwareSha:       "2c6ee2a6f3a53ee812f8a1fd80e60803",
			SiteApproved:         true,
			SiteApprovedAt:       "10:15 Bugün",
			SiteApproverName:     "Engin Yılmaz (Antrepo Şefi)",
		},
		{
			ID:                   "TKT-2026-9045",
			TicketNo:             "KNT-084916",
			Plate:                "16 İNE 332",
			DriverName:           "Hasan Çetin",
			DriverPhone:          "0535 777 41 29",
			CompanySender:        "İnegöl Keresteciler Sanayi Sitesi",
			CompanyReceiver:      "Rönesans Konut Projesi 2. Etap",
			Material:             "Kalıp Kereste 5x10 (1. Sınıf)",
			Sector:               "kereste",
			GrossWeightKg:        29500,
			TareWeightKg:         11400,
			NetWeightKg:          18100,
			AxleCount:            4,
			MaxLegalWeightKg:     32000,
			IsOverweight:         false,
			MoistureWastePercent: 0,
			FinalPayableKg:       18100,
			UetdsStatus:          "APPROVED",
			UetdsCode:            "UETDS-TR-2026-8819405",
			EWaybillStatus:       "SENT",
			EWaybillNo:           "GIB202600008423",
			Status:               "IN_TRANSIT",
			SiteName:             "Bursa Osmangazi Şantiyesi",
			Timestamp:            "09:15 Bugün",
			IotHardwareSha:       "8f14e45fceea167a5a36dedd4bea2543",
			SiteApproved:         false,
		},
		{
			ID:                   "TKT-2026-9046",
			TicketNo:             "KNT-084917",
			Plate:                "41 KRM 920",
			DriverName:           "Murat Karakaş",
			DriverPhone:          "0533 819 02 11",
			CompanySender:        "Kroman Çelik Sanayi A.Ş. Gebze Fabrikası",
			CompanyReceiver:      "Kalyon Metro İstasyon Şantiyesi",
			Material:             "Ø16 B420C Nervürlü İnşaat Demiri (12 Metre Bağ)",
			Sector:               "demir",
			GrossWeightKg:        39800,
			TareWeightKg:         13600,
			NetWeightKg:          26200,
			AxleCount:            5,
			MaxLegalWeightKg:     42000,
			IsOverweight:         false,
			MoistureWastePercent: 0,
			FinalPayableKg:       26200,
			UetdsStatus:          "APPROVED",
			UetdsCode:            "UETDS-TR-2026-8819406",
			EWaybillStatus:       "SENT",
			EWaybillNo:           "GIB202600009104",
			Status:               "IN_TRANSIT",
			SiteName:             "Göztepe Metro Şantiyesi",
			Timestamp:            "08:40 Bugün",
			IotHardwareSha:       "e5c010a30ab78f7e914041a87b32609a",
			SiteApproved:         false,
		},
	}

	// 4. Backhaul Loads
	store.backhauls = []BackhaulLoad{
		{
			ID:           "LOAD-401",
			Origin:       "Dilovası Liman Bölgesi (Kocaeli)",
			Destination:  "Gebze Taş Ocakları Sahası",
			Material:     "Dolgu Malzemesi & Moloz",
			Tonnage:      28,
			RatePerTon:   240,
			TotalFreight: 6720,
			VehicleType:  "Damperli Kamyon",
			Urgency:      "HIGH",
			OwnerCompany: "Körfez Hafriyat & Altyapı Ltd.",
			DistanceKm:   26,
			PickupWindow: "11:00 - 13:00 Bugün",
			IsBooked:     false,
		},
		{
			ID:           "LOAD-402",
			Origin:       "Çimsa Dilovası Tesisleri",
			Destination:  "Eskişehir Çimento Fabrikası",
			Material:     "Klinker & Katkı Maddesi",
			Tonnage:      30,
			RatePerTon:   580,
			TotalFreight: 17400,
			VehicleType:  "Silobas",
			Urgency:      "NORMAL",
			OwnerCompany: "Çimsa Lojistik A.Ş.",
			DistanceKm:   195,
			PickupWindow: "14:00 - 18:00 Bugün",
			IsBooked:     false,
		},
		{
			ID:           "LOAD-403",
			Origin:       "İÇDAŞ Biga Çelik Fabrikası",
			Destination:  "İzmir Menemen Organize Sanayi",
			Material:     "Nervürlü Kangal & Profil Demir",
			Tonnage:      27,
			RatePerTon:   620,
			TotalFreight: 16740,
			VehicleType:  "Sal Kasa Tır",
			Urgency:      "HIGH",
			OwnerCompany: "Ege Demir Çelik Pazarlama",
			DistanceKm:   280,
			PickupWindow: "Hemen (Hazır Araç Aranıyor)",
			IsBooked:     false,
		},
		{
			ID:           "LOAD-404",
			Origin:       "Aliağa Geri Dönüşüm Bölgesi",
			Destination:  "Bursa Demirtaş OSB",
			Material:     "Preslenmiş Sac ve DKP Hurda",
			Tonnage:      26,
			RatePerTon:   510,
			TotalFreight: 13260,
			VehicleType:  "Damperli Kamyon",
			Urgency:      "MEDIUM",
			OwnerCompany: "Marmara Metal Geri Dönüşüm",
			DistanceKm:   290,
			PickupWindow: "16:00 Yarın",
			IsBooked:     false,
		},
	}

	// 5. Risk Profiles
	store.riskProfiles = []CompanyRiskProfile{
		{
			ID:                      "CMP-101",
			CompanyName:             "Kolin-Kalyon Metro Konsorsiyumu A.Ş.",
			TaxNo:                   "5840192841",
			Sector:                  "Altyapı & Metro Müteahhitliği",
			TonajScore:              98,
			RiskStatus:              "GREEN",
			CreditTermDays:          30,
			UnpaidDisputeCount:      0,
			TotalDeliveredVolumeTon: 148500,
			LastPaymentStatus:       "Zamanında Ödendi (Kusursuz)",
			CreditLimitTl:           25000000,
			LockStatus:              false,
		},
		{
			ID:                      "CMP-102",
			CompanyName:             "Çimsa Çimento Dilovası Entegre Tesisi",
			TaxNo:                   "2110482910",
			Sector:                  "Çimento & Agrega Alıcısı",
			TonajScore:              96,
			RiskStatus:              "GREEN",
			CreditTermDays:          45,
			UnpaidDisputeCount:      0,
			TotalDeliveredVolumeTon: 320000,
			LastPaymentStatus:       "Kantar Onaylı 24 Saat İskonto",
			CreditLimitTl:           50000000,
			LockStatus:              false,
		},
		{
			ID:                      "CMP-103",
			CompanyName:             "Rönesans Konut Yapı 2. Etap Şantiyesi",
			TaxNo:                   "7740194820",
			Sector:                  "Üstyapı & Konut İnşaatı",
			TonajScore:              84,
			RiskStatus:              "YELLOW",
			CreditTermDays:          60,
			UnpaidDisputeCount:      1,
			TotalDeliveredVolumeTon: 42100,
			LastPaymentStatus:       "1 İrsaliye Mutabakat İncelemesinde",
			CreditLimitTl:           8000000,
			LockStatus:              false,
		},
		{
			ID:                      "CMP-104",
			CompanyName:             "Körfez Hafriyat ve Taşımacılık Ltd.",
			TaxNo:                   "3940182749",
			Sector:                  "Hafriyat & Nakliye Taşeronu",
			TonajScore:              41,
			RiskStatus:              "RED",
			CreditTermDays:          0,
			UnpaidDisputeCount:      4,
			TotalDeliveredVolumeTon: 18400,
			LastPaymentStatus:       "2 Karşılıksız Çek Bildirimi Mevcut",
			CreditLimitTl:           0,
			LockStatus:              true,
		},
		{
			ID:                      "CMP-105",
			CompanyName:             "Eren Kağıt & Kereste Entegre Fabrikası",
			TaxNo:                   "3410984129",
			Sector:                  "Ahşap & İthal Kereste Alıcısı",
			TonajScore:              92,
			RiskStatus:              "GREEN",
			CreditTermDays:          45,
			UnpaidDisputeCount:      0,
			TotalDeliveredVolumeTon: 64200,
			LastPaymentStatus:       "Düzenli Cari Ödeme",
			CreditLimitTl:           15000000,
			LockStatus:              false,
		},
	}

	// 6. Compliance Alerts
	store.alerts = []ComplianceAlert{
		{
			ID:                       "ALT-901",
			Type:                     "AXLE_LIMIT",
			Title:                    "Aşırı Aks Tonajı Engellendi (41 KRM 920)",
			Severity:                 "CRITICAL",
			Message:                  "Kantar tartımında 42.000 Kg yasal limiti 1.900 Kg aşıldı. Bariyer kilitlenerek 58.400 TL Karayolları cezası engellendi.",
			Plate:                    "41 KRM 920",
			Timestamp:                "10:35",
			PenaltyPreventedAmountTl: 58400,
		},
		{
			ID:                       "ALT-902",
			Type:                     "SLUMP_TIMEOUT",
			Title:                    "Kritik Beton Priz Süresi Alarmı (34 BTR 402)",
			Severity:                 "WARNING",
			Message:                  "Oyak Beton Ataşehir çıkışlı mikserin priz süresi son 28 dakikaya girdi. Şantiye trafiği nedeniyle şantiye şefine acil döküm QR bildirimi SMS ile iletildi.",
			Plate:                    "34 BTR 402",
			Timestamp:                "10:20",
			PenaltyPreventedAmountTl: 24000,
		},
		{
			ID:                       "ALT-903",
			Type:                     "U_ETDS",
			Title:                    "U-ETDS Bakanlık Onayı 4.2 Saniyede Tamamlandı",
			Severity:                 "INFO",
			Message:                  "34 ENR 819 plakalı agrega kamyonu kantardan indiği anda U-ETDS kodu veri tabanına mühürlendi.",
			Plate:                    "34 ENR 819",
			Timestamp:                "10:42",
			PenaltyPreventedAmountTl: 9600,
		},
		{
			ID:                       "ALT-904",
			Type:                     "MOTAT_WASTE",
			Title:                    "MoTAT Atık Taşıma Kodu Doğrulandı",
			Severity:                 "INFO",
			Message:                  "Tehlikesiz demir-çelik cürufu sevkiyatında Çevre Bakanlığı MoTAT referans no (TR-MT-8491) e-İrsaliye ile mühürlendi.",
			Plate:                    "35 MT 901",
			Timestamp:                "08:55",
			PenaltyPreventedAmountTl: 45000,
		},
	}

	// 7. Dispute Settlements
	store.settlements = []DisputeSettlement{
		{
			ID:                "SET-2026-001",
			TicketID:          "TKT-2026-9042",
			SenderWeightKg:    28800,
			ReceiverWeightKg:  28680,
			DifferenceKg:      120,
			ToleranceLimitKg:  144.0,
			IsWithinTolerance: true,
			FinancialImpactTL: 0,
			ResolvedAt:        "10:50 Bugün",
			Status:            "APPROVED",
		},
		{
			ID:                "SET-2026-002",
			TicketID:          "TKT-2026-9041",
			SenderWeightKg:    27650,
			ReceiverWeightKg:  27620,
			DifferenceKg:      30,
			ToleranceLimitKg:  138.25,
			IsWithinTolerance: true,
			FinancialImpactTL: 0,
			ResolvedAt:        "11:15 Bugün",
			Status:            "APPROVED",
		},
	}

	// 8. Early Factoring Payments
	store.earlyPayments = []EarlyPaymentSubmission{
		{
			ID:            "EP-2026-441",
			TicketID:      "TKT-2026-9046",
			InvoiceNo:     "FTR-2026-88194",
			InvoiceAmount: 748500,
			AdvanceAmount: 598800,
			FeeAmount:     17964,
			PayoutAmount:  580836,
			BankCode:      "GARANTI_BBVA_FACTORING",
			Status:        "TRANSFERRED_T1",
			CreatedAt:     "09:30 Bugün",
		},
	}

	// 9. All 7 Sector Live Telemetries
	store.telemetry["beton"] = map[string]interface{}{
		"cementSilo1":   28,
		"cementSilo2":   82,
		"admixtureTank": 64,
		"sand04Silo":    35,
		"aggregateSilo": 82,
		"mixers": []map[string]interface{}{
			{
				"plate":            "34 BTR 819",
				"driver":           "Cemil Karadağ",
				"concreteClass":    "C35/45 Hazır Beton",
				"volumeM3":         8.5,
				"site":             "Göztepe Metro İstasyon Şantiyesi",
				"minutesRemaining": 28,
				"temperatureC":     21.4,
				"status":           "CRITICAL",
			},
			{
				"plate":            "34 BTR 402",
				"driver":           "Hasan Çelik",
				"concreteClass":    "C30/37 Katlı Otopark",
				"volumeM3":         9.0,
				"site":             "Kartal Kentsel Dönüşüm 2. Etap",
				"minutesRemaining": 62,
				"temperatureC":     20.8,
				"status":           "NORMAL",
			},
			{
				"plate":            "34 BTR 110",
				"driver":           "Murat Şahin",
				"concreteClass":    "C25/30 Zemin Betonu",
				"volumeM3":         9.5,
				"site":             "Maltepe Konut Projesi Sahası",
				"minutesRemaining": 84,
				"temperatureC":     19.9,
				"status":           "SAFE",
			},
		},
		"testSlumpCm": 14,
		"testTemp":    21.5,
		"returnedM3":  4.0,
	}

	store.telemetry["tas_ocagi"] = map[string]interface{}{
		"crusherFeedTpH":     420,
		"bunker0_4":          78,
		"bunker7_15":         64,
		"bunker15_25":        45,
		"bunkerBalast":       30,
		"screenWearHours":    680,
		"mapegRuhsatNo":      "IR-2026/894-K",
		"annualQuotaTons":    1200000,
		"shippedTons":        845200,
		"mineralUnitPriceTL": 185.0,
		"mapegRusumRate":     0.045,
		"frontAxleKg":        6850,
		"driveAxleKg":        11200,
		"trailerAxleKg":      23200,
		"blastBatch":         "PATLATMA-2026-B12",
		"blastYieldTons":     38500,
		"pasaWastePercent":   6.5,
	}

	store.telemetry["demir"] = map[string]interface{}{
		"heatNo":               "ST-2026-H881",
		"steelGrade":           "B500C",
		"yieldStrengthRe":      534,
		"tensileStrengthRm":    648,
		"elongationAgt":        8.4,
		"carbonEqCev":          0.39,
		"selectedDiameter":     16,
		"bundleCount":          12,
		"barsPerBundle":        100,
		"actualWeighbridgeKg":  23100,
		"billetInputTons":      500,
		"scaleWastePercent":    1.8,
		"cropEndPercent":       1.6,
		"isDeliveredAtSite":    true,
		"earlyCashPayoutEnabled": true,
	}

	store.telemetry["hurda"] = map[string]interface{}{
		"radiationCPS":        18,
		"radiationThreshold":  60,
		"grossWeightKg":       28450,
		"tareWeightKg":        13200,
		"scrapType":           "Ekstra Hurda (Ağır Sanayi)",
		"wastePercent":        4.5,
		"scrapUnitPriceTL":    14.50,
		"supplierType":        "corporate",
		"motatCode":           "MOTAT-2026-TR-88190",
		"wasteCatalogCode":    "17 04 05",
		"shredderInputTons":   120,
		"magneticPercent":     72.5,
		"eddyPercent":         7.5,
		"shredderResidueFluff": 20.0,
	}

	store.telemetry["antrepo_gumruk"] = map[string]interface{}{
		"vbsSlots": []map[string]interface{}{
			{
				"bookingCode":   "VBS-2026-R4182",
				"plate":         "34 GMR 901",
				"driver":        "Serkan Yılmaz",
				"ramp":          "Rampa 4A (Kuru Yük)",
				"status":        "CALLED",
				"scheduledTime": "14:30",
				"etaMinutes":    5,
			},
			{
				"bookingCode":   "VBS-2026-R4183",
				"plate":         "06 TR 334",
				"driver":        "Mehmet Ali Kaya",
				"ramp":          "Rampa 1B (Soğuk Hava)",
				"status":        "WAITING",
				"scheduledTime": "15:00",
				"etaMinutes":    25,
			},
			{
				"bookingCode":   "VBS-2026-R4184",
				"plate":         "35 ANT 552",
				"driver":        "Orhan Demir",
				"ramp":          "Açık Saha 2 (Dökme)",
				"status":        "DOCKED",
				"scheduledTime": "13:45",
				"etaMinutes":    0,
			},
		},
		"containerNo":       "MSCU-884910-2",
		"freeTimeDays":      7,
		"elapsedDays":       11,
		"dailyDemurrageUSD": 120,
		"dailyStorageTL":    450,
		"usdExchangeRate":   34.50,
		"isDemurragePaid":   false,
		"ozetBeyanNo":       "26340000OB014298",
		"declaredGrossKg":   26400,
		"actualScaleKg":     26580,
		"totalBondedTons":   850,
		"clearedTons":       125,
		"sealNo":            "TR-GUMRUK-884129",
		"isSealIntact":      true,
	}

	store.telemetry["kereste"] = map[string]interface{}{
		"logPieces":        45,
		"logAvgDiameter":   32,
		"logLength":        4,
		"cutThickness":     5,
		"cutWidth":         10,
		"cutLength":        400,
		"cutPieces":        180,
		"woodSpecies":      "Sarıçam",
		"woodDensity":      680,
		"kilnBatchNo":      "KILN-2026-04",
		"kilnMoisture":     13.4,
		"kilnTemp":         62.5,
		"timberM3":         24.5,
		"ogmTezkereNo":     "OGM-2026-TR-441029",
	}

	store.telemetry["nakliye_lojistik"] = map[string]interface{}{
		"backhaulCorridor":        "dilovasi_aliaga",
		"backhaulTripsThisMonth":  42,
		"emptyKmSaved":            14280,
		"fuelSavingsTL":           318000,
		"uetdsTripNo":             "UETDS-2026-TR-49102",
		"uetdsPlate":              "34 FLL 890",
		"uetdsDriverTc":           "28491028472",
		"loadedConsumptionL100Km": 38.2,
		"emptyConsumptionL100Km":  26.4,
		"fuelDropAlert":           false,
		"fuelDropLiters":          18,
		"tireTreadMm":             6.5,
		"freightInvoiceAmount":    14500,
	}
}

// CORS middleware
func enableCORS(w http.ResponseWriter, r *http.Request) bool {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With")
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return true
	}
	return false
}

func writeJSON(w http.ResponseWriter, status int, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	if err := json.NewEncoder(w).Encode(data); err != nil {
		log.Printf("json encode error: %v", err)
	}
}

func main() {
	initStore()

	mux := http.NewServeMux()

	// 1. Health
	mux.HandleFunc("/api/health", func(w http.ResponseWriter, r *http.Request) {
		if enableCORS(w, r) {
			return
		}
		writeJSON(w, http.StatusOK, map[string]interface{}{
			"status":    "healthy",
			"timestamp": time.Now().Format(time.RFC3339),
			"version":   "2.4-go-enterprise",
			"engine":    "TONAJ B2B Go Core",
		})
	})

	// 2. Sectors
	mux.HandleFunc("/api/sectors", func(w http.ResponseWriter, r *http.Request) {
		if enableCORS(w, r) {
			return
		}
		store.mu.RLock()
		defer store.mu.RUnlock()
		writeJSON(w, http.StatusOK, store.sectors)
	})

	// 3. Auth: Register
	mux.HandleFunc("/api/auth/register", func(w http.ResponseWriter, r *http.Request) {
		if enableCORS(w, r) {
			return
		}
		if r.Method != http.MethodPost {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			return
		}

		var req struct {
			Email       string `json:"email"`
			Password    string `json:"password"`
			CompanyName string `json:"companyName"`
			TaxNo       string `json:"taxNo"`
			Sector      string `json:"sector"`
			Role        string `json:"role"`
		}
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, "Invalid request payload", http.StatusBadRequest)
			return
		}

		store.mu.Lock()
		defer store.mu.Unlock()

		token := fmt.Sprintf("tok_%x", sha256.Sum256([]byte(req.Email+time.Now().String())))
		user := User{
			ID:          fmt.Sprintf("USR-%d", time.Now().UnixNano()%100000),
			Email:       req.Email,
			Name:        strings.Split(req.Email, "@")[0],
			Password:    req.Password,
			CompanyName: req.CompanyName,
			TaxNo:       req.TaxNo,
			Sector:      req.Sector,
			Role:        req.Role,
			Token:       token,
			CreatedAt:   time.Now().Format("2006-01-02 15:04"),
		}
		store.users[user.Email] = user
		store.users[token] = user

		writeJSON(w, http.StatusCreated, map[string]interface{}{
			"success": true,
			"user":    user,
			"token":   token,
		})
	})

	// 4. Auth: Login
	mux.HandleFunc("/api/auth/login", func(w http.ResponseWriter, r *http.Request) {
		if enableCORS(w, r) {
			return
		}
		if r.Method != http.MethodPost {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			return
		}

		var req struct {
			Email    string `json:"email"`
			Password string `json:"password"`
			Sector   string `json:"sector"`
		}
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}

		store.mu.RLock()
		user, exists := store.users[req.Email]
		store.mu.RUnlock()

		if !exists {
			store.mu.Lock()
			token := fmt.Sprintf("tok_%x", sha256.Sum256([]byte(req.Email+time.Now().String())))
			sector := req.Sector
			if sector == "" {
				sector = "beton"
			}
			user = User{
				ID:          fmt.Sprintf("USR-%d", time.Now().UnixNano()%100000),
				Email:       req.Email,
				Name:        strings.Split(req.Email, "@")[0],
				CompanyName: strings.Split(req.Email, "@")[0] + " Sanayi A.Ş.",
				TaxNo:       "1029384756",
				Sector:      sector,
				Role:        "Tesis Yöneticisi",
				Token:       token,
				CreatedAt:   time.Now().Format("2006-01-02 15:04"),
			}
			store.users[user.Email] = user
			store.users[token] = user
			store.mu.Unlock()
		}

		writeJSON(w, http.StatusOK, map[string]interface{}{
			"success": true,
			"user":    user,
			"token":   user.Token,
		})
	})

	// 5. Auth: Me
	mux.HandleFunc("/api/auth/me", func(w http.ResponseWriter, r *http.Request) {
		if enableCORS(w, r) {
			return
		}
		token := r.Header.Get("Authorization")
		token = strings.TrimPrefix(token, "Bearer ")

		store.mu.RLock()
		user, exists := store.users[token]
		store.mu.RUnlock()

		if !exists {
			user = User{
				ID:          "USR-DEMO",
				Email:       "orhan.karadag@oyakbeton.com.tr",
				Name:        "Orhan Karadağ",
				CompanyName: "Oyak Beton Ataşehir",
				TaxNo:       "5840192841",
				Sector:      "beton",
				Role:        "Santral Operasyon Şefi",
				Token:       "tok_demo_active",
			}
		}

		writeJSON(w, http.StatusOK, map[string]interface{}{
			"user": user,
		})
	})

	// 6. Weighings: List & Create
	mux.HandleFunc("/api/weighings", func(w http.ResponseWriter, r *http.Request) {
		if enableCORS(w, r) {
			return
		}

		if r.Method == http.MethodGet {
			sector := r.URL.Query().Get("sector")
			search := strings.ToLower(r.URL.Query().Get("search"))

			store.mu.RLock()
			defer store.mu.RUnlock()

			var results []WeighingRecord
			for _, rec := range store.weighings {
				if sector != "" && sector != "nakliye_lojistik" && rec.Sector != sector {
					continue
				}
				if search != "" {
					matches := strings.Contains(strings.ToLower(rec.Plate), search) ||
						strings.Contains(strings.ToLower(rec.TicketNo), search) ||
						strings.Contains(strings.ToLower(rec.CompanySender), search) ||
						strings.Contains(strings.ToLower(rec.CompanyReceiver), search)
					if !matches {
						continue
					}
				}
				results = append(results, rec)
			}
			writeJSON(w, http.StatusOK, results)
			return
		}

		if r.Method == http.MethodPost {
			var newRecord WeighingRecord
			if err := json.NewDecoder(r.Body).Decode(&newRecord); err != nil {
				http.Error(w, "Bad request", http.StatusBadRequest)
				return
			}

			store.mu.Lock()
			defer store.mu.Unlock()

			rand.Seed(time.Now().UnixNano())
			newRecord.ID = fmt.Sprintf("TKT-%d", time.Now().UnixNano()%1000000)
			newRecord.TicketNo = fmt.Sprintf("KNT-%06d", rand.Intn(900000)+100000)
			newRecord.Timestamp = "Az önce"

			newRecord.NetWeightKg = newRecord.GrossWeightKg - newRecord.TareWeightKg
			wasteKg := int(float64(newRecord.NetWeightKg) * (newRecord.MoistureWastePercent / 100))
			newRecord.FinalPayableKg = newRecord.NetWeightKg - wasteKg
			if newRecord.GrossWeightKg > 42000 {
				newRecord.IsOverweight = true
			}

			hashBytes := sha256.Sum256([]byte(fmt.Sprintf("%s:%d:%s", newRecord.Plate, newRecord.GrossWeightKg, time.Now().String())))
			newRecord.IotHardwareSha = hex.EncodeToString(hashBytes[:])

			newRecord.UetdsCode = fmt.Sprintf("UETDS-TR-2026-%07d", rand.Intn(9000000)+1000000)
			newRecord.UetdsStatus = "APPROVED"
			newRecord.EWaybillNo = fmt.Sprintf("GIB2026%08d", rand.Intn(90000000)+10000000)
			newRecord.EWaybillStatus = "SENT"
			newRecord.Status = "IN_TRANSIT"

			store.weighings = append([]WeighingRecord{newRecord}, store.weighings...)

			writeJSON(w, http.StatusCreated, newRecord)
			return
		}

		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	})

	// 7. Approve U-ETDS
	mux.HandleFunc("/api/weighings/approve-uetds", func(w http.ResponseWriter, r *http.Request) {
		if enableCORS(w, r) {
			return
		}
		if r.Method != http.MethodPost {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			return
		}

		var req struct {
			TicketID string `json:"ticketId"`
		}
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, "Bad request", http.StatusBadRequest)
			return
		}

		store.mu.Lock()
		defer store.mu.Unlock()

		rand.Seed(time.Now().UnixNano())
		newUetds := fmt.Sprintf("UETDS-TR-2026-%07d", rand.Intn(9000000)+1000000)

		for i := range store.weighings {
			if store.weighings[i].ID == req.TicketID {
				store.weighings[i].UetdsStatus = "APPROVED"
				store.weighings[i].UetdsCode = newUetds
				writeJSON(w, http.StatusOK, map[string]interface{}{
					"success":   true,
					"ticketId":  req.TicketID,
					"uetdsCode": newUetds,
				})
				return
			}
		}

		http.Error(w, "Ticket not found", http.StatusNotFound)
	})

	// 8. Weighings: Site Delivery Sign-Off
	mux.HandleFunc("/api/weighings/site-delivery", func(w http.ResponseWriter, r *http.Request) {
		if enableCORS(w, r) {
			return
		}
		if r.Method != http.MethodPost {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			return
		}

		var req struct {
			TicketID     string  `json:"ticketId"`
			ApproverName string  `json:"approverName"`
			SlumpCm      int     `json:"slumpCm"`
			Temperature  float64 `json:"temperature"`
		}
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, "Bad request", http.StatusBadRequest)
			return
		}

		store.mu.Lock()
		defer store.mu.Unlock()

		for i := range store.weighings {
			if store.weighings[i].ID == req.TicketID {
				store.weighings[i].SiteApproved = true
				store.weighings[i].SiteApprovedAt = time.Now().Format("15:04 Bugün")
				store.weighings[i].SiteApproverName = req.ApproverName
				store.weighings[i].Status = "DELIVERED"

				writeJSON(w, http.StatusOK, map[string]interface{}{
					"success": true,
					"record":  store.weighings[i],
					"message": "Şantiye teslimatı onaylandı ve mühürlendi.",
				})
				return
			}
		}

		http.Error(w, "Ticket not found", http.StatusNotFound)
	})

	// 9. Risk Profiles
	mux.HandleFunc("/api/risk/companies", func(w http.ResponseWriter, r *http.Request) {
		if enableCORS(w, r) {
			return
		}
		store.mu.RLock()
		defer store.mu.RUnlock()
		writeJSON(w, http.StatusOK, store.riskProfiles)
	})

	// 10. Backhaul Loads & Booking
	mux.HandleFunc("/api/backhaul/loads", func(w http.ResponseWriter, r *http.Request) {
		if enableCORS(w, r) {
			return
		}
		store.mu.RLock()
		defer store.mu.RUnlock()
		writeJSON(w, http.StatusOK, store.backhauls)
	})

	mux.HandleFunc("/api/backhaul/book", func(w http.ResponseWriter, r *http.Request) {
		if enableCORS(w, r) {
			return
		}
		if r.Method != http.MethodPost {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			return
		}

		var req struct {
			LoadID string `json:"loadId"`
		}
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, "Bad request", http.StatusBadRequest)
			return
		}

		store.mu.Lock()
		defer store.mu.Unlock()

		for i := range store.backhauls {
			if store.backhauls[i].ID == req.LoadID {
				store.backhauls[i].IsBooked = true
				writeJSON(w, http.StatusOK, map[string]interface{}{
					"success": true,
					"message": "Dönüş yükü araca rezerve edildi.",
					"load":    store.backhauls[i],
				})
				return
			}
		}

		http.Error(w, "Load not found", http.StatusNotFound)
	})

	// 11. Compliance Alerts
	mux.HandleFunc("/api/compliance/alerts", func(w http.ResponseWriter, r *http.Request) {
		if enableCORS(w, r) {
			return
		}
		store.mu.RLock()
		defer store.mu.RUnlock()
		writeJSON(w, http.StatusOK, store.alerts)
	})

	// 12. Onboarding: Steps
	mux.HandleFunc("/api/onboarding/steps", func(w http.ResponseWriter, r *http.Request) {
		if enableCORS(w, r) {
			return
		}
		sector := r.URL.Query().Get("sector")
		if sector == "" {
			sector = "beton"
		}

		steps := []OnboardingStep{
			{
				StepNumber:  1,
				Title:       "Kantar İndikatör ve Donanım Eşleme",
				Description: "Tesis kantarınızın indikatör modelini seçin. IoT dongle ile kriptografik SHA-256 tartım kilidi otomatik devreye girer.",
				Icon:        "Scale",
			},
			{
				StepNumber:  2,
				Title:       "U-ETDS Bakanlık & GİB e-İrsaliye Entegrasyonu",
				Description: "Ulaştırma Bakanlığı firma yetki belgesi ve GİB özel entegratör kodunuzu doğrulayın.",
				Icon:        "ShieldCheck",
			},
			{
				StepNumber:  3,
				Title:       "42 Ton Otomatik Çıkış Bariyeri & Ceza Kalkanı",
				Description: "Karayolları aks limit aşımında çıkış bariyerinin otomatik kilitlenmesini etkinleştirin.",
				Icon:        "Lock",
			},
			{
				StepNumber:  4,
				Title:       "Şantiye Mobil QR Kabul & Teslim Protokolü",
				Description: "Şantiyeye inen mal için mobil teslimat imzasını ve anında fatura mutabakatını aktifleştirin.",
				Icon:        "QrCode",
			},
		}

		writeJSON(w, http.StatusOK, map[string]interface{}{
			"sector": sector,
			"steps":  steps,
		})
	})

	// 13. Onboarding: Complete
	mux.HandleFunc("/api/onboarding/complete", func(w http.ResponseWriter, r *http.Request) {
		if enableCORS(w, r) {
			return
		}
		if r.Method != http.MethodPost {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			return
		}

		var req struct {
			Token            string `json:"token"`
			Sector           string `json:"sector"`
			WeighbridgeModel string `json:"weighbridgeModel"`
			UetdsCompanyCode string `json:"uetdsCompanyCode"`
			EnableBarrier    bool   `json:"enableBarrier"`
		}
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, "Bad request", http.StatusBadRequest)
			return
		}

		store.mu.Lock()
		defer store.mu.Unlock()

		user, exists := store.users[req.Token]
		if exists {
			user.HasCompletedOnboarding = true
			if req.Sector != "" {
				user.Sector = req.Sector
			}
			user.WeighbridgeModel = req.WeighbridgeModel
			user.UetdsCompanyCode = req.UetdsCompanyCode
			store.users[req.Token] = user
			store.users[user.Email] = user
		}

		writeJSON(w, http.StatusOK, map[string]interface{}{
			"success": true,
			"message": "Tesis kurulumu ve kantar donanım eşlemesi başarıyla tamamlandı.",
			"user":    user,
		})
	})

	// 14. Financial: Summary
	mux.HandleFunc("/api/financial/summary", func(w http.ResponseWriter, r *http.Request) {
		if enableCORS(w, r) {
			return
		}
		store.mu.RLock()
		defer store.mu.RUnlock()

		var disputed []WeighingRecord
		for _, wRec := range store.weighings {
			if wRec.Status == "DISPUTED" || wRec.IsOverweight {
				disputed = append(disputed, wRec)
			}
		}

		totalResolved := 14850000.0
		for _, s := range store.settlements {
			totalResolved += float64(s.SenderWeightKg) * 450.0 / 1000.0
		}

		summary := FinancialSummary{
			TotalResolvedVolumeTL: totalResolved,
			ActiveFactoringRate:   80.0,
			FactoringFeeRate:      2.4,
			DisputedWeighings:     disputed,
			Settlements:           store.settlements,
			EarlyPayments:         store.earlyPayments,
		}
		writeJSON(w, http.StatusOK, summary)
	})

	// 15. Financial: Resolve Dispute
	mux.HandleFunc("/api/financial/resolve-dispute", func(w http.ResponseWriter, r *http.Request) {
		if enableCORS(w, r) {
			return
		}
		if r.Method != http.MethodPost {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			return
		}

		var req struct {
			TicketID         string  `json:"ticketId"`
			SenderWeightKg   int     `json:"senderWeightKg"`
			ReceiverWeightKg int     `json:"receiverWeightKg"`
			UnitPriceTL      float64 `json:"unitPriceTl"`
		}
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, "Bad request", http.StatusBadRequest)
			return
		}

		store.mu.Lock()
		defer store.mu.Unlock()

		diff := req.SenderWeightKg - req.ReceiverWeightKg
		absDiff := diff
		if absDiff < 0 {
			absDiff = -absDiff
		}
		toleranceLimit := float64(req.SenderWeightKg) * 0.005 // %0.5 yasal sınır
		isWithinTolerance := float64(absDiff) <= toleranceLimit

		status := "DISPUTED"
		if isWithinTolerance {
			status = "APPROVED"
			for i := range store.weighings {
				if store.weighings[i].ID == req.TicketID {
					store.weighings[i].Status = "DELIVERED"
					store.weighings[i].NetWeightKg = req.ReceiverWeightKg
					store.weighings[i].FinalPayableKg = req.ReceiverWeightKg
					break
				}
			}
		}

		settlement := DisputeSettlement{
			ID:                fmt.Sprintf("SET-%d", time.Now().UnixNano()%1000000),
			TicketID:          req.TicketID,
			SenderWeightKg:    req.SenderWeightKg,
			ReceiverWeightKg:  req.ReceiverWeightKg,
			DifferenceKg:      diff,
			ToleranceLimitKg:  toleranceLimit,
			IsWithinTolerance: isWithinTolerance,
			FinancialImpactTL: float64(absDiff) * req.UnitPriceTL / 1000.0,
			ResolvedAt:        time.Now().Format("15:04 Bugün"),
			Status:            status,
		}

		store.settlements = append([]DisputeSettlement{settlement}, store.settlements...)

		writeJSON(w, http.StatusOK, map[string]interface{}{
			"success":    true,
			"settlement": settlement,
			"message":    "Kantar tartım mutabakatı işlendi.",
		})
	})

	// 16. Financial: Early Payment Factoring
	mux.HandleFunc("/api/financial/request-early-payment", func(w http.ResponseWriter, r *http.Request) {
		if enableCORS(w, r) {
			return
		}
		if r.Method != http.MethodPost {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			return
		}

		var req struct {
			TicketID      string  `json:"ticketId"`
			InvoiceNo     string  `json:"invoiceNo"`
			InvoiceAmount float64 `json:"invoiceAmount"`
			BankCode      string  `json:"bankCode"`
		}
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, "Bad request", http.StatusBadRequest)
			return
		}

		store.mu.Lock()
		defer store.mu.Unlock()

		advance := req.InvoiceAmount * 0.80
		fee := req.InvoiceAmount * 0.024
		payout := advance - fee

		bank := req.BankCode
		if bank == "" {
			bank = "GARANTI_BBVA_FACTORING"
		}

		ep := EarlyPaymentSubmission{
			ID:            fmt.Sprintf("EP-%d", time.Now().UnixNano()%1000000),
			TicketID:      req.TicketID,
			InvoiceNo:     req.InvoiceNo,
			InvoiceAmount: req.InvoiceAmount,
			AdvanceAmount: advance,
			FeeAmount:     fee,
			PayoutAmount:  payout,
			BankCode:      bank,
			Status:        "TRANSFERRED_T1",
			CreatedAt:     time.Now().Format("15:04 Bugün"),
		}

		store.earlyPayments = append([]EarlyPaymentSubmission{ep}, store.earlyPayments...)

		writeJSON(w, http.StatusOK, map[string]interface{}{
			"success":    true,
			"submission": ep,
			"message":    fmt.Sprintf("%.2f TL avans tutarı 24 saat içinde şirket hesabına aktarılacaktır.", payout),
		})
	})

	// 17. Compliance: Live Summary
	mux.HandleFunc("/api/compliance/summary", func(w http.ResponseWriter, r *http.Request) {
		if enableCORS(w, r) {
			return
		}
		store.mu.RLock()
		defer store.mu.RUnlock()

		totalPrevented := 0
		for _, a := range store.alerts {
			totalPrevented += a.PenaltyPreventedAmountTl
		}

		uetdsApproved := 0
		mapegTickets := 0
		motatTickets := 0

		for _, rec := range store.weighings {
			if rec.UetdsStatus == "APPROVED" {
				uetdsApproved++
			}
			if rec.Sector == "tas_ocagi" {
				mapegTickets++
			}
			if rec.Sector == "hurda" {
				motatTickets++
			}
		}

		summary := ComplianceSummary{
			TotalPreventedTL:   totalPrevented,
			UetdsTotalApproved: 4890 + uetdsApproved,
			MapegTotalTickets:  1140 + mapegTickets,
			MotatTotalTickets:  880 + motatTickets,
			ActiveAlertsCount:  len(store.alerts),
			Alerts:             store.alerts,
		}
		writeJSON(w, http.StatusOK, summary)
	})

	// 18. Risk: Toggle Lock
	mux.HandleFunc("/api/risk/toggle-lock", func(w http.ResponseWriter, r *http.Request) {
		if enableCORS(w, r) {
			return
		}
		if r.Method != http.MethodPost {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			return
		}

		var req struct {
			CompanyID string `json:"companyId"`
		}
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, "Bad request", http.StatusBadRequest)
			return
		}

		store.mu.Lock()
		defer store.mu.Unlock()

		for i := range store.riskProfiles {
			if store.riskProfiles[i].ID == req.CompanyID {
				store.riskProfiles[i].LockStatus = !store.riskProfiles[i].LockStatus
				writeJSON(w, http.StatusOK, map[string]interface{}{
					"success": true,
					"company": store.riskProfiles[i],
					"message": fmt.Sprintf("%s için kredi kilidi güncellendi.", store.riskProfiles[i].CompanyName),
				})
				return
			}
		}

		http.Error(w, "Company not found", http.StatusNotFound)
	})

	// 19. Sector Telemetry: GET & POST
	mux.HandleFunc("/api/sectors/telemetry", func(w http.ResponseWriter, r *http.Request) {
		if enableCORS(w, r) {
			return
		}

		if r.Method == http.MethodGet {
			sector := r.URL.Query().Get("sector")
			if sector == "" {
				sector = "beton"
			}

			store.mu.RLock()
			defer store.mu.RUnlock()

			data, exists := store.telemetry[sector]
			if !exists {
				data = make(map[string]interface{})
			}
			writeJSON(w, http.StatusOK, map[string]interface{}{
				"sector":    sector,
				"timestamp": time.Now().Format("2006-01-02 15:04:05"),
				"data":      data,
			})
			return
		}

		if r.Method == http.MethodPost {
			var req struct {
				Sector string                 `json:"sector"`
				Data   map[string]interface{} `json:"data"`
			}
			if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
				http.Error(w, "Bad request", http.StatusBadRequest)
				return
			}

			store.mu.Lock()
			defer store.mu.Unlock()

			existing, exists := store.telemetry[req.Sector]
			if !exists {
				existing = make(map[string]interface{})
			}
			for k, v := range req.Data {
				existing[k] = v
			}
			store.telemetry[req.Sector] = existing

			writeJSON(w, http.StatusOK, map[string]interface{}{
				"success":   true,
				"sector":    req.Sector,
				"telemetry": existing,
				"message":   "Telemetri verisi Go sunucusuna kaydedildi.",
			})
			return
		}

		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	})

	// 20. Live IoT Scale Indicator
	mux.HandleFunc("/api/scale/live-indicator", func(w http.ResponseWriter, r *http.Request) {
		if enableCORS(w, r) {
			return
		}
		gross := 41850 + (time.Now().Second()%5)*30
		tare := 14200
		net := gross - tare

		writeJSON(w, http.StatusOK, map[string]interface{}{
			"indicatorModel":  "Tunaylar LPR-IoT v4.2",
			"serialNo":        "TNY-2026-SCALE-09",
			"grossWeightKg":   gross,
			"tareWeightKg":    tare,
			"netWeightKg":     net,
			"isCalibrated":    true,
			"lastCalibrated":  "2026-10-15 (TSE Mühürlü)",
			"isScaleZeroed":   true,
			"maxCapacityKg":   60000,
			"readTimestamp":   time.Now().Format("15:04:05"),
		})
	})

	port := 8080
	log.Printf("🚀 TONAJ B2B Go API sunucusu dinliyor: http://localhost:%d\n", port)
	if err := http.ListenAndServe(fmt.Sprintf(":%d", port), mux); err != nil {
		log.Fatalf("Server failed: %v", err)
	}
}
