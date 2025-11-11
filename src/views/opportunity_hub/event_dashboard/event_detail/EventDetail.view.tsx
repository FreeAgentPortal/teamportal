'use client';
import React, { useState } from 'react';
import { useEvent } from '../hooks';
import { Tabs, Tag, Spin, Alert, Button } from 'antd';
import { TeamOutlined, EditOutlined } from '@ant-design/icons';
import { getEventDetailTabs } from './eventDetailTabs';
import EventModal from '../components/eventModal/EventModal';
import dayjs from 'dayjs';
import styles from './EventDetail.module.scss';
dayjs.extend(require('dayjs/plugin/relativeTime'));

interface EventDetailProps {
  id?: string;
}

const EventDetail = ({ id }: EventDetailProps) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: eventData, isLoading, error } = useEvent(id as string);

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <Spin size="large" />
        <p>Loading event details...</p>
      </div>
    );
  }

  if (error || !eventData) {
    return (
      <div className={styles.errorContainer}>
        <Alert message="Error Loading Event" description="Unable to load event details. Please try again." type="error" showIcon />
      </div>
    );
  }

  const event = eventData.payload as any;

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      scheduled: 'green',
      completed: 'blue',
      canceled: 'red',
      postponed: 'orange',
    };
    return colors[status] || 'default';
  };

  const tabItems = getEventDetailTabs(event, id as string);

  return (
    <div className={styles.container}>
      {/* Header Section */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.titleSection}>
            <div className={styles.titleRow}>
              <h1 className={styles.title}>{event.title}</h1>
              <Button type="primary" icon={<EditOutlined />} onClick={() => setIsModalOpen(true)} className={styles.editButton}>
                Edit Event
              </Button>
            </div>
            <div className={styles.tags}>
              <Tag color="blue">{event?.type?.toUpperCase()}</Tag>
              <Tag color={getStatusColor(event.status)}>{event?.status?.toUpperCase()}</Tag>
              {event.sport && <Tag icon={<TeamOutlined />}>{event.sport}</Tag>}
              <Tag>{event.visibility.toUpperCase()}</Tag>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Content */}
      <div className={styles.content}>
        <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} size="large" className={styles.eventTabs} />
      </div>

      {/* Event Edit Modal */}
      <EventModal open={isModalOpen} onClose={() => setIsModalOpen(false)} event={event} onSuccess={() => setIsModalOpen(false)} />
    </div>
  );
};

export default EventDetail;
