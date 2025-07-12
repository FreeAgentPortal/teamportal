import PageLayout from '@/layout/page/Page.layout';
import { navigation } from '@/data/navigation';
import { Metadata } from 'next';
import AthleteDetails from '@/views/opportunity_hub/athlete/athleteDetails/AthleteDetails.view';
import axios from '@/utils/axios';

export const metadata: Metadata = {
  title: 'FAP | Athlete Details',
  description: 'Details for a specific athlete in the FAP system',
};

export default async function Home({ params }: { params: { id: string } }) {
  // Fetch athlete data
  const id = params.id; 
  // Pre-fetch the first page of blogs for static generation
  const athleteData = await fetchAthleteData(id);
  return (
    <PageLayout pages={[navigation().opportunities_hub.links.athletes]}>
        <AthleteDetails athlete={athleteData as any} />
    </PageLayout>
  );
}

const fetchAthleteData = async (id: string) => {
  try {
    const { data } = await axios.get(`/athlete/${id}`);
    return data.payload;
  } catch (error) {
    console.error('Error fetching athlete data:', error);
    return null;
  }
};
