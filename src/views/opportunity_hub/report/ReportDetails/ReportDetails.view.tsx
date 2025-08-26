'use client';
import { useEffect, useState } from 'react';
import styles from './ReportDetails.module.scss';
import { useParams } from 'next/navigation';
import useApiHook from '@/hooks/useApi';
import { ISearchReport } from '@/types/ISearchReport';
import AthleteList from '@/components/athleteList/AthleteList.component';
import { MdGridOn, MdList } from 'react-icons/md';
import { PositionBadges } from '@/components/positionBadge/PositionBadges.component';
import TheButton from '@/components/button/Button.component';

const ReportDetails = () => {
  // fetch the id from the search params
  const { id: reportId } = useParams();
  const { data, isLoading } = useApiHook({
    url: `/search-preference/report/${reportId}`,
    method: 'GET',
    key: [`report_details`, reportId as string],
    enabled: !!reportId,
  }) as { data: { payload: ISearchReport }; isLoading: boolean };

  const { mutate: mutateReport } = useApiHook({
    key: 'report_update',
    method: 'PUT',
    queriesToInvalidate: ['reports'],
  }) as any;

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

  const [isList, setIsList] = useState(true);

  useEffect(() => {
    // update the report to viewed status
    if (reportId) {
      mutateReport({
        url: `/search-preference/report/${reportId}`,
        formData: { opened: true },
      });
    }
  }, [reportId]);
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
          <span className={styles.metaItem}>Generated: {formatDate(report.generatedAt as any)}</span>
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
                  {searchPreference?.ageRange?.min} - {searchPreference?.ageRange?.max} years
                </span>
              </div>
              <div className={styles.preferenceItem}>
                <span className={styles.label}>Positions:</span>
                <PositionBadges positions={searchPreference?.positions || []} />
              </div>
            </div>
          </div>

          <div className={styles.preferenceCard}>
            <h3 className={styles.cardTitle}>Performance Metrics</h3>
            <div className={styles.cardContent}>
              <div className={styles.metricsGrid}>
                {/* performance metrics is a map of key/value pairs, turn it into an iterable map */}
                {Object.entries(searchPreference?.performanceMetrics || {}).map(([key, value]) => (
                  <div key={key} className={styles.metricItem}>
                    <span className={styles.metricLabel}>{key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}:</span>
                    <span className={styles.metricValue}>{formatMetricRange(value as any)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className={styles.resultsSection}>
        <div className={styles.resultsHeader}>
          <h2 className={styles.sectionTitle}>Search Results</h2>
          <TheButton type={'primary'} onClick={() => setIsList(!isList)} className={styles.viewToggleBtn} icon={isList ? <MdGridOn /> : <MdList />}>
            {isList ? 'Show as Grid' : 'Show as List'}
          </TheButton>
        </div>
        {results.length === 0 ? <div className={styles.noResults}>No athletes found matching your search criteria.</div> : <AthleteList data={results || []} isTable={isList} />}
      </div>
    </div>
  );
};

export default ReportDetails;
