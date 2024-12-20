import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Checkbox, Select } from 'antd';

// 定义表单字段类型
interface CodeFormProps {
  initialValues: any; // 初始值，编辑时会传入后台数据，新建时是空对象
  onSubmit: (values: any) => void; // 提交表单时的回调
}

const CodeForm: React.FC<CodeFormProps> = ({ initialValues, onSubmit }) => {
  const [form] = Form.useForm(); // Ant Design 的 Form 实例

  useEffect(() => {
    // 如果有 initialValues，则设置表单的初始值
    form.setFieldsValue(initialValues);
  }, [initialValues, form]);

  return (
    <Form
      form={form}
      onFinish={onSubmit}
      initialValues={initialValues}
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 16 }}
    >
      <Form.Item name="title" label="标题" rules={[{ required: true, message: '请输入标题' }]}>
        <Input />
      </Form.Item>

      <Form.Item name="tags" label="标签">
        <Select mode="tags" placeholder="请选择标签">
          {/* 标签选项可以根据需求从后端获取 */}
          <Select.Option value="JavaScript">JavaScript</Select.Option>
          <Select.Option value="Python">Python</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item name="isPublic" valuePropName="checked" label="公开">
        <Checkbox>公开</Checkbox>
      </Form.Item>

      <Form.Item name="password" label="密码">
        <Input.Password />
      </Form.Item>

      <Form.Item name="markdown" label="Markdown 内容">
        <Input.TextArea rows={6} />
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 4, span: 16 }}>
        <Button type="primary" htmlType="submit">
          {initialValues.id ? '更新' : '创建'}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CodeForm;
