export interface Case {
  id: string;
  clinicId: string;
  disease: string;
  reportedAt: string; // ISO date
  countyCode: string;
  caseId: string;
}

export interface Clinic {
  id: string;
  name: string;
  county: string;
  countyCode: string;
}

export const diseases = [
  'Cholera',
  'Ebola',
  'Malaria',
  'Measles',
  'Yellow Fever',
  // Add more from IDSR
];

// Clinics are now loaded from /facilities.json