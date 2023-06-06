import React from 'react';
import { InputNumber, Divider, Button, Checkbox, Form, Input, Select, Typography } from 'antd';

const { Title } = Typography;
/* const selectBefore = (
  <Select defaultValue='http://'>
    <Select.Option value='http://'>http://</Select.Option>
    <Select.Option value='https://'>https://</Select.Option>
  </Select>
); */

export const Download = React.memo((): JSX.Element => {
  const [form] = Form.useForm();
  const storageTypeValue = Form.useWatch('storageType', form);

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
        <Divider orientation='left'>存储位置设置</Divider>
        <Form.Item
          label='存储方式'
          name='storageType'
          rules={[{ required: true, message: '请选择视频文件存储的方式' }]}>
          <Select
            options={[
              { value: 'local', label: '本地存储' },
              { value: 'webdav', label: 'WebDAV' },
              { value: 'ftp', label: 'FTP' }
            ]}
          />
        </Form.Item>

        <Form.Item
          label='存储位置'
          name='outputPath'
          rules={[{ required: true, message: '请填写视频文件存储的位置' }]}>
          <Input />
        </Form.Item>

        {storageTypeValue !== 'local' ? (
          <>
            <Form.Item
              label='服务器地址'
              name='remoteURL'
              rules={[{ required: true, message: `请填写${storageTypeValue}服务地址` }]}>
              <Input placeholder='服务器地址，http(s)://开头' />
            </Form.Item>

            <Form.Item
              label='账号'
              name='account'
              rules={[{ required: true, message: '请输入账号' }]}>
              <Input placeholder='服务账号' />
            </Form.Item>

            <Form.Item
              label='密码'
              name='password'
              rules={[{ required: true, message: '请输入密码' }]}>
              <Input placeholder='密码' />
            </Form.Item>
          </>
        ) : null}

        <Divider orientation='left'>下载限制</Divider>
        <Form.Item
          tooltip='当视频发布/收藏超过该时间后就不会被下载，该配置建议默认即可'
          label='超期时间'
          name='overtimeLimit'>
          <InputNumber
            addonAfter='秒'
            style={{ width: '100%' }}
            placeholder='视频发布/收藏超过多长时间就忽略'
          />
        </Form.Item>

        <Form.Item
          tooltip='视频长度超过该时间限制后就不会被下载'
          label='视频长度限制'
          name='durationLimit'>
          <InputNumber
            addonAfter='秒'
            style={{ width: '100%' }}
            placeholder='视频时长超过多少秒就忽略'
          />
        </Form.Item>

        <Form.Item
          tooltip='当视频标题、描述、标签命中该关键词时才会被下载；如果你需要监听并下载收藏夹内容，那么不建议删除【收藏夹】关键词'
          label='监听关键词'
          name='keywords'>
          <Select mode='tags' style={{ width: '100%' }} placeholder='视频关键词' options={[]} />
        </Form.Item>

        <Form.Item tooltip='只有勾选了监听范围才会下载' label='监听范围' name='scope'>
          <Checkbox.Group>
            <Checkbox value={1}>个人动态</Checkbox>
            <Checkbox value={12}>默认收藏夹</Checkbox>
          </Checkbox.Group>
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
