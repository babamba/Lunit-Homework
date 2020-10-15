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
  @action.bound
  async merge() {
    const filterArr: Polygon[] = this.drawItems.filter(
      (item: Polygon) => this.selectItems.indexOf(item.key) >= 0
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
      await this.deletePolygon(); // merge 선택요소 제거
      // 병합 아이템 등록.
      await this.addPolygon({
        key: this.getMaxIndex(),
        moves: mergeMoves,
        lines: mergeLines,
        isMerged: true,
      });
    }
  }
  @action.bound
  exportAll() {
    const temp = this.drawItems.map((item: Polygon) => item.lines);
    console.info("--- > [PolygonList]  Export All : ", temp);
  }
}

export default CanvasStore;
