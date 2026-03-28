/* ═══════════════════════════════════════════════════════════════════
   AI TYPES
═══════════════════════════════════════════════════════════════════ */

export type Stage = "parse" | "clarify" | "analysis";

export type PriceAssessment = "overpriced" | "fair" | "underpriced";

export type Recommendation = "buy_to_live" | "buy_to_invest" | "avoid" | "wait";

export interface ProjectProfile {
  project:          string;
  type:             string;
  area:             string;
  price:            string;
  price_per_sqm:    string;
  province:         string;
  district:         string;
  transaction_type: string;
  handover_status:  string;
  tower:            string;
  floor:            string;
  orientation:      string;
  view:             string;
  legal_status:     string;
}

export interface AnalysisData {
  price_assessment:    PriceAssessment;
  price_label:         string;
  market_low:          number;
  market_high:         number;
  market_unit:         string;
  verdict_pill:        string;
  verdict_main:        string;
  verdict_detail:      string;
  risks:               string[];
  opportunities:       string[];
  recommendation:      Recommendation;
  recommendation_reason: string;
}

export interface AIResponse {
  stage:          Stage;
  message:        string;
  profile:        ProjectProfile;
  missing_fields: string[];
  questions:      string[];
  confidence:     number;
  analysis:       AnalysisData | null;
}

/** Derived state persisted per session */
export interface IntelData {
  stage:          Stage;
  profile:        ProjectProfile;
  missing_fields: string[];
  confidence:     number;
  analysis:       AnalysisData | null;
}
