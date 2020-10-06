import React, {
  useState,
  useEffect,
  forwardRef,
  ForwardRefRenderFunction,
  useImperativeHandle
} from 'react';
import styled from 'styled-components';
import { Button, Space } from 'antd';
import { observer } from 'mobx-react';
import { useStore } from 'hooks/useStore';

const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const ListArea = styled.div`
  width: 100%;
  min-height: 600px;
`;
const ButtonArea = styled.div`
  width: 100%;
  /* flex-direction: column; */
`;

interface Handler {
  merge(): void;
}

interface Props {}

const List: ForwardRefRenderFunction<Handler, Props> = (props, ref) => {
  const [loading, setLoading] = useState(false);
  const { drawItems } = useStore('canvasStore');
  const fullWidth = { width: '100%' };

  // 부모요소에서 자식요소의 함수 실행
  useImperativeHandle(ref, () => ({
    merge: () => {
      console.log('useImpreative merge draw()');
    }
  }));

  useEffect(() => {
    console.log('---> didmount List component');
    console.log('---> store test : ', drawItems);
    return () => {
      console.log('---> didmount List component');
    };
  }, []);

  return (
    <Container>
      <ListArea>
        <p>{'<List Area />'}</p>
      </ListArea>

      <ButtonArea>
        <Space direction="vertical" style={fullWidth}>
          <Button style={fullWidth}>Merge Selected</Button>
          <Button style={fullWidth}>Export All</Button>
        </Space>
      </ButtonArea>
    </Container>
  );
};

export default observer(forwardRef(List));
