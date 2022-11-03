/*
 * @Author       : 程哲林
 * @Date         : 2022-09-23 20:07:29
 * @LastEditors  : 程哲林
 * @LastEditTime : 2022-11-03 21:47:07
 * @FilePath     : /bilibili-downloader-admin/src/App.tsx
 * @Description  : 未添加文件描述
 */
import { Button, Form, Input, Typography, Divider, Tag, Select } from 'antd';
import React, { useRef, useState } from 'react';
import type { InputRef } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import styles from './App.module.scss';

const { Title } = Typography;

const Tags = ({
  value = '',
  addBtnText,
  onChange
}: {
  value?: string;
  addBtnText?: string;
  onChange?: (data: string) => void;
}) => {
  const [inputVisible, setInputVisible] = useState(false);
  const inputRef = useRef<InputRef>(null);

  const arr = value.split(',').filter((item) => item);

  const handleInputConfirm = (e: any) => {
    setInputVisible(false);

    const val = e.target.value;

    if (typeof onChange === 'function' && val) {
      onChange(Array.from(new Set([...arr, e.target.value])).join(','));
    }
  };

  const showInput = () => {
    setInputVisible(true);
  };

  return (
    <>
      {arr?.map((tag) => {
        return (
          <Tag key={tag} closable>
            {tag}
          </Tag>
        );
      })}
      {inputVisible && (
        <Input
          size='small'
          className={styles['tag-input']}
          ref={inputRef}
          placeholder='请输入UP主UID'
          type='text'
          onBlur={handleInputConfirm}
          onPressEnter={handleInputConfirm}
        />
      )}
      {!inputVisible && (
        <Tag onClick={showInput}>
          <PlusOutlined /> {addBtnText}
        </Tag>
      )}
    </>
  );
};

const App: React.FC = () => {
  const [saveType, setSaveType] = useState('local');

  const onFinish = (values: any) => {
    console.log('Success:', values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div className={styles.app}>
      <div className={styles.hd}>
        <Title>配置中心</Title>
      </div>
      <Divider />
      <Form
        name='basic'
        labelCol={{ span: 8 }}
        onValuesChange={({ saveType }) => {
          if (saveType) {
            setSaveType(saveType);
          }
        }}
        wrapperCol={{ span: 16 }}
        initialValues={{
          exclude: '',
          outputPath: '',
          include: '',
          keywords: '',
          ftpRemote: '',
          ftpPassword: '',
          ftpAccount: '',
          fileName: '{{title}}',
          saveType,
          duration: 300,
          expire: 600
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete='off'>
        <Form.Item label='视频时长限制' name='duration'>
          <Input type='number' placeholder='超过该限制不下载，单位：秒' />
        </Form.Item>

        <Form.Item label='动态超期时间' name='expire'>
          <Input type='number' placeholder='超过该限制不下载，单位：秒' />
        </Form.Item>

        <Form.Item
          label='视频命名'
          name='fileName'
          tooltip='命名组合方式，支持{{title}}视频标题，{{bvid}}、{{cid}}等'>
          <Input placeholder='视频命名规范' />
        </Form.Item>

        <Form.Item label='视频保存方式' name='saveType'>
          <Select
            options={[
              {
                value: 'local',
                label: '本地'
              },
              {
                value: 'ftp',
                label: 'FTP'
              }
            ]}
          />
        </Form.Item>

        {saveType === 'ftp' ? (
          <>
            <Form.Item label='FTP 远程地址' name='ftpRemote'>
              <Input type='text' placeholder='FTP远程服务器地址' />
            </Form.Item>

            <Form.Item label='FTP 账号' name='ftpAccount'>
              <Input type='text' placeholder='FTP账号' />
            </Form.Item>

            <Form.Item label='FTP 密码' name='ftpPassword'>
              <Input type='text' placeholder='FTP密码' />
            </Form.Item>
          </>
        ) : null}

        <Form.Item
          label='视频保存位置'
          name='outputPath'
          tooltip='本地默认保存在项目根目录output/下；FTP模式请填写FTP保存目录'>
          <Input placeholder='注意Windows及Linux路径区别' />
        </Form.Item>

        <Form.Item label='排除uid集合' name='exclude' tooltip='不下载该UP主的所有视频'>
          <Tags addBtnText='添加UP主UID' />
        </Form.Item>

        <Form.Item
          label='必须包含uid集合'
          name='include'
          tooltip='必须下载该UP主的视频，哪怕未命中关键词'>
          <Tags addBtnText='添加UP主UID' />
        </Form.Item>

        <Form.Item label='视频关键词' name='keywords' tooltip='视频必须包含这些关键词才会被下载'>
          <Tags addBtnText='添加关键词' />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type='primary' htmlType='submit'>
            保存配置
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default App;
