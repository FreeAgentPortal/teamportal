'use client';
import React, { useState } from 'react';
import { EventDocument } from '@/types/IEventType';
import TheButton from '@/components/button/Button.component';
import EventList from './components/EventList';
import EventFilters, { FilterOptions } from './components/EventFilters';
import EventStats from './components/EventStats';
import QuickActions from './components/QuickActions';
import { useEvents } from './hooks/useEvents';
import styles from './EventDashboard.module.scss';

const EventDashboard = () => {
  // State management
  const [filters, setFilters] = useState<FilterOptions>({});
  const [pageNumber, setPageNumber] = useState(1);

  // Fetch events using the custom hook
  const {
    data: eventsData,
    isLoading,
    error,
    isRefetching,
  } = useEvents({
    filters,
    pageNumber,
    pageLimit: 20,
    sortBy: 'startsAt',
    sortOrder: 'asc',
  });

  const events = eventsData?.events || [];
  const loading = isLoading || isRefetching;

  // Placeholder handlers - to be implemented
  const handleCreateEvent = () => {
    console.log('Create new event');
    // TODO: Open event creation modal/form
  };

  const handleImportEvents = () => {
    console.log('Import events');
    // TODO: Open import dialog
  };

  const handleEventClick = (event: EventDocument) => {
    console.log('Event clicked:', event._id);
    // TODO: Navigate to event detail view
  };

  const handleEditEvent = (event: EventDocument) => {
    console.log('Edit event:', event._id);
    // TODO: Open edit event modal/form
  };

  const handleDeleteEvent = (eventId: string) => {
    console.log('Delete event:', eventId);
    // TODO: Show confirmation dialog and delete
  };

  const handleFiltersChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    // Reset to first page when filters change
    setPageNumber(1);
  };

  const handleViewCalendar = () => {
    console.log('View calendar');
    // TODO: Navigate to calendar view
  };

  const handleExportEvents = () => {
    console.log('Export events');
    // TODO: Generate and download export
  };

  const handleManageTemplates = () => {
    console.log('Manage templates');
    // TODO: Open templates management
  };

  // Error handling
  if (error) {
    console.error('Failed to fetch events:', error);
  }

  // Pagination handlers
  const handlePageChange = (newPage: number) => {
    setPageNumber(newPage);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Event Dashboard</h1>
          <p className={styles.subtitle}>Manage your team events, track registrations, and engage with athletes</p>
        </div>
        <div className={styles.actions}>
          <TheButton type="secondary" onClick={handleImportEvents} icon="📥">
            Import Events
          </TheButton>
          <TheButton type="primary" onClick={handleCreateEvent} icon="➕">
            Create Event
          </TheButton>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.mainContent}>
          <EventList
            events={events}
            loading={loading}
            totalCount={eventsData?.totalCount || 0}
            currentPage={eventsData?.currentPage || 1}
            totalPages={eventsData?.totalPages || 1}
            onEventClick={handleEventClick}
            onEditEvent={handleEditEvent}
            onDeleteEvent={handleDeleteEvent}
            onPageChange={handlePageChange}
          />
        </div>

        <div className={styles.sidebar}>
          <EventStats events={events} />

          <QuickActions onCreateEvent={handleCreateEvent} onViewCalendar={handleViewCalendar} onExportEvents={handleExportEvents} onManageTemplates={handleManageTemplates} />

          <EventFilters filters={filters} onFiltersChange={handleFiltersChange} />
        </div>
      </div>
    </div>
  );
};

export default EventDashboard;
