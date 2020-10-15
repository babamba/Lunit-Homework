import RootStoreModel from "store/index";
import { observable, action } from "mobx";
import { Polygon } from "interface/polygon";

class CanvasStore {
  rootStore: RootStoreModel;
  constructor(rootStore: RootStoreModel) {
    this.rootStore = rootStore;
  }

  @observable drawItems: Polygon[] = [];
  @observable selectItems: number[] = [];

  /** 초기 앱진입시 LocalStorage 탐색 후 store에 저장 */
  @action.bound
  async initStorage() {
    // console.log('----> [Store] initStorage');
    const local = localStorage.getItem("polygonList");
    if (local) this.setDrawItems(JSON.parse(local) as Polygon[]);
  }

  /** 도형 추가 Action */
  @action.bound
  async addPolygon(param: Polygon) {
    const local = localStorage.getItem("polygonList");
    if (local) {
      const list = JSON.parse(local) as Polygon[];
      const newList = [...list, param];
      localStorage.setItem("polygonList", JSON.stringify(newList));
      this.setDrawItems(newList);
    } else {
      localStorage.setItem("polygonList", JSON.stringify([param]));
      this.setDrawItems([param]);
    }
  }

  /** 도형 삭제 Action */
  @action.bound
  async deletePolygon() {
    const local = localStorage.getItem("polygonList");
    if (local) {
      const filterArr: Polygon[] = JSON.parse(local).filter(
        (item: Polygon) => this.selectItems.indexOf(item.key) < 0
      );
      localStorage.setItem("polygonList", JSON.stringify(filterArr));
      this.setDrawItems(filterArr);
      this.setSelectedItem([]);
    }
  }

  /** 도형 추가시 최대 index값을 구한다.  */
  @action.bound
  getMaxIndex() {
    // 아이템을 추가할때 마다, 리스트에 key의 최대값을 찾아 ++값으로 리턴.
    // console.log("this.drawItems : ", this.drawItems);
    if (this.drawItems.length > 0) {
      const max = Math.max(...this.drawItems.map((o) => o.key));
      return max + 1;
    } else {
      return 0;
    }
  }

  /** 도형 아이템 리스트 setter  */
  @action.bound
  setDrawItems(newList: Polygon[]) {
    this.drawItems = newList;
  }

  /** 선택 리스트 setter  */
  @action.bound
  setSelectedItem(newSelectList: number[]) {
    this.selectItems = newSelectList;
  }
}

export default CanvasStore;
