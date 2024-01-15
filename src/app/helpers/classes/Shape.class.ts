import GetRandomString from "../functions/GetRandomString.func";
import ShapeType from "../types/ShapeType.type";
import Segment from "./Segment.class";
import CssStyle from "../types/CssStyle.type";

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
  style: CssStyle = { fill: 'red' };
  done: boolean = false;

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
}

export default Shape;
