import User from './User';

export interface TeamMember {
  user: User;
  role: string;
}

export interface Benefit {
  title: string;
  description: string;
}
export interface ITeamType {
  coachName: string;
  _id: string; // Unique identifier for the team
  name: string;
  email?: string;
  phone?: string;
  logoUrl?: string;
  slug?: string; // Optional slug for URL-friendly team name
  abbreviation?: string; // e.g., "SF" for San Francisco 49ers
  shortDisplayName?: string; // e.g., "49ers"
  positionsNeeded?: string[]; // e.g., ["QB", "WR", "OL"]
  color: string; // e.g., "#AA0000" for team color
  alternateColor?: string; // e.g., "#FFFFFF" for alternate color
  isActive?: boolean; // Whether the team is currently active
  isAllStar?: boolean; // Whether the team is an All-Star team
  logos?: [{ href: string; alt: string; width: number; height: number }]; // Array of logo objects with href and alt text
  links?: [{ language: string; href: string; text: string; shortText: string }];
  location: string; // e.g., "CA", "TX"
  bio: string;
  history: string;
  benefits: [Benefit];
  linkedUsers: TeamMember[]; // References to users with access
  alertsEnabled: boolean;
  verifiedDomain?: string; // e.g., "example.edu"
  openToTryouts?: boolean; // Whether the team is open to new athletes
  createdAt: Date;
  updatedAt: Date;
}
