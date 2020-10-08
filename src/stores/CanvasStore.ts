import { observable, action } from 'mobx';
import RootStoreModel from './index';

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

class CanvasStore {
  rootStore: RootStoreModel;
  constructor(rootStore: RootStoreModel) {
    this.rootStore = rootStore;
  }

  @observable drawItems: Polygon[] = [];
  @observable selectItems: number[] = [];

  @action.bound
  async initStorage() {
    console.log('----> [Store] initStorage');
    const local = await localStorage.getItem('polygonList');
    if (local) this.drawItems = JSON.parse(local);
  }

  @action.bound
  async addPolygon(param: Polygon) {
    const local = await localStorage.getItem('polygonList');
    if (local) {
      const list = JSON.parse(local) as Polygon[];
      const newList = [...list, param];
      await localStorage.setItem('polygonList', JSON.stringify(newList));
      this.setDrawItems(newList);
    } else {
      await localStorage.setItem('polygonList', JSON.stringify([param]));
      this.setDrawItems([param]);
    }
  }

  @action.bound
  async deletePolygon(list: number[]) {
    const local = await localStorage.getItem('polygonList');
    if (local) {
      const filterArr: Polygon[] = JSON.parse(local).filter(
        (item: Polygon, idx: number) => list.indexOf(item.key) < 0
      );
      await localStorage.setItem('polygonList', JSON.stringify(filterArr));
      this.setDrawItems(filterArr);
      this.setSelectedItem([]);
    }
  }

  @action.bound
  setDrawItems(newList: Polygon[]) {
    this.drawItems = newList;
  }

  @action.bound
  setSelectedItem(list: number[]) {
    this.selectItems = list;
  }
}

export default CanvasStore;
