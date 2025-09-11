'use client';
import { Tabs, TabsProps } from 'antd';
import BasicInfo from './subViews/basicInfo/BasicInfo.component';
import useApiHook from '@/hooks/useApi';
import { useQueryClient } from '@tanstack/react-query';
import UserManagement from './subViews/userManagement';
import OtherInfo from './subViews/otherInfo/OtherInfo.view';
import Benefits from './subViews/benefits/Benefits.view';

const Profile = () => {
  const queryClient = useQueryClient();

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
    {
      label: 'Additional Info',
      key: '2',
      children: <OtherInfo />,
    },
    {
      label: 'Benefits',
      key: '3',
      children: <Benefits />,
    },
    {
      label: 'User Management',
      key: '4',
      children: <UserManagement onUserRemoved={() => {}} />,
    },
  ];

  return (
    <div>
      <Tabs defaultActiveKey="1" type="card" items={tabs} animated />
    </div>
  );
};

export default Profile;
