import { ISupport } from "./ISupport";
import IUser from "./User";

export interface ISupportMessage {
  _id: string;
  ticket: ISupport;
  user: string;
  sender: IUser;
  message: string;
  attachments: {
    filename: string;
    url: string;
  }[];
  createdAt: string;
  updatedAt: string;
}
