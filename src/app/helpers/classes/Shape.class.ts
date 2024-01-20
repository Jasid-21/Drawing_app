import GetRandomString from "../functions/GetRandomString.func";
import ShapeType from "../types/ShapeType.type";
import Segment from "./Segment.class";
import Duple from "../types/Duple.type";

class Shape {
  id: string;
  type: ShapeType;
  isGuide: boolean;
	segments: Segment[];
  selected: boolean = false;
  start: string = '';
  round: number = 0;
  radiusX: number = 0;
  radiusY: number = 0;
  fill: string = 'rgba(255,0,0,1)';
  stroke: string = 'rgb(0,0,0)';

  rotate: number = 0;
  scale: Duple<number> = [1, 1];
  translate: Duple<number> = [0, 0];

  constructor(
      type: ShapeType,
      segments: Segment[] = [],
      isGuide: boolean = false,
      start: string = '',
      round: number = 0,
      radiusX: number = 0,
      radiusY: number = 0,
    ) {
    this.id = GetRandomString();
    this.type = type;
    this.segments = segments;
    this.isGuide = isGuide;
    this.start = start;
    this.round = round;
    this.radiusX = radiusX
    this.radiusY = radiusY;
  }

  toggleSelect(): void {
    console.log("Toggling");
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
