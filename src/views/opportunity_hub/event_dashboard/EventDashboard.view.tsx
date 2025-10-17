'use client';
import React, { useState } from 'react';
import { EventDocument } from '@/types/IEventType';
import TheButton from '@/components/button/Button.component';
import EventList from './components/EventList';
import EventFilters, { FilterOptions } from './components/EventFilters';
import EventStats from './components/EventStats';
import QuickActions from './components/QuickActions';
import EventModal from './components/EventModal';
import { useEvents, useCreateEvent, useUpdateEvent, useDeleteEvent, transformEventForAPI, formatFiltersForCache, useEventStats } from './hooks/useEvents';
import styles from './EventDashboard.module.scss';
import { useSelectedProfile } from '@/hooks/useSelectedProfile';
import { useUser } from '@/state/auth';

const EventDashboard = () => {
  // State management
  const [filters, setFilters] = useState<FilterOptions>({});
  const [pageNumber, setPageNumber] = useState(1);
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventDocument | null>(null);
  const [eventSubmitLoading, setEventSubmitLoading] = useState(false);
  const { selectedProfile } = useSelectedProfile();
  const { data: loggedInUser } = useUser();
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
  const { data: eventStatsData } = useEventStats(selectedProfile?._id as string);

  // Mutation hooks for event operations
  const { mutate: createEvent, isLoading: createLoading } = useCreateEvent(formatFiltersForCache(filters)) as any;
  const { mutate: updateEvent, isLoading: updateLoading } = useUpdateEvent() as any;
  const { mutate: deleteEvent, isLoading: deleteLoading } = useDeleteEvent() as any;

  const events = eventsData?.payload || [];
  const loading = isLoading || isRefetching;
  const modalLoading = eventSubmitLoading || createLoading || updateLoading;

  // Modal handlers
  const handleCreateEvent = () => {
    setSelectedEvent(null); // Clear any selected event (for create mode)
    setEventModalOpen(true);
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
    setSelectedEvent(event); // Set the event to edit
    setEventModalOpen(true);
  };

  const handleDeleteEvent = (eventId: string) => {
    // TODO: Add confirmation dialog here
    if (confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      deleteEvent({
        url: `/feed/event/${eventId}`,
      });
    }
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

  // Event submission handler
  const handleEventSubmit = (eventData: Partial<EventDocument>) => {
    setEventSubmitLoading(true);

    // Transform the event data for API
    const transformedData = transformEventForAPI({ ...eventData, createdByUserId: loggedInUser?._id, teamProfileId: selectedProfile?._id });

    if (selectedEvent) {
      // Update existing event
      updateEvent(
        {
          url: `/feed/event/${selectedEvent._id}`,
          formData: transformedData,
        },
        {
          onSuccess: () => {
            // Close modal and clear state on success
            setEventModalOpen(false);
            setSelectedEvent(null);
            setEventSubmitLoading(false);
          },
          onError: () => {
            // Error handling is managed by useApiHook, just reset loading
            setEventSubmitLoading(false);
          },
        }
      );
    } else {
      // Create new event
      createEvent(
        {
          formData: transformedData,
        },
        {
          onSuccess: () => {
            // Close modal and clear state on success
            setEventModalOpen(false);
            setSelectedEvent(null);
            setEventSubmitLoading(false);
          },
          onError: () => {
            // Error handling is managed by useApiHook, just reset loading
            setEventSubmitLoading(false);
          },
        }
      );
    }
  };

  const handleModalClose = () => {
    setEventModalOpen(false);
    setSelectedEvent(null);
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
            totalCount={eventsData?.metadata?.totalCount || 0}
            currentPage={eventsData?.metadata?.page || 1}
            totalPages={eventsData?.metadata?.pages || 1}
            onEventClick={handleEventClick}
            onEditEvent={handleEditEvent}
            onDeleteEvent={handleDeleteEvent}
            onPageChange={handlePageChange}
          />
        </div>

        <div className={styles.sidebar}>
          <EventStats events={events} statsData={eventStatsData} loading={!eventStatsData && isLoading} />

          <QuickActions onCreateEvent={handleCreateEvent} onViewCalendar={handleViewCalendar} onExportEvents={handleExportEvents} onManageTemplates={handleManageTemplates} />

          <EventFilters filters={filters} onFiltersChange={handleFiltersChange} />
        </div>
      </div>

      {/* Event Modal for Create/Edit */}
      <EventModal open={eventModalOpen} onClose={handleModalClose} onSubmit={handleEventSubmit} event={selectedEvent} loading={modalLoading} />
    </div>
  );
};

export default EventDashboard;
