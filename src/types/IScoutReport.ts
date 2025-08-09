import { IAthlete } from "./IAthleteType";
import { IScoutProfile } from "./IScoutProfile";

export interface IRatingField {
  score: number;
  comments?: string;
}

export interface IScoutReport {
  _id: string;
  athleteId: string;
  scoutId: string;
  scout: IScoutProfile;
  sport: string;
  league: string;
  reportType: "game" | "evaluation" | "camp" | "combine" | "interview" | "other";
  diamondRating: number; // number set automatically by aggregation
  ratingBreakdown: Record<string, IRatingField>; // Dynamic rating fields
  observations?: string; // detailed notes on performance
  strengths?: string[]; // key strengths observed
  weaknesses?: string[]; // areas for improvement
  verifiedMetrics?: string[]; // metrics that were verified during the report
  unverifiedMetrics?: string[]; // metrics that were not verified
  recommendations?: string; // suggestions for improvement

  //metadata
  tags?: string[]; // tags for categorization
  isPublic?: boolean; // whether the report is public or private, can teams see it? or does it only affect the athlete's rating?
  isFinalized?: boolean; // whether the report is finalized or still draft
  isDraft?: boolean; // whether the report is a draft or ready to be processed

  // actionable fields
  status?: "pending" | "approved" | "denied"; // current status of the report
  message?: string; // message from admin on approval/denial
  athlete?: IAthlete;
  // timestamps
  createdAt: Date;
  updatedAt: Date;
}
