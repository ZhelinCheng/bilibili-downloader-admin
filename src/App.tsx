/*
 * @Author       : 程哲林
 * @Date         : 2022-09-23 20:07:29
 * @LastEditors  : 程哲林
 * @LastEditTime : 2022-11-05 16:47:17
 * @FilePath     : /bilibili-downloader-admin/src/App.tsx
 * @Description  : 未添加文件描述
 */
import {
  Button,
  Form,
  Input,
  Typography,
  Divider,
  Tag,
  Select,
  Col,
  Row,
  message as Msg
} from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import type { InputRef } from 'antd';
import axios, { AxiosResponse } from 'axios';
import dayjs from 'dayjs';
import { PlusOutlined } from '@ant-design/icons';
import QS from 'qs';
import QRCode from 'qrcode';

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
          <Tag
            key={tag}
            closable
            onClose={() => {
              const newTags: string[] = arr.filter(t => t !== tag);
              if (typeof onChange === 'function') {
                onChange(newTags.join(','));
              }
            }}>
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

interface ResType<T> {
  statusCode: number;
  message: string;
  data: T;
}

interface ConfigData {
  isLogin: boolean;
  vipStatus: boolean;
  config: Config;
}

interface Config {
  id: number;
  duration: number;
  expire: number;
  exclude: string;
  include: string;
  keywords: string;
  fileName: string;
  saveType: string;
  ftpAccount: string;
  ftpPassword: string;
  ftpRemote: string;
  outputPath: string;
  lastTime: number;
}

const getQrCode = async () => {
  return axios.get('/api/v1/qrcode');
};

const getConfig = async () => {
  return axios.get<any, AxiosResponse<ResType<ConfigData>>>('/api/v1/config');
};

const poll = async (params: any) => {
  return axios.get<any, AxiosResponse<ResType<number>>>('/api/v1/poll', { params });
};

const edit = async (data: any) => {
  return axios<any, AxiosResponse<ResType<boolean>>>({
    url: '/api/v1/edit',
    method: 'post',
    data: QS.parse(data)
  });
};

function polling(key: string) {
  setTimeout(async () => {
    const {
      data: { statusCode, data, message }
    } = await poll({ key });

    if (statusCode !== 200) {
      return Msg.error(message);
    }

    if (data === 0) {
      window.location.reload();
    } else if (data === 86038) {
      Msg.error('二维码已失效');
    } else {
      polling(key);
    }
  }, 1500);
}

const App: React.FC = React.memo(() => {
  const [form] = Form.useForm();
  const [cfg, setConfig] = useState<ConfigData>({
    isLogin: true,
    vipStatus: false,
    config: {
      id: 1,
      exclude: '',
      outputPath: '',
      include: '',
      keywords: '',
      ftpRemote: '',
      ftpPassword: '',
      ftpAccount: '',
      fileName: '{{title}}',
      saveType: 'local',
      duration: 300,
      expire: 600,
      lastTime: 0
    }
  });

  const saveType = cfg.config.saveType;

  const onFinish = async (values: any) => {
    console.log(values);
    const {
      data: { statusCode, data, message }
    } = await edit({
      ...values,
      id: cfg.config.id
    });

    if (!values.outputPath) {
      return Msg.warning(saveType === 'ftp' ? '请填写FTP目录路径，从/（根目录）开始' : '请填写文件保存目录路径（注意Windows/Linux目录路径区别）');
    }

    if (statusCode === 200 && data) {
      Msg.success('更新成功');
    } else {
      Msg.error(message || '保存失败');
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  useEffect(() => {
    async function init() {
      const {
        data: { statusCode, data, message }
      } = await getConfig();

      if (statusCode !== 200) {
        return Msg.error(message);
      }

      setConfig(data);
      form.setFieldsValue(data.config);
    }

    init();
  }, [form]);

  useEffect(() => {
    async function init() {
      const qr = await getQrCode();
      const { qrcode_key, url } = qr.data.data;
      QRCode.toCanvas(document.getElementById('canvas'), url, function (error) {
        if (error) console.error(error);
        console.log('success!');
      });

      polling(qrcode_key);
    }

    if (!cfg.isLogin) {
      init();
    }
  }, [cfg.isLogin]);

  return (
    <div className={styles.app}>
      <div className={styles.hd}>
        <Title>管理页面</Title>
      </div>
      <Row>
        <Col span={8}>登录状态：{cfg.isLogin ? '正常' : '未登录'}</Col>
        <Col span={8}>会员状态：{cfg.vipStatus ? '正常' : '异常'}</Col>
        <Col span={8}>上次更新：{dayjs(cfg.config.lastTime * 1000).format('YYYY-MM-DD HH:mm')}</Col>
      </Row>
      <Divider orientation='left'>基础配置</Divider>
      {cfg.isLogin ? (
        <Form
          form={form}
          name='basic'
          labelCol={{ span: 8 }}
          onValuesChange={({ saveType }) => {
            if (saveType) {
              form.setFieldValue('outputPath', '');
              setConfig((ct) => {
                return {
                  ...ct,
                  config: {
                    ...ct.config,
                    saveType
                  }
                };
              });
            }
          }}
          wrapperCol={{ span: 16 }}
          initialValues={cfg.config}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete='off'>
          <Form.Item label='视频时长限制' name='duration' extra="如果视频时长超过该限制，将不会被下载">
            <Input addonAfter="秒" type='number' placeholder='超过该限制不下载，单位：秒' />
          </Form.Item>

          <Form.Item label='动态超期时间' name='expire' extra="动态超期时间（不建议更改）">
            <Input addonAfter="秒" type='number' placeholder='超过该限制不下载，单位：秒' />
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

          {cfg.config.saveType === 'ftp' ? (
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
            label={saveType === 'ftp' ? 'FTP目录路径' : '本地保存路径'}
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
      ) : (
        <div className={styles.qrcode}>
          <div className={styles.img}>
            <canvas id='canvas'></canvas>
          </div>
          <div className={styles.tips}>请扫码登录</div>
        </div>
      )}
    </div>
  );
});

export default App;
