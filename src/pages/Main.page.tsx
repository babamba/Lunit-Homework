import React, { FC } from 'react';
import { Row, Col, Card } from 'antd';
import styled from 'styled-components';
import Canvas from 'components/Main/Canvas';
import List from 'components/Main/List';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 12px;
`;

const MainPage: FC = () => {
  return (
    <Container>
      <Row gutter={[16, 0]}>
        <Col xs={24} sm={24} md={24} lg={16} xl={16} xxl={16}>
          <Card
            bodyStyle={{
              display: 'flex',
              flex: 1,
              width: '100%',
              height: '97vh'
            }}
          >
            <Canvas />
          </Card>
        </Col>
        <Col xs={24} sm={24} md={24} lg={8} xl={8} xxl={8}>
          <Card
            bodyStyle={{
              display: 'flex',
              flex: 1,
              height: '97vh'
            }}
          >
            <List />
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default MainPage;
