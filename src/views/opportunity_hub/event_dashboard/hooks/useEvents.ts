import { useQuery } from '@tanstack/react-query';
import axios from '@/utils/axios';
import { EventDocument } from '@/types/IEventType';
import { FilterOptions } from '../components/EventFilters';

export interface UseEventsParams {
  filters?: FilterOptions;
  pageNumber?: number;
  pageLimit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface EventsResponse {
  events: EventDocument[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
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
const formatFiltersForCache = (filterOptions: FilterOptions) => {
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
