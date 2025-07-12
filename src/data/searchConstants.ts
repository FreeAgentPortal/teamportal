// Football positions
export const FOOTBALL_POSITIONS = [
  { value: 'QB', label: 'Quarterback', category: 'Offense' },
  { value: 'RB', label: 'Running Back', category: 'Offense' },
  { value: 'FB', label: 'Fullback', category: 'Offense' },
  { value: 'WR', label: 'Wide Receiver', category: 'Offense' },
  { value: 'TE', label: 'Tight End', category: 'Offense' },
  { value: 'OT', label: 'Offensive Tackle', category: 'Offense' },
  { value: 'OG', label: 'Offensive Guard', category: 'Offense' },
  { value: 'C', label: 'Center', category: 'Offense' },
  { value: 'DE', label: 'Defensive End', category: 'Defense' },
  { value: 'DT', label: 'Defensive Tackle', category: 'Defense' },
  { value: 'LB', label: 'Linebacker', category: 'Defense' },
  { value: 'CB', label: 'Cornerback', category: 'Defense' },
  { value: 'S', label: 'Safety', category: 'Defense' },
  { value: 'K', label: 'Kicker', category: 'Special Teams' },
  { value: 'P', label: 'Punter', category: 'Special Teams' },
  { value: 'LS', label: 'Long Snapper', category: 'Special Teams' },
  { value: 'KR', label: 'Kick Returner', category: 'Special Teams' },
  { value: 'PR', label: 'Punt Returner', category: 'Special Teams' },
];

// Performance metrics with detailed configuration
export interface PerformanceMetric {
  key: string;
  label: string;
  unit: string;
  category: string;
  description?: string;
  defaultMin?: number;
  defaultMax?: number;
  step?: number;
}

export const PERFORMANCE_METRICS: PerformanceMetric[] = [
  // Combine Drills
  {
    key: 'fortyYardDash',
    label: '40 Yard Dash',
    unit: 'seconds',
    category: 'Combine Drills',
    description: 'Time to run 40 yards',
    defaultMin: 4.0,
    defaultMax: 6.0,
    step: 0.01,
  },
  {
    key: 'tenYardSplit',
    label: '10 Yard Split',
    unit: 'seconds',
    category: 'Combine Drills',
    description: 'Time to run first 10 yards of 40-yard dash',
    defaultMin: 1.0,
    defaultMax: 2.0,
    step: 0.01,
  },
  {
    key: 'twentyYardShuttle',
    label: '20 Yard Shuttle',
    unit: 'seconds',
    category: 'Combine Drills',
    description: 'Time to complete 20-yard shuttle run',
    defaultMin: 3.5,
    defaultMax: 5.5,
    step: 0.01,
  },
  {
    key: 'threeConeDrill',
    label: '3 Cone Drill',
    unit: 'seconds',
    category: 'Combine Drills',
    description: 'Time to complete 3-cone agility drill',
    defaultMin: 6.0,
    defaultMax: 8.5,
    step: 0.01,
  },
  {
    key: 'verticalJump',
    label: 'Vertical Jump',
    unit: 'inches',
    category: 'Combine Drills',
    description: 'Maximum vertical jump height',
    defaultMin: 20,
    defaultMax: 50,
    step: 0.5,
  },
  {
    key: 'broadJump',
    label: 'Broad Jump',
    unit: 'inches',
    category: 'Combine Drills',
    description: 'Maximum broad jump distance',
    defaultMin: 80,
    defaultMax: 140,
    step: 1,
  },
  {
    key: 'benchPressReps',
    label: 'Bench Press Reps',
    unit: 'reps',
    category: 'Combine Drills',
    description: 'Number of 225lb bench press repetitions',
    defaultMin: 5,
    defaultMax: 40,
    step: 1,
  },

  // Strength & Power
  {
    key: 'maxBench',
    label: 'Max Bench Press',
    unit: 'lbs',
    category: 'Strength & Power',
    description: 'Maximum bench press weight',
    defaultMin: 185,
    defaultMax: 500,
    step: 5,
  },
  {
    key: 'maxSquat',
    label: 'Max Squat',
    unit: 'lbs',
    category: 'Strength & Power',
    description: 'Maximum squat weight',
    defaultMin: 225,
    defaultMax: 700,
    step: 5,
  },
  {
    key: 'maxPowerClean',
    label: 'Max Power Clean',
    unit: 'lbs',
    category: 'Strength & Power',
    description: 'Maximum power clean weight',
    defaultMin: 135,
    defaultMax: 400,
    step: 5,
  },
  {
    key: 'gripStrength',
    label: 'Grip Strength',
    unit: 'lbs',
    category: 'Strength & Power',
    description: 'Maximum grip strength measurement',
    defaultMin: 80,
    defaultMax: 200,
    step: 1,
  },

  // Speed & Agility
  {
    key: 'sprintSpeed',
    label: 'Sprint Speed',
    unit: 'mph',
    category: 'Speed & Agility',
    description: 'Maximum sprinting speed',
    defaultMin: 15,
    defaultMax: 25,
    step: 0.1,
  },
  {
    key: 'topEndSpeed',
    label: 'Top End Speed',
    unit: 'mph',
    category: 'Speed & Agility',
    description: 'Maximum sustained running speed',
    defaultMin: 15,
    defaultMax: 25,
    step: 0.1,
  },
  {
    key: 'shuttleAgility',
    label: 'Shuttle Agility Rating',
    unit: 'score',
    category: 'Speed & Agility',
    description: 'Composite agility score (1-100)',
    defaultMin: 50,
    defaultMax: 100,
    step: 1,
  },
  {
    key: 'explosivenessScore',
    label: 'Explosiveness Score',
    unit: 'score',
    category: 'Speed & Agility',
    description: 'Composite explosiveness score (1-100)',
    defaultMin: 50,
    defaultMax: 100,
    step: 1,
  },
];

// Group metrics by category
export const METRICS_BY_CATEGORY = PERFORMANCE_METRICS.reduce((acc, metric) => {
  if (!acc[metric.category]) {
    acc[metric.category] = [];
  }
  acc[metric.category].push(metric);
  return acc;
}, {} as Record<string, PerformanceMetric[]>);

// Search frequency options
export const FREQUENCY_OPTIONS = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
];

// Owner type options
export const OWNER_TYPE_OPTIONS = [
  { value: 'team', label: 'Team' },
  { value: 'scout', label: 'Scout' },
  { value: 'agent', label: 'Agent' },
];

// Age range configuration
export const AGE_RANGE = {
  min: 16,
  max: 60,
  defaultMin: 18,
  defaultMax: 25,
  marks: {
    16: '16',
    18: '18',
    21: '21',
    25: '25',
    30: '30',
    35: '35',
    40: '40',
    45: '45',
    50: '50',
    55: '55',
    60: '60',
  },
};
