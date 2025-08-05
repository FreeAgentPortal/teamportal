'use client';
import React, { useState } from 'react';
import { Button, Tabs, Avatar, Tag, Tooltip } from 'antd';
import { MessageOutlined, UserOutlined } from '@ant-design/icons';
import styles from './AthleteDetails.module.scss';
import { IAthlete } from '@/types/IAthleteType';
import MetricsView from './subviews/metrics/Metrics.view';
import MeasurementsView from './subviews/measurements/Measurements.view';
import ScoutReportsView from './subviews/scoutReports/ScoutReports.view';
import DiamondRating from '@/components/diamondRating/DiamondRating.component';

interface AthleteDetailsProps {
  athlete?: IAthlete;
}

const AthleteDetails: React.FC<AthleteDetailsProps> = ({ athlete }) => {
  const [activeTab, setActiveTab] = useState('metrics');

  const handleStartConversation = () => {
    // TODO: Implement conversation functionality
    console.log('Starting conversation with athlete:', athlete?.fullName);
  };

  const tabItems = [
    {
      key: 'metrics',
      label: 'Metrics',
      children: <MetricsView athlete={athlete} />,
    },
    {
      key: 'measurements',
      label: 'Measurements',
      children: <MeasurementsView athlete={athlete} />,
    },
    {
      key: 'scout-reports',
      label: 'Scout Reports',
      children: <ScoutReportsView athlete={athlete} />,
    },
  ];

  if (!athlete) {
    return (
      <div className={styles.container}>
        <div className={styles.noData}>
          <p>No athlete data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header Section with Basic Info */}
      <div className={styles.header}>
        <div className={styles.athleteInfo}>
          <div className={styles.avatarSection}>
            <Avatar size={120} src={athlete.profileImageUrl} icon={<UserOutlined />} className={styles.avatar} />
          </div>

          <div className={styles.basicInfo}>
            <h1 className={styles.athleteName}>{athlete.fullName}</h1>

            <div className={styles.details}>
              {athlete.positions && athlete.positions.length > 0 && (
                <div className={styles.positions}>
                  {athlete.positions.map((position) => (
                    <Tag key={position._id} className={styles.positionTag}>
                      {position.name}
                    </Tag>
                  ))}
                </div>
              )}

              {athlete.college && <p className={styles.college}>{athlete.college}</p>}

              {athlete.graduationYear && <p className={styles.graduationYear}>Class of {athlete.graduationYear}</p>}

              {athlete.experienceYears && <p className={styles.experience}>{athlete.experienceYears} years experience</p>}

              {athlete.diamondRating && (
                <div className={styles.rating}>
                  <span className={styles.ratingLabel}>Diamond Rating:</span>
                  <DiamondRating rating={athlete.diamondRating} size="large" showValue={true} className={styles.athleteRating} />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className={styles.ctaSection}>
          <Tooltip title={athlete.userId ? 'Start a conversation with this athlete' : 'Athlete Is not registered with Free Agent Portal'}>
            <Button type="primary" size="large" icon={<MessageOutlined />} onClick={handleStartConversation} className={styles.conversationBtn} disabled={!athlete.userId}>
              Start Conversation
            </Button>
          </Tooltip>
        </div>
      </div>

      {/* Tabs Section */}
      <div className={styles.tabsContainer}>
        <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} className={styles.tabs} size="large" />
      </div>
    </div>
  );
};

export default AthleteDetails;
