import PageLayout from '@/layout/page/Page.layout';
import { navigation } from '@/data/navigation';
import { Metadata } from 'next';
import Athlete from '@/views/opportunity_hub/athlete/Athlete.view';

export const metadata: Metadata = {
  title: 'FAP | Team Athlete Search',
  description: 'Search for athletes in the FAP system',
};

export default function Home() {
  return (
    <PageLayout pages={[navigation().opportunities_hub.links.athletes]}>
      <Athlete />
    </PageLayout>
  );
}
