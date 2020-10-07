import React, { FC, useEffect } from 'react';
import { DeleteOutlined, MergeCellsOutlined, ExportOutlined } from '@ant-design/icons';
import { Button, Space } from 'antd';
import { observer } from 'mobx-react';
import { toJS } from 'mobx';
import { useStore } from 'hooks/useStore';
interface Props {
  handleDelete: Function;
  handleMerge: Function;
  handleExport: Function;
}

const ActionButtons: FC<Props> = (props: Props) => {
  const { selectItems } = useStore('canvasStore');
  const { handleDelete, handleMerge, handleExport } = props;

  return (
    <Space direction="vertical" style={{ width: '100%', justifyContent: 'flex-end' }}>
      <Button
        type="primary"
        danger
        icon={<DeleteOutlined />}
        onClick={() => handleDelete()}
        style={{ width: '100%' }}
        disabled={toJS(selectItems).length === 0}
      >
        Delete
      </Button>
      <Button
        icon={<MergeCellsOutlined />}
        onClick={() => handleMerge()}
        style={{ width: '100%' }}
        disabled={!(toJS(selectItems).length > 1)}
      >
        Merge Selected
      </Button>
      <Button icon={<ExportOutlined />} onClick={() => handleExport()} style={{ width: '100%' }}>
        Export All
      </Button>
    </Space>
  );
};

export default observer(ActionButtons);
