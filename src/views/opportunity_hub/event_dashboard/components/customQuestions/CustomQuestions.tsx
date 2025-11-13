import React, { useState } from 'react';
import { Button, Card, Checkbox, Col, Input, Row, Select } from 'antd';
import { PlusOutlined, DeleteOutlined, SaveOutlined, EditOutlined } from '@ant-design/icons';
import styles from './CustomQuestions.module.scss';

const { Option } = Select;

export interface CustomQuestion {
  key: string;
  label: string;
  type: 'shortText' | 'longText' | 'singleSelect' | 'multiSelect' | 'number' | 'boolean' | 'url';
  required: boolean;
  options?: string[];
}

interface CustomQuestionsProps {
  questions: CustomQuestion[];
  onChange: (questions: CustomQuestion[]) => void;
}

const CustomQuestions: React.FC<CustomQuestionsProps> = ({ questions, onChange }) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingQuestion, setEditingQuestion] = useState<CustomQuestion | null>(null);

  const addQuestion = () => {
    const newQuestion: CustomQuestion = {
      key: `question_${Date.now()}`,
      label: '',
      type: 'shortText',
      required: false,
      options: [],
    };
    // Add to list and immediately start editing
    onChange([...questions, newQuestion]);
    setEditingIndex(questions.length);
    setEditingQuestion({ ...newQuestion });
  };

  const startEditing = (index: number) => {
    setEditingIndex(index);
    setEditingQuestion({ ...questions[index] });
  };

  const cancelEditing = () => {
    setEditingIndex(null);
    setEditingQuestion(null);
  };

  const saveQuestion = () => {
    if (editingIndex !== null && editingQuestion) {
      const updatedQuestions = [...questions];
      updatedQuestions[editingIndex] = editingQuestion;
      onChange(updatedQuestions);
      setEditingIndex(null);
      setEditingQuestion(null);
    }
  };

  const updateEditingQuestion = (field: string, value: any) => {
    if (editingQuestion) {
      setEditingQuestion({ ...editingQuestion, [field]: value });
    }
  };

  const removeQuestion = (index: number) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    onChange(updatedQuestions);
    if (editingIndex === index) {
      cancelEditing();
    }
  };

  const addOptionToEditing = () => {
    if (editingQuestion) {
      const options = editingQuestion.options || [];
      setEditingQuestion({ ...editingQuestion, options: [...options, ''] });
    }
  };

  const updateEditingOption = (optionIndex: number, value: string) => {
    if (editingQuestion && editingQuestion.options) {
      const updatedOptions = [...editingQuestion.options];
      updatedOptions[optionIndex] = value;
      setEditingQuestion({ ...editingQuestion, options: updatedOptions });
    }
  };

  const removeEditingOption = (optionIndex: number) => {
    if (editingQuestion && editingQuestion.options) {
      const updatedOptions = editingQuestion.options.filter((_, i) => i !== optionIndex);
      setEditingQuestion({ ...editingQuestion, options: updatedOptions });
    }
  };

  return (
    <div className={styles.questionsSection}>
      <div className={styles.questionsSectionHeader}>
        <h5>Custom Registration Questions</h5>
        <Button type="dashed" onClick={addQuestion} icon={<PlusOutlined />} size="small">
          Add Question
        </Button>
      </div>

      {questions.length === 0 && (
        <div className={styles.emptyState}>No custom questions yet. Click &quot;Add Question&quot; to create questions that athletes will answer during registration.</div>
      )}

      {questions.map((question, questionIndex) => {
        const isEditing = editingIndex === questionIndex;
        const displayQuestion = isEditing ? editingQuestion! : question;

        return (
          <Card key={question.key} className={styles.questionCard} size="small">
            <Row gutter={16} align="middle">
              <Col span={10}>
                <Input
                  placeholder="Question label (e.g., 'What position do you play?')"
                  value={displayQuestion.label}
                  onChange={(e) => updateEditingQuestion('label', e.target.value)}
                  disabled={!isEditing}
                />
              </Col>
              <Col span={7}>
                <Select
                  placeholder="Question type"
                  value={displayQuestion.type}
                  onChange={(value) => updateEditingQuestion('type', value)}
                  className={styles.fullWidth}
                  disabled={!isEditing}
                >
                  <Option value="shortText">Short Text</Option>
                  <Option value="longText">Long Text</Option>
                  <Option value="singleSelect">Single Select</Option>
                  <Option value="multiSelect">Multi Select</Option>
                  <Option value="number">Number</Option>
                  <Option value="boolean">Yes/No</Option>
                  <Option value="url">URL</Option>
                </Select>
              </Col>
              <Col span={3}>
                <Checkbox checked={displayQuestion.required} onChange={(e) => updateEditingQuestion('required', e.target.checked)} disabled={!isEditing}>
                  Required
                </Checkbox>
              </Col>
              <Col span={4} style={{ textAlign: 'right' }}>
                {isEditing ? (
                  <div className={styles.actionButtons}>
                    <Button type="primary" size="small" icon={<SaveOutlined />} onClick={saveQuestion} className={styles.saveButton} />
                    <Button type="text" size="small" onClick={cancelEditing}>
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <div className={styles.actionButtons}>
                    <Button type="text" icon={<EditOutlined />} onClick={() => startEditing(questionIndex)} size="small" />
                    <Button type="text" danger icon={<DeleteOutlined />} onClick={() => removeQuestion(questionIndex)} size="small" />
                  </div>
                )}
              </Col>
            </Row>

            {/* Options for select types */}
            {(displayQuestion.type === 'singleSelect' || displayQuestion.type === 'multiSelect') && (
              <div className={styles.optionsSection}>
                <div className={styles.optionsHeader}>
                  <span className={styles.optionsLabel}>Options:</span>
                  {isEditing && (
                    <Button type="link" onClick={addOptionToEditing} icon={<PlusOutlined />} size="small">
                      Add Option
                    </Button>
                  )}
                </div>
                {displayQuestion.options?.map((option, optionIndex) => (
                  <Row key={optionIndex} gutter={8} style={{ marginBottom: '8px' }}>
                    <Col span={20}>
                      <Input
                        placeholder={`Option ${optionIndex + 1}`}
                        value={option}
                        onChange={(e) => updateEditingOption(optionIndex, e.target.value)}
                        size="small"
                        disabled={!isEditing}
                      />
                    </Col>
                    {isEditing && (
                      <Col span={4}>
                        <Button type="text" danger icon={<DeleteOutlined />} onClick={() => removeEditingOption(optionIndex)} size="small" />
                      </Col>
                    )}
                  </Row>
                ))}
                {(!displayQuestion.options || displayQuestion.options.length === 0) && (
                  <div className={styles.emptyOptions}>{isEditing ? "Click 'Add Option' to create selectable choices" : 'No options configured'}</div>
                )}
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
};

export default CustomQuestions;
