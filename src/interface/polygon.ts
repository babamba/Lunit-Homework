export interface Polygon {
  key: number;
  lines: Coordinate[];
  moves: Coordinate[];
  isMerged: boolean;
}

export type Coordinate = {
  x: number;
  y: number;
};
