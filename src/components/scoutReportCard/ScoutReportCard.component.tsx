'use client';

import React from 'react';
import styles from './ScoutReportCard.module.scss';
import { ScoutReportCardProps } from './ScoutReportCard.types';
import DiamondRating from '@/components/diamondRating';

const ScoutReportCard: React.FC<ScoutReportCardProps> = ({ report, onClick }) => {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getReportTypeLabel = (reportType: string) => {
    const typeLabels: Record<string, string> = {
      game: 'Game',
      evaluation: 'Eval',
      camp: 'Camp',
      combine: 'Combine',
      interview: 'Interview',
      other: 'Other',
    };
    return typeLabels[reportType] || reportType;
  };

  // Check if report is private (using isPublic field - private when isPublic is false)
  const isPrivateReport = report.isPublic === false;

  return (
    <div className={`${styles.reportCard} ${onClick ? styles.clickable : ''} ${isPrivateReport ? styles.privateReport : ''}`} onClick={onClick}>
      {/* Scout Profile & Basic Info */}
      <div className={styles.cardHeader}>
        <div className={styles.scoutProfile}>
          <div className={styles.scoutAvatar}>{report.scout?.displayName?.charAt(0) || 'S'}</div>
          <div className={styles.scoutInfo}>
            <h4 className={styles.scoutName}>{report.scout?.displayName || report.scout?.user?.fullName || 'Anonymous Scout'}</h4>
            {!isPrivateReport && report.scout?.teams && report.scout.teams.length > 0 && <span className={styles.scoutOrg}>{report.scout.teams[0]}</span>}
          </div>
        </div>

        {/* Rating - Always shown even for private reports */}
        <div className={styles.rating}>
          <DiamondRating rating={report.diamondRating} size="small" showValue={true} className={styles.cardRating} />
        </div>
      </div>

      {/* Report Details */}
      <div className={styles.cardBody}>
        <div className={styles.reportMeta}>
          {!isPrivateReport && <span className={styles.reportType}>{getReportTypeLabel(report.reportType)}</span>}
          <span className={styles.reportDate}>{formatDate(report.createdAt)}</span>
          {!isPrivateReport && report.sport && (
            <span className={styles.sportInfo}>
              {report.sport}
              {report.league && ` • ${report.league}`}
            </span>
          )}
        </div>

        {/* General Observations - Always shown for private reports */}
        {report.observations && (
          <div className={styles.observations}>
            <p className={styles.observationText}>
              {isPrivateReport ? (report.observations.length > 100 ? `${report.observations.substring(0, 100)}...` : report.observations) : report.observations}
            </p>
          </div>
        )}

        {/* Status Badges - Hidden for private reports */}
        {!isPrivateReport && (
          <div className={styles.statusBadges}>
            {report.isFinalized && <span className={styles.finalizedBadge}>✓</span>}
            {report.isDraft && <span className={styles.draftBadge}>📝</span>}
            {report.isPublic && <span className={styles.publicBadge}>🌐</span>}
            {report.status && <span className={`${styles.statusBadge} ${styles[report.status]}`}>{report.status}</span>}
          </div>
        )}

        {/* Private Report Indicator */}
        {isPrivateReport && (
          <div className={styles.privateIndicator}>
            <span className={styles.privateBadge}>🔒 Private Report</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScoutReportCard;
