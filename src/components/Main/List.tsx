import React, { FC } from "react";
import styled from "styled-components";
import PolygonList from "components/Main/PolygonList";
import ActionButtons from "components/Main/ActionButtons";

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

const List: FC = () => {
  return (
    <Container>
      <ListArea>
        <PolygonList />
      </ListArea>

      <ButtonArea>
        <ActionButtons />
      </ButtonArea>
    </Container>
  );
};

export default List;
