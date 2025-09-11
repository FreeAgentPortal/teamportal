import React from 'react';
import styles from '../Info.module.scss';
import formStyles from '@/styles/Form.module.scss';
import { Button, Form } from 'antd';
import { useQueryClient } from '@tanstack/react-query';
import { ITeamType } from '@/types/ITeamType';
import useApiHook from '@/hooks/useApi';
import TextArea from 'antd/es/input/TextArea';

const OtherInfo = () => {
  const queryClient = useQueryClient();
  const [teamLogo, setTeamLogo] = React.useState<string | undefined>(undefined);
  const profile = queryClient.getQueryData(['profile', 'team']) as any;
  const [form] = Form.useForm();

  const { mutate: updateProfile } = useApiHook({
    method: 'PUT',
    key: 'updateProfile',
    queriesToInvalidate: ['profile,team'],
    successMessage: 'Team profile updated successfully',
  }) as any;

  React.useEffect(() => {
    if (profile?.payload) {
      form.setFieldsValue({
        ...profile?.payload,
      });
      setTeamLogo(profile?.payload?.logoUrl);
    }
  }, [profile, form]);

  const handleSubmit = async (values: ITeamType) => {
    await updateProfile({
      url: `/profiles/team/${profile?.payload?._id}`,
      formData: values,
    });
  };
  return (
    <div className={styles.container}>
      <div className={styles.headerSection}>
        <h1 className={styles.title}>Additional Team Info</h1>
        <p className={styles.description}>Add some additional information about your team.</p>
      </div>

      <Form form={form} layout="vertical" className={styles.formContainer} onFinish={handleSubmit}>
        <div className={styles.formSection}>
          <div className={styles.formGroup}>
            <div className={formStyles.row}>
              <Form.Item label="Team Biography" name="bio" className={formStyles.field}>
                <TextArea rows={4} placeholder="Enter team biography" size="large" />
              </Form.Item>
            </div>
            <div className={styles.formGroup}>
              <div className={formStyles.row}>
                <Form.Item label="Team History" name="history" className={formStyles.field}>
                  <TextArea rows={4} placeholder="Enter team history" size="large" />
                </Form.Item>
              </div>
            </div>
          </div>
        </div>
      </Form>

      <div className={styles.actionContainer}>
        <Button className={styles.button} size="large" onClick={() => form.submit()} onSubmit={(e) => e.preventDefault()} type="primary">
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default OtherInfo;
