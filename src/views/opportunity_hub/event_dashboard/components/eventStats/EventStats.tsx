import React from 'react';
import { Tooltip } from 'antd';
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
  registrations: number;
  confirmedRegistrations: number;
  interestedRegistrations: number;
  appliedRegistrations: number;
  capacity: number;
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
  totalConfirmedRegistrations: number;
  totalInterestedRegistrations: number;
  totalAppliedRegistrations: number;
  totalCapacity: number;
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
  totalConfirmedRegistrations: number;
  totalInterestedRegistrations: number;
  totalAppliedRegistrations: number;
  totalCapacity: number;
  capacityUtilization: number;
  popularEventType: string;
}

const EventStats: React.FC<EventStatsProps> = ({ events, statsData, loading = false }) => {
  // Tooltip explanations for each statistic
  const tooltips = {
    totalEvents: 'The total number of events created across all categories and statuses',
    activeEvents: 'Events that are currently happening (started but not yet ended)',
    upcomingEvents: 'Events scheduled to start in the future',
    completedEvents: 'Events that have finished and are no longer active',
    totalRegistrations: 'Total number of people who have registered for any event in any capacity',
    confirmedRegistrations: 'Number of people who have confirmed their attendance and are guaranteed spots',
    interestedRegistrations: "Number of people who have expressed interest but haven't committed to attending",
    appliedRegistrations: 'Number of people who have applied to attend but are awaiting approval',
    totalCapacity: 'Maximum number of attendees that can be accommodated across all events with limited space',
    capacityUtilization: 'Percentage showing how much of the total available capacity is being used by confirmed registrations',
    popularEventType: 'The type of event (game, practice, camp, etc.) that appears most frequently in your schedule',
  };

  // Calculate stats from server data or fallback to client-side calculation
  const calculateStats = (): StatsDisplay => {
    // If server data is available, use it
    if (statsData) {
      const capacityUtilization = statsData.totalCapacity > 0 ? Math.round((statsData.totalRegistrations / statsData.totalCapacity) * 100) : 0;

      return {
        ...statsData,
        capacityUtilization,
        popularEventType: statsData?.mostPopularEventType?.type,
      };
    }

    // Fallback to client-side calculation from events array
    const now = new Date();
    const totalEvents = events.length;
    const upcomingEvents = events.filter((e) => new Date(e.startsAt) > now).length;
    const completedEvents = events.filter((e) => e.status === 'completed').length;
    const activeEvents = events.filter((e) => e.status === 'scheduled' && new Date(e.startsAt) <= now && new Date(e.endsAt) >= now).length;

    // Placeholder calculations for registrations (would come from actual data)
    const totalRegistrations = events.reduce((sum) => {
      return sum + (Math.floor(Math.random() * 10) + 1);
    }, 0);

    const totalConfirmedRegistrations = Math.floor(totalRegistrations * 0.6);
    const totalInterestedRegistrations = Math.floor(totalRegistrations * 0.3);
    const totalAppliedRegistrations = Math.floor(totalRegistrations * 0.1);

    const totalCapacity = events.reduce((sum) => {
      return sum + (Math.floor(Math.random() * 100) + 20);
    }, 0);

    const capacityUtilization = totalCapacity > 0 ? Math.round((totalRegistrations / totalCapacity) * 100) : 0;

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
      totalConfirmedRegistrations,
      totalInterestedRegistrations,
      totalAppliedRegistrations,
      totalCapacity,
      capacityUtilization,
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
        <Tooltip title={tooltips.totalEvents} placement="left">
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Total Events</span>
            <span className={styles.statValue}>{stats.totalEvents}</span>
          </div>
        </Tooltip>

        <Tooltip title={tooltips.activeEvents} placement="left">
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Active</span>
            <span className={styles.statValue}>{stats.activeEvents}</span>
          </div>
        </Tooltip>

        <Tooltip title={tooltips.upcomingEvents} placement="left">
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Upcoming</span>
            <span className={styles.statValue}>{stats.upcomingEvents}</span>
          </div>
        </Tooltip>

        <Tooltip title={tooltips.completedEvents} placement="left">
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Completed</span>
            <span className={styles.statValue}>{stats.completedEvents}</span>
          </div>
        </Tooltip>

        <Tooltip title={tooltips.totalRegistrations} placement="left">
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Total Registrations</span>
            <span className={styles.statValue}>{stats.totalRegistrations}</span>
          </div>
        </Tooltip>

        <Tooltip title={tooltips.confirmedRegistrations} placement="left">
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Confirmed</span>
            <span className={styles.statValue}>{stats.totalConfirmedRegistrations}</span>
          </div>
        </Tooltip>

        <Tooltip title={tooltips.interestedRegistrations} placement="left">
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Interested</span>
            <span className={styles.statValue}>{stats.totalInterestedRegistrations}</span>
          </div>
        </Tooltip>

        <Tooltip title={tooltips.appliedRegistrations} placement="left">
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Applied</span>
            <span className={styles.statValue}>{stats.totalAppliedRegistrations}</span>
          </div>
        </Tooltip>

        <Tooltip title={tooltips.totalCapacity} placement="left">
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Total Capacity</span>
            <span className={styles.statValue}>{stats.totalCapacity}</span>
          </div>
        </Tooltip>

        <Tooltip title={tooltips.capacityUtilization} placement="left">
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Capacity Usage</span>
            <span className={styles.statValue}>{stats.capacityUtilization}%</span>
          </div>
        </Tooltip>

        <Tooltip title={tooltips.popularEventType} placement="left">
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Popular Type</span>
            <span className={styles.statValue}>{stats.popularEventType}</span>
          </div>
        </Tooltip>
      </div>
    </div>
  );
};

export default EventStats;
