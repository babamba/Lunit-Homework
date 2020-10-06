import React, { useState, useEffect } from 'react';
import { Layout } from 'antd';
import styled from 'styled-components';
import Routes from '../../route/Route';
import './Client.css';

function App() {
  return (
    <Layout style={{ height: '100vh' }}>
      <Routes />
    </Layout>
  );
}

export default App;
