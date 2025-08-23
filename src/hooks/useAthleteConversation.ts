import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { IAthlete } from '@/types/IAthleteType';
import useApiHook from './useApi';

export function useAthleteConversations(defaultAthlete?: IAthlete) {
  const router = useRouter();

  const { data: conversations, isLoading: isLoadingConversations } = useApiHook({
    url: `/messaging?role=team`,
    method: 'GET',
    key: 'conversations',
    queriesToInvalidate: ['conversations'],
    refetchInterval: 2000,
  }) as any;

  const { mutate: createConversation, isLoading: isCreatingConversation } = useApiHook({
    url: `/messaging`,
    method: 'POST',
    key: 'create_conversation',
    onSuccessCallback(data) {
      router.push(`/opportunities_hub/messages/${data.payload._id}`);
    },
  }) as any;

  const hasConversation = useCallback(
    (athlete: IAthlete = defaultAthlete!) => {
      if (!athlete?._id) return false;
      return conversations?.payload?.some((conv: any) => conv.participants.athlete?._id === athlete._id);
    },
    [conversations, defaultAthlete?._id]
  );

  const getConversationId = useCallback(
    (athlete = defaultAthlete) => {
      if (!athlete?._id) return null;
      const conv = conversations?.payload?.find((c: any) => c.participants.athlete?._id === athlete._id);
      return conv?._id ?? null;
    },
    [conversations, defaultAthlete?._id]
  );

  const handleStartConversation = useCallback(
    (athlete: IAthlete = defaultAthlete!) => {
      if (!athlete?.userId) {
        alert('Athlete is not registered with Free Agent Portal');
        return;
      }

      createConversation({
        formData: { athleteId: athlete._id, message: "Hello, let's connect." },
      });
    },
    [defaultAthlete?._id, createConversation]
  );

  return {
    conversations: conversations?.payload ?? [],
    isLoadingConversations,
    isCreatingConversation,
    getConversationId,
    hasConversation,
    handleStartConversation,
  };
}
