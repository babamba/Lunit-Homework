import React, {
  useEffect,
  forwardRef,
  ForwardRefRenderFunction,
  useImperativeHandle,
  useCallback,
} from "react";
import styled from "styled-components";
import { Checkbox, Row, Col, Empty } from "antd";
import { observer } from "mobx-react";
import { CheckboxValueType } from "antd/lib/checkbox/Group";
import { useStore } from "hooks/useStore";
import { Polygon } from "interface/polygon";
import { toJS } from "mobx";

const CheckTextBox = styled.span`
  padding-left: 12px;
`;

interface Handler {
  merge(): void;
  delete(): void;
  export(): void;
}

interface Props {}

const PolygonList: ForwardRefRenderFunction<Handler, Props> = (props, ref) => {
  const {
    drawItems,
    addPolygon,
    deletePolygon,
    getMaxIndex,
    selectItems,
    setSelectedItem,
  } = useStore("canvasStore");

  // 부모요소에서 자식요소의 함수 실행
  useImperativeHandle(ref, () => ({
    merge: () => onHandleMerge(),
    delete: async () => await deletePolygon(),
    export: () => {
      const temp = toJS(drawItems).map((item: Polygon) => item.lines);
      console.info("--- > [PolygonList]  Export All : ", temp);
    },
  }));

  const onHandleMerge = useCallback(async () => {
    // 2개 이상의 Line 목록을 병합한다.

    // console.log('----> [PolygonList] findMergeItems ');
    const filterArr: Polygon[] = toJS(drawItems).filter(
      (item: Polygon) => selectItems.indexOf(item.key) >= 0
    );
    if (filterArr.length > 1) {
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
      await deletePolygon(); // merge 선택요소 제거
      // 병합 아이템 등록.
      await addPolygon({
        key: getMaxIndex(),
        moves: mergeMoves,
        lines: mergeLines,
        isMerged: true,
      });
    }
  }, [selectItems]);

  const onHandleChange = useCallback(
    (values: CheckboxValueType[]) => {
      // console.log("----> [PolygonList]  checked = ", values);
      setSelectedItem([...values] as number[]);
    },
    [selectItems]
  );

  const renderItems = useCallback(() => {
    // console.log("----> [PolygonList]  renderItems count : ", drawItems.length);
    return drawItems.map((item: Polygon, idx: number) => (
      <Col span={24} key={idx}>
        <Checkbox value={item.key}>
          <CheckTextBox>{`Polygon ${item.key}`}</CheckTextBox>
        </Checkbox>
      </Col>
    ));
  }, [drawItems]);

  // useEffect(() => {
  //   console.log(
  //     "----> [PolygonList]  updated selectItems effect : ",
  //     toJS(selectItems)
  //   );
  // }, [selectItems]);

  // useEffect(() => {
  //   console.log(
  //     "----> [PolygonList] updated drawItems effect : ",
  //     toJS(drawItems)
  //   );
  // }, [drawItems]);

  return (
    <Checkbox.Group
      value={toJS(selectItems)}
      style={{ width: "100%" }}
      onChange={onHandleChange}
    >
      <Row gutter={[0, 16]}>
        {drawItems.length > 0 ? (
          renderItems()
        ) : (
          <Col span={24}>
            <Empty description="저장된 항목이 없습니다." />
          </Col>
        )}
      </Row>
    </Checkbox.Group>
  );
};

export default observer(forwardRef(PolygonList));
