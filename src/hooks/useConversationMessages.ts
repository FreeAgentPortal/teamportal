import { useCallback } from 'react';
import useApiHook from './useApi';

/**
 * Messages (for a given conversation)
 */
export const useConversationMessages = (conversationId: string) => {
  const { data, isLoading: isLoadingMessages } = useApiHook({
    url: `/messaging/${conversationId}/messages?role=team`,
    method: 'GET',
    key: ['messages', conversationId],
    refetchInterval: 1000, // polling messages
  }) as any;

  const { mutate: sendMessage, isLoading: isSendingMessage } = useApiHook({
    url: `/messaging/${conversationId}/messages?role=team`,
    method: 'POST',
    key: ['sendMessage', conversationId],
    queriesToInvalidate: ['messages', conversationId],
  }) as any;

  const handleSendMessage = useCallback(
    (messageContent: string) => {
      if (!messageContent.trim()) return; // prevent empty messages
      sendMessage({ formData: { message: messageContent } });
    },
    [sendMessage]
  );

  return {
    participants: data?.payload?.participants,
    messages: data?.payload?.messages ?? [],
    isLoadingMessages,
    isSendingMessage,
    handleSendMessage,
  };
};
