/*
 * @Author       : 程哲林
 * @Date         : 2023-06-06 20:56:46
 * @LastEditors  : 程哲林
 * @LastEditTime : 2023-06-06 21:09:24
 * @FilePath     : /bilibili-downloader-admin/src/pages/List/index.tsx
 * @Description  : 未添加文件描述
 */
import React from 'react';
import { Button, Form, Select, Spin, Typography } from 'antd';

const { Title } = Typography;
/* const selectBefore = (
  <Select defaultValue='http://'>
    <Select.Option value='http://'>http://</Select.Option>
    <Select.Option value='https://'>https://</Select.Option>
  </Select>
); */

export const List = React.memo((): JSX.Element => {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log('Success:', values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <>
      <Title level={2}>黑白名单</Title>
      <Form
        form={form}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        style={{ maxWidth: 500 }}
        initialValues={{
          keywords: ['收藏夹'],
          scope: [1],
          durationLimit: 360,
          storageType: 'local',
          overtimeLimit: 600
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete='off'>
        <Form.Item
          tooltip='白名单内的UP主视频必须下载，忽略下载限制'
          label='白名单'
          name='whitelist'>
          <Select
            labelInValue
            notFoundContent={<Spin size='small' />}
            filterOption={false}
            onSearch={() => undefined}
            style={{ width: '100%' }}
            placeholder='UP主UID'
            options={[]}
          />
        </Form.Item>

        <Form.Item tooltip='黑名单内的UP主视频不会被下载' label='黑名单' name='blacklist'>
          <Select style={{ width: '100%' }} placeholder='UP主UID' options={[]} />
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
