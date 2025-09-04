import React, { useState } from 'react';
import { Empty, Row, Col, Card } from 'antd';
import { FileTextOutlined, PlayCircleOutlined } from '@ant-design/icons';
import styles from './ScoutReports.module.scss';
import { IAthlete } from '@/types/IAthleteType';
import useApiHook from '@/hooks/useApi';
import { IScoutReport } from '@/types/IScoutReport';
import ScoutReportCard from '@/components/scoutReportCard/ScoutReportCard.component';
import ScoutReportModal from './components/ScoutReportModal.component';
import VideoLink from './components/VideoLink.component';

interface ScoutReportsViewProps {
  athlete?: IAthlete;
}

const ScoutReportsView: React.FC<ScoutReportsViewProps> = ({ athlete }) => {
  const [selectedReport, setSelectedReport] = useState<IScoutReport | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const { data } = useApiHook({
    url: `/scout`,
    method: 'GET',
    filter: `athleteId;{"$eq": "${athlete?._id}"}`,
    enabled: !!athlete?._id,
    key: 'scoutReports',
  }) as any;

  const scoutReports = data?.payload || [];

  const fetchMetaImage = async (videoUrl: string) => {
    if (!videoUrl) return;

    try {
      // Call the JSONLink API directly from the frontend
      const response = await fetch(`https://jsonlink.io/api/extractor?url=${encodeURIComponent(videoUrl)}`);

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();

      // Extract the image URL from the response
      if (data.image) {
        return data.image;
      }
    } catch (error) {
      console.error('JSONLink API error:', error);
    }
  };

  const handleViewReport = (report: IScoutReport) => {
    setSelectedReport(report);
    setModalVisible(true);
  };

  if (!scoutReports || scoutReports.length === 0) {
    return (
      <div className={styles.container}>
        <Empty description="No scout reports available" className={styles.empty} image={<FileTextOutlined className={styles.emptyIcon} />}>
          <p className={styles.emptySubtext}>Scout reports will appear here once evaluations are completed.</p>
        </Empty>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Scout Reports</h2>
        <p className={styles.description}>Professional evaluations and assessments for {athlete?.fullName}</p>
        <div className={styles.stats}>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>{scoutReports.length}</span>
            <span className={styles.statLabel}>Total Reports</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>
              {scoutReports.length > 0 ? (scoutReports.reduce((sum: number, report: IScoutReport) => sum + report.diamondRating, 0) / scoutReports.length).toFixed(1) : '0.0'}
            </span>
            <span className={styles.statLabel}>Avg Rating</span>
          </div>
        </div>
      </div>

      <Row gutter={[24, 24]}>
        {scoutReports.map((report: IScoutReport) => (
          <Col xs={24} lg={24} key={report._id}>
            <ScoutReportCard report={report} onClick={() => handleViewReport(report)} />
          </Col>
        ))}
      </Row>

      {/* Highlight Videos Section */}
      {athlete?.highlightVideos && athlete.highlightVideos.length > 0 && (
        <Card
          className={styles.videosCard}
          title={
            <div className={styles.cardTitle}>
              <PlayCircleOutlined className={styles.cardIcon} />
              Highlight Videos
            </div>
          }
        >
          <div className={styles.videoGrid}>
            {athlete.highlightVideos.map((videoUrl, index) => (
              <VideoLink key={index} videoUrl={videoUrl} index={index} />
            ))}
          </div>
        </Card>
      )}

      <ScoutReportModal selectedReport={selectedReport} visible={modalVisible} onClose={() => setModalVisible(false)} />
    </div>
  );
};

export default ScoutReportsView;
