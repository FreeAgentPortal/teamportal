'use client';
import { useState } from 'react';
import styles from './Athlete.module.scss';
import useApiHook from '@/hooks/useApi';
import SearchWrapper from '@/layout/searchWrapper/SearchWrapper.layout';
import { MdFavorite, MdFavoriteBorder, MdGridOn, MdList } from 'react-icons/md';
import { Button } from 'antd';
import { useLocalStorage } from '@uidotdev/usehooks';
import AthleteList from '../../../components/athleteList/AthleteList.component';
import { useFavoriteAthlete } from '@/hooks/useFavoriteAthlete';

const Athlete = () => {
  const { data, isFetching } = useApiHook({
    url: '/athlete',
    method: 'GET',
    key: 'athletes',
    filter: `isActive;true|profileImageUrl;{"$exists": true}`,
  }) as any;

  const { favoritedAthletes } = useFavoriteAthlete();

  const [showingFavorites, setShowingFavorites] = useState(false);
  const [isList, setIsList] = useLocalStorage('athlete-view-is-list', false);

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.title}>{showingFavorites ? 'Favorite Athletes' : 'All Athletes'}</h1>
        <div className={styles.actions}>
          <Button
            type="primary"
            icon={showingFavorites ? <MdFavorite /> : <MdFavoriteBorder />}
            onClick={() => setShowingFavorites(!showingFavorites)}
            className={styles.toggleFavoritesBtn}
          >
            {showingFavorites ? 'Hide Favorites' : 'Show Favorites'}
          </Button>
          <Button type="primary" icon={isList ? <MdGridOn /> : <MdList />} onClick={() => setIsList(!isList)}>
            {isList ? 'Show as Grid' : 'Show as List'}
          </Button>
        </div>
      </div>
      {showingFavorites ? (
        <div className={styles.favoritesList}>
          <AthleteList data={favoritedAthletes || []} isTable={isList} />
        </div>
      ) : (
        <SearchWrapper
          placeholder="Filter athletes"
          queryKey="athletes"
          filters={[
            { label: 'All', key: '' },
            { label: 'QB', key: 'positions.abbreviation;{"$in":"QB"}' },
            { label: 'RB', key: 'positions.abbreviation;{"$in":"RB"}' },
            { label: 'FB', key: 'positions.abbreviation;{"$in":"FB"}' },
            { label: 'WR', key: 'positions.abbreviation;{"$in":"WR"}' },
            { label: 'TE', key: 'positions.abbreviation;{"$in":"TE"}' },
            { label: 'OT', key: 'positions.abbreviation;{"$in":"OT"}' },
            { label: 'OG', key: 'positions.abbreviation;{"$in":"OG"}' },
            { label: 'C', key: 'positions.abbreviation;{"$in":"C"}' },
            { label: 'DE', key: 'positions.abbreviation;{"$in":"DE"}' },
            { label: 'DT', key: 'positions.abbreviation;{"$in":"DT"}' },
            { label: 'LB', key: 'positions.abbreviation;{"$in":"LB"}' },
            { label: 'CB', key: 'positions.abbreviation;{"$in":"CB"}' },
            { label: 'S', key: 'positions.abbreviation;{"$in":"S"}' },
            { label: 'K', key: 'positions.abbreviation;{"$in":"K"}' },
            { label: 'P', key: 'positions.abbreviation;{"$in":"P"}' },
            { label: 'LS', key: 'positions.abbreviation;{"$in":"LS"}' },
            { label: 'KR', key: 'positions.abbreviation;{"$in":"KR"}' },
            { label: 'PR', key: 'positions.abbreviation;{"$in":"PR"}' },
          ]}
          total={data?.metadata?.totalCount}
          isFetching={isFetching}
        >
          <div className={styles.container}>
            <div className={styles.athletesList}>
              <AthleteList data={data?.payload || []} isTable={isList} />
            </div>
          </div>
        </SearchWrapper>
      )}
    </div>
  );
};

export default Athlete;
