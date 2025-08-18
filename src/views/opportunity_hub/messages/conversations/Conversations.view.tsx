'use client';
import React from 'react';
import styles from './Conversations.module.scss';
import useApiHook from '@/hooks/useApi';
import Image from 'next/image';
import Link from 'next/link';

const ConversationsView = () => {
  const { data, isLoading } = useApiHook({
    url: '/messaging?role=team',
    method: 'GET',
    key: 'conversations',
    refetchInterval: 2000,
  }) as any;

  if (isLoading || !data) {
    return <div>Loading Messages...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.messagesList}>
        {data?.payload?.length > 0 ? (
          data.payload
            .sort((a: any, b: any) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
            .map((conversation: any) => (
              <Link href={`/opportunities_hub/messages/${conversation._id}`} key={conversation._id} className={styles.messageItem}>
                <div className={styles.messageHeader}>
                  <Image
                    src={conversation.participants.athlete?.profileImageUrl || '/images/no-photo.png'}
                    alt={conversation.participants.athlete?.fullName || 'Unknown Athlete'}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/no-photo.png';
                    }}
                    className={styles.profileImage}
                    width={50}
                    height={50}
                  />
                  <span className={styles.senderName}>{conversation.participants.athlete?.fullName || 'Unknown Athlete'}</span>
                  <span className={styles.lastMessageTime}>{new Date(conversation.updatedAt).toLocaleTimeString()}</span>
                </div>
              </Link>
            ))
        ) : (
          <div className={styles.noMessages}>No messages found</div>
        )}
        {data?.payload?.length === 0 && !isLoading && <div className={styles.noMessages}>No conversations available</div>}
      </div>
    </div>
  );
};

export default ConversationsView;
