import AthleteCard from '@/components/athleteCard/AthleteCard.component';
import useApiHook from '@/hooks/useApi';
import React from 'react';
import styles from './RecentAthleteSignups.module.scss';
import Link from 'next/link';

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
      {data?.payload?.map((athlete: any) => (
        <Link key={athlete._id} href={`/athletes/${athlete._id}`} passHref>
          <AthleteCard key={athlete._id} athlete={athlete} variant="compact" />
        </Link>
      ))}
    </div>
  );
};

export default RecentAthleteSignups;
