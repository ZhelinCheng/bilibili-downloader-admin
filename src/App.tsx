import React from 'react';
import {
  AimOutlined,
  DownloadOutlined,
  VideoCameraOutlined,
  PoweroffOutlined,
  HomeOutlined
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Layout, Menu, theme, Avatar, Dropdown } from 'antd';
import styles from './App.module.scss';
import { BrowserRouter, Routes, Route, Outlet, Link, HashRouter } from 'react-router-dom';
import { Download, List, Universal } from './pages';

const { Header, Content, Footer, Sider } = Layout;

const menuItems: MenuProps['items'] = [
  {
    // 登录状态、运行时间、成功下载、失败下载、队列数、最近日志
    key: '/',
    icon: <HomeOutlined />,
    label: '概览'
  },
  {
    // 黑白名单、关键词等
    key: 'list',
    icon: <AimOutlined />,
    label: <Link to='/list'>黑白名单</Link>
  },
  {
    // 下载类型、账号密码、存储位置、收藏夹动态、视频时长、超期时间
    key: 'download',
    icon: <DownloadOutlined />,
    label: <Link to='/download'>下载设置</Link>
  },
  {
    // 日志保存时间
    key: 'universal',
    icon: <VideoCameraOutlined />,
    label: <Link to='/universal'>通用设置</Link>
  }
];

/* 
const items: MenuProps['items'] = [
  UserOutlined,
  VideoCameraOutlined,
  UploadOutlined,
  BarChartOutlined,
  CloudOutlined,
  AppstoreOutlined,
  TeamOutlined,
  ShopOutlined
].map((icon, index) => ({
  key: String(index + 1),
  icon: React.createElement(icon),
  label: `nav ${index + 1}`
})); */

const AppLayout = () => {
  const {
    token: { colorBgContainer }
  } = theme.useToken();

  return (
    <Layout className={styles.app} hasSider>
      <Sider theme='light' className={styles.sider}>
        <div className='demo-logo-vertical' />
        <Menu
          className={styles.menu}
          theme='light'
          mode='inline'
          defaultSelectedKeys={['/']}
          items={menuItems}
        />
      </Sider>
      <Layout className='site-layout' style={{ marginLeft: 200 }}>
        <Header className={styles.header} style={{ background: colorBgContainer }}>
          <Dropdown
            menu={{
              items: [
                {
                  key: '1',
                  icon: <PoweroffOutlined />,
                  label: '注销'
                }
              ]
            }}
            placement='bottom'
            arrow={{ pointAtCenter: true }}>
            <div className={styles.user}>
              <span className={styles['u-name']}>是大橙子</span>
              <Avatar />
            </div>
          </Dropdown>
        </Header>
        <Content className={styles.content}>
          <div className={styles.wrap}>
            <Outlet />
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>Ant Design ©2023 Created by Ant UED</Footer>
      </Layout>
    </Layout>
  );
};

function Home() {
  return (
    <div>
      <h2>Home</h2>
    </div>
  );
}

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path='/' element={<AppLayout />}>
          <Route index element={<Home />} />
          <Route path='download' element={<Download />} />
          <Route path='list' element={<List />} />
          <Route path='universal' element={<Universal />} />
        </Route>
      </Routes>
    </HashRouter>
  );
};

export default App;
