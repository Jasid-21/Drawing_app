import Duple from "../types/Duple.type";
import SegmentPoint from "./SegmentPoint.class";
import Shape from "./Shape.class";

class Circle extends Shape {
  start: string = '';
  radius: number = 0;

  constructor(start: Duple<number>, radius: number, isGuide = false) {
    super('circle', isGuide);

    const startPoint = new SegmentPoint('raw', start);
    this.addPoint(startPoint);
    this.start = startPoint.id;
    this.radius = radius;
  }

  moveShape(deltaX: number, deltaY: number): void {
    console.log('circle');
    const center = this.points.find(p => p.id == this.start);
    if (!center) return;

    center.coord = [
      center.coord[0] + deltaX,
      center.coord[1] + deltaY
    ]
  }

  getCenter(): string | undefined {
    var center: Duple<number> | undefined = undefined;
    const point = this.points.find((p) => p.id == this.start);
    if (!point) return;

    center = [point.coord[0], point.coord[1]];
    return center?.map((n) => n + 'px').join(' ');
  }

  updateSize(mouseX: number, mouseY: number): void {
    const center = this.points.find(p => p.id == this.start);
    if (!center) return;

    const [deltaX, deltaY] = [
      mouseX - center.coord[0],
      mouseY - center.coord[1]
    ]

    this.radius = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
  }
}

export default Circle;
