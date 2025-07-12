import React from 'react';
import { Card, Statistic, Row, Col, Empty } from 'antd';
import { TrophyOutlined, ThunderboltOutlined, RocketOutlined } from '@ant-design/icons';
import styles from './Metrics.module.scss';
import { IAthlete } from '@/types/IAthleteType';

interface MetricsViewProps {
  athlete?: IAthlete;
}

const MetricsView: React.FC<MetricsViewProps> = ({ athlete }) => {
  const metrics = athlete?.metrics;

  if (!metrics || Object.keys(metrics).length === 0) {
    return (
      <div className={styles.container}>
        <Empty description="No metrics data available" className={styles.empty} />
      </div>
    );
  }

  const getMetricTitle = (key: string) => {
    const titles: { [key: string]: string } = {
      dash40: '40-Yard Dash',
      benchPress: 'Bench Press',
      squat: 'Squat',
      verticalJump: 'Vertical Jump',
      broadJump: 'Broad Jump',
      shuttleRun: 'Shuttle Run',
      coneSpeed: '3-Cone Drill',
      throwVelocity: 'Throw Velocity',
      exitVelocity: 'Exit Velocity',
      popTime: 'Pop Time',
    };

    return titles[key] || key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
  };

  const metricsArray = Object.entries(metrics).map(([key, value]) => ({
    key,
    value: typeof value === 'number' ? value : parseFloat(value as string) || 0,
    title: getMetricTitle(key),
  }));

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Performance Metrics</h2>
        <p className={styles.description}>Key performance indicators and measurable statistics for {athlete?.fullName}</p>
      </div>

      <Row gutter={[24, 24]} className={styles.metricsGrid}>
        {metricsArray.map(({ key, value, title }) => (
          <Col xs={24} sm={12} lg={8} xl={6} key={key}>
            <Card className={styles.metricCard} hoverable>
              <div className={styles.metricContent}>
                <div className={styles.metricHeader}>
                  <span className={styles.metricTitle}>{title}</span>
                </div>
                <Statistic
                  value={value}
                  formatter={(val) => {
                    // format so that any floating point number is shown with 2 decimal places
                    return typeof val === 'number' ? val.toFixed(2) : val;
                  }}
                  valueStyle={{
                    color: 'var(--primary)',
                    fontSize: '1.8rem',
                    fontWeight: 700,
                  }}
                />
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {athlete?.strengths && (
        <Card className={styles.strengthsCard} title="Strengths">
          <p className={styles.strengthsText}>{athlete.strengths}</p>
        </Card>
      )}

      {athlete?.weaknesses && (
        <Card className={styles.weaknessesCard} title="Areas for Improvement">
          <p className={styles.weaknessesText}>{athlete.weaknesses}</p>
        </Card>
      )}
    </div>
  );
};

export default MetricsView;
