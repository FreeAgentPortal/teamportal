import React, { useState } from 'react';
import Link from 'next/link';
import { Modal, Button, Descriptions, Space, Badge, Avatar, Select } from 'antd';
import { CheckCircleOutlined, ClockCircleOutlined, MailOutlined, CloseCircleOutlined, MinusCircleOutlined, TrophyOutlined, UserOutlined, EyeOutlined } from '@ant-design/icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '@/utils/axios';
import { RegistrationStatus, IEventRegistration } from '@/types/IEventRegistration';
import { useInterfaceStore } from '@/state/interface';
import styles from './RegistrationDetailModal.module.scss';

interface RegistrationDetailModalProps {
  open: boolean;
  registration: IEventRegistration | null;
  onClose: () => void;
}

// Map status to icons and colors
const statusConfig = {
  [RegistrationStatus.INTERESTED]: { icon: 'EyeOutlined', label: 'Interested', color: 'default' },
  [RegistrationStatus.APPLIED]: { icon: 'FormOutlined', label: 'Applied', color: 'blue' },
  [RegistrationStatus.CONFIRMED]: { icon: 'CheckCircleOutlined', label: 'Confirmed', color: 'green' },
  [RegistrationStatus.WAITLISTED]: { icon: 'ClockCircleOutlined', label: 'Waitlisted', color: 'orange' },
  [RegistrationStatus.DECLINED]: { icon: 'CloseCircleOutlined', label: 'Declined', color: 'red' },
  [RegistrationStatus.NO_SHOW]: { icon: 'MinusCircleOutlined', label: 'No Show', color: 'volcano' },
  [RegistrationStatus.ATTENDED]: { icon: 'TrophyOutlined', label: 'Attended', color: 'cyan' },
};

const RegistrationDetailModal: React.FC<RegistrationDetailModalProps> = ({ open, registration, onClose }) => {
  const queryClient = useQueryClient();
  const addAlert = useInterfaceStore((state) => state.addAlert);
  const [selectedStatus, setSelectedStatus] = useState<RegistrationStatus | null>(null);

  // Reset selected status when modal opens with new registration
  React.useEffect(() => {
    if (open && registration) {
      setSelectedStatus(registration.status);
    }
  }, [open, registration]);

  // Mutation to update registration status
  const { mutate: updateStatus, isPending } = useMutation({
    mutationFn: async ({ eventId, registrantId, status }: { eventId: string; registrantId: string; status: RegistrationStatus }) => {
      const response = await axios.put(`/feed/event/${eventId}/registration/${registrantId}/status`, { status });
      return response.data;
    },
    onSuccess: (data, variables) => {
      addAlert({
        type: 'success',
        message: 'Registration status updated successfully',
        duration: 3000,
      });
      // Invalidate and refetch registration queries
      queryClient.invalidateQueries({ queryKey: ['event-registrations'] });
      queryClient.invalidateQueries({ queryKey: ['event-registration-count'] });
      onClose();
    },
    onError: (error: any) => {
      addAlert({
        type: 'error',
        message: error?.response?.data?.message || 'Failed to update registration status',
      });
    },
  });

  const handleStatusChange = () => {
    if (!registration?.profile?._id) {
      addAlert({
        type: 'error',
        message: 'Cannot update status: Profile ID not found',
      });
      return;
    }

    if (!selectedStatus) {
      addAlert({
        type: 'error',
        message: 'Please select a status',
      });
      return;
    }

    updateStatus({
      eventId: registration.eventId,
      registrantId: registration.profile._id,
      status: selectedStatus,
    });
  };

  if (!registration) return null;

  return (
    <Modal
      title="Registration Details"
      open={open}
      onCancel={onClose}
      width={700}
      footer={[
        <div
          key="footer"
          style={{
            display: 'flex',
            gap: '10px',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Button type="primary" onClick={handleStatusChange} loading={isPending} disabled={!selectedStatus || selectedStatus === registration.status}>
            Update Status
          </Button>
          <div style={{ display: 'flex', gap: '10px' }}>
            {registration.profile && (
              <Link key="profile" href={`/opportunities_hub/athletes/${registration.profile._id}`} passHref>
                <Button icon={<EyeOutlined />}>View Profile</Button>
              </Link>
            )}
            <Button key="close" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>,
      ]}
    >
      <div className={styles.modalContent}>
        {/* Profile Header */}
        {registration.profile && (
          <div className={styles.profileHeader}>
            <Avatar size={64} src={registration.profile.profileImageUrl} icon={<UserOutlined />} />
            <div className={styles.profileInfo}>
              <h3 className={styles.profileName}>{registration.profile.fullName}</h3>
              <p className={styles.profileEmail}>{registration.profile.email}</p>
              <Badge count={registration.role} color="blue" style={{ textTransform: 'capitalize' }} />
            </div>
          </div>
        )}

        {/* Registration Details */}
        <Descriptions bordered column={1} size="small" className={styles.detailsSection}>
          <Descriptions.Item label="Status">
            <Badge count={statusConfig[registration.status]?.label || registration.status} color={statusConfig[registration.status]?.color} />
          </Descriptions.Item>
          <Descriptions.Item label="Registered">{new Date(registration.createdAt).toLocaleString()}</Descriptions.Item>
          <Descriptions.Item label="Last Updated">{new Date(registration.updatedAt).toLocaleString()}</Descriptions.Item>
        </Descriptions>

        {registration.answers && registration.answers.length > 0 && (
          <div className={styles.answersSection}>
            <h4>Registration Answers</h4>
            <Descriptions bordered column={1} size="small">
              {registration.answers.map((item) => (
                <Descriptions.Item key={item.key} label={item.label}>
                  {String(item.answer)}
                </Descriptions.Item>
              ))}
            </Descriptions>
          </div>
        )}

        <div className={styles.actionsSection}>
          <h4>Update Status</h4>
          <Select
            value={selectedStatus}
            onChange={(value) => setSelectedStatus(value)}
            style={{ width: '100%' }}
            disabled={isPending}
            placeholder="Select status"
            options={[
              { value: RegistrationStatus.INTERESTED, label: '👁️ Interested' },
              { value: RegistrationStatus.APPLIED, label: '📝 Applied' },
              { value: RegistrationStatus.CONFIRMED, label: '✅ Confirmed' },
              { value: RegistrationStatus.WAITLISTED, label: '⏰ Waitlisted' },
              { value: RegistrationStatus.DECLINED, label: '❌ Declined' },
              { value: RegistrationStatus.NO_SHOW, label: '⊖ No Show' },
              { value: RegistrationStatus.ATTENDED, label: '🏆 Attended' },
            ]}
          />
        </div>
      </div>
    </Modal>
  );
};

export default RegistrationDetailModal;
