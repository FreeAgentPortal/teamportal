'use client';
import React, { useState } from 'react';
import styles from './Athlete.module.scss';
import useApiHook from '@/hooks/useApi';
import SearchWrapper from '@/layout/searchWrapper/SearchWrapper.layout';
import { IAthlete } from '@/types/IAthleteType';
import AthleteCard from '../report/components/athleteCard/AthleteCard.component';
import { MdFavorite } from 'react-icons/md';
import { Button } from 'antd';
import { BsPerson } from 'react-icons/bs';

const Athlete = () => {
  const { data, isFetching } = useApiHook({
    url: '/athlete',
    method: 'GET',
    key: 'athletes',
    filter: `isActive;true|profileImageUrl;{"$exists": true}`,
  }) as any;

  const { data: favoritedAthletes } = useApiHook({
    url: `/team/favorite-athlete`,
    method: 'GET',
    key: 'favoritedAthletes',
  }) as any;

  const [showingFavorites, setShowingFavorites] = useState(false);

  return (
    <div>
      {showingFavorites ? (
        <>
          <div className={styles.header}>
            <h2>Favorite Athletes</h2>
            <Button type="primary" icon={<BsPerson />} onClick={() => setShowingFavorites(false)} className={styles.toggleFavoritesBtn}>
              Show All Athletes
            </Button>
          </div>
          <div className={styles.favoritesList}>
            {favoritedAthletes?.payload?.map((athlete: IAthlete) => (
              <AthleteCard key={athlete._id} athlete={athlete} />
            ))}
            {favoritedAthletes?.payload?.length === 0 && <div className={styles.noFavoritesMessage}>No favorite athletes found.</div>}
          </div>
        </>
      ) : (
        <>
          <div className={styles.header}>
            <h2>All Athletes</h2>
            <Button type="primary" icon={<MdFavorite />} onClick={() => setShowingFavorites(true)} className={styles.toggleFavoritesBtn}>
              Show Favorite Athletes
            </Button>
          </div>

          <SearchWrapper
            placeholder="Filter athletes"
            queryKey="athletes"
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
        </>
      )}
    </div>
  );
};

export default Athlete;
