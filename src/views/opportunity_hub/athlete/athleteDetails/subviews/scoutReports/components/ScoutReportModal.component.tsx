import React, { useState } from 'react';
import { Modal, Tag, Row, Col, Button } from 'antd';
import { FileTextOutlined, CalendarOutlined, UserOutlined, TrophyOutlined } from '@ant-design/icons';
import moment from 'moment';
import { IScoutReport } from '@/types/IScoutReport';
import DiamondRating from '@/components/diamondRating/DiamondRating.component';
import styles from './ScoutReportModal.module.scss';

interface ScoutReportModalProps {
  selectedReport: IScoutReport | null;
  visible: boolean;
  onClose: () => void;
}

const ScoutReportModal: React.FC<ScoutReportModalProps> = ({ selectedReport, visible, onClose }) => {
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());
  const [observationsExpanded, setObservationsExpanded] = useState(false);
  const [recommendationsExpanded, setRecommendationsExpanded] = useState(false);

  if (!selectedReport) return null;

  const isPrivateReport = selectedReport.isPublic === false;

  const toggleCommentExpansion = (category: string) => {
    const newExpandedComments = new Set(expandedComments);
    if (newExpandedComments.has(category)) {
      newExpandedComments.delete(category);
    } else {
      newExpandedComments.add(category);
    }
    setExpandedComments(newExpandedComments);
  };

  const truncateComment = (comment: string, category: string, maxLength: number = 150) => {
    const isExpanded = expandedComments.has(category);

    if (comment.length <= maxLength) {
      return comment;
    }

    if (isExpanded) {
      return comment;
    }

    return comment.substring(0, maxLength) + '...';
  };

  const truncateObservations = (text: string, maxLength: number = 250) => {
    if (text.length <= maxLength) {
      return text;
    }

    if (observationsExpanded) {
      return text;
    }

    return text.substring(0, maxLength) + '...';
  };

  const truncateRecommendations = (text: string, maxLength: number = 250) => {
    if (text.length <= maxLength) {
      return text;
    }

    if (recommendationsExpanded) {
      return text;
    }

    return text.substring(0, maxLength) + '...';
  };

  return (
    <Modal
      title={
        <div className={styles.modalTitle}>
          <FileTextOutlined className={styles.modalIcon} />
          <span className={styles.titleText}>Scout Report - {selectedReport.scout.displayName || selectedReport.scout.user.fullName}</span>
          {isPrivateReport && <span className={styles.privateModalBadge}>🔒 Private</span>}
        </div>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width={800}
      className={styles.reportModal}
    >
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <div className={styles.modalMeta}>
            <div className={styles.metaItem}>
              <UserOutlined className={styles.metaIcon} />
              <span className={styles.metaText}>{selectedReport.scout.displayName || selectedReport.scout.user.fullName}</span>
            </div>
            <div className={styles.metaItem}>
              <CalendarOutlined className={styles.metaIcon} />
              <span className={styles.metaText}>{moment(selectedReport.createdAt).format('MMMM DD, YYYY')}</span>
            </div>
            {!isPrivateReport && (
              <>
                <div className={styles.metaItem}>
                  <span className={styles.metaText}>
                    {selectedReport.sport} - {selectedReport.league}
                  </span>
                </div>
                <Tag color="blue" className={styles.reportTypeTag}>
                  {selectedReport.reportType}
                </Tag>
              </>
            )}
          </div>
          <div className={styles.modalRating}>
            <div className={styles.overallRating}>
              <span className={styles.ratingLabel}>Diamond Rating</span>
              <div className={styles.ratingDisplay}>
                <DiamondRating rating={selectedReport.diamondRating} size="medium" showValue={true} className={styles.modalDiamondRating} />
              </div>
            </div>
          </div>
        </div>

        <div className={styles.analysisSection}>
          <h4 className={styles.sectionTitle}>General Observations</h4>
          <div className={styles.observationsContainer}>
            <p className={styles.observationText}>{selectedReport.observations ? truncateObservations(selectedReport.observations) : 'No observations available'}</p>
            {selectedReport.observations && selectedReport.observations.length > 250 && (
              <Button type="link" size="small" className={styles.showMoreButton} onClick={() => setObservationsExpanded(!observationsExpanded)}>
                {observationsExpanded ? 'Show Less' : 'Show More'}
              </Button>
            )}
          </div>
        </div>

        <Row gutter={[24, 24]} className={styles.strengthsWeaknessesRow}>
          <Col xs={24} md={12}>
            <div className={styles.section}>
              <h4 className={styles.sectionTitle}>
                <TrophyOutlined className={styles.sectionIcon} />
                Strengths
              </h4>
              <div className={styles.tagList}>
                {selectedReport.strengths && selectedReport.strengths.length > 0 ? (
                  selectedReport.strengths.map((strength: string, index: number) => (
                    <Tag key={index} color="green" className={styles.strengthTag}>
                      {strength}
                    </Tag>
                  ))
                ) : (
                  <p className={styles.noDataText}>No strengths recorded</p>
                )}
              </div>
            </div>
          </Col>

          <Col xs={24} md={12}>
            <div className={styles.section}>
              <h4 className={styles.sectionTitle}>Areas for Improvement</h4>
              <div className={styles.tagList}>
                {selectedReport.weaknesses && selectedReport.weaknesses.length > 0 ? (
                  selectedReport.weaknesses.map((weakness: string, index: number) => (
                    <Tag key={index} color="orange" className={styles.weaknessTag}>
                      {weakness}
                    </Tag>
                  ))
                ) : (
                  <p className={styles.noDataText}>No weaknesses recorded</p>
                )}
              </div>
            </div>
          </Col>
        </Row>

        {/* Only show detailed information for public reports */}
        {!isPrivateReport && (
          <>
            <div className={styles.recommendationsSection}>
              <h4 className={styles.sectionTitle}>Recommendations</h4>
              <div className={styles.recommendationsContainer}>
                <p className={styles.recommendationText}>
                  {selectedReport.recommendations ? truncateRecommendations(selectedReport.recommendations) : 'No recommendations available'}
                </p>
                {selectedReport.recommendations && selectedReport.recommendations.length > 250 && (
                  <Button type="link" size="small" className={styles.showMoreButton} onClick={() => setRecommendationsExpanded(!recommendationsExpanded)}>
                    {recommendationsExpanded ? 'Show Less' : 'Show More'}
                  </Button>
                )}
              </div>
            </div>

            {/* Rating Breakdown - Only for public reports */}
            {Object.keys(selectedReport.ratingBreakdown).length > 0 && (
              <div className={styles.ratingBreakdownSection}>
                <h4 className={styles.sectionTitle}>Rating Breakdown</h4>
                <div className={styles.ratingCategories}>
                  {Object.entries(selectedReport.ratingBreakdown).map(([category, ratingField]) => (
                    <div key={category} className={styles.categoryItem}>
                      <span className={styles.categoryName}>{category.charAt(0).toUpperCase() + category.slice(1)}</span>
                      <div className={styles.categoryRating}>
                        <DiamondRating rating={ratingField.score} size="large" showValue={true} className={styles.categoryDiamondRating} />
                        {ratingField.comments && (
                          <div className={styles.commentSection}>
                            <p className={styles.comments}>{truncateComment(ratingField.comments, category)}</p>
                            {ratingField.comments.length > 150 && (
                              <Button type="link" size="small" className={styles.showMoreButton} onClick={() => toggleCommentExpansion(category)}>
                                {expandedComments.has(category) ? 'Show Less' : 'Show More'}
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Private report notice */}
        {isPrivateReport && (
          <div className={styles.privateNotice}>
            <p className={styles.privateNoticeText}>🔒 This is a private scout report. Additional details are restricted and only available to authorized personnel.</p>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ScoutReportModal;
