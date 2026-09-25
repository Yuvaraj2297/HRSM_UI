/* =========================================================
   LEAD STAGE — MODELS
========================================================== */

export interface LeadStageItem {
  id: number;
  orderNo: number; // position in the lead pipeline (1 = first)
  name: string;
}

/** Create / update payload */
export type LeadStageInput = Omit<LeadStageItem, 'id'>;

/** Response shape of lead-stages.json (and the future API) */
export interface LeadStageData {
  stages: LeadStageItem[];
}
