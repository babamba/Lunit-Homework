import React, {
  FC,
  useRef,
  useState,
  useEffect,
  useCallback,
  forwardRef,
  ForwardRefRenderFunction,
  useImperativeHandle
} from 'react';
import { useWindowWidth, useWindowHeight } from '@react-hook/window-size';
import styled from 'styled-components';
import { observer } from 'mobx-react';
import { toJS } from 'mobx';
import { useStore } from 'hooks/useStore';

const Container = styled.div`
  display: flex;
  flex: 1;
  cursor: pointer;
`;

interface Handler {
  merge(): void;
}

interface Props {}
interface Polygon {
  key: number;
  lines: Coordinate[];
  moves: Coordinate[];
  isMerged: boolean;
}

type Coordinate = {
  x: number;
  y: number;
};

const Canvas: ForwardRefRenderFunction<Handler, Props> = (props, ref) => {
  const { addPolygon, deletePolygon, drawItems, selectItems } = useStore('canvasStore');

  const browserWidth = useWindowWidth();
  const browserHeight = useWindowHeight();

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvasWidth, setCanvasWidth] = useState<number | undefined>(600);
  const [canvasHeight, setCanvasHeight] = useState<number | undefined>(600);

  const [isPainting, setIsPainting] = useState<boolean>(false);
  const [mousePosition, setMousePosition] = useState<Coordinate | undefined>(undefined);
  const [lines, setLines] = useState<Coordinate[]>([]);
  const [moves, setMoves] = useState<Coordinate[]>([]);

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
    [isPainting, mousePosition]
  );

  //Mouse Up&Leave Event Listener에 사용될 callback 함수
  const exitPaint = () => {
    setIsPainting(false);
    setMousePosition(undefined);
    handleFinsh(); // 페인팅이 끝난 후 Store에 저장한다.
  };

  const handleFinsh = async () => {
    console.log('----> [Canvas] draw finish ! ');
    console.info('----> [Canvas] draw lines : ', lines.length);
    console.info('----> [Canvas] draw moves : ', moves.length);
    if (!canvasRef.current || lines.length === 0) return;
    if (canvasRef.current.getContext('2d')) {
      console.log('test @@ : ', moves[moves.length - 1].x, moves[moves.length - 1].y);
      console.log('test @@ : ', lines[lines.length - 1].x, lines[lines.length - 1].y);
      addPolygon({
        key: maxIndex(),
        moves: [...moves, { x: lines[lines.length - 1].x, y: lines[lines.length - 1].y }],
        lines: [...lines, { x: lines[0].x, y: lines[0].y }], // 끝선과 시작선을 합쳐준다.
        isMerged: false
      });
      setLines([]); // state 초기화
      setMoves([]); // state 초기화
    }
  };

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
            console.log('merged item');
            context.strokeStyle = 'green';
            context.fillStyle = '#FFFFFF';

            for (let j = 0; j < drawItems[i].lines.length; j++) {
              // observable 목록안의 i 번째 line path을 반복
              // moveTo 적용시  선 지점에 대한 참조가 끊어 지기 때문에 배경이 안들어감.
              // context.moveTo(drawItems[i].moves[j].x, drawItems[i].moves[j].y);
              context.lineTo(drawItems[i].lines[j].x, drawItems[i].lines[j].y); //경로의 끝 점에서 (x,y)까지 직선을 경로에 추가한다.
            }

            context.stroke(); // 그린다.
            context.fill();
            console.log('merged draw end');
          } else {
            console.log('not merged item');
            context.strokeStyle = 'black';
            for (let j = 0; j < drawItems[i].lines.length; j++) {
              // observable 목록안의 i 번째 line path을 반복
              context.moveTo(drawItems[i].moves[j].x, drawItems[i].moves[j].y);
              context.lineTo(drawItems[i].lines[j].x, drawItems[i].lines[j].y); //경로의 끝 점에서 (x,y)까지 직선을 경로에 추가한다.
            }
            context.stroke(); // 그린다.
            console.log('stroke draw end');
          }
        }
      }
    }
  };

  // 아이템을 추가할때 마다, 리스트에 key의 최대값을 찾아 ++값으로 리턴.
  const maxIndex = (): number => {
    if (drawItems.length > 0) {
      const max = Math.max(...drawItems.map(o => o.key));
      return max + 1;
    } else {
      return 0;
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
      y: event.pageY - canvasRef.current.offsetTop
    };
  };

  // 선 그리기
  const drawLine = async (originalMousePosition: Coordinate, newMousePosition: Coordinate) => {
    if (!canvasRef.current) return;
    const canvas: HTMLCanvasElement = canvasRef.current;
    const context = canvas.getContext('2d');
    if (context) {
      context.strokeStyle = '#000000';
      context.beginPath(); //새 로운 경로를 만듭니다. 경로가 생성됬다면, 이후 그리기 명령들은 경로를 구성하고 만드는데 사용하게 됩니다.
      context.moveTo(originalMousePosition.x, originalMousePosition.y); // 경로에 담긴 도형은 그대로 두고, 점 (x,y)를 새 시작점으로 삽입한다.
      context.lineTo(newMousePosition.x, newMousePosition.y); //경로의 끝 점에서 (x,y)까지 직선을 경로에 추가한다.
      // context.closePath(); //현재 하위 경로의 시작 부분과 연결된 직선을 추가합니다.
      context.stroke(); // 그린다.
      console.log(
        'originalMousePosition.x, originalMousePosition.y',
        originalMousePosition.x,
        originalMousePosition.y
      );
      console.log('newMousePosition.x, newMousePosition.y', newMousePosition.x, newMousePosition.y);
      await setData(newMousePosition, originalMousePosition);
    }
  };

  const setData = async (newMousePosition: Coordinate, originalMousePosition: Coordinate) => {
    setMoves([...moves, { x: originalMousePosition.x, y: originalMousePosition.y }]);
    setLines([...lines, { x: newMousePosition.x, y: newMousePosition.y }]);
  };

  const checkResponsive = () => {
    if (!containerRef.current) return;
    setCanvasHeight(containerRef.current.offsetHeight);
    setCanvasWidth(containerRef.current.offsetWidth);
  };

  // 2개 이상의 Line 목록을 병합한다.
  const mergeFindItems = async () => {
    console.log('----> [Canvas] findMergeItems ');
    const filterArr: Polygon[] = toJS(drawItems).filter(
      (item: Polygon) => selectItems.indexOf(item.key) >= 0
    );
    console.log('----> [Canvas] filter Items : ', filterArr);

    if (!canvasRef.current) return;
    const canvas: HTMLCanvasElement = canvasRef.current;
    const context = canvas.getContext('2d');

    if (filterArr.length > 1) {
      if (context) {
        let mergeLines = [];
        let mergeMoves = [];
        // 선택 아이템들 목록의 line 배열 반복에 따른 새로운 line 배열로 구성
        for (let i = 0; i < filterArr.length; i++) {
          for (let j = 0; j < filterArr[i].lines.length; j++) {
            mergeLines.push(filterArr[i].lines[j]);
          }
        }

        for (let i = 0; i < filterArr.length; i++) {
          for (let j = 0; j < filterArr[i].moves.length; j++) {
            mergeMoves.push(filterArr[i].moves[j]);
          }
        }

        await deletePolygon(toJS(selectItems) as number[]); // merge 선택요소 제거
        // 병합 아이템 등록.
        await addPolygon({
          key: maxIndex(),
          moves: mergeMoves,
          lines: mergeLines,
          isMerged: true
        });
      }
    }
  };

  useImperativeHandle(ref, () => ({
    merge: () => mergeFindItems()
  }));

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

export default observer(forwardRef(Canvas));
