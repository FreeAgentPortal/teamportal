import React from 'react';
import { EventDocument } from '@/types/IEventType';
import styles from './EventList.module.scss';

interface EventListProps {
  events: EventDocument[];
  loading?: boolean;
  totalCount?: number;
  currentPage?: number;
  totalPages?: number;
  onEventClick?: (event: EventDocument) => void;
  onEditEvent?: (event: EventDocument) => void;
  onDeleteEvent?: (eventId: string) => void;
  onPageChange?: (page: number) => void;
}

const EventList: React.FC<EventListProps> = ({
  events,
  loading = false,
  totalCount = 0,
  currentPage = 1,
  totalPages = 1,
  onEventClick,
  onEditEvent,
  onDeleteEvent,
  onPageChange,
}) => {
  // Placeholder functions
  const handleEventClick = (event: EventDocument) => {
    onEventClick?.(event);
  };

  const handleEditEvent = (event: EventDocument, e: React.MouseEvent) => {
    e.stopPropagation();
    onEditEvent?.(event);
  };

  const handleDeleteEvent = (eventId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onDeleteEvent?.(eventId);
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.loadingText}>Loading events...</div>
        </div>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📅</div>
          <div className={styles.emptyTitle}>No Events Yet</div>
          <div className={styles.emptyMessage}>Create your first event to start engaging with athletes and scouts.</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Your Events</h3>
        <div className={styles.count}>{events.length} events</div>
      </div>

      <div className={styles.list}>
        {events.map((event) => (
          <div key={event._id} className={styles.eventCard} onClick={() => handleEventClick(event)}>
            <div className={styles.eventHeader}>
              <div className={styles.eventType}>{event.type}</div>
              <div className={styles.eventStatus}>{event.status}</div>
            </div>

            <h4 className={styles.eventTitle}>{event.title}</h4>

            <div className={styles.eventDetails}>
              <div className={styles.eventDate}>
                {new Date(event.startsAt).toLocaleDateString()} at {new Date(event.startsAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
              <div className={styles.eventLocation}>{event.location.kind === 'physical' ? event.location.physical?.venueName || 'Physical Location' : 'Virtual Event'}</div>
            </div>

            <div className={styles.eventFooter}>
              <div className={styles.eventAudience}>
                {event.audience} • {event.visibility}
              </div>
              <div className={styles.eventActions}>
                <button className={styles.actionButton} onClick={(e) => handleEditEvent(event, e)}>
                  Edit
                </button>
                <button className={styles.actionButton + ' ' + styles.danger} onClick={(e) => handleDeleteEvent(event._id, e)}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button className={styles.pageButton} onClick={() => onPageChange?.(currentPage - 1)} disabled={currentPage === 1}>
            ← Previous
          </button>

          <div className={styles.pageInfo}>
            Page {currentPage} of {totalPages} • {totalCount} total events
          </div>

          <button className={styles.pageButton} onClick={() => onPageChange?.(currentPage + 1)} disabled={currentPage === totalPages}>
            Next →
          </button>
        </div>
      )}
    </div>
  );
};

export default EventList;
