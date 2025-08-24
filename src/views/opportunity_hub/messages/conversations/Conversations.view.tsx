'use client';
import styles from './Conversations.module.scss';
import Image from 'next/image';
import Link from 'next/link';
import { formatDate } from '@/utils/formatDate';
import { useAthleteConversations } from '@/hooks/useAthleteConversation';

const ConversationsView = () => {
  const { conversations, isLoadingConversations } = useAthleteConversations();

  if (isLoadingConversations) return <div>Loading Messages...</div>;

  if (!conversations || conversations.length === 0) {
    return <div className={styles.noMessages}>No conversations available</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.messagesList}>
        {conversations.map((conversation: any) => (
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
              <span className={styles.lastMessageTime}>{formatDate(conversation.updatedAt)}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ConversationsView;
