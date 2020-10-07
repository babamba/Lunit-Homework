import React, {
  useState,
  useEffect,
  forwardRef,
  ForwardRefRenderFunction,
  useImperativeHandle,
  useCallback
} from 'react';
import styled from 'styled-components';
import { Checkbox, Row, Col, Empty } from 'antd';
import { observer } from 'mobx-react';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';
import { useStore } from 'hooks/useStore';
import { toJS } from 'mobx';

const CheckTextBox = styled.span`
  padding-left: 12px;
`;
const EmptyBox = styled(Empty)`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

interface Handler {
  merge(): void;
  delete(): void;
  export(): void;
}

interface Polygon {
  key: number;
  lines: Coordinate[];
}

type Coordinate = {
  x: number;
  y: number;
};

interface Props {}

const PolygonList: ForwardRefRenderFunction<Handler, Props> = (props, ref) => {
  const { drawItems, deletePolygon, selectItems, setSelectedItem } = useStore('canvasStore');
  // 부모요소에서 자식요소의 함수 실행
  useImperativeHandle(ref, () => ({
    merge: () => {
      console.log('useImpreative merge');
      findItems();
    },
    delete: async () => {
      await deletePolygon(selectItems as number[]);
    },
    export: () => {
      const temp = toJS(drawItems);
      console.info('--- > [PolygonList]  Export All : ', temp);
    }
  }));

  const findItems = () => {
    const filterArr: Polygon[] = toJS(drawItems).filter((item: Polygon) => {
      return selectItems.indexOf(item.key) >= 0;
    });

    console.log('filter Items : ', filterArr);
  };

  const onHandleChange = useCallback((values: CheckboxValueType[]) => {
    console.log('----> [PolygonList]  checked = ', values);
    setSelectedItem([...values] as number[]);
  }, []);

  const renderItems = useCallback(() => {
    console.log('----> [PolygonList]  renderItems count : ', drawItems.length);
    return drawItems.map((item, idx) => {
      return (
        <Col span={24} key={idx}>
          <Checkbox value={item.key}>
            <CheckTextBox>{`Polygon ${item.key}`}</CheckTextBox>
          </Checkbox>
        </Col>
      );
    });
  }, [drawItems]);

  useEffect(() => {
    console.log('----> [PolygonList]  updated selectItems effect : ', toJS(selectItems));
  }, [selectItems]);

  useEffect(() => {
    console.log('----> [PolygonList] updated drawItems effect : ', toJS(drawItems));
  }, [drawItems]);

  return (
    <Checkbox.Group defaultValue={selectItems} style={{ width: '100%' }} onChange={onHandleChange}>
      <Row gutter={[0, 16]}>{drawItems.length > 0 ? renderItems() : <EmptyBox />}</Row>
    </Checkbox.Group>
  );
};

export default observer(forwardRef(PolygonList));
