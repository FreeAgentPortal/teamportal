import React from 'react';
import styles from './BasicInfo.module.scss';
import formStyles from '@/styles/Form.module.scss';
import { Button, Form, Input, Switch, ColorPicker } from 'antd';
import { useQueryClient } from '@tanstack/react-query';
import { ITeamType } from '@/types/ITeamType';
import useApiHook from '@/hooks/useApi';
import PhotoUpload from '@/components/photoUpload/PhotoUpload.component';

const BasicInfo = () => {
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
    <>
      <div className={styles.container}>
        <div className={styles.headerSection}>
          <h1 className={styles.title}>Team Basic Info</h1>
          <p className={styles.description}>Update your team&apos;s basic information here.</p>
        </div>

        <Form form={form} layout="vertical" className={styles.formContainer} onFinish={handleSubmit}>
          <div className={styles.formSection}>
            <h3 className={styles.sectionTitle}>Essential Information</h3>
            <div className={styles.formGroup}>
              <div className={formStyles.row}>
                <div className={`${styles.imageContainer} ${formStyles.field}`}>
                  <PhotoUpload
                    default={teamLogo}
                    name="logoUrl"
                    label="Upload Team Logo"
                    action={`${process.env.API_URL}/upload/cloudinary/file`}
                    isAvatar={false}
                    form={form}
                    aspectRatio={1}
                    placeholder="Upload team logo"
                    tooltip="Upload a team logo image file"
                    imgStyle={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: '200px',
                      height: '200px',
                      objectFit: 'contain',
                    }}
                  />
                </div>
                <div className={`${formStyles.row} ${formStyles.column}`}>
                  <Form.Item label="Team Name" name="name" rules={[{ required: true, message: 'Please enter the team name' }]} className={formStyles.field}>
                    <Input type="text" size="large" />
                  </Form.Item>
                  <Form.Item
                    label="Coach Name"
                    name="coachName"
                    tooltip="For administrative purposes only - not displayed publicly"
                    help="This information is used for internal communication and is not shown to athletes or other teams"
                    className={formStyles.field}
                  >
                    <Input type="text" size="large" placeholder="Enter coach's name" />
                  </Form.Item>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.formSection}>
            <h3 className={styles.sectionTitle}>Contact Information</h3>
            <div className={styles.formGroup}>
              <Form.Item
                label="Email"
                name="email"
                rules={[{ type: 'email', message: 'Please enter a valid email' }]}
                tooltip="For administrative communication only - not displayed publicly"
                help="This email will be used for platform notifications and administrative purposes only"
                className={formStyles.field}
              >
                <Input type="email" size="large" placeholder="team@example.com" />
              </Form.Item>
              <div className={formStyles.row}>
                <Form.Item
                  label="Phone Number"
                  name="phone"
                  tooltip="For administrative purposes only - not displayed publicly"
                  help="Used for urgent communications and verification"
                  className={formStyles.field}
                >
                  <Input type="tel" size="large" placeholder="(555) 123-4567" className={formStyles.input} />
                </Form.Item>
                <Form.Item
                  label="Location"
                  name="location"
                  tooltip="General location for administrative purposes - not displayed publicly"
                  help="Used for regional grouping and administrative purposes"
                  className={formStyles.field}
                >
                  <Input type="text" size="large" placeholder="e.g., CA, TX" className={formStyles.input} />
                </Form.Item>
              </div>
            </div>
          </div>

          <div className={styles.formSection}>
            <h3 className={styles.sectionTitle}>Team Identity</h3>
            <div className={styles.formGroup}>
              <Form.Item
                label="Logo URL"
                name="logoUrl"
                tooltip="Provide an HTTPS link to your team's logo image"
                rules={[
                  { type: 'url', message: 'Please enter a valid URL' },
                  { pattern: /^https:\/\//, message: 'Logo URL must start with https://' },
                ]}
                className={formStyles.field}
              >
                <Input type="url" size="large" placeholder="https://example.com/logo.png" />
              </Form.Item>
              <div className={formStyles.row}>
                <Form.Item label="Team Abbreviation" name="abbreviation" tooltip="e.g., SF for San Francisco 49ers" className={formStyles.field}>
                  <Input type="text" size="large" placeholder="e.g., SF" className={formStyles.input} />
                </Form.Item>
                <Form.Item label="Short Display Name" name="shortDisplayName" tooltip="e.g., 49ers" className={formStyles.field}>
                  <Input type="text" size="large" placeholder="e.g., 49ers" className={formStyles.input} />
                </Form.Item>
              </div>
              <div className={formStyles.row}>
                <Form.Item label="Team Color" name="color" rules={[{ required: true, message: 'Please select a team color' }]} className={formStyles.field}>
                  <ColorPicker size="large" showText value={form.getFieldValue('color')} onChange={(color) => form.setFieldsValue({ color: color.toHexString() })} />
                </Form.Item>
                <Form.Item label="Alternate Color" name="alternateColor" className={formStyles.field}>
                  <ColorPicker
                    size="large"
                    showText
                    value={form.getFieldValue('alternateColor')}
                    onChange={(color) => form.setFieldsValue({ alternateColor: color.toHexString() })}
                  />
                </Form.Item>
              </div>
            </div>
          </div>

          <div className={styles.formSection}>
            <h3 className={styles.sectionTitle}>Additional Settings</h3>
            <div className={styles.formGroup}>
              <Form.Item label="Verified Domain" name="verifiedDomain" tooltip="e.g., example.edu" className={formStyles.field}>
                <Input type="text" size="large" placeholder="e.g., example.edu" className={formStyles.input} />
              </Form.Item>
              <div className={styles.switchContainer}>
                <Form.Item label="Open to Tryouts" name="openToTryouts" valuePropName="checked" className={styles.switchField}>
                  <Switch size="default" />
                </Form.Item>
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
    </>
  );
};

export default BasicInfo;
