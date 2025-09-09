'use client';
import { useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import React, { Suspense, useEffect } from 'react';
import io from 'socket.io-client';
import { logout, useUser } from '@/state/auth';
import { useSocketStore } from '@/state/socket';
import PageLayout from '../page/Page.layout';
import useApiHook from '@/hooks/useApi';
import { Skeleton } from 'antd';
import PolicyCheckWrapper from '../policyCheckWrapper/PolicyCheckWrapper.layout';

type Props = {
  children: React.ReactNode;
};
const AppWrapper = (props: Props) => {
  const queryClient = useQueryClient();
  //Set up state
  const searchParams = useSearchParams();
  const token = searchParams.get('token') as string;
  const { data: loggedInData, isLoading: userIsLoading } = useUser(token);
  const { data: selectedProfile } = useApiHook({
    method: 'GET',
    key: ['profile', 'team'],
    url: `/team/profile/${loggedInData?.profileRefs['team']}`,
    enabled: !!loggedInData?.profileRefs['team'],
  });
  //Set up socket connection
  const { socket, isConnecting, setSocket, setIsConnecting } = useSocketStore((state: any) => state);

  useEffect(() => {
    if (process.env.API_URL) {
      setIsConnecting(true);
      const socket = io(process.env.NODE_ENV === 'development' ? 'http://localhost:5000' : process.env.API_URL.replace('/api/v1', ''));
      socket.on('connect', () => {
        setIsConnecting(false);
        setSocket(socket);
      });
      return () => {
        socket.disconnect();
      };
    }
  }, []);

  useEffect(() => {
    //If there is a user and a socket connection, setup a setup event with the user data

    if (socket && isConnecting) {
      // Listen for user updates
      socket.emit('setup', loggedInData);
      socket.on('updateUser', () => {
        queryClient.invalidateQueries(['user'] as any);
      });
    }

    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [socket]);

  // if the profile data is missing or the user doesnt have access to this profile log them out
  useEffect(() => {
    if (loggedInData && !loggedInData?.profileRefs['team']) {
      // alert
      console.error('Profile data is missing or user does not have access to this profile. Logging out.');
      alert('Profile data is missing or user does not have access to this profile. Logging out.');
      logout();
    }
  }, [loggedInData, selectedProfile]);

  if (userIsLoading || (!userIsLoading && !selectedProfile)) {
    return (
      <PageLayout>
        <Skeleton active />
      </PageLayout>
    ); // or skeleton loader
  }
  return (
    <Suspense fallback={<Skeleton active />}>
      <PolicyCheckWrapper>{props.children}</PolicyCheckWrapper>
    </Suspense>
  );
};

export default AppWrapper;
