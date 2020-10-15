import React, { FC, useRef, useState, useEffect, useCallback } from 'react';
import { useWindowWidth, useWindowHeight } from '@react-hook/window-size';
import styled from 'styled-components';
import { observer } from 'mobx-react';
import { useStore } from 'hooks/useStore';
import { Polygon, Coordinate } from 'interface/polygon';
import { toJS } from 'mobx';

const Container = styled.div`
  display: flex;
  flex: 1;
  cursor: pointer;
`;

const Canvas: FC = () => {
  const { addPolygon, getMaxIndex, drawItems, selectItems } = useStore('canvasStore');
  const browserWidth = useWindowWidth(); // 브라우저 리사이징 hook
  const browserHeight = useWindowHeight(); // 브라우저 리사이징 hook

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvasWidth, setCanvasWidth] = useState<number | undefined>(600);
  const [canvasHeight, setCanvasHeight] = useState<number | undefined>(600);

  const [isPainting, setIsPainting] = useState<boolean>(false);
  const [mousePosition, setMousePosition] = useState<Coordinate | undefined>(undefined);
  const [lines, setLines] = useState<Coordinate[]>([]); // 그려지는 마지막 좌표값(End X, Y)
  const [moves, setMoves] = useState<Coordinate[]>([]); // 마우스 움직임 값(start X, Y )

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
    async (event: MouseEvent) => {
      if (isPainting) {
        const newMousePosition = getCoordinates(event);

        if (mousePosition && newMousePosition) {
          await drawLine(mousePosition, newMousePosition);
          setMousePosition(newMousePosition);
        }
      }
    },
    [isPainting, mousePosition],
  );

  //Mouse Up&Leave Event Listener에 사용될 callback 함수
  const exitPaint = () => {
    setIsPainting(false);
    setMousePosition(undefined);
    handleFinsh(); // 페인팅이 끝난 후 Store에 저장한다.
  };

  // line draw가 끝난 후 저장된 line / move state 값을 저장액션(로컬스토리지 저장) 후 초기화한다.
  const handleFinsh = async () => {
    if (!canvasRef.current || lines.length === 0) return;
    if (canvasRef.current.getContext('2d')) {
      addPolygon({
        key: getMaxIndex(),
        moves: [...moves, { x: lines[lines.length - 1].x, y: lines[lines.length - 1].y }], // 마우스 마지막 포인트를 선 마지막 점 으로 추가.
        lines: [...lines, { x: moves[0].x, y: moves[0].y }], // 끝선과 마우스 포인트 첫점을 합쳐준다.
        isMerged: false,
      });
      setLines([]); // state 초기화
      setMoves([]); // state 초기화
    }
  };

  // Store의 Observable item이 변경(추가, 삭제) 될 시점마다 리스트를 캔버스에 그린다.
  useEffect(() => {
    redraw();
  }, [drawItems]);

  // store 의 observable 변수가 변경이 있을 때 캔버스에 목록을 다시 그려준다.
  const redraw = () => {
    if (!canvasRef.current) return;

    let canvas: HTMLCanvasElement = canvasRef.current;
    let context = canvas.getContext('2d');

    if (context) {
      context.clearRect(0, 0, canvas.width, canvas.height);

      if (drawItems.length > 0) {
        for (let i = 0; i < drawItems.length; i++) {
          context.beginPath();
          if (drawItems[i].isMerged) {
            // Merge 상태 아이템의 경우
            context.strokeStyle = '#5634eb';
            context.fillStyle = '#FFFFFF';
            for (let j = 0; j < drawItems[i].lines.length; j++) {
              context.moveTo(drawItems[i].moves[j].x, drawItems[i].moves[j].y);
              context.lineTo(drawItems[i].lines[j].x, drawItems[i].lines[j].y); //경로의 끝 점에서 (x,y)까지 직선을 경로에 추가한다.
            }
            context.stroke(); // 그린다.
            context.globalCompositeOperation = 'destination-out';
            for (let j = 0; j < drawItems[i].lines.length; j++) {
              // context.moveTo(drawItems[i].moves[j].x, drawItems[i].moves[j].y);
              context.lineTo(drawItems[i].lines[j].x, drawItems[i].lines[j].y); //경로의 끝 점에서 (x,y)까지 직선을 경로에 추가한다.
            }
            context.fill(); //배경을 넣을때는 moveTo를 할경우 경로가 끊어지기때문에 넣지않음.
            context.globalCompositeOperation = 'source-over'; // reset
          } else {
            // Merge 상태가 아닌 아이템의 경우
            context.strokeStyle = 'black';
            for (let j = 0; j < drawItems[i].lines.length; j++) {
              // observable 목록안의 i 번째 line path을 반복
              context.moveTo(drawItems[i].moves[j].x, drawItems[i].moves[j].y);
              context.lineTo(drawItems[i].lines[j].x, drawItems[i].lines[j].y); //경로의 끝 점에서 (x,y)까지 직선을 경로에 추가한다.
            }
            context.globalCompositeOperation = 'source-over';
            context.stroke(); // 그린다.
          }
        }
      }
    }
  };

  // canvas ref에 이벤트 리스너 등록
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
      y: event.pageY - canvasRef.current.offsetTop,
    };
  };

  // 선 그리기
  const drawLine = async (originalMousePosition: Coordinate, newMousePosition: Coordinate) => {
    if (!canvasRef.current) return;
    const canvas: HTMLCanvasElement = canvasRef.current;
    const context = canvas.getContext('2d');
    if (context) {
      context.globalCompositeOperation = 'source-over';
      context.strokeStyle = 'black';
      context.beginPath(); //새로운 경로를 생성
      context.moveTo(originalMousePosition.x, originalMousePosition.y); // 경로에 담긴 도형은 그대로 두고, 점 (x,y)를 새 시작점으로 삽입한다.
      context.lineTo(newMousePosition.x, newMousePosition.y); //경로의 끝 점에서 (x,y)까지 직선을 경로에 추가한다.
      context.stroke(); // 그린다.
      await setData(newMousePosition, originalMousePosition);
    }
  };

  // Line draw 값 저장.
  const setData = async (newMousePosition: Coordinate, originalMousePosition: Coordinate) => {
    setMoves([...moves, { x: originalMousePosition.x, y: originalMousePosition.y }]);
    setLines([...lines, { x: newMousePosition.x, y: newMousePosition.y }]);
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

  const selectedItemCheck = () => {
    const selectedArr: Polygon[] = toJS(drawItems).filter(
      (item: Polygon) => selectItems.indexOf(item.key) >= 0,
    );
    const deselectedArr: Polygon[] = toJS(drawItems).filter(
      (item: Polygon) => selectItems.indexOf(item.key) < 0,
    );

    for (const select of selectedArr) {
      makeArc('#34eb64', select.lines[0].x, select.lines[0].y);
    }
    for (const deselect of deselectedArr) {
      makeArc('#FFFFFF', deselect.lines[0].x, deselect.lines[0].y);
    }
  };

  const clearItemCheck = () => {
    for (const item of drawItems) {
      makeArc('#FFFFFF', item.lines[0].x, item.lines[0].y);
    }
  };

  // 선택값 또는 선택하지않은값에 대한 표시 처리.
  const makeArc = (color: string, x: number, y: number) => {
    if (!canvasRef.current) return;
    const canvas: HTMLCanvasElement = canvasRef.current;
    const context = canvas.getContext('2d');
    if (context) {
      context.beginPath();
      context.moveTo(x - 40, y - 40);
      context.arc(x - 40, y - 40, 4, 0, 2 * Math.PI, false);
      context.fillStyle = color;
      context.fill();
      context.closePath();
    }
  };

  useEffect(() => {
    if (selectItems.length > 0) selectedItemCheck();
    else clearItemCheck();
  }, [selectItems]);

  return (
    <Container ref={containerRef}>
      <canvas ref={canvasRef} width={canvasWidth} height={canvasHeight} />
    </Container>
  );
};

export default observer(Canvas);
