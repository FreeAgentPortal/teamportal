import { useEffect, useCallback, useRef } from 'react';
import { useMutation } from '@tanstack/react-query';
import axios from '@/utils/axios';

interface UseViewUpdateProps {
  athleteId: string;
  profileId: string;
  enabled?: boolean;
}

interface ViewUpdatePayload {
  viewer: string;
  viewerType: 'team';
}

interface UpdateViewParams {
  athleteId: string;
  payload: ViewUpdatePayload;
}

const updateView = async ({ athleteId, payload }: UpdateViewParams) => {
  const response = await axios.post(`/profiles/athlete/views/${athleteId}`, payload);
  return response.data;
};

export const useViewUpdate = ({ athleteId, profileId, enabled = true }: UseViewUpdateProps) => {
  const hasTrackedRef = useRef<string | null>(null);

  const mutation = useMutation({
    mutationFn: updateView,
    onError: (error) => {
      // Silently handle errors for analytics - don't disrupt user experience
      console.warn('View update failed:', error);
    },
    onSuccess: (data) => {
      console.debug('View updated successfully:', data);
    },
  });

  const trackView = useCallback(
    (currentAthleteId: string, currentProfileId: string) => {
      if (!currentAthleteId || !currentProfileId || !enabled || hasTrackedRef.current === currentAthleteId) return;

      const payload: ViewUpdatePayload = {
        viewer: currentProfileId,
        viewerType: 'team',
      };

      hasTrackedRef.current = currentAthleteId;
      mutation.mutate({ athleteId: currentAthleteId, payload });
    },
    [enabled, mutation.mutate]
  );

  useEffect(() => {
    if (athleteId && profileId) {
      trackView(athleteId, profileId);
    }
  }, [athleteId, profileId, trackView]);

  return {
    isLoading: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
    updateView: (aId: string, pId: string) => trackView(aId, pId),
  };
};

export default useViewUpdate;
