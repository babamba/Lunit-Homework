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

  const BodyStyle = {
    display: 'flex',
    flex: 1,
    width: '100%',
    height: '97vh'
  }
  return (
    <Container>
      <Row gutter={[16, 0]}>
        <Col xs={16} sm={16} md={16} lg={16} xl={16} xxl={16}>
          <Card bodyStyle={BodyStyle}>
            <Canvas />
          </Card>
        </Col>
        <Col xs={8} sm={8} md={8} lg={8} xl={8} xxl={8}>
          <Card bodyStyle={BodyStyle}>
            <List />
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default MainPage;
