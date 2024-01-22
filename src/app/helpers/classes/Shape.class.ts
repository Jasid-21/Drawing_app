import GetRandomString from "../functions/GetRandomString.func";
import ShapeType from "../types/ShapeType.type";
import Duple from "../types/Duple.type";
import SegmentPoint from "./SegmentPoint.class";
import PointType from "../types/PointType.type";

class Shape {
  points: SegmentPoint[] = [];
  id: string;
  type: ShapeType;
  isGuide: boolean;
  selected: boolean = false;

  fill: string = 'rgba(255,0,0,1)';
  stroke: string = 'rgb(0,0,0)';

  rotate: number = 0;
  scale: Duple<number> = [1, 1];
  translate: Duple<number> = [0, 0];

  constructor(
      type: ShapeType,
      isGuide: boolean = false,
    ) {
    this.id = GetRandomString();
    this.type = type;
    this.isGuide = isGuide;
  }

  addPoint(point: SegmentPoint): void {
    this.points.push(point);
  }

  removePoint(id: string): void {
    this.points = this.points.filter(p => p.id != id);
  }

  showPoints(ids: string[]): void {
    if (ids.length) {
      ids.forEach(id => {
        const p = this.points.find(p => p.id == id);
        if (p) p.show = true;
      });
    } else {
      this.points.forEach(p => p.show = true);
    }
  }

  getPoint(id: string): SegmentPoint | undefined {
    return this.points.find(p => p.id == id);
  }

  getCoord(pointId: string): Duple<number | undefined> {
    const point = this.points.find(p => p.id == pointId);
    return point ? point.coord : [undefined, undefined];
  }

  setPointsMode(ids: string[], from: PointType | '*' = '*', to: PointType, last = false): void {
    const ps: SegmentPoint[] = ids.length ? [] : this.points;
    if (ids.length) {
      ids.forEach(id => {
        const p = this.points.find(p => p.id == id);
        if (p) ps.push(p);
      });
    }

    for (var i = 0; i < ps.length - (last ? 1 : 2); i++) {
      const p = ps[i];
      if (from != '*' ? p.type == from : true) {
        p.type = to;
      }
    }
  }

  deselectAllPoints(): void {
    this.points.forEach(p => {
      p.selected = false;
      p.show = false;
    });
  }

  togglePointsSelect(): void {
    this.points.forEach(p => {
      p.selected = !p.selected;
    });
  }

  toggleSelect(): void {
    this.selected = !this.selected;
  }

  setFill(color: string): void {
    this.fill = color;
  }

  setTransforms(
    rotate: number = 0,
    scale: Duple<number>  = [1, 1],
    translate: Duple<number> = [0, 0]
  ): void {
    this.scale = scale;
    this.rotate = rotate;
    this.translate = translate;
  }
}

export default Shape;
