import PageLayout from '@/layout/page/Page.layout';
import { navigation } from '@/data/navigation';
import { Metadata } from 'next';
import AthleteDetails from '@/views/opportunity_hub/athlete/athleteDetails/AthleteDetails.view';
import axios from '@/utils/axios';
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const athlete = await fetchAthleteData(id);

  if (!athlete) {
    return {
      title: "Athlete not found",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return {
    title: `FAP | ${athlete.name} Details`,
    description: `Details for athlete ${athlete.name} in the FAP system`,
  };
};
 
export default async function Home({ params }: { params: Promise<{ id: string }>; }) {
  // Fetch athlete data
  const { id } = await params;
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
