import React, { useLayoutEffect } from 'react';
import { Layout } from 'antd';
import Routes from '../../route/Route';
import './Client.css';
import { useStore } from 'hooks/useStore';

function App() {
  const { initStorage } = useStore('canvasStore');

  useLayoutEffect(() => {
    initStorage();
  }, []);

  return (
    <Layout style={{ height: '100vh' }}>
      <Routes />
    </Layout>
  );
}

export default App;
