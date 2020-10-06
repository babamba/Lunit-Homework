import { observable, action, computed } from 'mobx';
import RootStoreModel from './index';

class CanvasStore {
  rootStore: RootStoreModel;
  constructor(rootStore: RootStoreModel) {
    this.rootStore = rootStore;
  }

  @observable drawItems = [];

  @action.bound
  async test() {
    console.log('test : ', this.drawItems);
  }
}

export default CanvasStore;
