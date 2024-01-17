import { Injectable, OnInit } from '@angular/core';
import SegmentPoint from '../helpers/classes/SegmentPoint.class';
import Shape from '../helpers/classes/Shape.class';
import { BehaviorSubject } from 'rxjs';
import ShapeType from '../helpers/types/ShapeType.type';
import Segment from '../helpers/classes/Segment.class';
import Duple from '../helpers/types/Duple.type';
import MouseMode from '../helpers/types/MouseMode.type';
import SegmentType from '../helpers/types/SegmentType.type';

@Injectable({
  providedIn: 'root'
})
export class ShapesManagerService {
  $points = new BehaviorSubject<SegmentPoint[]>([]);
  $shapes = new BehaviorSubject<Shape[]>([]);

  mouseMode: MouseMode = 'path';
  segmentType: SegmentType = 'line';
  mouseIsDown: boolean = false;


  constructor() { }

  setMouseMode(mode: MouseMode, segment?: SegmentType): void {
    this.mouseMode = mode;

    if (!segment) return;
    this.segmentType = segment;
  }
  setMouseDown(isDown: boolean): void {
    this.mouseIsDown = isDown;
  }

  addPoint(point: SegmentPoint): void {
    if (!point) return;
    const points = this.$points.getValue();
    this.$points.next([...points, point]);
  }

  removePoint(id: string): void {
    if (!id) return;
    const points = this.$points.getValue();
    const newPoints = points.filter((p) => p.id != id);
    this.$points.next(newPoints);
  }

  updatePoint(id: string, coord: [number, number]): void {
    const points = this.$points.getValue();
    const point = points.find((p) => p.id == id);
    if (!point) return;

    point.updateCoord(coord);
    this.$points.next(points);
  }

  addShape(shape: Shape): void {
    const shapes = this.$shapes.getValue();
    this.$shapes.next([...shapes, shape]);
  }

  removeShape(id: string): void {
    if (!id) return;
    const shapes = this.$shapes.getValue();
    const newShapes = shapes.filter((s) => s.id != id);
    this.$shapes.next(newShapes);
  }

  updateShapeSize(
    id: string,
    radiusX: number,
    radiusY: number,
    newPoint?: Duple<number>,
    startPoint?: Duple<number>,
    ): void {

    const shapes = this.$shapes.getValue();
    const shape = shapes.find((s) => s.id == id);
    if (!shape) return;

    if (newPoint) {
      if (!startPoint) return;
      const points = this.$points.getValue();
      const point = points.find((p) => p.id == shape.start);
      if (!point) return;
      point.coord = [
        Math.min(newPoint[0], startPoint[0]),
        Math.min(newPoint[1], startPoint[1])
      ];

      this.$points.next(points);
    }

    if (shape.type == 'circle') {
      const h = Math.sqrt(Math.pow(radiusX, 2) + Math.pow(radiusY, 2))
      shape.radiusX = Math.abs(h);
    } else {
      shape.radiusX = Math.abs(radiusX);
      shape.radiusY = Math.abs(radiusY);
    }

    this.$shapes.next(shapes);
  }

  getPoints(id?: string): SegmentPoint[] {
    const points = this.$points.getValue();

    if (id) {
      const point = points.find((p) => p.id == id);
      return point ? [point] : [];
    }

    return points;
  }

  getShapes(id?: string): Shape[] {
    const shapes = this.$shapes.getValue();

    if (id) {
      const shape = shapes.find((s) => s.id == id);
      return shape ? [shape] : [];
    }

    return shapes;
  }

  toggleShapeSelection(shapeId: string): void {
    const multiselect = false;
    const shapes = this.$shapes.getValue();
    const shape = shapes.find((s) => s.id == shapeId);
    if (!shape) return;

    const nextMode = !shape.selected;
    if (!multiselect) {
      shapes.forEach((s) => {
        s.selected = false;
        this.toggleShapePoints(s, false);
      });
    }
    shape.selected = nextMode;

    this.toggleShapePoints(shape, nextMode);
    this.$shapes.next(shapes);
  }

  toggleShapePoints(shape: Shape, nextMode: boolean): void {
    const starts = shape.segments.map((s) => s.start);
    const ends = shape.segments.map((s) => s.end);
    const controls: string[] = []
    shape.segments.forEach((s) => {
      const cps = s.controlPoints;
      controls.push(...cps);
    });
    const segmentsStartPointsIds = [
      ...starts,
      ...ends,
      ...controls,
    ]

    const points = this.$points.getValue();
    segmentsStartPointsIds.forEach((id) => {
      const point = points.find((p) => p.id == id);
      if (point) {
        point.show = nextMode;
      }
    });
  }
}
