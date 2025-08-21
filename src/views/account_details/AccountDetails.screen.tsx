'use client';
import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, Space, Divider } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined, SaveOutlined } from '@ant-design/icons';
import styles from './AccountDetails.module.scss';
import formStyles from '@/styles/Form.module.scss';
import useApiHook from '@/hooks/useApi';
import { useUser } from '@/state/auth';
import type User from '@/types/User';
import PhotoUpload from '@/components/photoUpload/PhotoUpload.component';
import { useInterfaceStore } from '@/state/interface';

const AccountDetails = () => {
  const { data: loggedInUser, refetch: refetchUser } = useUser();

  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState<string | undefined>(undefined);
  const { addAlert } = useInterfaceStore((state) => state);

  const { data: userData } = useApiHook({
    url: `/user/${loggedInUser?._id}`,
    key: ['user', loggedInUser?._id as string],
    method: 'GET',
  });

  // Update user basic info
  const { mutate: updateUser, isLoading: isUpdating } = useApiHook({
    method: 'PUT',
    key: 'user-update',
    queriesToInvalidate: ['user'],
  }) as any;

  // Update password
  const { mutate: updatePassword, isLoading: isUpdatingPassword } = useApiHook({
    method: 'PUT',
    url: `/user/${loggedInUser?._id}/password`,
    key: 'user-password-update',
  }) as any;

  useEffect(() => {
    if (userData?.payload) {
      form.setFieldsValue({
        firstName: userData.payload.firstName,
        lastName: userData.payload.lastName,
        email: userData.payload.email,
        phoneNumber: userData.payload.phoneNumber,
        profileImageUrl: userData.payload.profileImageUrl,
      });
      setProfileImage(userData.payload.profileImageUrl);
    }
  }, [userData, form]);

  // Watch for form field changes to update local state
  useEffect(() => {
    const handleFormChange = () => {
      const formImageUrl = form.getFieldValue('profileImageUrl');
      if (formImageUrl && formImageUrl !== profileImage) {
        setProfileImage(formImageUrl);
      }
    };

    // Set up form field listener
    const interval = setInterval(handleFormChange, 1000); // Check every second
    return () => clearInterval(interval);
  }, [form, profileImage]);

  const handleBasicInfoSubmit = (values: any) => {
    console.log('Basic Info Submitted:', values);
    console.log('Form values before submit:', form.getFieldsValue());
    console.log('ProfileImage state:', profileImage);

    // Ensure profileImageUrl is included in the submission
    const submitData = {
      ...values,
      profileImageUrl: values.profileImageUrl || profileImage,
    };
    console.log('Submit data:', submitData);

    updateUser(
      {
        url: `/user/${loggedInUser?._id}`,
        formData: submitData,
      },
      {
        onSuccess: () => {
          addAlert({
            type: 'success',
            message: 'Account information updated successfully',
            duration: 3000,
          });
          setIsEditing(false);
          refetchUser();
        },
        onError: (error: any) => {
          addAlert({
            type: 'error',
            message: error?.response?.data?.message || 'Failed to update account information',
            duration: 5000,
          });
        },
      }
    );
  };

  const handlePasswordSubmit = (values: any) => {
    if (values.newPassword !== values.confirmPassword) {
      addAlert({
        type: 'error',
        message: 'New passwords do not match',
        duration: 5000,
      });
      return;
    }

    updatePassword(
      {
        formData: {
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
        },
      },
      {
        onSuccess: () => {
          addAlert({
            type: 'success',
            message: 'Password updated successfully',
            duration: 3000,
          });
          form.resetFields(['currentPassword', 'newPassword', 'confirmPassword']);
        },
        onError: (error: any) => {
          addAlert({
            type: 'error',
            message: error?.response?.data?.message || 'Failed to update password',
            duration: 5000,
          });
        },
      }
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.contentContainer}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          {/* Profile Section */}
          <Card
            title="Profile Information"
            extra={
              <Button type="link" onClick={() => setIsEditing(!isEditing)} icon={isEditing ? <SaveOutlined /> : <UserOutlined />}>
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </Button>
            }
          >
            <div className={formStyles.form}>
              {/* Basic Information Form */}
              <Form form={form} layout="vertical" onFinish={handleBasicInfoSubmit} disabled={!isEditing}>
                {/* Profile Image Section */}
                <div className={styles.formSection}>
                  <div className={styles.formGroup}>
                    <div className={formStyles.row}>
                      <div className={`${styles.imageContainer}`}>
                        <PhotoUpload
                          default={profileImage}
                          name="profileImageUrl"
                          action={`${process.env.API_URL}/upload/cloudinary/file`}
                          isAvatar={true}
                          form={form}
                          aspectRatio={1}
                          placeholder="Upload your profile photo"
                          imgStyle={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: '200px',
                            height: '200px',
                            borderRadius: '50%',
                          }}
                        />
                      </div>
                      <div className={formStyles.column}>
                        <div className={formStyles.row}>
                          <Form.Item name="firstName" label="First Name" rules={[{ required: true, message: 'Please enter your first name' }]} className={formStyles.field}>
                            <Input prefix={<UserOutlined />} placeholder="Enter your first name" className={formStyles.input} />
                          </Form.Item>

                          <Form.Item name="lastName" label="Last Name" className={formStyles.field}>
                            <Input prefix={<UserOutlined />} placeholder="Enter your last name" className={formStyles.input} />
                          </Form.Item>
                        </div>
                        <div className={formStyles.row}>
                          <Form.Item
                            name="email"
                            label="Email Address"
                            rules={[
                              { required: true, message: 'Please enter your email' },
                              { type: 'email', message: 'Please enter a valid email' },
                            ]}
                            className={formStyles.field}
                          >
                            <Input prefix={<MailOutlined />} placeholder="Enter your email address" className={formStyles.input} />
                          </Form.Item>

                          <Form.Item name="phoneNumber" label="Phone Number" rules={[{ required: true, message: 'Please enter your phone number' }]} className={formStyles.field}>
                            <Input prefix={<PhoneOutlined />} placeholder="Enter your phone number" className={formStyles.input} />
                          </Form.Item>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {isEditing && (
                  <Form.Item>
                    <Space>
                      <Button type="primary" htmlType="submit" loading={isUpdating} icon={<SaveOutlined />}>
                        Save Changes
                      </Button>
                      <Button onClick={() => setIsEditing(false)}>Cancel</Button>
                    </Space>
                  </Form.Item>
                )}
              </Form>
            </div>
          </Card>

          {/* Password Section */}
          <Card title="Change Password">
            <div className={formStyles.form}>
              <Form layout="vertical" onFinish={handlePasswordSubmit}>
                <div className={formStyles.row}>
                  <Form.Item
                    name="newPassword"
                    label="New Password"
                    rules={[
                      { required: true, message: 'Please enter your new password' },
                      { min: 6, message: 'Password must be at least 6 characters' },
                    ]}
                    className={formStyles.field}
                  >
                    <Input.Password prefix={<LockOutlined />} placeholder="Enter your new password" />
                  </Form.Item>

                  <Form.Item
                    name="confirmPassword"
                    label="Confirm New Password"
                    rules={[
                      { required: true, message: 'Please confirm your new password' },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue('newPassword') === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(new Error('Passwords do not match'));
                        },
                      }),
                    ]}
                    className={formStyles.field}
                  >
                    <Input.Password prefix={<LockOutlined />} placeholder="Confirm your new password" />
                  </Form.Item>
                </div>

                <Form.Item>
                  <Button type="primary" htmlType="submit" loading={isUpdatingPassword} icon={<SaveOutlined />}>
                    Update Password
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </Card>
        </Space>
      </div>
    </div>
  );
};

export default AccountDetails;
