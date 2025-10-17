import { useQuery } from '@tanstack/react-query';
import axios from '@/utils/axios';
import { EventDocument } from '@/types/IEventType';
import { FilterOptions } from '../components/EventFilters';
import { EventStatsData } from '../components/EventStats';
import useApiHook from '@/hooks/useApi';
import { useSelectedProfile } from '@/hooks/useSelectedProfile';
import { useUser } from '@/state/auth';

export interface UseEventsParams {
  filters?: FilterOptions;
  pageNumber?: number;
  pageLimit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface EventsResponse {
  payload: EventDocument[];
  metadata: {
    page: number;
    pages: number;
    totalCount: number;
    prevPage: number | null;
    nextPage: number | null;
  };
}

/**
 * Custom hook to fetch events with filtering capabilities
 * Uses React Query for caching and state management
 */
export const useEvents = (params: UseEventsParams = {}) => {
  const { filters = {}, pageNumber = 1, pageLimit = 20, sortBy = 'startsAt', sortOrder = 'asc' } = params;

  /**
   * Convert filter options to API-compatible format
   * Format: "key:value|key:value" for filterOptions (AND operations)
   * Format: "key:value|key:value" for includeOptions (OR operations)
   */
  const formatFilters = (filterOptions: FilterOptions) => {
    const filterPairs: string[] = [];
    const includePairs: string[] = [];

    // Handle event types (OR operation - include any of the selected types)
    if (filterOptions.type && filterOptions.type.length > 0) {
      filterOptions.type.forEach((type) => {
        includePairs.push(`type;${type}`);
      });
    }

    // Handle visibility (OR operation - include any of the selected visibility levels)
    if (filterOptions.visibility && filterOptions.visibility.length > 0) {
      filterOptions.visibility.forEach((visibility) => {
        includePairs.push(`visibility;${visibility}`);
      });
    }

    // Handle audience (OR operation - include any of the selected audiences)
    if (filterOptions.audience && filterOptions.audience.length > 0) {
      filterOptions.audience.forEach((audience) => {
        includePairs.push(`audience;${audience}`);
      });
    }

    // Handle status (OR operation - include any of the selected statuses)
    if (filterOptions.status && filterOptions.status.length > 0) {
      filterOptions.status.forEach((status) => {
        includePairs.push(`status;${status}`);
      });
    }

    // Handle date range (AND operation - must be within the range)
    if (filterOptions.dateRange) {
      if (filterOptions.dateRange.start) {
        filterPairs.push(`startsAt;>=${filterOptions.dateRange.start.toISOString()}`);
      }
      if (filterOptions.dateRange.end) {
        filterPairs.push(`startsAt;<=${filterOptions.dateRange.end.toISOString()}`);
      }
    }

    return {
      filterOptions: filterPairs.join('|'),
      includeOptions: includePairs.join('|'),
    };
  };

  // Convert filters to query parameters
  const { filterOptions, includeOptions } = formatFilters(filters);

  // Create query key for caching
  const queryKey = [
    'events',
    {
      filters: filterOptions,
      includes: includeOptions,
      page: pageNumber,
      limit: pageLimit,
      sort: `${sortBy};${sortOrder}`,
    },
  ];

  // Fetch function
  const fetchEvents = async (): Promise<EventsResponse> => {
    const params: Record<string, any> = {
      pageNumber,
      pageLimit,
      sortOptions: `${sortBy};${sortOrder}`,
    };

    // Add filter parameters if they exist
    if (filterOptions) {
      params.filterOptions = filterOptions;
    }
    if (includeOptions) {
      params.includeOptions = includeOptions;
    }

    const response = await axios.get('/feed/event', { params });
    return response.data;
  };

  return useQuery({
    queryKey,
    queryFn: fetchEvents,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (was cacheTime in older versions)
    retry: 2,
    refetchOnWindowFocus: false,
    // Enable query when we have valid parameters
    enabled: true,
  });
};

/**
 * Hook to get a single event by ID
 */
export const useEvent = (eventId: string) => {
  return useQuery({
    queryKey: ['event', eventId],
    queryFn: async () => {
      const response = await axios.get(`/api/events/${eventId}`);
      return response.data as EventDocument;
    },
    enabled: !!eventId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
  });
};

/**
 * Utility function to create optimistic updates
 * This can be used with mutations to update the cache immediately
 */
export const createEventCacheKey = (filters?: FilterOptions) => {
  const { filterOptions, includeOptions } = formatFiltersForCache(filters || {});
  return [
    'events',
    {
      filters: filterOptions,
      includes: includeOptions,
      page: 1,
      limit: 20,
      sort: 'startsAt:asc',
    },
  ];
};

/**
 * Utility function to format filters for cache key creation
 * This can be used outside the hook for cache invalidation
 */
export const formatFiltersForCache = (filterOptions: FilterOptions) => {
  const filterPairs: string[] = [];
  const includePairs: string[] = [];

  if (filterOptions.type && filterOptions.type.length > 0) {
    filterOptions.type.forEach((type) => {
      includePairs.push(`type;${type}`);
    });
  }

  if (filterOptions.visibility && filterOptions.visibility.length > 0) {
    filterOptions.visibility.forEach((visibility) => {
      includePairs.push(`visibility;${visibility}`);
    });
  }

  if (filterOptions.audience && filterOptions.audience.length > 0) {
    filterOptions.audience.forEach((audience) => {
      includePairs.push(`audience;${audience}`);
    });
  }

  if (filterOptions.status && filterOptions.status.length > 0) {
    filterOptions.status.forEach((status) => {
      includePairs.push(`status;${status}`);
    });
  }

  if (filterOptions.dateRange) {
    if (filterOptions.dateRange.start) {
      filterPairs.push(`startsAt;>=${filterOptions.dateRange.start.toISOString()}`);
    }
    if (filterOptions.dateRange.end) {
      filterPairs.push(`startsAt;<=${filterOptions.dateRange.end.toISOString()}`);
    }
  }

  return {
    filterOptions: filterPairs.join('|'),
    includeOptions: includePairs.join('|'),
  };
};

/**
 * Hook to create a new event
 * Leverages useApiHook for consistent API handling and caching
 */
export const useCreateEvent = (cache: any) => {
  return useApiHook({
    method: 'POST',
    url: '/feed/event',
    key: 'createEvent',
    successMessage: 'Event created successfully!',
    queriesToInvalidate: ['events', cache],
    onSuccessCallback: (data) => {
      console.log('Event created:', data);
    },
    onErrorCallback: (error) => {
      console.error('Failed to create event:', error);
    },
  });
};

/**
 * Hook to update an existing event
 * Leverages useApiHook for consistent API handling and caching
 */
export const useUpdateEvent = () => {
  return useApiHook({
    method: 'PUT',
    key: 'updateEvent',
    successMessage: 'Event updated successfully!',
    queriesToInvalidate: ['events', 'event'],
    onSuccessCallback: (data) => {
      console.log('Event updated:', data);
    },
    onErrorCallback: (error) => {
      console.error('Failed to update event:', error);
    },
  });
};

/**
 * Hook to delete an event
 * Leverages useApiHook for consistent API handling and caching
 */
export const useDeleteEvent = () => {
  return useApiHook({
    method: 'DELETE',
    key: 'deleteEvent',
    successMessage: 'Event deleted successfully!',
    queriesToInvalidate: ['events'],
    onSuccessCallback: (data) => {
      console.log('Event deleted:', data);
    },
    onErrorCallback: (error) => {
      console.error('Failed to delete event:', error);
    },
  });
};

/**
 * Utility function to transform EventDocument to API format
 * Removes client-side only fields and ensures proper structure
 */
export const transformEventForAPI = (eventData: Partial<EventDocument>): any => {
  const transformed: any = {
    ...eventData,
    // Ensure dates are in ISO string format
    startsAt: eventData.startsAt instanceof Date ? eventData.startsAt.toISOString() : eventData.startsAt,
    endsAt: eventData.endsAt instanceof Date ? eventData.endsAt.toISOString() : eventData.endsAt,
  };

  // Transform registration dates if they exist
  if (transformed.registration) {
    const registration = transformed.registration;
    transformed.registration = {
      ...registration,
      opensAt: registration.opensAt instanceof Date ? registration.opensAt.toISOString() : registration.opensAt,
      closesAt: registration.closesAt instanceof Date ? registration.closesAt.toISOString() : registration.closesAt,
    };
  }

  // Remove any undefined fields to keep payload clean
  Object.keys(transformed).forEach((key) => {
    if (transformed[key] === undefined) {
      delete transformed[key];
    }
  });

  return transformed;
};

// fetches from the API a list of event statistics
export const useEventStats = (teamId: string) => {
  return useQuery<EventStatsData>({
    queryKey: ['events', 'stats', teamId],
    queryFn: async (): Promise<EventStatsData> => {
      const response = await axios.get(`/feed/event/${teamId}/stats`);
      return response.data;
    },
    enabled: !!teamId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
  });
};
