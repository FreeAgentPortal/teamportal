'use client';
import React, { useState } from 'react';
import { Button, Tabs, Avatar, Tag, Tooltip } from 'antd';
import { MessageOutlined, UserOutlined } from '@ant-design/icons';
import styles from './AthleteDetails.module.scss';
import { IAthlete } from '@/types/IAthleteType';
import MetricsView from './subviews/metrics/Metrics.view';
import MeasurementsView from './subviews/measurements/Measurements.view';
import ScoutReportsView from './subviews/scoutReports/ScoutReports.view';
import useApiHook from '@/hooks/useApi';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import DiamondRating from '@/components/diamondRating/DiamondRating.component';

interface AthleteDetailsProps {
  athlete?: IAthlete;
}

const AthleteDetails: React.FC<AthleteDetailsProps> = ({ athlete }) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('metrics');
  const { mutate: createConversation } = useApiHook({
    url: `/messaging`,
    method: 'POST',
    key: 'create_conversation',
    onSuccessCallback(data) {
      router.push(`/opportunities_hub/messages/${data.payload._id}`);
    },
  }) as any;

  const { data: conversations } = useApiHook({
    url: `/messaging?role=team`,
    method: 'GET',
    key: 'conversations',
    queriesToInvalidate: ['conversations'],
  }) as any;
  const handleStartConversation = () => {
    if (athlete?.userId) {
      createConversation({ formData: { athleteId: athlete._id, message: "Hello, let's connect." } });
    } else {
      alert('Athlete is not registered with Free Agent Portal');
    }
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

  const hasConversation = conversations?.payload?.some((conv: any) => conv.participants.athlete?._id === athlete._id);

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
          <Tooltip
            title={athlete.userId ? (hasConversation ? 'Go to Conversation' : 'Start a Conversation with this Athlete') : 'Athlete Is not registered with Free Agent Portal'}
          >
            {hasConversation ? (
              <Link href={`/opportunities_hub/messages/${conversations.payload.find((conv: any) => conv.participants.athlete?._id === athlete._id)._id}`}>
                <Button type="primary" size="large" icon={<MessageOutlined />} className={styles.conversationBtn}>
                  Go to Conversation
                </Button>
              </Link>
            ) : (
              <Button type="primary" size="large" icon={<MessageOutlined />} onClick={handleStartConversation} className={styles.conversationBtn} disabled={!athlete.userId}>
                Start Conversation
              </Button>
            )}
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
