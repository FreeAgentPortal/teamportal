import React, { useEffect } from 'react';
import { Button, Form, Input, Modal } from 'antd';
import { useQueryClient } from '@tanstack/react-query';
import useApiHook from '@/hooks/useApi';
import { Benefit } from '@/types/ITeamType';
import TextArea from 'antd/es/input/TextArea';

type Props = {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  benefit?: Benefit;
  index?: number;
};
const BenefitModal = (props: Props) => {
  const queryClient = useQueryClient();
  const profile = queryClient.getQueryData(['profile', 'team']) as any;
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({ title: props.benefit?.title, description: props.benefit?.description });
  }, [props.benefit, props.isModalOpen]);

  const { mutate: updateProfile } = useApiHook({
    method: 'PUT',
    key: 'updateProfile',
    queriesToInvalidate: ['profile,team'],
    successMessage: 'Team profile updated successfully',
  }) as any;

  const handleSubmit = async (values: { title: string; description: string }) => {
    let newValues = {} as any;
    newValues = { benefits: [...(profile.payload?.benefits || [])] };
    if (props.index !== undefined) {
      newValues.benefits[props.index] = { title: values.title, description: values.description };
    } else {
      newValues.benefits.push({ title: values.title, description: values.description });
    }

    await updateProfile({
      url: `/profiles/team/${profile?.payload?._id}`,
      formData: newValues,
    });
    props.setIsModalOpen(false);
  };

  const deleteBenefit = async () => {
    let newValues = {} as any;
    newValues = { benefits: [...(profile.payload?.benefits || [])] };
    newValues.benefits.splice(props.index || 0, 1);
    await updateProfile({
      url: `/profiles/team/${profile?.payload?._id}`,
      formData: newValues,
    });
    props.setIsModalOpen(false);
  };

  return (
    <Modal title="Add benefit" open={props.isModalOpen} onOk={() => handleSubmit(form.getFieldsValue())} onCancel={() => props.setIsModalOpen(false)}>
      <Form form={form} layout="vertical">
        <Form.Item name="title" label="Title" initialValue={props.benefit?.title}>
          <Input />
        </Form.Item>
        <Form.Item name="description" label="Description" initialValue={props.benefit?.description}>
          <TextArea />
        </Form.Item>
      </Form>

      {props.index !== undefined && (
        <Button type="primary" onClick={() => deleteBenefit()} danger>
          Delete
        </Button>
      )}
    </Modal>
  );
};

export default BenefitModal;
