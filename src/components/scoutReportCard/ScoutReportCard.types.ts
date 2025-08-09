import { IScoutReport } from "@/types/IScoutReport";

export interface ScoutReportCardProps {
  report: IScoutReport;
  onClick?: () => void;
}
