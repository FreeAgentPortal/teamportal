import { QueryClient } from '@tanstack/react-query';
import NewsCard from './components/cards/newsCard/NewsCard.component';
import RecentAthleteSignups from './components/cards/recentAthletes/RecentAthleteSignups.component';
export interface CardComponentProps {
  data: any; // or AthleteProfile | TeamProfile | etc when you type it
}
export interface Card {
  title: string;
  component: (props: CardComponentProps) => React.ReactNode;
  order?: number; // lower number = higher priority
  size?: number; // NEW: size = column weight (1 = default, 2 = double-width, 3 = triple-width)
  gridKey: string;
  isCard?: boolean;
  hideIf?: ((params: { profile: any; queryClient: QueryClient }) => boolean) | boolean;
}

export default [
  {
    title: 'Related News',
    component: ({ data }: CardComponentProps) => <NewsCard />,
    gridKey: 'news-content',
    order: 2,
    size: 3,
    isCard: true,
    // hideIf: DashboardRulesEngine.noNews,
  },
  {
    title: 'Recent Athlete Signups',
    component: ({ data }: CardComponentProps) => <RecentAthleteSignups />,
    gridKey: 'recent-athlete-signups',
    order: 5,
    size: 3,
    isCard: true,
    // hideIf: DashboardRulesEngine.noRecentAthletes,
  },
] as Card[];
