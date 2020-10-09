import RootStoreModel from 'store/index';
import { observable, action } from 'mobx';
import { Polygon } from 'interface/polygon'

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
    if (local) this.setDrawItems(JSON.parse(local) as Polygon[]);
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
  getMaxIndex(){
    // 아이템을 추가할때 마다, 리스트에 key의 최대값을 찾아 ++값으로 리턴.
    console.log('this.drawItems : ', this.drawItems)
    if (this.drawItems.length > 0) {
      const max = Math.max(...this.drawItems.map(o => o.key));
      return max + 1;
    } else {
      return 0;
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
