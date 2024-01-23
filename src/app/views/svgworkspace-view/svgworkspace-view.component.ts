import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import Segment from 'src/app/helpers/classes/Segment.class';
import SegmentPoint from 'src/app/helpers/classes/SegmentPoint.class';
import Duple from 'src/app/helpers/types/Duple.type';
import MouseMode from 'src/app/helpers/types/MouseMode.type';
import PointType from 'src/app/helpers/types/PointType.type';
import SegmentType from 'src/app/helpers/types/SegmentType.type';
import { ShapesManagerService } from 'src/app/services/shapes-manager.service';
import { faArrowPointer, faPenNib } from '@fortawesome/free-solid-svg-icons';
import { faCircle, faSquare } from '@fortawesome/free-regular-svg-icons';
import DragPointObj from 'src/app/helpers/types/DragPointObj.type';
import Circle from 'src/app/helpers/classes/Circle.class';
import Path from 'src/app/helpers/classes/Path.class';
import Rect from 'src/app/helpers/classes/Rect.class';
import Figure from 'src/app/helpers/types/Figure.type';

@Component({
  selector: 'app-svgworkspace-view',
  templateUrl: './svgworkspace-view.component.html',
  styleUrls: ['./svgworkspace-view.component.scss'],
})
export class SVGWorkspaceViewComponent implements OnInit {
  @ViewChild('canvas', { static: true }) canvas!: ElementRef;
  canvasBound: DOMRect | null = null;
  selectionStart: Duple<number> = [0, 0];
  selectionWidth: number = 0;
  selectionHeight: number = 0;

  faCircle = faCircle;
  faRect = faSquare;
  faPath = faPenNib;
  faDefault = faArrowPointer;
  activeBtn: MouseMode = this.ShapesManager.mouseMode;

  shapes: (Circle | Rect | Path)[] = [];
  points: SegmentPoint[] = [];
  draggedElement:string = '';
  dragStartPoint: Duple<number> | null = null;

  canvasWidth: number = 700;
  canvasHeight: number = 550;
  zoomScale: number = 1.1;

  viewBoxX: number = 0;
  viewBoxY: number = 0;
  viewBoxWidth = this.canvasWidth;
  viewBoxHeight = this.canvasHeight;

  startCoord: Duple<number> = [0, 0];
  startPointId: string = '';
  endPointId: string = '';
  controlPointId: string = '';
  rawShapeId: string = '';
  mouseIsDown: boolean = false;
  creatingShape: boolean = false;

  constructor(
    private ShapesManager: ShapesManagerService,
  ) {}

  ngOnInit(): void {
    this.ShapesManager.$shapes.subscribe((v) => {
      this.shapes = v;

      if (this.rawShapeId) {
        const shape = this.shapes.find(s =>  s.id == this.rawShapeId);
        if (shape) this.points = shape.points;
      } else {
        this.points = [];
        const selected = v.filter(s => s.selected);
        selected.forEach(s => {
          this.points.push(...s.points);
        });
        this.points.forEach(p => {
          p.show = true;
        });
      }
    });

    this.ShapesManager.$currentShapeId.subscribe((v) => {
      this.rawShapeId = v || '';

      const rawShape = this.shapes.find(s => s.id == v);
      if (rawShape) {
        this.points = rawShape.points;
      }
    });

    const circle = new Circle([100, 100], 50);
    this.ShapesManager.addShape(circle);

    const canvas = this.canvas.nativeElement as HTMLCanvasElement;
    this.canvasBound = canvas.getBoundingClientRect();
  }

  setZoom(ev: WheelEvent): void {
    const mouseX = ev.offsetX;
    const mouseY = ev.offsetY;
    const zoomDir = ev.deltaY;

    const leftFraction = mouseX / this.canvasWidth;
    const topFraction = mouseY / this.canvasHeight;

    if (zoomDir > 0) {
      const scaledWidth = this.viewBoxWidth / this.zoomScale;
      const scaledHeight = this.viewBoxHeight / this.zoomScale;

      this.viewBoxX = this.viewBoxX + ((this.viewBoxWidth - scaledWidth) * leftFraction);
      this.viewBoxY = this.viewBoxY + ((this.viewBoxHeight - scaledHeight) * topFraction);
      this.viewBoxWidth = scaledWidth;
      this.viewBoxHeight = scaledHeight;
    } else {
      const scaledWidth = this.viewBoxWidth * this.zoomScale;
      const scaledHeight = this.viewBoxHeight * this.zoomScale;

      this.viewBoxX = this.viewBoxX - ((scaledWidth - this.viewBoxWidth) * leftFraction);
      this.viewBoxY = this.viewBoxY - ((scaledHeight - this.viewBoxHeight) * topFraction);
      this.viewBoxWidth = scaledWidth;
      this.viewBoxHeight = scaledHeight;
    }
  }

  handlePointClick(pointId: string): void {
    if (!this.creatingShape) return;

    const shape = this.shapes.find((s) => s.id == this.rawShapeId);
    if (!shape) return;

    if (!(shape instanceof Path)) return;

    const segments = shape.segments;
    if (!segments.length) return;
    if (segments[0].start != pointId) return;

    segments.forEach((s) => {
      const startCoord = this.points.find((p) =>  p.id == s.start);
      if (startCoord) {
        startCoord.type = 'union';
        startCoord.show = false;
      }
    });

    const lastSegment = segments[segments.length - 1];
    lastSegment.end = pointId;
    shape.removePoint(this.endPointId);

    this.ShapesManager.setCurrentShape('');
    this.creatingShape = false;
    this.mouseIsDown = false;
    this.endPointId = '';
  }

  handlePointDrag(dragObj: DragPointObj): void {
    const { id, start, end } = dragObj;
    if (!this.canvasBound) return;
    const canvasCoord = [this.canvasBound.left, this.canvasBound.top];
    const scaledStart = this.scaledMouse(
      start[0] - canvasCoord[0],
      start[1] - canvasCoord[1],
    );
    const scaledEnd = this.scaledMouse(
      end[0] - canvasCoord[0],
      end[1] - canvasCoord[1],
    );

    const [deltaX, deltaY] = [
      scaledEnd[0] - scaledStart[0],
      scaledEnd[1] - scaledStart[1],
    ]

    const point = this.points.find(p => p.id == id);
    point?.moveByDelta(deltaX, deltaY);
  }

  handledragOver(ev: DragEvent): void {
    ev.preventDefault();
  }

  mouseDown(ev: MouseEvent): void {
    this.ShapesManager.deselectAll();
    this.mouseIsDown = true;

    const mouseMode = this.ShapesManager.mouseMode;
    if (mouseMode == 'default') {
      const t = ev.target as HTMLElement;
      if (!t.classList.contains('draggable')) return;

      const shapeId = t.getAttribute('href')?.slice(1);
      const shape = this.shapes.find((s) => s.id == shapeId);
      if (!shape) return;
      if (!this.canvasBound) return;

      this.draggedElement = shape.id;
      const absCoord = [ev.clientX, ev.clientY];
      const canvasCoord = [this.canvasBound.left, this.canvasBound.top];
      const [mouseX, mouseY] = [
        absCoord[0] - canvasCoord[0],
        absCoord[1] - canvasCoord[1],
      ];

      const scaledMouse = this.scaledMouse(mouseX, mouseY);
      this.dragStartPoint = [...scaledMouse];

      return;
    };

    const mousePoint = this.scaledMouse(ev.offsetX, ev.offsetY);
    this.startCoord = [...mousePoint];

    if (mouseMode == 'circle') {
      const circle = new Circle(mousePoint, 0);
      this.ShapesManager.setCurrentShape(circle.id);
      this.ShapesManager.addShape(circle);
      this.creatingShape = true;
    }

    if (mouseMode == 'rect') {
      const rect = new Rect(mousePoint, 0, 0);
      this.ShapesManager.setCurrentShape(rect.id);
      this.ShapesManager.addShape(rect);
      this.creatingShape = true;
    }

    if (mouseMode == 'path') {
      const prevPath = this.shapes.find(s => s.id == this.rawShapeId);

      if (prevPath && prevPath instanceof Path) {
        this.startPointId = this.endPointId;
        const endPoint = new SegmentPoint('raw', mousePoint);
        prevPath.addPoint(endPoint);
        this.endPointId = endPoint.id;

        const segment = new Segment('line', this.startPointId, this.endPointId);
        prevPath.addSegment(segment);
      } else {
        const startPoint = new SegmentPoint('raw', mousePoint);
        const endPoint = new SegmentPoint('raw', mousePoint);
        this.startPointId = startPoint.id;
        this.endPointId = endPoint.id;

        const segment = new Segment('line', this.startPointId, this.endPointId);
        const path = new Path([segment]);
        path.addPoint(startPoint);
        path.addPoint(endPoint);
        this.ShapesManager.setCurrentShape(path.id);

        const shapesColor = this.ShapesManager.shapesColor;
        path.setFill(shapesColor);
        this.ShapesManager.addShape(path);

        this.creatingShape = true;
      }
    }
  }

  mouseMove(ev: MouseEvent): void {
    const mouseMode = this.ShapesManager.mouseMode;

    if (mouseMode == 'default') {
      if (!this.draggedElement) return;
      if (!this.canvasBound) return;

      const absCoord = [ev.clientX, ev.clientY];
      const canvasCoord = [this.canvasBound.left, this.canvasBound.top];
      const [mouseX, mouseY] = [
        absCoord[0] - canvasCoord[0],
        absCoord[1] - canvasCoord[1],
      ];

      const scaledMouse = this.scaledMouse(mouseX, mouseY);

      if (!this.dragStartPoint) return;
      const shape = this.shapes.find(s => s.id == this.draggedElement);
      if (!shape) return;

      shape.moveShape(
        scaledMouse[0] - this.dragStartPoint[0],
        scaledMouse[1] - this.dragStartPoint[1]
      );

      this.dragStartPoint = [...scaledMouse];
      return;
    }

    if (!this.creatingShape) return;

    const mousePoint = this.scaledMouse(ev.offsetX, ev.offsetY);
    const shape = this.shapes.find(s => s.id == this.rawShapeId);
    if (!shape) return;

    if (shape instanceof Path) {
      //shape.showPoints([]);
      shape.updatePointCoord(this.endPointId, mousePoint);

      if (this.mouseIsDown) {
        const lastSegment = shape.segments[shape.segments.length - 1];
        const prevSegment = shape.segments[shape.segments.length - 2];
        if (!prevSegment) return;

        if (prevSegment.type == 'doubleCurve') {
          const controlPoint = this.points.find((p) => p.id == this.controlPointId);
          if (!controlPoint) return;
          const lastStartPoint = this.points.find((p) => p.id == this.startPointId);
          if (!lastStartPoint) return;

          const [deltaX, deltaY] = [
            mousePoint[0] - lastStartPoint.coord[0],
            mousePoint[1] - lastStartPoint.coord[1],
          ];
          const newControlPoint: Duple<number> = [
            lastStartPoint.coord[0] - deltaX,
            lastStartPoint.coord[1] - deltaY,
          ];

          controlPoint.updateCoord(newControlPoint);

          return;
        }

        if (prevSegment.type == 'curve') {
          const newControlPoint = shape.segmentToDoubleCurve(prevSegment.id, 'end');
          this.controlPointId = newControlPoint || '';
        }

        shape.updatePointCoord(this.endPointId, mousePoint);
      }

      return;
    }

    if (shape instanceof Rect || shape instanceof Circle) {
      shape.updateSize(mousePoint[0], mousePoint[1]);
    }
  }

  mouseUp(ev: MouseEvent): void {
    this.mouseIsDown = false;
    const mouseMode = this.ShapesManager.mouseMode;
    if (mouseMode == 'default') {
      this.draggedElement = '';
      this.dragStartPoint = null;
      return;
    }

    const mp: Duple<number> = this.scaledMouse(ev.offsetX, ev.offsetY); // Mouse point.
    const diff = mp[0] != this.startCoord[0] || mp[1] != this.startCoord[1];
    if (!diff) {
      if (mouseMode != 'path') {
        this.ShapesManager.removeShape(this.rawShapeId);
        this.ShapesManager.setCurrentShape('');
        this.creatingShape = false;
        this.startPointId = '';
        this.endPointId = ''

        return;
      }

      const shape = this.shapes.find(s => s.id == this.rawShapeId);
      if (!shape || !(shape instanceof Path)) return;
      shape.showPoints([shape.segments[0].start]);

      return;
    }

    if (diff) {
      const shape = this.shapes.find((s) => s.id == this.rawShapeId);
      if (!shape) return;

      if (mouseMode == 'path') {
        if (!(shape instanceof Path)) return;
        shape.showPoints([shape.segments[0].start]);

        const segment = shape.segments[shape.segments.length - 1];
        segment.type = 'curve';

        const controlPoint = new SegmentPoint('control', mp);
        shape.addPoint(controlPoint);
        segment.addControlPoint(controlPoint.id);
      } else {
        //shape.deselectAllPoints();
        const startPoint = shape.getPoint(this.startPointId);
        if (startPoint) {
          startPoint.type = 'union';
          startPoint.show = false;
        }

        this.ShapesManager.setCurrentShape('');
        this.startCoord = [0, 0];
        this.startPointId = '';
        this.endPointId = '';
        this.creatingShape = false;
      }
    }
  }

  scaledMouse(mouseX: number, mouseY: number): Duple<number> {
    const leftFraction: number = mouseX / this.canvasWidth;
    const topFraction: number = mouseY / this.canvasHeight;
    const scaledX = this.viewBoxX + this.viewBoxWidth * leftFraction;
    const scaledY = this.viewBoxY + this.viewBoxHeight * topFraction;

    return [scaledX, scaledY];
  }

  filterCircles(): Circle[] {
    const circles: Circle[] = [];
    this.shapes.forEach(s => {
      if (s instanceof Circle) circles.push(s);
    });

    return circles;
  }

  filterRects(): Rect[] {
    const ss: Rect[] = [];
    this.shapes.forEach(s => {
      if (s instanceof Rect) ss.push(s);
    });

    return ss;
  }

  filterPaths(): Path[] {
    const ss: Path[] = [];
    this.shapes.forEach(s => {
      if (s instanceof Path) ss.push(s);
    });

    return ss;
  }

  filterByPointType(type: PointType, exclude: boolean = false): SegmentPoint[] {
    if (!exclude) {
      return this.points.filter((p) => p.type == type);
    }
    return this.points.filter((p) => p.type != type);
  }

  getScaledPoint(point: Duple<number>): Duple<number> {
    const widthFraction = this.canvasWidth / this.viewBoxWidth;
    const heightFraction = this.canvasHeight / this.viewBoxHeight;
    const scaledX = (point[0] - this.viewBoxX) * widthFraction;
    const scaledY = (point[1] - this.viewBoxY) * heightFraction;

    return [scaledX, scaledY];
  }

  setMouseMode(mode: MouseMode, segment?: SegmentType): void {
    this.ShapesManager.setMouseMode(mode, segment);
    this.activeBtn = mode;
  }

  selectShape(shape: Figure): void {
    console.log(shape.points.map(p => p.id));
    shape.toggleSelect();
    this.ShapesManager.updateShapesList(this.shapes);
  }
}
