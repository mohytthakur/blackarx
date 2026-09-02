// Blackarc inspection data, analysis logic, and export utilities.

export type Severity = 'critical' | 'warning' | 'pass';
export type ComplianceStatus = 'pass' | 'borderline' | 'fail';

export type ProcessDefinition = {
  code: string;
  name: string;
  checks: string[];
};

export type Criterion = {
  name: string;
  score: number;
  severity: Severity;
  note: string;
};

export type Finding = {
  type: string;
  location: string;
  position: string;
  zone: string;
  severity: 'Critical' | 'Major' | 'Minor';
  rootCause: string;
  correctiveAction: string;
  prevention: string;
  compliance: ComplianceStatus;
  clause: string;
  corrosionRisk: string;
  fatigueClass: string;
  stressConcentrationFactor: number;
  confidence: number;
};

export type Calibration = {
  pixelDistance: number;
  mmDistance: number;
  pixelsPerMm: number;
  warning: string | null;
};

export type JointConfig = {
  type: string;
  preparation: string;
  thickness: number;
  rootGap: number;
  rootFace: number;
};

export type ServiceCondition = {
  loading: string;
  environment: string;
  criticality: string;
};

export type ImageItem = {
  id: string;
  name: string;
  url: string;
  width: number;
  height: number;
};

export type Signature = {
  inspectorName: string;
  certificationNumber: string;
  signedAt: string;
  verification: string;
};

export type Analysis = {
  hazThermal: { discoloration: string; peakTempEstimate: string; heatInputFlag: string; sensitizationRisk: string };
  multiPass: { mode: string; interpassCleaning: string; layerUniformity: string; lackOfInterpassFusion: string };
  pwht: { visible: boolean; required: boolean; note: string };
  mechanical: { tensile: string; bend: string; impact: string; hardness: string; macroEtch: string };
  fatigue: { estimatedLifeReduction: string; kt: string };
  repair: { isRepair: boolean; location: string; reason: string; multipleRepairFlag: string };
  comparative: { imageCount: number; worstCase: string; affectedLengthPercent: string; weldMap: string };
  heatInput: string;
};

export type Certification = {
  likelyPass: boolean;
  additionalNdt: string[];
  documentationGaps: string[];
  estimatedReworkHours: number;
};

export type Report = {
  processChecks: string[];
  blowholes: string[];
  dpt: {
    required: boolean;
    locations: string[];
    method: string;
    penetrant: string;
    developer: string;
    dwellTime: string;
    developerTime: string;
    lighting: string;
    standard: string;
  };
  findings: Finding[];
  measurements: string[];
};

export type ProcessPrediction = {
  predictedCode: string;
  predictedName: string;
  confidence: number;
  matchesSelected: boolean;
  visualClues: string[];
};

export type ProcessVerification = {
  prediction: ProcessPrediction;
  overridden: boolean;
  overriddenAt: string | null;
};

export type ServiceContextInput = {
  loading: string;
  environment: string;
  criticality: string;
  designLifeYears: string;
  designLifeCycles: string;
  operatingTempMin: string;
  operatingTempMax: string;
  operatingPressureMin: string;
  operatingPressureMax: string;
  vibration: string;
  consequenceOfFailure: string;
};

export type ServiceContextAssessment = {
  suitability: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  riskReasoning: string;
  failureModes: string[];
  remainingSafetyMargin: string;
  additionalNdt: string[];
  reworkDecision: 'Acceptable as-is' | 'Acceptable with monitoring' | 'Rework required before service' | 'Reject for this application';
  inspectionIntervals: string;
  assessedAt: string;
};

export type InspectionConfig = {
  processCode: string;
  processName: string;
  standard: string;
  joint: JointConfig;
  baseMetal: string;
  fillerMetal: string;
  position: string;
  service: ServiceCondition;
  multiPass: boolean;
  repairWeld: boolean;
  welderId: string;
  heatNumber: string;
  batchNumber: string;
};

export type Inspection = {
  id: string;
  file_name: string;
  process_code: string;
  process_name: string;
  standard: string;
  overall_score: number;
  overall_grade: string;
  inspection_status: 'PASS' | 'FAIL' | 'REVIEW NEEDED';
  critical_count: number;
  warning_count: number;
  criteria: Criterion[];
  report: Report;
  dpt_required: boolean;
  joint_config: JointConfig;
  base_metal: string;
  filler_metal: string;
  position: string;
  service_condition: ServiceCondition;
  multi_pass: boolean;
  repair_weld: boolean;
  welder_id: string | null;
  heat_number: string | null;
  batch_number: string | null;
  images: ImageItem[];
  calibration: Calibration | null;
  analysis: Analysis;
  signature: Signature | null;
  locked: boolean;
  certification: Certification;
  process_verification: ProcessVerification | null;
  service_context: ServiceContextAssessment | null;
  created_at: string;
};

export const processes: ProcessDefinition[] = [
  { code: 'SMAW', name: 'SMAW (Shielded Metal Arc Welding / Stick)', checks: ['Electrode type compatibility with base metal', 'Current setting: AC/DC and amperage range for electrode diameter', 'Arc length consistency', 'Slag removal between passes', 'Moisture content in electrodes and low-hydrogen requirements'] },
  { code: 'GMAW', name: 'GMAW (Gas Metal Arc Welding / MIG)', checks: ['Shielding gas type and flow rate (CFH)', 'Wire feed speed versus voltage balance', 'Contact tip to work distance (CTWD)', 'Transfer mode: short circuit, globular, spray, or pulsed', 'Gas coverage adequacy from oxidation colors'] },
  { code: 'GTAW', name: 'GTAW (Gas Tungsten Arc Welding / TIG)', checks: ['Tungsten condition: sharpened, balled, or contaminated', 'Shielding gas type and flow rate', 'Filler rod addition technique', 'Heat input control: amperage and travel speed', 'Post-flow time and gas coverage during cooling'] },
  { code: 'FCAW', name: 'FCAW (Flux-Cored Arc Welding)', checks: ['Gas-shielded versus self-shielded verification', 'Wire feed speed and voltage settings', 'Slag coverage and detachability', 'Penetration profile for joint configuration', 'Wire polarity and travel angle'] },
  { code: 'SAW', name: 'SAW (Submerged Arc Welding)', checks: ['Flux type and condition with moisture check', 'Wire feed speed to travel speed ratio', 'Flux coverage depth', 'Preheat and interpass temperature control', 'Electrode alignment and arc stability'] },
  { code: 'PAW', name: 'PAW (Plasma Arc Welding)', checks: ['Plasma gas type and flow rate', 'Orifice diameter and condition', 'Arc current and travel speed', 'Keyhole mode stability', 'Shielding gas coverage'] },
  { code: 'ESW', name: 'ESW (Electroslag Welding)', checks: ['Flux composition and electrical conductivity', 'Consumable guide alignment', 'Slag pool height and stability', 'Cooling shoe seal condition', 'Preheat and interpass temperature control'] },
  { code: 'OAW', name: 'OAW (Oxy-Acetylene Welding)', checks: ['Flame type: neutral, carburizing, or oxidizing', 'Torch tip size and gas pressure settings', 'Filler rod compatibility', 'Heat affected zone size', 'Torch angle and travel speed'] },
  { code: 'RSW', name: 'Resistance Spot Welding', checks: ['Electrode tip diameter and condition', 'Squeeze, weld, and hold time', 'Current in kA and force in kN', 'Nugget size estimation from surface appearance', 'Electrode alignment and cooling'] },
  { code: 'RSEAM', name: 'Resistance Seam Welding', checks: ['Wheel electrode condition and alignment', 'Current, weld time, and off time', 'Electrode force and travel speed', 'Overlap between nuggets', 'Cooling water flow and temperature'] },
  { code: 'USW', name: 'Ultrasonic Welding', checks: ['Frequency and amplitude settings', 'Clamp pressure and weld time', 'Horn tip condition and alignment', 'Joint interface preparation', 'Bond quality and flash formation'] },
  { code: 'FSW', name: 'Friction Stir Welding', checks: ['Tool shoulder and pin condition', 'Rotation speed and travel speed', 'Axial force and plunge depth', 'Tilt angle and tool offset', 'Advancing-side and retreating-side profile'] },
  { code: 'LBW', name: 'Laser Beam Welding', checks: ['Beam focus position relative to workpiece', 'Power density and welding speed', 'Shielding gas type and delivery method', 'Keyhole stability indicators', 'Beam alignment and spot size'] },
  { code: 'EBW', name: 'Electron Beam Welding', checks: ['Beam focus and accelerating voltage', 'Beam current and travel speed', 'Vacuum level and chamber condition', 'Joint fit-up and alignment', 'Penetration profile and keyhole stability'] },
  { code: 'STUD', name: 'Stud Welding', checks: ['Stud diameter and material compatibility', 'Weld current and weld time', 'Lift and plunge settings', 'Ferrule condition and placement', 'Arc shielding and stud alignment'] },
  { code: 'BRAZING', name: 'Brazing (Torch, Furnace, Induction)', checks: ['Filler alloy compatibility and melting range', 'Joint clearance and capillary action', 'Flux type and coverage', 'Heat source temperature control', 'Heating sequence and cooling rate'] },
  { code: 'SOLDERING', name: 'Soldering', checks: ['Solder alloy and base material compatibility', 'Flux type and activation', 'Joint cleanliness and clearance', 'Tip or heat source temperature', 'Wetting and capillary flow'] },
];

export const standards = [
  'AWS D1.1 (Structural Steel)',
  'AWS D1.6 (Stainless Steel)',
  'ASME Section IX (Pressure Vessels)',
  'ISO 5817 Level B',
  'ISO 5817 Level C',
  'ISO 5817 Level D',
  'API 1104 (Pipeline Welding)',
  'ISO 10042 (Aluminum)',
];

export const jointTypes = ['Butt', 'Lap', 'T-joint', 'Corner', 'Edge', 'Cruciform'];
export const jointPreparations = ['Square', 'Single-V', 'Double-V', 'Single-U', 'Double-U', 'Single-Bevel', 'Double-Bevel', 'J-groove'];

export const baseMetals = [
  'Carbon Steel',
  'Stainless Steel 304',
  'Stainless Steel 316',
  'Stainless Steel 321',
  'Duplex Stainless 2205',
  'Aluminum 5052',
  'Aluminum 6061',
  'Aluminum 7075',
  'Titanium Gr2',
  'Nickel Alloy 625',
  'Copper',
];

export const fillerMetals = [
  'None',
  'E7018',
  'ER70S-6',
  'ER308L',
  'ER316L',
  'ER2209',
  'ER4043',
  'ER5356',
  'ERTi-2',
  'ERNiCrMo-3',
  'ERCu',
];

export const positions = [
  '1G/1F (Flat)',
  '2G (Horizontal)',
  '3G (Vertical Up)',
  '3G (Vertical Down)',
  '4G (Overhead)',
  '5G (Pipe Horizontal Fixed)',
  '6G (Pipe 45° Inclined)',
  '6GR (with Restriction Ring)',
];

export const loadingTypes = ['Static', 'Dynamic/Cyclic', 'Impact', 'Seismic'];
export const serviceEnvironments = ['Ambient', 'High Temperature (>400°C)', 'Cryogenic (<-40°C)', 'Corrosive', 'Subsea', 'Sour Service (H₂S)', 'Radiation'];
export const criticalityLevels = ['Non-critical', 'Safety-critical', 'Pressure-containing', 'Load-bearing'];

const fillerCompatibility: Record<string, string[]> = {
  'Carbon Steel': ['E7018', 'ER70S-6'],
  'Stainless Steel 304': ['ER308L'],
  'Stainless Steel 316': ['ER316L'],
  'Stainless Steel 321': ['ER308L', 'ER316L'],
  'Duplex Stainless 2205': ['ER2209'],
  'Aluminum 5052': ['ER5356'],
  'Aluminum 6061': ['ER4043', 'ER5356'],
  'Aluminum 7075': ['ER5356'],
  'Titanium Gr2': ['ERTi-2'],
  'Nickel Alloy 625': ['ERNiCrMo-3'],
  'Copper': ['ERCu'],
};

export function checkFillerCompatibility(base: string, filler: string): { compatible: boolean; note: string } {
  if (filler === 'None') return { compatible: true, note: 'Filler metal not specified — compatibility checks skipped.' };
  const allowed = fillerCompatibility[base] ?? [];
  if (allowed.length === 0) return { compatible: true, note: 'Compatibility data unavailable — verify against WPS.' };
  if (allowed.includes(filler)) return { compatible: true, note: 'Filler metal matches base metal classification.' };
  return { compatible: false, note: `Mismatch: ${filler} is not a standard filler for ${base}. Verify WPS.` };
}

const standardThresholds: Record<string, { undercut: number; pore: number; porosityArea: number; crack: number }> = {
  'AWS D1.1 (Structural Steel)': { undercut: 1.0, pore: 1.5, porosityArea: 3, crack: 0 },
  'AWS D1.6 (Stainless Steel)': { undercut: 0.8, pore: 1.5, porosityArea: 2, crack: 0 },
  'ASME Section IX (Pressure Vessels)': { undercut: 0.8, pore: 1.0, porosityArea: 2, crack: 0 },
  'ISO 5817 Level B': { undercut: 0.5, pore: 1.0, porosityArea: 1, crack: 0 },
  'ISO 5817 Level C': { undercut: 0.8, pore: 1.5, porosityArea: 2, crack: 0 },
  'ISO 5817 Level D': { undercut: 1.5, pore: 2.0, porosityArea: 3, crack: 0 },
  'API 1104 (Pipeline Welding)': { undercut: 0.8, pore: 1.5, porosityArea: 2, crack: 0 },
  'ISO 10042 (Aluminum)': { undercut: 1.0, pore: 2.0, porosityArea: 3, crack: 0 },
};

export function getStandardThresholds(standard: string) {
  return standardThresholds[standard] ?? standardThresholds['AWS D1.1 (Structural Steel)'];
}

const seedCriteria: Criterion[] = [
  { name: 'Weld Bead Uniformity', score: 6.8, severity: 'warning', note: 'Bead width varies by approximately 15% along the weld length.' },
  { name: 'Porosity Detection', score: 4.1, severity: 'critical', note: 'Clustered surface pores exceed the visual acceptance threshold.' },
  { name: 'Crack Detection', score: 3.2, severity: 'critical', note: 'Linear indication at Toe-Right requires verification.' },
  { name: 'Undercut Assessment', score: 5.8, severity: 'warning', note: 'Localized toe undercut requires depth measurement.' },
  { name: 'Spatter Level', score: 6.2, severity: 'warning', note: 'Moderate adhered spatter within the HAZ.' },
  { name: 'Penetration Quality', score: 5.5, severity: 'warning', note: 'Root penetration estimated at 80% — joint preparation may be inadequate.' },
  { name: 'Surface Finish', score: 6.8, severity: 'warning', note: 'Toe transition varies along the center third; oxidation discoloration present.' },
  { name: 'Alignment Accuracy', score: 7.2, severity: 'pass', note: 'Joint alignment within tolerance; minor offset visible at start.' },
  { name: 'Slag Inclusion', score: 7.6, severity: 'pass', note: 'No visible slag inclusions; interpass cleaning appears adequate.' },
  { name: 'Overall Weld Grade', score: 5.9, severity: 'warning', note: 'Composite score reflects multiple minor defects and one critical finding.' },
];

export function generateCriteria(seed: string): Criterion[] {
  const hash = simpleHash(seed);
  const quality = (hash % 100) / 100;
  return seedCriteria.map((c, index) => {
    let base: number;
    if (c.severity === 'critical') base = 1.5 + quality * 8;
    else if (c.severity === 'warning') base = 3 + quality * 6.5;
    else base = 6 + quality * 3.5;
    const variation = ((hash >> (index * 3 + 7)) % 7 - 3) * 0.4;
    const score = Math.max(1, Math.min(10, Number((base + variation).toFixed(1))));
    let severity: 'pass' | 'warning' | 'critical' = 'pass';
    if (score < 4) severity = 'critical';
    else if (score < 7) severity = 'warning';
    return { ...c, score, severity };
  });
}

export function makeReport(config: InspectionConfig, calibration: Calibration | null, seed: string): Report {
  const hash = simpleHash(seed);
  const quality = (hash % 100) / 100;
  const thresholds = getStandardThresholds(config.standard);
  const calNote = calibration ? '' : ' (estimated — scale uncalibrated)';
  const undercutDepth = 0.6;
  const poreSize = 1.8;
  const compliance = (value: number, limit: number): ComplianceStatus => {
    if (value <= 0) return 'fail';
    if (value < limit * 0.8) return 'pass';
    if (value <= limit) return 'borderline';
    return 'fail';
  };
  const allFindings: Finding[] = [
    {
      type: 'Blowholes (Cluster of 4)',
      location: '46 mm from weld start',
      position: 'X: 46 mm, Y: 3 mm',
      zone: 'Face / Centerline',
      severity: 'Major',
      rootCause: 'Moisture contamination and inadequate gas coverage at weld start',
      correctiveAction: 'Dry consumables per WPS, verify shielding at 15–20 CFH, and establish pre-flow before arc initiation',
      prevention: 'Store consumables in controlled conditions and record gas-flow verification before each weld',
      compliance: compliance(poreSize, thresholds.pore),
      clause: `${config.standard} — max single pore ${thresholds.pore.toFixed(1)} mm`,
      corrosionRisk: 'Pores at surface act as crevice initiation sites in corrosive service.',
      fatigueClass: 'Class D',
      stressConcentrationFactor: 1.8,
      confidence: 88,
    },
    {
      type: 'Linear crack indication',
      location: '82 mm from weld start',
      position: 'X: 82 mm, Y: 1 mm',
      zone: 'Toe-Right / HAZ-Right',
      severity: 'Critical',
      rootCause: 'High restraint with localized heat input variation',
      correctiveAction: 'Stop acceptance, remove the affected section, and re-weld under the qualified WPS after engineering review',
      prevention: 'Control interpass temperature and verify joint restraint and preheat records',
      compliance: 'fail',
      clause: `${config.standard} — crack-like indication: rejectable (0 mm tolerance)`,
      corrosionRisk: 'Crack provides direct path for stress corrosion cracking in sour service.',
      fatigueClass: 'Class F',
      stressConcentrationFactor: 3.5,
      confidence: 95,
    },
    {
      type: 'Undercut at Toe-Right',
      location: '60 mm from weld start',
      position: 'X: 60 mm, Y: 0 mm',
      zone: 'Toe-Right',
      severity: 'Major',
      rootCause: 'Excessive travel speed or amperage at the toe',
      correctiveAction: `Reduce travel speed by 10–15% and verify amperage range; grind blend if depth is below ${thresholds.undercut.toFixed(1)} mm`,
      prevention: 'Monitor travel speed and maintain consistent arc length during cap pass',
      compliance: compliance(undercutDepth, thresholds.undercut),
      clause: `${config.standard} — undercut shall not exceed ${thresholds.undercut.toFixed(1)} mm`,
      corrosionRisk: 'Undercut creates crevice and stress concentration; corrosion initiation site.',
      fatigueClass: 'Class E',
      stressConcentrationFactor: 2.5,
      confidence: 91,
    },
  ];
  let findings: Finding[];
  if (quality > 0.78) {
    findings = [];
  } else if (quality > 0.55) {
    findings = [allFindings[2]];
  } else if (quality > 0.32) {
    findings = [allFindings[0], allFindings[2]];
  } else {
    findings = allFindings;
  }
  const hasCrack = findings.some((f) => f.type.includes('crack'));
  const hasBlowholes = findings.some((f) => f.type.includes('Blowholes'));
  const hasUndercut = findings.some((f) => f.type.includes('Undercut'));
  return {
    processChecks: processes.find((p) => p.code === config.processCode)?.checks ?? [],
    blowholes: hasBlowholes ? [
      `Visible count: 4${calNote}`,
      `Size estimate: 0.8–1.8 mm${calNote}; scale reference required for confirmation`,
      'Locations: Face, Centerline, and Toe-Right',
      'Clustered pattern: Yes; isolated indications: 1',
      'Depth estimate: surface-breaking appearance',
      `Acceptance reference: ${config.standard}; max single pore ${thresholds.pore.toFixed(1)} mm and total porosity area below ${thresholds.porosityArea}% for static loading`,
    ] : ['No surface blowholes or gas pores detected.'],
    dpt: {
      required: hasCrack || (findings.length > 0 && quality < 0.5),
      locations: findings.length > 0 ? findings.map((f) => `${f.position} — ${f.zone}`) : [],
      method: 'Visible (Type II)',
      penetrant: 'Solvent-removable (Method C)',
      developer: 'Wet non-aqueous',
      dwellTime: 'Minimum 5 minutes at 10–25°C',
      developerTime: '10–30 minutes',
      lighting: 'White light, minimum 1000 lux',
      standard: 'ASME BPVC Section V Article 6; ASTM E165/E165M',
    },
    findings,
    measurements: [
      ...(hasCrack ? [`Crack: longitudinal classification; estimated length 12 mm${calNote}; branching: No`] : []),
      ...(hasUndercut ? [`Undercut: Toe-Right; estimated depth ${undercutDepth.toFixed(1)} mm${calNote}; continuous over 18 mm; profile sharp`] : []),
      `Reinforcement: estimated ${quality > 0.7 ? '1.5' : '2.4'} mm above base metal${calNote}; material thickness ${config.joint.thickness} mm`,
      ...(quality < 0.6 ? ['Incomplete penetration: root gap not fully visible; estimated penetration 80% at image center'] : []),
      `Spatter: approximately ${quality > 0.7 ? '2' : '12'} particles/cm² in HAZ${calNote}; particle size 0.5–2.0 mm; adhered and loose particles present`,
      `Profile: ${quality > 0.7 ? 'uniform convex; smooth toe transition' : 'convex; toe transition requires confirmation against the applicable WPS'}; overlap not confirmed`,
      `HAZ: estimated ${quality > 0.7 ? '2.5' : '4'} mm each side${calNote}; ${quality > 0.7 ? 'no discoloration' : 'blue-to-grey discoloration'}; no HAZ cracking visible`,
      `Surface cleanliness: ${quality > 0.7 ? 'clean; no residue' : 'partial residue visible'}; no clear arc strike outside weld zone`,
    ],
  };
}

export function makeAnalysis(config: InspectionConfig, imageCount: number, findingsCount: number): Analysis {
  const isStainless = config.baseMetal.toLowerCase().includes('stainless') || config.baseMetal.toLowerCase().includes('duplex');
  const thickness = config.joint.thickness;
  const pwhtRequired = thickness > 25 || isStainless || config.service.environment === 'Sour Service (H₂S)';
  const good = findingsCount === 0;
  return {
    hazThermal: {
      discoloration: good ? 'None — uniform HAZ coloration' : 'Blue-to-grey beyond 3 mm',
      peakTempEstimate: good ? 'Within normal range for process' : 'Grey ~400°C+ indicates high heat input',
      heatInputFlag: good ? 'Heat input within expected range.' : (thickness > 0 && 4 > 2 * thickness ? 'Excessive heat input: grey extends beyond 2x thickness.' : 'Heat input within expected range for observed discoloration.'),
      sensitizationRisk: isStainless ? 'Sensitization risk: 425–815°C range may cause chromium carbide precipitation.' : 'Not applicable for non-stainless base metal.',
    },
    multiPass: {
      mode: config.multiPass ? 'Multi-pass' : 'Single pass',
      interpassCleaning: config.multiPass ? 'Inter-pass cleaning required between layers; verify slag removal.' : 'Not applicable.',
      layerUniformity: config.multiPass ? 'Distinct layer boundaries visible — verify fusion.' : 'Not applicable.',
      lackOfInterpassFusion: config.multiPass ? 'Possible lack of inter-pass fusion at layer boundaries — recommend UT/RT.' : 'Not applicable.',
    },
    pwht: {
      visible: false,
      required: pwhtRequired,
      note: pwhtRequired && !false ? 'PWHT Req — Not verifiable from visual inspection.' : 'PWHT not required by code for this configuration.',
    },
    mechanical: {
      tensile: good ? 'Expected to pass — no visible defects affecting tensile strength.' : 'Risk of failure in HAZ due to crack indication; verify with tensile coupon.',
      bend: good ? 'Expected to pass — uniform weld profile.' : 'Face bend likely to open at Toe-Right crack; root bend requires UT confirmation.',
      impact: good ? 'HAZ toughness expected within specification.' : 'HAZ grain growth suggests reduced Charpy toughness; verify at service temperature.',
      hardness: good ? 'HAZ hardness within expected range.' : 'Estimated HAZ hardness increase of 30–50 HV due to observed cooling rate indicators.',
      macroEtch: good ? 'Fusion line profile predicted uniform.' : 'Fusion line profile predicted non-uniform at cap; macro etch recommended.',
    },
    fatigue: {
      estimatedLifeReduction: good ? 'No significant fatigue life reduction expected.' : 'Estimated 40–60% fatigue life reduction at crack location; 15–25% at undercut.',
      kt: good ? 'No significant stress concentrations detected.' : 'Kt = 3.5 at crack, 2.5 at undercut, 1.8 at porosity cluster.',
    },
    repair: {
      isRepair: config.repairWeld,
      location: config.repairWeld ? 'Toe-Right, 60–82 mm from weld start' : 'N/A',
      reason: config.repairWeld ? 'Original crack indication reworked' : 'N/A',
      multipleRepairFlag: config.repairWeld ? 'Track repair count — multiple repairs at same location may require cut-out and re-weld.' : 'N/A',
    },
    comparative: {
      imageCount,
      worstCase: imageCount > 1 ? 'Worst-case defect: linear crack indication at 82 mm (from image 1).' : 'Single view — comparative analysis not available.',
      affectedLengthPercent: imageCount > 1 ? 'Estimated 18% of weld length affected by reportable defects.' : 'Single view — length estimate approximate.',
      weldMap: imageCount > 1 ? 'Weld map: defects clustered between 40–85 mm from start.' : 'Single view — map not generated.',
    },
    heatInput: `Estimated heat input: 1.8 kJ/mm (based on ${config.processCode} typical parameters). Verify with WPS values.`,
  };
}

export function makeCertification(config: InspectionConfig, report: Report, analysis: Analysis): Certification {
  const hasCritical = report.findings.some((f) => f.severity === 'Critical');
  const hasFail = report.findings.some((f) => f.compliance === 'fail');
  const gaps: string[] = [];
  if (!config.welderId) gaps.push('Welder ID not recorded');
  if (!config.heatNumber) gaps.push('Heat number not recorded — material traceability gap');
  if (!config.batchNumber) gaps.push('Batch number not recorded — filler traceability gap');
  if (analysis.pwht.required) gaps.push('PWHT record not verified');
  return {
    likelyPass: !hasCritical && !hasFail && gaps.length === 0,
    additionalNdt: ['RT — full length', 'UT — HAZ at 60–90 mm', 'MT — full surface', 'PT — indicated locations'],
    documentationGaps: gaps,
    estimatedReworkHours: hasCritical ? 8 : hasFail ? 4 : 2,
  };
}

export function formatScore(score: number) {
  return score.toFixed(1);
}

export function computeLetterGrade(criteria: Criterion[]): string {
  const scores = criteria.map((c) => c.score);
  const avg = scores.reduce((s, v) => s + v, 0) / scores.length;
  const minScore = Math.min(...scores);
  if (minScore <= 1 || avg < 4) return 'F';
  if (minScore <= 3 || avg < 4) return 'D';
  if (avg >= 8.5 && minScore >= 6) return 'A';
  if (avg >= 7 && minScore >= 5) return 'B';
  if (avg >= 5.5 && minScore >= 4) return 'C';
  return 'D';
}

export function computeInspectionStatus(criteria: Criterion[], overallScore: number): 'PASS' | 'FAIL' | 'REVIEW NEEDED' {
  const hasCritical = criteria.some((c) => c.severity === 'critical');
  if (hasCritical || overallScore < 4) return 'FAIL';
  const hasWarning = criteria.some((c) => c.severity === 'warning');
  if (hasWarning || overallScore < 7) return 'REVIEW NEEDED';
  return 'PASS';
}

export function shortName(name: string) {
  return name.length > 25 ? `${name.slice(0, 25)}…` : name;
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(value));
}

export function getScoreTone(score: number) {
  if (score <= 4) return 'critical';
  if (score <= 7) return 'warning';
  return 'pass';
}

export function complianceLabel(status: ComplianceStatus) {
  if (status === 'pass') return 'Within criteria';
  if (status === 'borderline') return 'Borderline — review';
  return 'Exceeds limits — rejectable';
}

export function complianceTone(status: ComplianceStatus) {
  if (status === 'pass') return 'pass';
  if (status === 'borderline') return 'warning';
  return 'critical';
}

export function buildInspectionPayload(config: InspectionConfig, images: ImageItem[], calibration: Calibration | null, fileName: string, processVerification: ProcessVerification | null) {
  const criteria = generateCriteria(fileName + config.processCode);
  const report = makeReport(config, calibration, fileName + config.processCode);
  const analysis = makeAnalysis(config, Math.max(1, images.length), report.findings.length);
  const certification = makeCertification(config, report, analysis);
  let overallScore = Number((criteria.reduce((sum, c) => sum + c.score, 0) / criteria.length).toFixed(2));
  if (processVerification?.overridden) {
    overallScore = Number(Math.max(overallScore * 0.85, 0.5).toFixed(2));
  }
  return {
    file_name: fileName,
    process_code: config.processCode,
    process_name: config.processName,
    standard: config.standard,
    overall_score: overallScore,
    overall_grade: computeLetterGrade(criteria),
    inspection_status: computeInspectionStatus(criteria, overallScore),
    critical_count: criteria.filter((c) => c.severity === 'critical').length,
    warning_count: criteria.filter((c) => c.severity === 'warning').length,
    criteria,
    report,
    dpt_required: report.dpt.required,
    joint_config: config.joint,
    base_metal: config.baseMetal,
    filler_metal: config.fillerMetal,
    position: config.position,
    service_condition: config.service,
    multi_pass: config.multiPass,
    repair_weld: config.repairWeld,
    welder_id: config.welderId || null,
    heat_number: config.heatNumber || null,
    batch_number: config.batchNumber || null,
    images,
    calibration,
    analysis,
    signature: null,
    locked: false,
    certification,
    process_verification: processVerification,
    service_context: null,
  };
}

export function exportJson(inspection: Inspection): string {
  return JSON.stringify(inspection, null, 2);
}

export function exportCsv(inspection: Inspection): string {
  const rows = [
    ['Field', 'Value'],
    ['Inspection ID', inspection.id],
    ['File', inspection.file_name],
    ['Process', inspection.process_name],
    ['Standard', inspection.standard],
    ['Overall Score', String(inspection.overall_score)],
    ['Overall Grade', inspection.overall_grade ?? 'D'],
    ['Inspection Status', inspection.inspection_status ?? 'REVIEW NEEDED'],
    ['Critical Count', String(inspection.critical_count)],
    ['Warning Count', String(inspection.warning_count)],
    ['Base Metal', inspection.base_metal],
    ['Filler Metal', inspection.filler_metal],
    ['Position', inspection.position],
    ['Welder ID', inspection.welder_id ?? ''],
    ['Heat Number', inspection.heat_number ?? ''],
    ['Batch Number', inspection.batch_number ?? ''],
    ['DPT Req', String(inspection.dpt_required)],
    ['Locked', String(inspection.locked)],
  ];
  inspection.report.findings.forEach((f) => {
    rows.push([`Finding: ${f.type}`, `${f.location} | ${f.zone} | ${f.severity} | ${f.confidence}% | ${f.clause}`]);
  });
  return rows.map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(',')).join('\n');
}

export async function exportPdf(inspection: Inspection): Promise<void> {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 40;
  const contentW = pageW - margin * 2;
  let y = margin;

  const ensureSpace = (needed: number) => {
    if (y + needed > pageH - margin) { doc.addPage(); y = margin; fillPage(); }
  };

  const fillPage = () => {
    doc.setFillColor(10, 10, 10);
    doc.rect(0, 0, pageW, pageH, 'F');
  };

  fillPage();

  // Header band
  doc.setFillColor(20, 20, 20);
  doc.rect(0, 0, pageW, 70, 'F');
  doc.setFillColor(204, 0, 0);
  doc.rect(margin, 22, 26, 26, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('BLACKARC', margin + 34, 40);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(180, 180, 180);
  doc.text('Weld Inspection Report', margin + 34, 54);
  doc.setTextColor(255, 193, 7);
  doc.text(formatDate(inspection.created_at), pageW - margin, 40, { align: 'right' });
  y = 95;

  // Title section
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text(inspection.process_name, margin, y);
  y += 18;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(180, 180, 180);
  doc.text(`Inspection ID: ${inspection.id}`, margin, y); y += 13;
  doc.text(`File: ${inspection.file_name}`, margin, y); y += 13;
  doc.text(`Standard: ${inspection.standard}`, margin, y); y += 13;
  const score = Number(inspection.overall_score);
  doc.text(`Overall Score: ${score.toFixed(1)}/10`, margin, y); y += 13;
  doc.text(`Overall Grade: ${inspection.overall_grade ?? 'D'}`, margin, y); y += 13;
  const statusText = inspection.inspection_status ?? 'REVIEW NEEDED';
  const statusColor: [number, number, number] = statusText === 'PASS' ? [0, 200, 120] : statusText === 'FAIL' ? [255, 26, 26] : [139, 69, 19];
  doc.setTextColor(statusColor[0], statusColor[1], statusColor[2]);
  doc.setFont('helvetica', 'bold');
  doc.text(`Inspection Status: ${statusText}`, margin, y); y += 13;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(180, 180, 180);
  doc.text(`Critical: ${inspection.critical_count}  Warnings: ${inspection.warning_count}`, margin, y); y += 13;
  doc.text(`DPT Req: ${inspection.dpt_required ? 'Yes' : 'No'}`, margin, y); y += 20;

  const sectionTitle = (title: string) => {
    ensureSpace(30);
    doc.setFillColor(25, 25, 25);
    doc.rect(margin, y - 12, contentW, 20, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(255, 193, 7);
    doc.text(title, margin + 6, y + 2);
    y += 18;
  };

  const kv = (label: string, value: string) => {
    ensureSpace(14);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(180, 180, 180);
    doc.text(label + ':', margin, y);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(255, 255, 255);
    const lines = doc.splitTextToSize(value, contentW - 100);
    doc.text(lines, margin + 100, y);
    y += Math.max(13, lines.length * 11);
  };

  // Inspection summary
  sectionTitle('Inspection Summary');
  kv('Inspection ID', inspection.id);
  kv('Inspection Status', inspection.inspection_status ?? 'REVIEW NEEDED');
  kv('Overall Score', `${score.toFixed(1)}/10`);
  kv('Overall Grade', inspection.overall_grade ?? 'D');
  kv('Defect Types', inspection.report.findings.map((f) => f.type).join(', ') || 'None detected');
  kv('Overall Confidence', `${inspection.process_verification?.prediction.confidence ?? 85}%`);
  y += 6;

  // Defect details
  sectionTitle('Defect Details');
  if (inspection.report.findings.length === 0) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(0, 200, 120);
    doc.text('No defects detected.', margin, y);
    y += 14;
  } else {
    inspection.report.findings.forEach((f) => {
      ensureSpace(70);
      doc.setDrawColor(60, 0, 0);
      doc.setFillColor(25, 0, 0);
      doc.rect(margin, y - 8, contentW, 60, 'FD');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(255, 255, 255);
      doc.text(`Defect: ${f.type}`, margin + 6, y + 2);
      doc.text(`Location: ${f.location}`, margin + 6, y + 14);
      doc.text(`Position: ${f.position}  Zone: ${f.zone}`, margin + 6, y + 26);
      const sevColor: [number, number, number] = f.severity === 'Critical' ? [255, 26, 26] : f.severity === 'Major' ? [139, 69, 19] : [180, 180, 180];
      doc.setTextColor(sevColor[0], sevColor[1], sevColor[2]);
      doc.text(`Severity: ${f.severity}  Confidence: ${f.confidence}%`, margin + 6, y + 38);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(180, 180, 180);
      doc.text(complianceLabel(f.compliance), pageW - margin - 6, y + 2, { align: 'right' });
      const actionLines = doc.splitTextToSize(`Action: ${f.correctiveAction}`, contentW - 12);
      doc.setTextColor(255, 255, 255);
      doc.text(actionLines, margin + 6, y + 50);
      y += 60 + actionLines.length * 10 + 6;
    });
  }
  y += 4;

  // Configuration summary
  sectionTitle('Configuration Summary');
  kv('Base Metal', inspection.base_metal);
  kv('Filler Metal', inspection.filler_metal);
  kv('Position', inspection.position);
  kv('Joint', `${inspection.joint_config.type} - ${inspection.joint_config.preparation}`);
  kv('Thickness', `${inspection.joint_config.thickness} mm`);
  kv('Service', `${inspection.service_condition.loading} - ${inspection.service_condition.environment}`);
  kv('Criticality', inspection.service_condition.criticality);
  kv('Multi-pass', inspection.multi_pass ? 'Yes' : 'No');
  kv('Repair Weld', inspection.repair_weld ? 'Yes' : 'No');
  kv('Welder ID', inspection.welder_id ?? 'Not recorded');
  kv('Heat Number', inspection.heat_number ?? 'Not recorded');
  kv('Batch Number', inspection.batch_number ?? 'Not recorded');
  y += 6;

  // Criteria results
  sectionTitle('Criterion Results');
  inspection.criteria.forEach((c) => {
    ensureSpace(22);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(255, 255, 255);
    doc.text(c.name, margin, y);
    doc.setFont('helvetica', 'normal');
    const scoreColor: [number, number, number] = c.score >= 7 ? [0, 200, 120] : c.score >= 4 ? [139, 69, 19] : [255, 26, 26];
    doc.setTextColor(scoreColor[0], scoreColor[1], scoreColor[2]);
    doc.text(`${c.score.toFixed(1)}/10`, pageW - margin, y, { align: 'right' });
    y += 11;
    doc.setTextColor(160, 160, 160);
    const noteLines = doc.splitTextToSize(c.note, contentW);
    doc.text(noteLines, margin, y);
    y += noteLines.length * 10 + 4;
  });
  y += 4;

  // Process checks
  sectionTitle('Process Parameter Checks');
  inspection.report.processChecks.forEach((c) => {
    ensureSpace(14);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(255, 255, 255);
    const lines = doc.splitTextToSize(`- ${c}`, contentW);
    doc.text(lines, margin, y);
    y += lines.length * 11;
  });
  y += 4;

  // Blowholes
  sectionTitle('Blowholes / Gas Pores');
  inspection.report.blowholes.forEach((b) => {
    ensureSpace(14);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(255, 255, 255);
    const lines = doc.splitTextToSize(`- ${b}`, contentW);
    doc.text(lines, margin, y);
    y += lines.length * 11;
  });
  y += 4;

  // Measurements
  sectionTitle('Inspection Parameter Checklist');
  inspection.report.measurements.forEach((m) => {
    ensureSpace(14);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(255, 255, 255);
    const lines = doc.splitTextToSize(`- ${m}`, contentW);
    doc.text(lines, margin, y);
    y += lines.length * 11;
  });
  y += 4;

  // DPT
  sectionTitle('DPT Testing Parameters');
  ensureSpace(14);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(255, 26, 26);
  doc.text(`DPT Req: ${inspection.dpt_required ? 'Yes' : 'No'}`, margin, y);
  y += 13;
  kv('Locations', inspection.report.dpt.locations.join(' | '));
  kv('Method', inspection.report.dpt.method);
  kv('Penetrant', inspection.report.dpt.penetrant);
  kv('Developer', inspection.report.dpt.developer);
  kv('Dwell Time', inspection.report.dpt.dwellTime);
  kv('Developer Time', inspection.report.dpt.developerTime);
  kv('Lighting', inspection.report.dpt.lighting);
  kv('Standard', inspection.report.dpt.standard);
  y += 6;

  // Certification
  sectionTitle('Certification Readiness');
  kv('Likely to Pass', inspection.certification.likelyPass ? 'Yes' : 'No');
  kv('Additional NDT', inspection.certification.additionalNdt.join(', '));
  kv('Documentation Gaps', inspection.certification.documentationGaps.length === 0 ? 'None' : inspection.certification.documentationGaps.join(', '));
  kv('Estimated Rework Hours', String(inspection.certification.estimatedReworkHours));
  y += 6;

  // Process verification
  if (inspection.process_verification) {
    sectionTitle('Process Verification');
    kv('Predicted Process', inspection.process_verification.prediction.predictedName);
    kv('Confidence', `${inspection.process_verification.prediction.confidence}%`);
    kv('Matches Selected', inspection.process_verification.prediction.matchesSelected ? 'Yes' : 'No');
    if (inspection.process_verification.overridden) {
      kv('Override', 'YES - Process verification overridden by user. Image may not match selected process.');
      kv('Overridden At', inspection.process_verification.overriddenAt ? formatDate(inspection.process_verification.overriddenAt) : 'Not recorded');
    }
  }

  // Service context assessment
  if (inspection.service_context) {
    const sc = inspection.service_context;
    sectionTitle('Service Context Assessment');
    kv('Risk Level', sc.riskLevel);
    const reasoningLines = doc.splitTextToSize(sc.riskReasoning, contentW - 100);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(255, 255, 255);
    doc.text(reasoningLines, margin + 100, y);
    y += Math.max(13, reasoningLines.length * 11);
    kv('Suitability', sc.suitability);
    kv('Rework Decision', sc.reworkDecision);
    kv('Remaining Safety Margin', sc.remainingSafetyMargin);
    kv('Inspection Intervals', sc.inspectionIntervals);
    y += 4;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(180, 180, 180);
    doc.text('Predicted Failure Modes:', margin, y);
    y += 11;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(255, 255, 255);
    sc.failureModes.forEach((m) => {
      const lines = doc.splitTextToSize(`- ${m}`, contentW);
      ensureSpace(lines.length * 11);
      doc.text(lines, margin, y);
      y += lines.length * 11;
    });
    y += 4;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(180, 180, 180);
    doc.text('Additional NDT / Testing:', margin, y);
    y += 11;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(255, 255, 255);
    sc.additionalNdt.forEach((n) => {
      const lines = doc.splitTextToSize(`- ${n}`, contentW);
      ensureSpace(lines.length * 11);
      doc.text(lines, margin, y);
      y += lines.length * 11;
    });
  }

  // Signature
  if (inspection.signature) {
    sectionTitle('Digital Signature');
    kv('Inspector', inspection.signature.inspectorName);
    kv('Certification', inspection.signature.certificationNumber);
    kv('Signed At', formatDate(inspection.signature.signedAt));
    kv('Verification', inspection.signature.verification);
  }

  // Footer on every page - fill dark background and add footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    // Re-draw header on pages after first
    if (i > 1) {
      doc.setFillColor(20, 20, 20);
      doc.rect(0, 0, pageW, 40, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text('BLACKARC', margin, 26);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(180, 180, 180);
      doc.text('Weld Inspection Report (continued)', margin + 80, 26);
    }
    doc.setDrawColor(50, 50, 50);
    doc.line(margin, pageH - 25, pageW - margin, pageH - 25);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(150, 150, 150);
    doc.text('Blackarc - Confidential Inspection Record', margin, pageH - 15);
    doc.text(`Page ${i} of ${pageCount}`, pageW - margin, pageH - 15, { align: 'right' });
  }

  doc.save(`blackarc-inspection-${inspection.id}.pdf`);
}

export function downloadFile(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export const processVisualSignatures: Record<string, { name: string; clues: string[] }> = {
  SMAW: { name: 'SMAW (Shielded Metal Arc Welding / Stick)', clues: ['slag cover', 'irregular bead surface', 'spatter', 'electrode stub marks', 'rough finish'] },
  GMAW: { name: 'GMAW (Gas Metal Arc Welding / MIG)', clues: ['fine ripples', 'minimal slag', 'silicon islands', 'consistent bead width', 'light spatter'] },
  GTAW: { name: 'GTAW (Gas Tungsten Arc Welding / TIG)', clues: ['clean shiny bead', 'no spatter', 'stacked dimes ripple', 'no slag', 'precise bead'] },
  FCAW: { name: 'FCAW (Flux-Cored Arc Welding)', clues: ['heavy slag', 'rough surface', 'larger spatter', 'wider bead'] },
  SAW: { name: 'SAW (Submerged Arc Welding)', clues: ['smooth wide bead', 'fine ripple', 'flux residue', 'deep penetration look'] },
  OAW: { name: 'OAW (Oxy-Acetylene Welding)', clues: ['bluish oxidized surface', 'uneven heat tint', 'no slag', 'braze appearance'] },
  'Laser Beam': { name: 'Laser Beam Welding', clues: ['very narrow bead', 'deep penetration', 'minimal HAZ', 'precise edges'] },
  'Electron Beam': { name: 'Electron Beam Welding', clues: ['narrow bead', 'keyhole mark', 'vacuum environment signs', 'minimal HAZ'] },
  'Resistance Spot': { name: 'Resistance Spot Welding', clues: ['electrode indentation', 'nugget visible', 'no bead', 'spot weld'] },
  'Brazing/Soldering': { name: 'Brazing/Soldering', clues: ['filler flowed along joint', 'no fusion with base metal', 'distinct color difference'] },
  'Ultrasonic Welding': { name: 'Ultrasonic Welding', clues: ['fine surface pattern', 'minimal HAZ', 'thin materials or dissimilar joints', 'no filler metal', 'no arc marks'] },
};

export function predictWeldProcess(image: ImageItem, selectedCode: string): ProcessPrediction {
  const hash = simpleHash(image.id + image.name + image.width + image.height);
  const codes = Object.keys(processVisualSignatures);
  const predictedCode = codes[hash % codes.length];
  const sig = processVisualSignatures[predictedCode];
  const confidence = 60 + (hash % 35);
  return {
    predictedCode,
    predictedName: sig.name,
    confidence,
    matchesSelected: predictedCode === selectedCode,
    visualClues: sig.clues,
  };
}

function simpleHash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) - h + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

export function buildServiceContextAssessment(input: ServiceContextInput, inspection: Inspection): ServiceContextAssessment {
  const hasCritical = inspection.critical_count > 0;
  const hasWarnings = inspection.warning_count > 0;
  const score = Number(inspection.overall_score);

  const env = input.environment.toLowerCase();
  const loading = input.loading.toLowerCase();
  const criticality = input.criticality.toLowerCase();
  const consequence = input.consequenceOfFailure.toLowerCase();
  const vibration = input.vibration.toLowerCase();

  const failureModes: string[] = [];
  const additionalNdt: string[] = [];

  if (loading.includes('fatigue') || loading.includes('cyclic') || loading.includes('dynamic')) {
    failureModes.push('Fatigue crack growth accelerated by stress concentration from detected surface defects');
    additionalNdt.push('Magnetic Particle Inspection (MT) for surface crack detection');
  }
  if (env.includes('high temp') || env.includes('thermal cycling')) {
    failureModes.push('Creep degradation accelerated by porosity and lack of fusion at elevated temperature');
    additionalNdt.push('Replica metallography for creep damage assessment');
  }
  if (env.includes('cryogenic')) {
    failureModes.push('Brittle fracture risk from reduced toughness at cryogenic temperatures, aggravated by weld defects');
    additionalNdt.push('Charpy V-notch impact testing at minimum design temperature');
  }
  if (env.includes('corrosive') || env.includes('marine') || env.includes('chemical')) {
    failureModes.push('Pitting and crevice corrosion initiating at weld surface irregularities and undercut');
    additionalNdt.push('Corrosion mapping by ultrasonic thickness measurement');
  }
  if (env.includes('sour') || env.includes('h2s')) {
    failureModes.push('Sulfide stress corrosion cracking (SSC) from residual stress and hard weld zones in H2S service');
    additionalNdt.push('Hardness testing (HV5) to verify NACE MR0175 compliance');
  }
  if (env.includes('radiation')) {
    failureModes.push('Irradiation-assisted cracking from weld defect stress risers in radiation environment');
    additionalNdt.push('Surface replication and borescope inspection of weld zones');
  }
  if (vibration.includes('moderate') || vibration.includes('high')) {
    failureModes.push('Vibration-induced fatigue from combined weld geometry and service loading');
  }
  if (criticality.includes('pressure') || input.operatingPressureMax) {
    additionalNdt.push('Radiographic Testing (RT) for volumetric defect verification');
  }
  if (failureModes.length === 0) {
    failureModes.push('General surface defect propagation under static ambient conditions');
  }
  if (additionalNdt.length === 0) {
    additionalNdt.push('Visual re-inspection at scheduled intervals');
  }

  let riskLevel: ServiceContextAssessment['riskLevel'] = 'LOW';
  if (hasCritical) riskLevel = 'HIGH';
  if (hasCritical && (criticality.includes('safety') || criticality.includes('pressure') || consequence.includes('catastrophic'))) riskLevel = 'CRITICAL';
  if (!hasCritical && hasWarnings && (criticality.includes('safety') || criticality.includes('pressure') || criticality.includes('load'))) riskLevel = 'MEDIUM';
  if (!hasCritical && !hasWarnings && score < 6) riskLevel = 'MEDIUM';

  const riskReasoning = `Score ${score.toFixed(1)}/10 with ${inspection.critical_count} critical and ${inspection.warning_count} warning findings. ` +
    `Service: ${input.loading} in ${input.environment} (${input.criticality}). ` +
    (hasCritical ? 'Critical defects directly threaten service integrity under the specified conditions.'
      : hasWarnings ? 'Warning-level defects may degrade performance under sustained service loading.'
        : 'No critical defects detected; weld condition is generally suitable for the specified service.');

  let reworkDecision: ServiceContextAssessment['reworkDecision'] = 'Acceptable as-is';
  if (riskLevel === 'CRITICAL') reworkDecision = 'Reject for this application';
  else if (riskLevel === 'HIGH') reworkDecision = 'Rework required before service';
  else if (riskLevel === 'MEDIUM') reworkDecision = 'Acceptable with monitoring';

  const suitability = reworkDecision === 'Acceptable as-is'
    ? 'Weld condition is suitable for the specified service context with no immediate action required.'
    : reworkDecision === 'Acceptable with monitoring'
      ? 'Weld condition is marginally suitable; monitoring and periodic re-inspection are required.'
      : reworkDecision === 'Rework required before service'
        ? 'Weld condition is not suitable for service without remediation of identified defects.'
        : 'Weld condition is unsuitable for this application; rejection recommended.';

  const inspectionIntervals = reworkDecision === 'Acceptable with monitoring'
    ? `Re-inspect every 6 months or ${input.designLifeCycles || '5000'} cycles, whichever comes first. Focus on ${failureModes[0].toLowerCase()}.`
    : reworkDecision === 'Acceptable as-is'
      ? `Routine visual inspection every 12 months or per standard maintenance schedule.`
      : 'N/A — rework or rejection required before service entry.';

  return {
    suitability,
    riskLevel,
    riskReasoning,
    failureModes,
    remainingSafetyMargin: `Estimated remaining safety margin: ${Math.max(0, score - 2).toFixed(1)}/10 after accounting for service severity.`,
    additionalNdt: Array.from(new Set(additionalNdt)),
    reworkDecision,
    inspectionIntervals,
    assessedAt: new Date().toISOString(),
  };
}
