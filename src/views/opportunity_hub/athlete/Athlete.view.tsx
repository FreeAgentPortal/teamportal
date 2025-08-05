'use client';
import React from 'react';
import styles from './Athlete.module.scss';
import useApiHook from '@/hooks/useApi';
import SearchWrapper from '@/layout/searchWrapper/SearchWrapper.layout';
import { IAthlete } from '@/types/IAthleteType';
import AthleteCard from '../report/components/athleteCard/AthleteCard.component';

const Athlete = () => {
  const { data, isFetching } = useApiHook({
    url: '/athlete',
    method: 'GET',
    key: 'athletes',
    filter: `isActive;true`,
  }) as any;

  return (
    <SearchWrapper
      placeholder="Filter athletes"
      queryKey="athletes"
      buttons={[]}
      filters={[
        {
          key: '',
          label: 'All',
        },
        {
          key: 'userId;{"$exists": true}',
          label: 'FAP Athlete',
        },
      ]}
      sort={[
        {
          key: '',
          label: 'Default',
        },
      ]}
      total={data?.metadata?.totalCount}
      isFetching={isFetching}
    >
      <div className={styles.container}>
        <div className={styles.athletesList}>
          {data?.payload?.map((athlete: IAthlete) => (
            <AthleteCard key={athlete._id} athlete={athlete} />
          ))}
        </div>
      </div>
    </SearchWrapper>
  );
};

export default Athlete;
