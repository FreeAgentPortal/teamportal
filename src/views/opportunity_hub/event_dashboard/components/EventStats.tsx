import React from 'react';
import { EventDocument } from '@/types/IEventType';
import styles from './EventStats.module.scss';

interface EventStatsProps {
  events: EventDocument[];
}

interface StatsData {
  totalEvents: number;
  upcomingEvents: number;
  completedEvents: number;
  totalRegistrations: number;
  averageAttendance: number;
  popularEventType: string;
}

const EventStats: React.FC<EventStatsProps> = ({ events }) => {
  // Calculate stats - placeholder logic
  const calculateStats = (): StatsData => {
    const now = new Date();

    const totalEvents = events.length;
    const upcomingEvents = events.filter((e) => new Date(e.startsAt) > now).length;
    const completedEvents = events.filter((e) => e.status === 'completed').length;

    // Placeholder calculations - would be replaced with real data
    const totalRegistrations = events.reduce((sum, event) => {
      // This would come from actual registration data
      return sum + (Math.floor(Math.random() * 50) + 5);
    }, 0);

    const averageAttendance = totalEvents > 0 ? Math.floor(totalRegistrations / totalEvents) : 0;

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
      totalRegistrations,
      averageAttendance,
      popularEventType,
    };
  };

  const stats = calculateStats();

  return (
    <div className={styles.container}>
      <h4 className={styles.title}>Event Statistics</h4>

      <div className={styles.statsList}>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Total Events</span>
          <span className={styles.statValue}>{stats.totalEvents}</span>
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
          <span className={styles.statLabel}>Avg. Attendance</span>
          <span className={styles.statValue}>{stats.averageAttendance}</span>
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
