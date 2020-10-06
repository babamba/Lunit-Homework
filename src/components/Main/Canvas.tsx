import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const Canvas = () => {
  return (
    <Container>
      <p>{'<Canvas Area />'}</p>
    </Container>
  );
};

export default Canvas;
