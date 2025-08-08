'use client';
import React from 'react';
import styles from './Profile.module.scss';
import { Tabs, TabsProps } from 'antd';
import BasicInfo from './subViews/basicInfo/BasicInfo.component';
import useApiHook from '@/hooks/useApi';
import { useQueryClient } from '@tanstack/react-query';

const Profile = () => {
  const queryClient = useQueryClient();
  const profile = queryClient.getQueryData(['profile', 'team']) as any;
 
  const { mutate: handleSubmit } = useApiHook({
    method: 'PUT',
    key: 'updateProfile',
    queriesToInvalidate: ['profile,team'],
    successMessage: 'Profile updated successfully',
  }) as any;
  const tabs: TabsProps['items'] = [
    {
      label: 'Info',
      key: '1',
      children: <BasicInfo />,
    },
  ];

  return (
    <div className={styles.container}>
      <Tabs defaultActiveKey="1" type="card" items={tabs} animated />
    </div>
  );
};

export default Profile;
