import { useCallback } from 'react';
import { IAthlete } from '@/types/IAthleteType';
import useApiHook from './useApi';

export function useFavoriteAthlete(defaultAthlete?: IAthlete) {
  const { data: favoritedAthletes } = useApiHook({
    url: `/team/favorite-athlete`,
    method: 'GET',
    key: 'favoritedAthletes',
  }) as any;

  const { mutate: toggleFavoritedAthletes, isLoading } = useApiHook({
    method: 'POST',
    key: 'toggleFavoritedAthletes',
    queriesToInvalidate: ['athlete', 'athletes'],
  }) as any;

  const isFavorited = useCallback(
    (athlete: IAthlete = defaultAthlete!) => {
      if (!athlete?._id) return false;
      return favoritedAthletes?.payload?.some((fav: IAthlete) => fav?._id === athlete._id);
    },
    [favoritedAthletes, defaultAthlete?._id]
  );

  const handleToggleFavoriteAthlete = useCallback(
    (athlete: IAthlete = defaultAthlete!) => {
      if (!athlete?._id) {
        alert('Athlete is not registered with Free Agent Portal');
        return;
      }
      toggleFavoritedAthletes({ url: `/team/favorite-athlete/${athlete._id}` });
    },
    [defaultAthlete?._id, toggleFavoritedAthletes]
  );

  return {
    isFavorited,
    handleToggleFavoriteAthlete,
    isLoading,
    favoritedAthletes: favoritedAthletes?.payload ?? [],
  };
}
