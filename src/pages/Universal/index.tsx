/*
 * @Author       : 程哲林
 * @Date         : 2023-06-06 21:10:59
 * @LastEditors  : 程哲林
 * @LastEditTime : 2023-06-06 21:21:15
 * @FilePath     : /bilibili-downloader-admin/src/pages/Universal/index.tsx
 * @Description  : 未添加文件描述
 */
import React from 'react';
import { Button, Form, InputNumber, Typography } from 'antd';

const { Title } = Typography;

export const Universal = React.memo((): JSX.Element => {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log('Success:', values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <>
      <Title level={2}>通用设置</Title>

      <Form
        form={form}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        style={{ maxWidth: 500 }}
        initialValues={{}}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete='off'>
        <Form.Item tooltip='限制下载日志条数' label='视频长度限制' name='logLimit'>
          <InputNumber addonAfter='条' style={{ width: '100%' }} placeholder='限制下载日志长度' />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 6 }}>
          <Button type='primary' htmlType='submit'>
            保存并更新
          </Button>
        </Form.Item>
      </Form>
    </>
  );
});
