import { Injectable, OnInit } from '@angular/core';
import SegmentPoint from '../helpers/classes/SegmentPoint.class';
import Shape from '../helpers/classes/Shape.class';
import { BehaviorSubject } from 'rxjs';
import Duple from '../helpers/types/Duple.type';
import MouseMode from '../helpers/types/MouseMode.type';
import SegmentType from '../helpers/types/SegmentType.type';
import Circle from '../helpers/classes/Circle.class';
import Rect from '../helpers/classes/Rect.class';
import Path from '../helpers/classes/Path.class';

@Injectable({
  providedIn: 'root'
})
export class ShapesManagerService {
  $shapes = new BehaviorSubject<(Circle | Rect | Path)[]>([]);
  $currentShapeId = new BehaviorSubject< string | undefined>(undefined);

  mouseMode: MouseMode = 'default';
  segmentType: SegmentType = 'line';
  mouseIsDown: boolean = false;

  shapesColor: string = 'rgb(170,170,170)';

  constructor() { }

  setCurrentShape(id?: string): void {
    this.$currentShapeId.next(id);
  }

  setShapesColor(color: string): void {
    this.shapesColor = color;
  }

  setMouseMode(mode: MouseMode, segment?: SegmentType): void {
    this.mouseMode = mode;

    if (!segment) return;
    this.segmentType = segment;
  }
  setMouseDown(isDown: boolean): void {
    this.mouseIsDown = isDown;
  }

  addShape(shape: Circle | Rect | Path): void {
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
    mouseX: number,
    mouseY: number,
    ): void {

    const shapes = this.$shapes.getValue();
    const shape = shapes.find((s) => s.id == id);
    if (!shape) return;

    if (shape instanceof Circle) {
      shape.updateSize(mouseX, mouseY);
    }

    if (shape instanceof Rect) {
      shape.updateSize(mouseX, mouseY);
    }

    this.$shapes.next(shapes);
  }

  getShapes(id?: string): Shape[] {
    const shapes = this.$shapes.getValue();

    if (id) {
      const shape = shapes.find((s) => s.id == id);
      return shape ? [shape] : [];
    }

    return shapes;
  }

  deselectAll(): void {
    const shapes = this.$shapes.getValue();
    shapes.filter((s) => s.selected).forEach((s) => {
      this.toggleShapeSelection(s);
    });
  }

  updateShapesList(shapes: (Circle | Rect | Path)[]): void {
    this.$shapes.next(shapes);
  }

  toggleShapeSelection(shape?: Circle | Rect | Path | string): void {
    const multiselect = false;
    const shapes = this.$shapes.getValue();
    shape = shape instanceof Shape ? shape : shapes.find((s) => s.id == shape);
    if (!shape) return;

    if (!multiselect) {
      const newState = !shape.selected;
      shapes.forEach((s) => {
        s.selected = false;
      });

      shape.selected = newState;
    } else {
      shape.toggleSelect();
    }
    this.$shapes.next(shapes);
  }
}
