import React from 'react';
import { Card, Descriptions, Empty, Row, Col, Tag } from 'antd';
import { UserOutlined, CalendarOutlined, EnvironmentOutlined } from '@ant-design/icons';
import styles from './Measurements.module.scss';
import { IAthlete } from '@/types/IAthleteType';
import moment from 'moment';

interface MeasurementsViewProps {
  athlete?: IAthlete;
}

const MeasurementsView: React.FC<MeasurementsViewProps> = ({ athlete }) => {
  const measurements = athlete?.measurements;
  const hasPhysicalData = measurements && Object.keys(measurements).length > 0;
  const hasPersonalData = athlete?.birthdate || athlete?.birthPlace || athlete?.contactNumber || athlete?.email;

  if (!hasPhysicalData && !hasPersonalData) {
    return (
      <div className={styles.container}>
        <Empty description="No measurement data available" className={styles.empty} />
      </div>
    );
  }

  const formatMeasurement = (value: string | number, key: string) => {
    const keyLower = key.toLowerCase();

    if (keyLower.includes('height')) {
      return typeof value === 'string' ? value : `${value}"`;
    }

    if (keyLower.includes('weight')) {
      return typeof value === 'string' ? value : `${value} lbs`;
    }

    if (keyLower.includes('wingspan') || keyLower.includes('reach')) {
      return typeof value === 'string' ? value : `${value}"`;
    }

    return value.toString();
  };

  const getMeasurementTitle = (key: string) => {
    const titles: { [key: string]: string } = {
      height: 'Height',
      weight: 'Weight',
      wingspan: 'Wingspan',
      armLength: 'Arm Length',
      handSize: 'Hand Size',
      footSize: 'Foot Size',
      bodyFat: 'Body Fat %',
      muscle: 'Muscle Mass',
    };

    return titles[key] || key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
  };

  const formatBirthPlace = (birthPlace: { city: string; state: string; country: string }) => {
    const parts = [];
    if (birthPlace.city) parts.push(birthPlace.city);
    if (birthPlace.state) parts.push(birthPlace.state);
    if (birthPlace.country && birthPlace.country !== 'USA') parts.push(birthPlace.country);
    return parts.join(', ');
  };

  const calculateAge = (birthdate: Date) => {
    return moment().diff(moment(birthdate), 'years');
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Physical Measurements & Personal Information</h2>
        <p className={styles.description}>Detailed physical measurements and personal details for {athlete?.fullName}</p>
      </div>

      <Row gutter={[24, 24]}>
        {/* Physical Measurements */}
        {hasPhysicalData && (
          <Col xs={24} lg={12}>
            <Card
              title={
                <div className={styles.cardTitle}>
                  <UserOutlined className={styles.cardIcon} />
                  Physical Measurements
                </div>
              }
              className={styles.measurementCard}
            >
              <div className={styles.measurementGrid}>
                {Object.entries(measurements!).map(([key, value]) => (
                  <div key={key} className={styles.measurementItem}>
                    <span className={styles.measurementLabel}>{getMeasurementTitle(key)}</span>
                    <span className={styles.measurementValue}>{formatMeasurement(value, key)}</span>
                  </div>
                ))}
              </div>
            </Card>
          </Col>
        )}

        {/* Personal Information */}
        {hasPersonalData && (
          <Col xs={24} lg={hasPhysicalData ? 12 : 24}>
            <Card
              title={
                <div className={styles.cardTitle}>
                  <CalendarOutlined className={styles.cardIcon} />
                  Personal Information
                </div>
              }
              className={styles.personalCard}
            >
              <Descriptions column={1} className={styles.descriptions}>
                {athlete?.birthdate && (
                  <Descriptions.Item label="Age">
                    {calculateAge(athlete.birthdate)} years old
                    <Tag className={styles.birthdateTag}>Born {moment(athlete.birthdate).format('MMMM DD, YYYY')}</Tag>
                  </Descriptions.Item>
                )}

                {athlete?.birthPlace && (
                  <Descriptions.Item label="Birthplace">
                    <div className={styles.birthplaceInfo}>
                      <EnvironmentOutlined className={styles.locationIcon} />
                      {formatBirthPlace(athlete.birthPlace)}
                    </div>
                  </Descriptions.Item>
                )}

                {athlete?.contactNumber && (
/*                  <Descriptions.Item label="Phone">
                    <a href={`tel:${athlete.contactNumber}`} className={styles.contactLink}>
                      {athlete.contactNumber}
                    </a>
                  </Descriptions.Item>
*/                )}

                {athlete?.email && (
/*                  <Descriptions.Item label="Email">
                    <a href={`mailto:${athlete.email}`} className={styles.contactLink}>
                      {athlete.email}
                    </a>
                  </Descriptions.Item>
*/                )}
              </Descriptions>
            </Card>
          </Col>
        )}
      </Row>

      {/* Additional Information */}
      <Row gutter={[24, 24]} className={styles.additionalInfo}>
        {athlete?.highSchool && (
          <Col xs={24} sm={12}>
            <Card className={styles.infoCard} title="High School">
              <p className={styles.infoText}>{athlete.highSchool}</p>
            </Card>
          </Col>
        )}

        {athlete?.awards && athlete.awards.length > 0 && (
          <Col xs={24} sm={12}>
            <Card className={styles.infoCard} title="Awards & Honors">
              <div className={styles.awardsList}>
                {athlete.awards.map((award, index) => (
                  <Tag key={index} className={styles.awardTag}>
                    {award}
                  </Tag>
                ))}
              </div>
            </Card>
          </Col>
        )}
      </Row>

      {athlete?.bio && (
        <Card className={styles.bioCard} title="Biography">
          <p className={styles.bioText}>{athlete.bio}</p>
        </Card>
      )}
    </div>
  );
};

export default MeasurementsView;
