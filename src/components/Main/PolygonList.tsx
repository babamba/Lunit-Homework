import React, { useEffect, useCallback } from "react";
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

interface Props {}

const PolygonList = () => {
  const { drawItems, selectItems, setSelectedItem } = useStore("canvasStore");

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

export default observer(PolygonList);
