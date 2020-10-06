import CanvasStore from './CanvasStore';

// 여러가지 분류로 나뉘어 있는 Store를 하나로 combine.
class RootStore {
  canvasStore: CanvasStore;
  constructor() {
    this.canvasStore = new CanvasStore(this);
  }
}

export default RootStore;
