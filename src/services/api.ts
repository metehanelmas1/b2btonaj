import { 
  WeighingRecord, 
  SectorType, 
  SectorMeta, 
  CompanyRiskProfile, 
  BackhaulLoad, 
  ComplianceAlert,
  FinancialSummary,
  DisputeSettlement,
  EarlyPaymentSubmission,
  ComplianceSummary,
  LiveScaleIndicator
} from '../types';

const API_BASE = '/api';

export interface UserSession {
  id: string;
  email: string;
  name: string;
  companyName: string;
  taxNo: string;
  sector: SectorType;
  role: string;
  token: string;
  createdAt?: string;
  hasCompletedOnboarding?: boolean;
  weighbridgeModel?: string;
  uetdsCompanyCode?: string;
}

export const api = {
  // 1. Health
  async health(): Promise<{ status: string; engine: string }> {
    const res = await fetch(`${API_BASE}/health`);
    if (!res.ok) throw new Error('Health check failed');
    return await res.json();
  },

  // 2. Master Sectors
  async getSectors(): Promise<SectorMeta[]> {
    const res = await fetch(`${API_BASE}/sectors`);
    if (!res.ok) throw new Error('Sektörler yüklenemedi');
    return await res.json();
  },

  // 3. Auth: Login
  async login(email: string, password: string): Promise<{ user: UserSession; token: string }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error('Giriş başarısız');
    const data = await res.json();
    return {
      user: {
        id: data.user.id,
        email: data.user.email,
        name: data.user.name || data.user.email.split('@')[0],
        companyName: data.user.companyName,
        taxNo: data.user.taxNo,
        sector: (data.user.sector || 'beton') as SectorType,
        role: data.user.role || 'Tesis Yöneticisi',
        token: data.token,
        createdAt: data.user.createdAt,
        hasCompletedOnboarding: data.user.hasCompletedOnboarding,
        weighbridgeModel: data.user.weighbridgeModel,
        uetdsCompanyCode: data.user.uetdsCompanyCode,
      },
      token: data.token,
    };
  },

  // 4. Auth: Register
  async register(payload: {
    email: string;
    password: string;
    companyName: string;
    taxNo: string;
    role?: string;
  }): Promise<{ user: UserSession; token: string }> {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Kayıt oluşturulamadı');
    const data = await res.json();
    return {
      user: {
        id: data.user.id,
        email: data.user.email,
        name: data.user.name || data.user.email.split('@')[0],
        companyName: data.user.companyName,
        taxNo: data.user.taxNo,
        sector: (data.user.sector || 'beton') as SectorType,
        role: data.user.role || 'Tesis Yöneticisi',
        token: data.token,
        createdAt: data.user.createdAt,
        hasCompletedOnboarding: data.user.hasCompletedOnboarding,
        weighbridgeModel: data.user.weighbridgeModel,
        uetdsCompanyCode: data.user.uetdsCompanyCode,
      },
      token: data.token,
    };
  },

  // 5. Weighings: Get list
  async getWeighings(sector?: SectorType, search?: string): Promise<WeighingRecord[]> {
    const params = new URLSearchParams();
    if (sector && sector !== 'nakliye_lojistik') params.append('sector', sector);
    if (search) params.append('search', search);

    const res = await fetch(`${API_BASE}/weighings?${params.toString()}`);
    if (!res.ok) throw new Error('Tartım verileri alınamadı');
    return await res.json();
  },

  // 6. Weighings: Create new
  async createWeighing(payload: Partial<WeighingRecord>): Promise<WeighingRecord> {
    const res = await fetch(`${API_BASE}/weighings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Tartım fişi oluşturulamadı');
    return await res.json();
  },

  // 7. Weighings: Approve U-ETDS
  async approveUetds(ticketId: string): Promise<{ success: boolean; uetdsCode: string }> {
    const res = await fetch(`${API_BASE}/weighings/approve-uetds`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ticketId }),
    });
    if (!res.ok) throw new Error('U-ETDS onayı verilemedi');
    return await res.json();
  },

  // 8. Weighings: Site delivery sign-off
  async confirmSiteDelivery(
    ticketId: string, 
    approverName: string, 
    slumpCm: number = 14, 
    temperature: number = 21.5
  ): Promise<{ success: boolean; record: WeighingRecord }> {
    const res = await fetch(`${API_BASE}/weighings/site-delivery`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ticketId, approverName, slumpCm, temperature }),
    });
    if (!res.ok) throw new Error('Teslimat onaylanamadı');
    return await res.json();
  },

  // 9. Risk Profiles (Tonaj Skor)
  async getRiskProfiles(): Promise<CompanyRiskProfile[]> {
    const res = await fetch(`${API_BASE}/risk/companies`);
    if (!res.ok) throw new Error('Risk profilleri alınamadı');
    return await res.json();
  },

  // 10. Backhaul Loads
  async getBackhaulLoads(): Promise<BackhaulLoad[]> {
    const res = await fetch(`${API_BASE}/backhaul/loads`);
    if (!res.ok) throw new Error('Geri dönüş yükleri alınamadı');
    return await res.json();
  },

  // 11. Book Backhaul Load
  async bookBackhaulLoad(loadId: string): Promise<{ success: boolean; load: BackhaulLoad }> {
    const res = await fetch(`${API_BASE}/backhaul/book`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ loadId }),
    });
    if (!res.ok) throw new Error('Yük rezervasyonu yapılamadı');
    return await res.json();
  },

  // 12. Compliance Alerts
  async getComplianceAlerts(): Promise<ComplianceAlert[]> {
    const res = await fetch(`${API_BASE}/compliance/alerts`);
    if (!res.ok) throw new Error('Mevzuat uyarıları alınamadı');
    return await res.json();
  },

  // 13. Onboarding: Steps
  async getOnboardingSteps(sector: string = 'beton'): Promise<{ sector: string; steps: { stepNumber: number; title: string; description: string; icon: string }[] }> {
    const res = await fetch(`${API_BASE}/onboarding/steps?sector=${sector}`);
    if (!res.ok) throw new Error('Onboarding adımları alınamadı');
    return await res.json();
  },

  // 14. Onboarding: Complete
  async completeOnboarding(payload: {
    token: string;
    sector: SectorType;
    weighbridgeModel: string;
    uetdsCompanyCode: string;
    enableBarrier: boolean;
  }): Promise<{ success: boolean; message: string; user: UserSession }> {
    const res = await fetch(`${API_BASE}/onboarding/complete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Onboarding tamamlanamadı');
    return await res.json();
  },

  // 15. Financial: Summary
  async getFinancialSummary(): Promise<FinancialSummary> {
    const res = await fetch(`${API_BASE}/financial/summary`);
    if (!res.ok) throw new Error('Finansal mutabakat verileri alınamadı');
    return await res.json();
  },

  // 16. Financial: Resolve Dispute
  async resolveDispute(payload: {
    ticketId: string;
    senderWeightKg: number;
    receiverWeightKg: number;
    unitPriceTl: number;
  }): Promise<{ success: boolean; settlement: DisputeSettlement; message: string }> {
    const res = await fetch(`${API_BASE}/financial/resolve-dispute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Tartım uyuşmazlığı çözülemedi');
    return await res.json();
  },

  // 17. Financial: Early Payment Factoring Request
  async requestEarlyPayment(payload: {
    ticketId: string;
    invoiceNo: string;
    invoiceAmount: number;
    bankCode?: string;
  }): Promise<{ success: boolean; submission: EarlyPaymentSubmission; message: string }> {
    const res = await fetch(`${API_BASE}/financial/request-early-payment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Erken ödeme talebi iletilemedi');
    return await res.json();
  },

  // 18. Compliance: Live Summary
  async getComplianceSummary(): Promise<ComplianceSummary> {
    const res = await fetch(`${API_BASE}/compliance/summary`);
    if (!res.ok) throw new Error('Mevzuat özeti alınamadı');
    return await res.json();
  },

  // 19. Risk: Toggle Lock
  async toggleRiskLock(companyId: string): Promise<{ success: boolean; company: CompanyRiskProfile; message: string }> {
    const res = await fetch(`${API_BASE}/risk/toggle-lock`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ companyId }),
    });
    if (!res.ok) throw new Error('Kredi kilidi güncellenemedi');
    return await res.json();
  },

  // 20. Sector Telemetry: Get
  async getSectorTelemetry(sector: SectorType): Promise<{ sector: string; timestamp: string; data: any }> {
    const res = await fetch(`${API_BASE}/sectors/telemetry?sector=${sector}`);
    if (!res.ok) throw new Error('Sektörel telemetri verisi alınamadı');
    return await res.json();
  },

  // 21. Sector Telemetry: Update
  async updateSectorTelemetry(sector: SectorType, data: any): Promise<{ success: boolean; sector: string; telemetry: any; message: string }> {
    const res = await fetch(`${API_BASE}/sectors/telemetry`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sector, data }),
    });
    if (!res.ok) throw new Error('Telemetri verisi güncellenemedi');
    return await res.json();
  },

  // 22. Scale: Live Indicator
  async getLiveScaleIndicator(): Promise<LiveScaleIndicator> {
    const res = await fetch(`${API_BASE}/scale/live-indicator`);
    if (!res.ok) throw new Error('Kantar indikatör verisi okunamadı');
    return await res.json();
  },
};
