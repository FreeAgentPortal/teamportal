import React from 'react';
import { EventDocument } from '@/types/IEventType';
import styles from './EventStats.module.scss';

export interface EventStatsProps {
  events: EventDocument[];
  statsData?: EventStatsData | null;
  loading?: boolean;
}

export interface EventTypeBreakdown {
  type: string;
  count: number;
  active: number;
  completed: number;
  upcoming: number;
  canceled: number;
  postponed: number;
}

export interface EventStatsData {
  _id: string | null;
  totalEvents: number;
  activeEvents: number;
  completedEvents: number;
  upcomingEvents: number;
  canceledEvents: number;
  postponedEvents: number;
  totalRegistrations: number;
  eventTypeBreakdown: EventTypeBreakdown[];
  mostPopularEventType: {
    type: string;
    count: number;
  };
}

interface StatsDisplay {
  totalEvents: number;
  upcomingEvents: number;
  completedEvents: number;
  activeEvents: number;
  totalRegistrations: number;
  averageRegistrations: number;
  popularEventType: string;
}

const EventStats: React.FC<EventStatsProps> = ({ events, statsData, loading = false }) => {
  // Calculate stats from server data or fallback to client-side calculation
  const calculateStats = (): StatsDisplay => {
    // If server data is available, use it
    if (statsData) {
      const averageRegistrations = statsData.totalEvents > 0 ? Math.floor(statsData.totalRegistrations / statsData.totalEvents) : 0;

      return {
        totalEvents: statsData.totalEvents,
        upcomingEvents: statsData.upcomingEvents,
        completedEvents: statsData.completedEvents,
        activeEvents: statsData.activeEvents,
        totalRegistrations: statsData.totalRegistrations,
        averageRegistrations,
        popularEventType: statsData.mostPopularEventType.type,
      };
    }

    // Fallback to client-side calculation from events array
    const now = new Date();
    const totalEvents = events.length;
    const upcomingEvents = events.filter((e) => new Date(e.startsAt) > now).length;
    const completedEvents = events.filter((e) => e.status === 'completed').length;
    const activeEvents = events.filter((e) => e.status === 'scheduled' && new Date(e.startsAt) <= now && new Date(e.endsAt) >= now).length;

    // Placeholder calculations for registrations
    const totalRegistrations = events.reduce((sum) => {
      return sum + (Math.floor(Math.random() * 50) + 5);
    }, 0);

    const averageRegistrations = totalEvents > 0 ? Math.floor(totalRegistrations / totalEvents) : 0;

    // Find most popular event type
    const typeCounts = events.reduce((acc, event) => {
      acc[event.type] = (acc[event.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const popularEventType = Object.entries(typeCounts).reduce((a, b) => (typeCounts[a[0]] > typeCounts[b[0]] ? a : b), ['none', 0])[0];

    return {
      totalEvents,
      upcomingEvents,
      completedEvents,
      activeEvents,
      totalRegistrations,
      averageRegistrations,
      popularEventType,
    };
  };

  const stats = calculateStats();

  if (loading) {
    return (
      <div className={styles.container}>
        <h4 className={styles.title}>Event Statistics</h4>
        <div className={styles.statsList}>
          <div className={styles.loading}>Loading statistics...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h4 className={styles.title}>Event Statistics</h4>

      <div className={styles.statsList}>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Total Events</span>
          <span className={styles.statValue}>{stats.totalEvents}</span>
        </div>

        <div className={styles.statItem}>
          <span className={styles.statLabel}>Active</span>
          <span className={styles.statValue}>{stats.activeEvents}</span>
        </div>

        <div className={styles.statItem}>
          <span className={styles.statLabel}>Upcoming</span>
          <span className={styles.statValue}>{stats.upcomingEvents}</span>
        </div>

        <div className={styles.statItem}>
          <span className={styles.statLabel}>Completed</span>
          <span className={styles.statValue}>{stats.completedEvents}</span>
        </div>

        <div className={styles.statItem}>
          <span className={styles.statLabel}>Total Registrations</span>
          <span className={styles.statValue}>{stats.totalRegistrations}</span>
        </div>

        <div className={styles.statItem}>
          <span className={styles.statLabel}>Avg. Registrations</span>
          <span className={styles.statValue}>{stats.averageRegistrations}</span>
        </div>

        <div className={styles.statItem}>
          <span className={styles.statLabel}>Popular Type</span>
          <span className={styles.statValue}>{stats.popularEventType}</span>
        </div>
      </div>
    </div>
  );
};

export default EventStats;
