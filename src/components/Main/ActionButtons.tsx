import React, { FC } from "react";
import {
  DeleteOutlined,
  MergeCellsOutlined,
  ExportOutlined,
} from "@ant-design/icons";
import { Button, Space } from "antd";
import { observer } from "mobx-react";
import { toJS } from "mobx";
import { useStore } from "hooks/useStore";

const ActionButtons: FC = () => {
  const { selectItems, merge, deletePolygon, exportAll } = useStore(
    "canvasStore"
  );

  return (
    <Space
      direction="vertical"
      style={{ width: "100%", justifyContent: "flex-end" }}
    >
      <Button
        type="primary"
        danger
        icon={<DeleteOutlined />}
        onClick={() => deletePolygon()}
        style={{ width: "100%" }}
        disabled={toJS(selectItems).length === 0}
      >
        Delete
      </Button>
      <Button
        icon={<MergeCellsOutlined />}
        onClick={() => merge()}
        style={{ width: "100%" }}
        disabled={!(toJS(selectItems).length > 1)}
      >
        Merge Selected
      </Button>
      <Button
        type="primary"
        icon={<ExportOutlined />}
        onClick={() => exportAll()}
        style={{ width: "100%" }}
      >
        Export All
      </Button>
    </Space>
  );
};

export default observer(ActionButtons);
