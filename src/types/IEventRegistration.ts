export const RegistrationStatus = {
  INTERESTED: 'interested', // light-weight "I'm watching this"
  APPLIED: 'applied', // submitted registration answers
  CONFIRMED: 'confirmed', // has a spot
  WAITLISTED: 'waitlisted',
  DECLINED: 'declined',
  NO_SHOW: 'no-show',
  ATTENDED: 'attended',
} as const;
export type RegistrationStatus = (typeof RegistrationStatus)[keyof typeof RegistrationStatus];

export interface IEventRegistration {
  _id: string;
  eventId: string;
  userId: string; // who is acting (athlete/agent/scout)
  role: 'athlete' | 'agent' | 'scout' | 'media';

  status: RegistrationStatus;
  profileId: {
    collection: 'AthleteProfile';
    id: string;
  };

  // answers to registration questions
  answers?: Array<{
    key: string;
    label: string;
    answer: string | number | boolean | string[];
  }>;

  // populated user profile
  profile?: {
    _id: string;
    fullName: string;
    email: string;
    profileImageUrl?: string;
  };

  // server-side stamps
  createdAt: Date;
  updatedAt: Date;
}
