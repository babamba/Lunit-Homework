import React, { FC, useRef } from 'react';
import styled from 'styled-components';
import PolygonList from 'components/Main/PolygonList';
import ActionButtons from 'components/Main/ActionButtons';

const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const ListArea = styled.div`
  width: 100%;
  display: flex;
  flex: 4;
  overflow-y: scroll;
`;
const ButtonArea = styled.div`
  width: 100%;
  display: flex;
  flex: 1;
`;

interface PolygonListRefObject {
  merge(): void;
  delete(): void;
  export(): void;
}

const List: FC = () => {
  const PolygonListRef = useRef<PolygonListRefObject>(null); // 자식요소 구성요소에 접근하기위해 Ref 생성
  const handleDelete = () => PolygonListRef.current?.delete();
  const handleExport = () => PolygonListRef.current?.export();
  const handleMerge = () => PolygonListRef.current?.merge();

  return (
    <Container>
      <ListArea>
        <PolygonList ref={PolygonListRef} />
      </ListArea>

      <ButtonArea>
        <ActionButtons
          handleDelete={handleDelete}
          handleMerge={handleMerge}
          handleExport={handleExport}
        />
      </ButtonArea>
    </Container>
  );
};

export default List;
