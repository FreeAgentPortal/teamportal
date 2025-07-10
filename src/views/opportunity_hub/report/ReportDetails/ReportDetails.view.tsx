'use client';
import React from 'react';
import styles from './ReportDetails.module.scss';
import { useParams } from 'next/navigation';
import useApiHook from '@/hooks/useApi';

interface Position {
  name: string;
  abbreviation: string;
  _id: string;
}

interface PerformanceMetrics {
  dash40?: { min: number; max: number };
  benchPress?: { min: number; max: number };
  verticalJump?: { min: number; max: number };
  broadJump?: { min: number; max: number };
  threeCone?: { min: number; max: number };
  shuttle?: { min: number; max: number };
}

interface SearchPreference {
  _id: string;
  name: string;
  description: string;
  ageRange: { min: number; max: number };
  positions: string[];
  performanceMetrics: PerformanceMetrics;
}

interface Athlete {
  _id: string;
  fullName: string;
  birthdate: string;
  positions: Position[];
  profileImageUrl: string;
}

interface ReportData {
  _id: string;
  searchPreference: SearchPreference;
  results: Athlete[];
  generatedAt: string;
  reportId: string;
  opened: boolean;
  createdAt: string;
  updatedAt: string;
}

const ReportDetails = () => {
  // fetch the id from the search params
  const { id: reportId } = useParams();
  const { data, isLoading } = useApiHook({
    url: `/search-preference/report/${reportId}`,
    method: 'GET',
    key: [`report_details`, reportId as string],
    enabled: !!reportId,
  }) as { data: { payload: ReportData }; isLoading: boolean };

  const calculateAge = (birthdate: string) => {
    const birth = new Date(birthdate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const formatMetricRange = (metric: { min: number; max: number } | undefined, unit: string = '') => {
    if (!metric) return 'Not specified';
    return `${metric.min}${unit} - ${metric.max}${unit}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading report details...</div>
      </div>
    );
  }

  if (!data?.payload) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>Report not found</div>
      </div>
    );
  }

  const report = data.payload;
  const { searchPreference, results } = report;

  return (
    <div className={styles.container}>
      {/* Report Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>{searchPreference.name}</h1>
        <div className={styles.reportMeta}>
          <span className={styles.metaItem}>Generated: {formatDate(report.generatedAt)}</span>
          <span className={styles.metaItem}>Results: {results.length} athletes found</span>
        </div>
      </div>

      {/* Search Preferences Overview */}
      <div className={styles.searchPreferences}>
        <h2 className={styles.sectionTitle}>Search Criteria</h2>
        <div className={styles.preferencesGrid}>
          <div className={styles.preferenceCard}>
            <h3 className={styles.cardTitle}>Basic Info</h3>
            <div className={styles.cardContent}>
              <div className={styles.preferenceItem}>
                <span className={styles.label}>Description:</span>
                <span className={styles.value}>{searchPreference.description}</span>
              </div>
              <div className={styles.preferenceItem}>
                <span className={styles.label}>Age Range:</span>
                <span className={styles.value}>
                  {searchPreference.ageRange.min} - {searchPreference.ageRange.max} years
                </span>
              </div>
              <div className={styles.preferenceItem}>
                <span className={styles.label}>Positions:</span>
                <div className={styles.positions}>
                  {searchPreference.positions.map((position, index) => (
                    <span key={index} className={styles.positionTag}>
                      {position}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className={styles.preferenceCard}>
            <h3 className={styles.cardTitle}>Performance Metrics</h3>
            <div className={styles.cardContent}>
              <div className={styles.metricsGrid}>
                <div className={styles.metricItem}>
                  <span className={styles.metricLabel}>40-Yard Dash:</span>
                  <span className={styles.metricValue}>{formatMetricRange(searchPreference.performanceMetrics.dash40, 's')}</span>
                </div>
                <div className={styles.metricItem}>
                  <span className={styles.metricLabel}>Bench Press:</span>
                  <span className={styles.metricValue}>{formatMetricRange(searchPreference.performanceMetrics.benchPress, ' reps')}</span>
                </div>
                <div className={styles.metricItem}>
                  <span className={styles.metricLabel}>Vertical Jump:</span>
                  <span className={styles.metricValue}>{formatMetricRange(searchPreference.performanceMetrics.verticalJump, '"')}</span>
                </div>
                <div className={styles.metricItem}>
                  <span className={styles.metricLabel}>Broad Jump:</span>
                  <span className={styles.metricValue}>{formatMetricRange(searchPreference.performanceMetrics.broadJump, '"')}</span>
                </div>
                <div className={styles.metricItem}>
                  <span className={styles.metricLabel}>3-Cone Drill:</span>
                  <span className={styles.metricValue}>{formatMetricRange(searchPreference.performanceMetrics.threeCone, 's')}</span>
                </div>
                <div className={styles.metricItem}>
                  <span className={styles.metricLabel}>20-Yard Shuttle:</span>
                  <span className={styles.metricValue}>{formatMetricRange(searchPreference.performanceMetrics.shuttle, 's')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className={styles.resultsSection}>
        <h2 className={styles.sectionTitle}>Search Results</h2>
        {results.length === 0 ? (
          <div className={styles.noResults}>No athletes found matching your search criteria.</div>
        ) : (
          <div className={styles.athletesList}>
            {results.map((athlete) => (
              <div key={athlete._id} className={styles.athleteCard}>
                <div className={styles.athleteImage}>
                  <img
                    src={athlete.profileImageUrl}
                    alt={athlete.fullName}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/no-photo.png';
                    }}
                  />
                </div>
                <div className={styles.athleteInfo}>
                  <h3 className={styles.athleteName}>{athlete.fullName}</h3>
                  <div className={styles.athleteDetails}>
                    <div className={styles.athleteAge}>Age: {calculateAge(athlete.birthdate)}</div>
                    <div className={styles.athletePositions}>
                      {athlete.positions.map((position) => (
                        <span key={position._id} className={styles.positionBadge}>
                          {position.abbreviation}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className={styles.birthdate}>Born: {new Date(athlete.birthdate).toLocaleDateString()}</div>
                </div>
                <div className={styles.cardActions}>
                  <button className={styles.viewButton}>View Profile</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportDetails;
