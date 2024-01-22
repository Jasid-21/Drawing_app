import { SegmentEquivalences } from "../HelperObjects";
import Duple from "../types/Duple.type";
import PointType from "../types/PointType.type";
import Segment from "./Segment.class";
import SegmentPoint from "./SegmentPoint.class";
import Shape from "./Shape.class";

class Path extends Shape {
  segments: Segment[] = [];

  constructor(segments: Segment[], isGuide = false) {
    super('path');
    this.segments = segments;
  }

  getCenter(): string | undefined {
    var center: Duple<number> | undefined = undefined;
    var minX: number = Infinity,
    maxX: number = -Infinity,
    minY: number = Infinity,
    maxY: number = -Infinity;
    this.segments.forEach((s) => {
      const startPoint = this.points.find((p) => p.id == s.start);
      if (!startPoint) return;

      if (startPoint.coord[0] < minX) minX = startPoint.coord[0];
      if (startPoint.coord[0] > maxX) maxX = startPoint.coord[0];
      if (startPoint.coord[1] < minY) minY = startPoint.coord[1];
      if (startPoint.coord[1] > maxY) maxY = startPoint.coord[1];
    });

    center = [
      (minX + maxX) / 2,
      (minY + maxY) / 2
    ]

    return center?.map((n) => n + 'px').join(' ');
  }

  getPath(end = false): string {
    return this.shapeToPath() + (end ? ' Z' : '');
  }

  shapeToPath(): string {
    const segments = this.segments;
    const segmentPaths = segments.map((s) => this.segmentToPath(s));
    const path = segmentPaths[0] + ' ' + segmentPaths.slice(1).map((p) => {
      const ps = p.split(' ').slice(2)
      return ps.join(' ');
    }).join(' ');

    return path;
  }

  segmentToPath(segment: Segment): string {
    const startPoint = this.points.find((p) => p.id == segment.start);
    const endPoint = this.points.find((p) => p.id == segment.end);

    if (!startPoint || !endPoint) return '';
    const type = segment.type;
    const controlPoints = segment.controlPoints.map((pId) => {
      const point = this.points.find((p) => p.id == pId);
      if (!point) return;
      return point;
    });

    var path = 'M';
    path += startPoint.coord.join(' ');
    path += ' ' + SegmentEquivalences[type];
    path +=  controlPoints.map((p) => ' ' + p?.coord.join(' '));
    path += ' ' + endPoint.coord.join(' ');

    return path;
  }

  addSegment(segment: Segment): void {
    const startPoint = this.points.find(p => p.id == segment.start);
    const endPoint = this.points.find(p => p.id == segment.end);
    if (!startPoint || !endPoint) return;

    this.segments.push(segment);
  }

  removeSegment(id: string): void {
    this.segments = this.segments.filter(s => s.id != id);
  }

  updatePointCoord(id: string, coord: Duple<number>): void {
    const point = this.points.find(p => p.id == id);
    if (!point) return;

    point.coord = coord;
  }

  segmentToCurve(ids: string[], control: 'middle' | 'end'): void {
    const segments: Segment[] = [];
    ids.forEach(id => {
      const s = this.segments.find(s => s.id == id);
      if (s) segments.push(s)
    });

    segments.forEach(s => {
      s.type = 'curve';
      if (control == 'end') {
        s.controlPoints.push(s.end);
      }
    })
  }

  segmentToDoubleCurve(id: string, control: 'middle' | 'end'): string | undefined {
    var newControlPointId: string = '';
    const segment = this.segments.find(s => s.id == id); //Curve segment.
    if (!segment) return;

    if (control == 'end') {
      const endPoint = this.points.find(p => p.id == segment.end);
      if (!endPoint) return;

      const newControlPoint = new SegmentPoint('control', endPoint.coord);
      this.addPoint(newControlPoint);
      segment.addControlPoint(newControlPoint.id);
      segment.type = 'doubleCurve';

      newControlPointId = newControlPoint.id;
    }

    return newControlPointId;
  }

  moveShape(deltaX: number, deltaY: number): void {
    console.log('path');
    this.points.forEach(p => {
      p.coord = [
        p.coord[0] + deltaX,
        p.coord[1] + deltaY
      ]
    });
  }
}

export default Path;
