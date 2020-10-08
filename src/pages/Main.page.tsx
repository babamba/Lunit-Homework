import React, { FC, useRef } from 'react';
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

interface CanvasRefObject {
  merge(): void;
}

const MainPage: FC = () => {
  // 자식요소인 List 컴포넌트에 콜백함수를 props를 넘기고
  // 그 콜백함수를 실행 할 시 Canvas Ref 에 useImperativeHandle로 Canvas 컴포넌트 내부에서 실행한다.
  const CanvasRef = useRef<CanvasRefObject>(null);
  const mergeCallback = () => {
    CanvasRef.current?.merge();
  };

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
            <Canvas ref={CanvasRef} />
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
            <List mergeAct={mergeCallback} />
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default MainPage;
