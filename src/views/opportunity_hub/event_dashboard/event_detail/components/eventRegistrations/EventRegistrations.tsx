'use client';
import React, { useState } from 'react';
import { Card, Tabs, Badge, Spin, Empty } from 'antd';
import {
  UserOutlined,
  EyeOutlined,
  FormOutlined,
  MailOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  MinusCircleOutlined,
  TrophyOutlined,
} from '@ant-design/icons';
import { RegistrationStatus, IEventRegistration } from '@/types/IEventRegistration';
import useApiHook from '@/hooks/useApi';
import RegistrationDetailModal from './RegistrationDetailModal';
import styles from './EventRegistrations.module.scss';

interface EventRegistrationsProps {
  eventId: string;
}

// Map status to icons and colors
const statusConfig = {
  [RegistrationStatus.INTERESTED]: { icon: <EyeOutlined />, label: 'Interested', color: 'default' },
  [RegistrationStatus.APPLIED]: { icon: <FormOutlined />, label: 'Applied', color: 'blue' },
  [RegistrationStatus.CONFIRMED]: { icon: <CheckCircleOutlined />, label: 'Confirmed', color: 'green' },
  [RegistrationStatus.WAITLISTED]: { icon: <ClockCircleOutlined />, label: 'Waitlisted', color: 'orange' },
  [RegistrationStatus.DECLINED]: { icon: <CloseCircleOutlined />, label: 'Declined', color: 'red' },
  [RegistrationStatus.NO_SHOW]: { icon: <MinusCircleOutlined />, label: 'No Show', color: 'volcano' },
  [RegistrationStatus.ATTENDED]: { icon: <TrophyOutlined />, label: 'Attended', color: 'cyan' },
};

const EventRegistrations = ({ eventId }: EventRegistrationsProps) => {
  const [activeStatus, setActiveStatus] = useState<RegistrationStatus>(RegistrationStatus.APPLIED);
  const [selectedRegistration, setSelectedRegistration] = useState<IEventRegistration | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCardClick = (registration: IEventRegistration) => {
    setSelectedRegistration(registration);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedRegistration(null);
  };

  // Fetch counts for all statuses - must call hooks at top level
  const { data: interestedCountData } = useApiHook({
    method: 'GET',
    url: `/feed/event/${eventId}/registration/count?status=${RegistrationStatus.INTERESTED}`,
    key: ['event-registration-count', eventId, RegistrationStatus.INTERESTED],
    enabled: !!eventId,
  }) as any;

  const { data: appliedCountData } = useApiHook({
    method: 'GET',
    url: `/feed/event/${eventId}/registration/count?status=${RegistrationStatus.APPLIED}`,
    key: ['event-registration-count', eventId, RegistrationStatus.APPLIED],
    enabled: !!eventId,
  }) as any;

  const { data: confirmedCountData } = useApiHook({
    method: 'GET',
    url: `/feed/event/${eventId}/registration/count?status=${RegistrationStatus.CONFIRMED}`,
    key: ['event-registration-count', eventId, RegistrationStatus.CONFIRMED],
    enabled: !!eventId,
  }) as any;

  const { data: waitlistedCountData } = useApiHook({
    method: 'GET',
    url: `/feed/event/${eventId}/registration/count?status=${RegistrationStatus.WAITLISTED}`,
    key: ['event-registration-count', eventId, RegistrationStatus.WAITLISTED],
    enabled: !!eventId,
  }) as any;

  const { data: declinedCountData } = useApiHook({
    method: 'GET',
    url: `/feed/event/${eventId}/registration/count?status=${RegistrationStatus.DECLINED}`,
    key: ['event-registration-count', eventId, RegistrationStatus.DECLINED],
    enabled: !!eventId,
  }) as any;

  const { data: noShowCountData } = useApiHook({
    method: 'GET',
    url: `/feed/event/${eventId}/registration/count?status=${RegistrationStatus.NO_SHOW}`,
    key: ['event-registration-count', eventId, RegistrationStatus.NO_SHOW],
    enabled: !!eventId,
  }) as any;

  const { data: attendedCountData } = useApiHook({
    method: 'GET',
    url: `/feed/event/${eventId}/registration/count?status=${RegistrationStatus.ATTENDED}`,
    key: ['event-registration-count', eventId, RegistrationStatus.ATTENDED],
    enabled: !!eventId,
  }) as any;

  const statusCounts: Record<string, number> = {
    [RegistrationStatus.INTERESTED]: interestedCountData?.payload.count || 0,
    [RegistrationStatus.APPLIED]: appliedCountData?.payload.count || 0,
    [RegistrationStatus.CONFIRMED]: confirmedCountData?.payload.count || 0,
    [RegistrationStatus.WAITLISTED]: waitlistedCountData?.payload.count || 0,
    [RegistrationStatus.DECLINED]: declinedCountData?.payload.count || 0,
    [RegistrationStatus.NO_SHOW]: noShowCountData?.payload.count || 0,
    [RegistrationStatus.ATTENDED]: attendedCountData?.payload.count || 0,
  };

  // Fetch registrations based on active status
  const { data: registrationsData, isLoading } = useApiHook({
    method: 'GET',
    url: `/feed/event/${eventId}/registration/all?status=${activeStatus}`,
    key: ['event-registrations', eventId, activeStatus],
    enabled: !!eventId,
  }) as any;

  const registrations = (registrationsData?.payload || []) as IEventRegistration[];
  const totalCount = registrationsData?.metadata?.totalCount || 0;

  // Generate tab items
  const tabItems = Object.values(RegistrationStatus).map((status) => {
    const config = statusConfig[status];
    const count = statusCounts[status] || 0;

    return {
      key: status,
      label: (
        <span>
          {config.icon} {config.label} <Badge count={count} showZero color={config.color} style={{ marginLeft: '8px' }} />
        </span>
      ),
      children: (
        <div className={styles.tabContent}>
          {isLoading ? (
            <div className={styles.loadingContainer}>
              <Spin size="large" />
              <p>Loading registrations...</p>
            </div>
          ) : registrations.length === 0 ? (
            <Empty description={`No ${config.label.toLowerCase()} registrations`} />
          ) : (
            <div className={styles.registrationsList}>
              {registrations.map((registration) => (
                <div key={registration._id} className={styles.registrationCard} onClick={() => handleCardClick(registration)}>
                  <div className={styles.cardContent}>
                    <div className={styles.userSection}>
                      <div className={styles.avatar}>
                        {registration.profile?.profileImageUrl ? <img src={registration.profile.profileImageUrl} alt={registration.profile.fullName} /> : <UserOutlined />}
                      </div>
                      <div className={styles.userInfo}>
                        <div className={styles.userName}>{registration.profile?.fullName || registration.userId}</div>
                        <div className={styles.userEmail}>{registration.profile?.email}</div>
                      </div>
                    </div>
                    <div className={styles.cardMeta}>
                      <div className={styles.roleTag}>
                        <span className={styles.userRole}>{registration.role}</span>
                      </div>
                      <Badge count={config.label} color={config.color} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ),
    };
  });

  return (
    <div className={styles.registrationsContainer}>
      <Card>
        <div className={styles.header}>
          <h3 className={styles.title}>Event Registrations</h3>
          {!isLoading && <Badge count={totalCount} showZero color="blue" />}
        </div>

        <Tabs activeKey={activeStatus} onChange={(key) => setActiveStatus(key as RegistrationStatus)} items={tabItems} size="large" className={styles.registrationTabs} />
      </Card>

      <RegistrationDetailModal open={isModalOpen} registration={selectedRegistration} onClose={handleModalClose} />
    </div>
  );
};

export default EventRegistrations;
