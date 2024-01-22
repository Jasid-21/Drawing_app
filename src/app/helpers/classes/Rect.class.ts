import Duple from "../types/Duple.type";
import SegmentPoint from "./SegmentPoint.class";
import Shape from "./Shape.class";

class Rect extends Shape {
  start: string;
  startCoord: Duple<number> = [0, 0];
  width: number;
  height: number;

  constructor(
    start: Duple<number>,
    width: number, height: number,
    round = 0, isGuide = false
    ) {
    super('rect', isGuide);

    const startPoint = new SegmentPoint('raw', start);
    this.addPoint(startPoint);
    this.start = startPoint.id;
    this.startCoord = [...start];
    this.width = width;
    this.height = height;
  }

  getCenter(): string | undefined {
    var center: Duple<number> | undefined = undefined;
  const start = this.points.find((p) => p.id == this.start);
    if (!start) return;

    center = [
      start.coord[0] + this.width / 2,
      start.coord[1] + this.height / 2
    ];
    return center?.map((n) => n + 'px').join(' ');
  }

  updateSize(mouseX: number, mouseY: number): void {
    const start = this.points.find(p => p.id == this.start);
    if (!start) return;

    const [deltaX, deltaY] = [
      Math.abs(mouseX - this.startCoord[0]),
      Math.abs(mouseY - this.startCoord[1])
    ]

    start.coord = [
      Math.min(mouseX, this.startCoord[0]),
      Math.min(mouseY, this.startCoord[1])
    ]

    this.width = deltaX;
    this.height = deltaY;
  }

  moveShape(deltaX: number, deltaY: number): void {
    console.log('rect');
    const center = this.points.find(p => p.id == this.start);
    if (!center) return;

    center.coord = [
      center.coord[0] + deltaX,
      center.coord[1] + deltaY
    ]
  }
}

export default Rect;
