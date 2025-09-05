'use client';
import React from 'react';
import { Card, Typography, Space, Divider } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import styles from './Agent.module.scss';
import { IAthlete } from '@/types/IAthleteType';

const { Title, Text } = Typography;

interface AgentViewProps {
  athlete: IAthlete;
}

const AgentView: React.FC<AgentViewProps> = ({ athlete }) => {
  const { agent } = athlete;

  if (!agent) {
    return (
      <div className={styles.noAgent}>
        <Text type="secondary">No agent information available for this athlete.</Text>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Card className={styles.agentCard}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div className={styles.header}>
            <UserOutlined className={styles.agentIcon} />
            <Title level={3} className={styles.title}>
              Agent Information
            </Title>
          </div>

          <Divider />

          <div className={styles.agentDetails}>
            {agent.name && (
              <div className={styles.detailItem}>
                <Text strong className={styles.label}>
                  Name:
                </Text>
                <Text className={styles.value}>{agent.name}</Text>
              </div>
            )}

            {agent.email && (
              <div className={styles.detailItem}>
                <MailOutlined className={styles.icon} />
                <Text strong className={styles.label}>
                  Email:
                </Text>
                <a href={`mailto:${agent.email}`} className={styles.link}>
                  {agent.email}
                </a>
              </div>
            )}

            {agent.phone && (
              <div className={styles.detailItem}>
                <PhoneOutlined className={styles.icon} />
                <Text strong className={styles.label}>
                  Phone:
                </Text>
                <a href={`tel:${agent.phone}`} className={styles.link}>
                  {agent.phone}
                </a>
              </div>
            )}
          </div>
        </Space>
      </Card>
    </div>
  );
};

export default AgentView;
