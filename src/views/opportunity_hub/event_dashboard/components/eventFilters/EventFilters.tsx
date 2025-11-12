import React from 'react';
import { EventType, Visibility, Audience } from '@/types/IEventType';
import styles from './EventFilters.module.scss';

export interface FilterOptions {
  type?: EventType[];
  visibility?: Visibility[];
  audience?: Audience[];
  status?: string[];
  dateRange?: {
    start?: Date;
    end?: Date;
  };
}

interface EventFiltersProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
}

const EventFilters: React.FC<EventFiltersProps> = ({ filters, onFiltersChange }) => {
  // Placeholder filter handlers
  const handleTypeChange = (type: EventType, checked: boolean) => {
    const currentTypes = filters.type || [];
    const newTypes = checked ? [...currentTypes, type] : currentTypes.filter((t) => t !== type);

    onFiltersChange({ ...filters, type: newTypes });
  };

  const handleVisibilityChange = (visibility: Visibility, checked: boolean) => {
    const currentVisibility = filters.visibility || [];
    const newVisibility = checked ? [...currentVisibility, visibility] : currentVisibility.filter((v) => v !== visibility);

    onFiltersChange({ ...filters, visibility: newVisibility });
  };

  const handleAudienceChange = (audience: Audience, checked: boolean) => {
    const currentAudience = filters.audience || [];
    const newAudience = checked ? [...currentAudience, audience] : currentAudience.filter((a) => a !== audience);

    onFiltersChange({ ...filters, audience: newAudience });
  };

  const handleStatusChange = (status: string, checked: boolean) => {
    const currentStatus = filters.status || [];
    const newStatus = checked ? [...currentStatus, status] : currentStatus.filter((s) => s !== status);

    onFiltersChange({ ...filters, status: newStatus });
  };

  const clearAllFilters = () => {
    onFiltersChange({});
  };

  const eventTypes = Object.values(EventType);
  const visibilityOptions = Object.values(Visibility);
  const audienceOptions = Object.values(Audience);
  const statusOptions = ['active', 'scheduled', 'completed', 'canceled', 'postponed'];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h4 className={styles.title}>Filters</h4>
        <button className={styles.clearButton} onClick={clearAllFilters}>
          Clear All
        </button>
      </div>

      <div className={styles.section}>
        <h5 className={styles.sectionTitle}>Event Type</h5>
        <div className={styles.options}>
          {eventTypes.map((type) => (
            <label key={type} className={styles.option}>
              <input type="checkbox" checked={filters.type?.includes(type) || false} onChange={(e) => handleTypeChange(type, e.target.checked)} />
              <span className={styles.optionLabel}>{type}</span>
            </label>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <h5 className={styles.sectionTitle}>Visibility</h5>
        <div className={styles.options}>
          {visibilityOptions.map((visibility) => (
            <label key={visibility} className={styles.option}>
              <input type="checkbox" checked={filters.visibility?.includes(visibility) || false} onChange={(e) => handleVisibilityChange(visibility, e.target.checked)} />
              <span className={styles.optionLabel}>{visibility}</span>
            </label>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <h5 className={styles.sectionTitle}>Audience</h5>
        <div className={styles.options}>
          {audienceOptions.map((audience) => (
            <label key={audience} className={styles.option}>
              <input type="checkbox" checked={filters.audience?.includes(audience) || false} onChange={(e) => handleAudienceChange(audience, e.target.checked)} />
              <span className={styles.optionLabel}>{audience}</span>
            </label>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <h5 className={styles.sectionTitle}>Status</h5>
        <div className={styles.options}>
          {statusOptions.map((status) => (
            <label key={status} className={styles.option}>
              <input type="checkbox" checked={filters.status?.includes(status) || false} onChange={(e) => handleStatusChange(status, e.target.checked)} />
              <span className={styles.optionLabel}>{status}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventFilters;
