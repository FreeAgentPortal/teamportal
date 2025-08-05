import IUser from "./User";

export interface IScoutProfile {
  _id: string;
  userId: string;
  displayName?: string; // Full name of the scout
  contactNumber?: string; // Contact number of the scout
  email?: string; // Email address of the scout
  bio?: string; // Short biography or description of the scout
  favoritedAthletes?: string[]; // Array of athlete IDs that the scout has favorited
  permissions?: string[]; // Array of permissions assigned to the scout
  isActive?: boolean; // Whether the scout profile is active or not, soft delete flag
  teams?: string[]; // Teams associated with the scout
  user: IUser;
  sports?: string[]; // Sports that the scout specializes in
  leagues?: string[]; // Leagues that the scout covers
  createdAt: Date; // Timestamp when the profile was created
  updatedAt: Date; // Timestamp when the profile was last updated
}
