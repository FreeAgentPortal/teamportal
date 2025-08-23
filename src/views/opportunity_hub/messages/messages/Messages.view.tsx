import styles from './Messages.module.scss';
import Image from 'next/image';
import { IoSend } from 'react-icons/io5';
import Link from 'next/link';
import { CgChevronLeft } from 'react-icons/cg';
import { formatDate } from '@/utils/formatDate';
import { useConversationMessages } from '@/hooks/useConversationMessages'; // <-- use your new hook

type Props = {
  id: string;
};

const MessagesView = ({ id }: Props) => {
  const { participants, messages, isLoadingMessages, isSendingMessage, handleSendMessage } = useConversationMessages(id);

  if (isLoadingMessages || isSendingMessage) {
    return <div className={styles.container}>Loading messages...</div>;
  }

  const athlete = participants?.athlete;

  const onSendClick = () => {
    const inputEl = document.getElementById('messageInput') as HTMLInputElement;
    const messageContent = inputEl.value;
    handleSendMessage(messageContent);
    inputEl.value = '';
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link className={styles.backButton} aria-label="Back to Conversations" href="/opportunities_hub/messages">
          <CgChevronLeft size={24} />
        </Link>
        {athlete && (
          <Link className={styles.profileLink} href={`/opportunities_hub/athletes/${athlete._id}`}>
            <Image
              src={athlete.profileImageUrl || '/images/no-photo.png'}
              alt={athlete.fullName || 'Athlete'}
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/images/no-photo.png';
              }}
              className={styles.profileImage}
              width={40}
              height={40}
            />
            <span className={styles.participantName}>{athlete.fullName || 'Conversation'}</span>
          </Link>
        )}
      </header>

      <div className={styles.messagesContainer}>
        {messages.map((message: any) => {
          const isOutgoing = message.sender.role === 'team';
          return (
            <div key={message._id} className={`${styles.messageWrapper} ${isOutgoing ? styles.outgoing : styles.incoming}`}>
              <div className={styles.messageBubble}>
                <p className={styles.messageContent}>{message.content}</p>
                <p className={styles.timestamp}>{formatDate(message.createdAt)}</p>
              </div>
            </div>
          );
        })}
      </div>

      <footer className={styles.inputArea}>
        <input type="text" placeholder="Type a message..." className={styles.messageInput} id="messageInput" />
        <button className={styles.sendButton} aria-label="Send Message" onClick={onSendClick}>
          <IoSend size={20} />
        </button>
      </footer>
    </div>
  );
};

export default MessagesView;
