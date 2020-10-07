import React, { FC, useRef, useState, useEffect, useCallback } from 'react';
import { useWindowWidth, useWindowHeight } from '@react-hook/window-size';
import styled from 'styled-components';
import { observer } from 'mobx-react';
import { useStore } from 'hooks/useStore';

const Container = styled.div`
  display: flex;
  flex: 1;
  cursor: pointer;
`;

type Coordinate = {
  x: number;
  y: number;
};

const Canvas: FC = () => {
  const { addPolygon, drawItems } = useStore('canvasStore');

  const browserWidth = useWindowWidth();
  const browserHeight = useWindowHeight();

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvasWidth, setCanvasWidth] = useState<number | undefined>(600);
  const [canvasHeight, setCanvasHeight] = useState<number | undefined>(600);

  const [isPainting, setIsPainting] = useState<boolean>(false);
  const [mousePosition, setMousePosition] = useState<Coordinate | undefined>(undefined);
  const [lines, setLines] = useState<Coordinate[]>([]);

  //MouseDown Event Listener에 사용될 callback 함수
  const startPaint = useCallback((event: MouseEvent) => {
    const coordinates = getCoordinates(event);
    if (coordinates) {
      setMousePosition(coordinates);
      setIsPainting(true);
    }
  }, []);

  //Mouse Move Event Listener에 사용될 callback 함수
  const paint = useCallback(
    (event: MouseEvent) => {
      if (isPainting) {
        const newMousePosition = getCoordinates(event);
        if (mousePosition && newMousePosition) {
          drawLine(mousePosition, newMousePosition);
          setMousePosition(newMousePosition);
        }
      }
    },
    [isPainting, mousePosition]
  );

  //Mouse Up&Leave Event Listener에 사용될 callback 함수
  const exitPaint = () => {
    setIsPainting(false);

    setMousePosition(undefined);
    handleFinsh();
  };

  const handleFinsh = async () => {
    console.log('----> [Canvas] draw finish ! ');
    console.info('----> [Canvas] draw lines : ', lines);
    if (!canvasRef.current || lines.length === 0) return;
    if (canvasRef.current.getContext('2d')) saveToClear();
  };

  const saveToClear = () => {
    addPolygon({
      key: maxIndex(),
      lines: [...lines, { x: lines[0].x, y: lines[0].y }]
    });
    setLines([]);
  };

  useEffect(() => {
    redraw();
  }, [drawItems]);

  const redraw = useCallback(() => {
    if (!canvasRef.current) return;

    const canvas: HTMLCanvasElement = canvasRef.current;
    const context = canvas.getContext('2d');
    if (context) {
      if (drawItems.length > 0) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < drawItems.length; i++) {
          context.beginPath();
          for (let j = 0; j < drawItems[i].lines.length; j++) {
            context.lineTo(drawItems[i].lines[j].x, drawItems[i].lines[j].y); //경로의 끝 점에서 (x,y)까지 직선을 경로에 추가한다.
          }
          context.closePath(); //현재 하위 경로의 시작 부분과 연결된 직선을 추가합니다.
          context.stroke(); // 그린다.
        }
      } else {
        context.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  }, [drawItems]);

  const maxIndex = () => {
    if (drawItems.length > 0) {
      const max = Math.max(...drawItems.map(o => o.key));
      return max + 1;
    } else {
      return 0;
    }
  };

  // 리스너 등록
  useEffect(() => {
    if (!canvasRef.current) return;
    canvasRef.current.addEventListener('mousedown', startPaint); // 마우스 버튼이 눌릴때 이벤트
    canvasRef.current.addEventListener('mousemove', paint); // 마우스가 움직일때 이벤트
    canvasRef.current.addEventListener('mouseup', exitPaint); // 마우스 버튼이 올라올때 이벤트
    return () => {
      canvasRef.current?.removeEventListener('mousedown', startPaint);
      canvasRef.current?.removeEventListener('mousemove', paint);
      canvasRef.current?.removeEventListener('mouseup', exitPaint);
    };
  }, [startPaint, paint, exitPaint]);

  // MouseEvent로 부터 좌표를 얻음
  const getCoordinates = (event: MouseEvent): Coordinate | undefined => {
    if (!canvasRef.current) return;
    return {
      x: event.pageX - canvasRef.current.offsetLeft,
      y: event.pageY - canvasRef.current.offsetTop
    };
  };

  // 선 그리기
  const drawLine = (originalMousePosition: Coordinate, newMousePosition: Coordinate) => {
    if (!canvasRef.current) return;
    const canvas: HTMLCanvasElement = canvasRef.current;
    const context = canvas.getContext('2d');
    if (context) {
      context.beginPath(); //새 로운 경로를 만듭니다. 경로가 생성됬다면, 이후 그리기 명령들은 경로를 구성하고 만드는데 사용하게 됩니다.
      context.moveTo(originalMousePosition.x, originalMousePosition.y); // 경로에 담긴 도형은 그대로 두고, 점 (x,y)를 새 시작점으로 삽입한다.
      context.lineTo(newMousePosition.x, newMousePosition.y); //경로의 끝 점에서 (x,y)까지 직선을 경로에 추가한다.
      context.stroke(); // 그린다.
      setLines([...lines, { x: newMousePosition.x, y: newMousePosition.y }]);
    }
  };

  const checkResponsive = () => {
    if (!containerRef.current) return;
    setCanvasHeight(containerRef.current.offsetHeight);
    setCanvasWidth(containerRef.current.offsetWidth);
  };

  useEffect(() => {
    if (!canvasRef.current) return;
    checkResponsive();
  }, [browserWidth, browserHeight]);

  return (
    <Container ref={containerRef}>
      <canvas ref={canvasRef} width={canvasWidth} height={canvasHeight} />
    </Container>
  );
};

export default observer(Canvas);
