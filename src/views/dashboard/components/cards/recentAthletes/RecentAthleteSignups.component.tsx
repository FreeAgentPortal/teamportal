import useApiHook from '@/hooks/useApi';
import styles from './RecentAthleteSignups.module.scss';
import AthleteList from '@/components/athleteList/AthleteList.component';

const RecentAthleteSignups = () => {
  // find results from the last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  // const to use for removing athletes who havent completed their profile
  const athleteFilter = `profileImageUrl;{"$exists": true}|metrics;{"$exists": true}|measurements;{"$exists": true}|isActive;true`;

  const { data } = useApiHook({
    url: '/profiles/athlete',
    method: 'GET',
    key: 'recent-athlete-signups',
    filter: `createdAt;{"$gte":"${thirtyDaysAgo.toISOString()}"}|${athleteFilter}`,
    limit: 5,
  }) as any;
  return (
    <div className={styles.container}>
      <AthleteList data={data?.payload} isTable={true} minimal />
    </div>
  );
};

export default RecentAthleteSignups;
