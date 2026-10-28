export type SectorType = 
  | 'demir'
  | 'antrepo_gumruk'
  | 'beton' 
  | 'tas_ocagi' 
  | 'hurda' 
  | 'kereste' 
  | 'nakliye_lojistik';

export interface SectorMeta {
  id: SectorType;
  name: string;
  tagline: string;
  icon: string;
  primaryMetricLabel: string;
  primaryMetricValue: string;
  riskFactor: string;
  complianceKey: string;
}

export interface WeighingRecord {
  id: string;
  ticketNo: string;
  plate: string;
  trailerPlate?: string;
  driverName: string;
  driverPhone: string;
  companySender: string;
  companyReceiver: string;
  material: string;
  sector: SectorType;
  grossWeightKg: number;
  tareWeightKg: number;
  netWeightKg: number;
  axleCount: number;
  maxLegalWeightKg: number;
  isOverweight: boolean;
  moistureWastePercent: number; // Hurda veya nem firesi
  finalPayableKg: number;
  uetdsStatus: 'APPROVED' | 'PENDING' | 'ERROR';
  uetdsCode?: string;
  eWaybillStatus: 'SENT' | 'PENDING' | 'DRAFT';
  eWaybillNo?: string;
  status: 'IN_TRANSIT' | 'WEIGHED' | 'DELIVERED' | 'DISPUTED';
  siteName: string;
  timestamp: string;
  concreteSlumpMinutesRemaining?: number; // Beton için priz süresi
  customsDeclarationNo?: string; // Antrepo için
  siteApproved?: boolean;
  siteApprovedAt?: string;
  siteApproverName?: string;
  iotHardwareSha?: string;
}

export interface BackhaulLoad {
  id: string;
  origin: string;
  destination: string;
  material: string;
  tonnage: number;
  ratePerTon: number;
  totalFreight: number;
  vehicleType: 'Damperli Kamyon' | 'Mikser' | 'Sal Kasa Tır' | 'Silobas' | 'Konteyner Taşıyıcı';
  urgency: 'HIGH' | 'MEDIUM' | 'NORMAL';
  ownerCompany: string;
  distanceKm: number;
  pickupWindow: string;
  isBooked?: boolean;
}

export interface ComplianceAlert {
  id: string;
  type: 'U_ETDS' | 'MAPEG' | 'AXLE_LIMIT' | 'SLUMP_TIMEOUT' | 'MOTAT_WASTE';
  title: string;
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  message: string;
  plate: string;
  timestamp: string;
  penaltyPreventedAmountTl: number;
}

export interface CompanyRiskProfile {
  id: string;
  companyName: string;
  taxNo: string;
  sector: string;
  tonajScore: number; // 0 - 100
  riskStatus: 'GREEN' | 'YELLOW' | 'RED';
  creditTermDays: number;
  unpaidDisputeCount: number;
  totalDeliveredVolumeTon: number;
  lastPaymentStatus: string;
  creditLimitTl: number;
  lockStatus: boolean; // Eğer red ise vadeli mal satışı kilitlenir
}

export interface DisputeSettlement {
  id: string;
  ticketId: string;
  senderWeightKg: number;
  receiverWeightKg: number;
  differenceKg: number;
  toleranceLimitKg: number;
  isWithinTolerance: boolean;
  financialImpactTL: number;
  resolvedAt: string;
  status: 'APPROVED' | 'DISPUTED' | 'ADJUSTED';
}

export interface EarlyPaymentSubmission {
  id: string;
  ticketId: string;
  invoiceNo: string;
  invoiceAmount: number;
  advanceAmount: number;
  feeAmount: number;
  payoutAmount: number;
  bankCode: string;
  status: string;
  createdAt: string;
}

export interface FinancialSummary {
  totalResolvedVolumeTL: number;
  activeFactoringRate: number;
  factoringFeeRate: number;
  disputedWeighings: WeighingRecord[];
  settlements: DisputeSettlement[];
  earlyPayments: EarlyPaymentSubmission[];
}

export interface ComplianceSummary {
  totalPreventedTL: number;
  uetdsTotalApproved: number;
  mapegTotalTickets: number;
  motatTotalTickets: number;
  activeAlertsCount: number;
  alerts: ComplianceAlert[];
}

export interface LiveScaleIndicator {
  indicatorModel: string;
  serialNo: string;
  grossWeightKg: number;
  tareWeightKg: number;
  netWeightKg: number;
  isCalibrated: boolean;
  lastCalibrated: string;
  isScaleZeroed: boolean;
  maxCapacityKg: number;
  readTimestamp: string;
}
