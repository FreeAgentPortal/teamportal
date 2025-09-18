'use client';
import React, { useState } from 'react';
import { Tabs, Tag, Tooltip } from 'antd';
import { MessageOutlined, UserOutlined } from '@ant-design/icons';
import styles from './AthleteDetails.module.scss';
import { IAthlete } from '@/types/IAthleteType';
import MetricsView from './subviews/metrics/Metrics.view';
import MeasurementsView from './subviews/measurements/Measurements.view';
import ScoutReportsView from './subviews/scoutReports/ScoutReports.view';
import AgentView from './subviews/agent/Agent.view';
import Link from 'next/link';
import DiamondRating from '@/components/diamondRating/DiamondRating.component';
import { MdFavorite, MdFavoriteBorder } from 'react-icons/md';
import { useFavoriteAthlete } from '@/hooks/useFavoriteAthlete';
import { useAthleteConversations } from '@/hooks/useAthleteConversation';
import TheButton from '@/components/button/Button.component';
import Resume from './subviews/resume/Resume.view';
import Image from 'next/image';

interface AthleteDetailsProps {
  athlete?: IAthlete;
}

const AthleteDetails: React.FC<AthleteDetailsProps> = ({ athlete }) => {
  const [activeTab, setActiveTab] = useState('metrics');

  const { isFavorited, handleToggleFavoriteAthlete } = useFavoriteAthlete(athlete);
  const { hasConversation, handleStartConversation, getConversationId } = useAthleteConversations(athlete);

  if (!athlete) {
    return (
      <div className={styles.container}>
        <div className={styles.noData}>
          <p>No athlete data available</p>
        </div>
      </div>
    );
  }

  const tabItems = [
    {
      key: 'metrics',
      label: 'Metrics',
      children: <MetricsView athlete={athlete} />,
    },
    {
      key: 'Personal-Info',
      label: 'Personal Info',
      children: <MeasurementsView athlete={athlete} />,
    },
    {
      key: 'scout-reports',
      label: 'Scout Reports',
      children: <ScoutReportsView athlete={athlete} />,
    },
    {
      key: 'agent',
      label: 'Agent',
      children: <AgentView athlete={athlete} />,
    },
    {
      key: 'resume',
      label: 'Resume',
      children: <Resume athlete={athlete} />,
    },
  ];

  return (
    <div className={styles.container}>
      {/* Header Section with Basic Info */}
      <div className={styles.header}>
        <div className={styles.athleteInfo}>
          <div className={styles.avatarSection}>
            <Image alt={athlete.fullName} width={200} height={200} src={athlete.profileImageUrl || '/images/no-photo.png'} className={styles.avatar} />
          </div>

          <div className={styles.basicInfo}>
            <h1 className={styles.athleteName}>{athlete.fullName}</h1>

            <div className={styles.details}>
              {athlete.positions && athlete.positions?.length > 0 && (
                <div className={styles.positions}>
                  {athlete.positions?.map((position) => (
                    <Tag key={position.name} className={styles.positionTag}>
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

              {/* Agent Indicator */}
              {athlete.agent && (athlete.agent.name || athlete.agent.email || athlete.agent.phone) && (
                <div className={styles.agentIndicator}>
                  <UserOutlined className={styles.agentIcon} />
                  <span className={styles.agentText}>Represented by Agent</span>
                  {athlete.agent.name && <span className={styles.agentName}>({athlete.agent.name})</span>}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className={styles.ctaSection}>
          <Tooltip
            title={athlete.userId ? (hasConversation() ? 'Go to Conversation' : 'Start a Conversation with this Athlete') : 'Athlete is not registered with Free Agent Portal'}
          >
            {hasConversation() ? (
              <Link href={`/opportunities_hub/messages/${getConversationId()}`}>
                <TheButton type="primary" size="large" icon={<MessageOutlined />} className={styles.conversationBtn}>
                  Go to Conversation
                </TheButton>
              </Link>
            ) : (
              <TheButton
                type="primary"
                size="large"
                icon={<MessageOutlined />}
                onClick={() => handleStartConversation()}
                className={styles.conversationBtn}
                disabled={!athlete._id}
              >
                Start Conversation
              </TheButton>
            )}
          </Tooltip>

          <Tooltip title={athlete.userId ? (isFavorited() ? 'Remove from favorites list' : 'Add to favorites list') : 'Athlete is not registered with Free Agent Portal'}>
            <TheButton
              type="primary"
              size="large"
              icon={isFavorited() ? <MdFavorite /> : <MdFavoriteBorder />}
              onClick={() => handleToggleFavoriteAthlete()}
              className={styles.conversationBtn}
              disabled={!athlete._id}
            >
              {isFavorited() ? 'Remove from favorites' : 'Add to favorites'}
            </TheButton>
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
