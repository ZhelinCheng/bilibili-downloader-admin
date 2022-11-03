/*
 * @Author       : 程哲林
 * @Date         : 2022-09-23 20:07:29
 * @LastEditors  : 程哲林
 * @LastEditTime : 2022-11-03 20:42:44
 * @FilePath     : /bilibili-downloader-admin/src/index.tsx
 * @Description  : 未添加文件描述
 */
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
// import 'antd/dist/antd.less'

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
