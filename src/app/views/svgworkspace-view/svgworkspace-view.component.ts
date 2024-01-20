import { Component, OnInit, NgModule, ViewChild, ElementRef } from '@angular/core';
import Segment from 'src/app/helpers/classes/Segment.class';
import SegmentPoint from 'src/app/helpers/classes/SegmentPoint.class';
import Shape from 'src/app/helpers/classes/Shape.class';
import Duple from 'src/app/helpers/types/Duple.type';
import MouseMode from 'src/app/helpers/types/MouseMode.type';
import PointType from 'src/app/helpers/types/PointType.type';
import SegmentType from 'src/app/helpers/types/SegmentType.type';
import ShapeType from 'src/app/helpers/types/ShapeType.type';
import { ShapesManagerService } from 'src/app/services/shapes-manager.service';
import { ShapesTranslatorService } from 'src/app/services/shapes-translator.service';
import { faArrowPointer, faPenNib } from '@fortawesome/free-solid-svg-icons';
import { faCircle, faSquare } from '@fortawesome/free-regular-svg-icons';
import DragPointObj from 'src/app/helpers/types/DragPointObj.type';

@Component({
  selector: 'app-svgworkspace-view',
  templateUrl: './svgworkspace-view.component.html',
  styleUrls: ['./svgworkspace-view.component.scss'],
})
export class SVGWorkspaceViewComponent implements OnInit {
  @ViewChild('canvas', { static: true }) canvas!: ElementRef;
  canvasBound: DOMRect | null = null;

  faCircle = faCircle;
  faRect = faSquare;
  faPath = faPenNib;
  faDefault = faArrowPointer;
  activeBtn: MouseMode = this.ShapesManager.mouseMode;

  shapes: Shape[] = [];
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
  constrolPointId: string = '';
  rawShapeId: string = '';
  mouseIsDown: boolean = false;
  creatingShape: boolean = false;

  constructor(
    private ShapesManager: ShapesManagerService,
    private ShapesTranslator: ShapesTranslatorService,
  ) {}

  ngOnInit(): void {
    this.ShapesManager.$shapes.subscribe((v) => {
      this.shapes = v;
    });

    this.ShapesManager.$points.subscribe((v) => {
      this.points = v;
    });

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

    const segments = shape.segments;
    if (!segments.length) return;

    if (segments[0].start != pointId) return;
    this.creatingShape = false;
    this.mouseIsDown = false;
    this.rawShapeId = '';
    this.endPointId = '';
    const lastSegment = segments[segments.length - 1];
    lastSegment.end = pointId;

    segments.forEach((s) => {
      const startCoord = this.points.find((p) =>  p.id == s.start);

      if (startCoord) {
        startCoord.type = 'union';
        startCoord.show = false;
      }
    });
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

    this.ShapesManager.movePoint(id, deltaX, deltaY);
  }

  handledragOver(ev: DragEvent): void {
    ev.preventDefault();
  }

  mouseDown(ev: MouseEvent): void {
    this.ShapesManager.deselectAll();
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

    //const pointType: PointType = mouseMode == 'path' ? 'union' : 'raw';
    const tryPoint = this.points.find((p) => p.id == this.endPointId)
    const startPoint = tryPoint || new SegmentPoint('raw', mousePoint);
    startPoint.show = true;
    if (!tryPoint) {
      this.ShapesManager.addPoint(startPoint);
    }
    const endPoint = new SegmentPoint('raw', mousePoint);
    this.ShapesManager.addPoint(endPoint);

    const segment = new Segment('line', startPoint.id, endPoint.id);
    const tryShape = this.shapes.find((s) => s.id == this.rawShapeId);
    const shape = tryShape || new Shape(mouseMode, [], false, startPoint.id);
    shape.segments.push(segment);
    if (!tryShape) {
      const shapesColor = this.ShapesManager.shapesColor;
      shape.setFill(shapesColor);
      this.ShapesManager.addShape(shape);
    }

    this.rawShapeId = shape.id;
    this.startPointId = startPoint.id;
    this.endPointId = endPoint.id;

    this.creatingShape = true;
    this.mouseIsDown = true;
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
      this.ShapesManager.moveShape(
        this.draggedElement,
        scaledMouse[0] - this.dragStartPoint[0],
        scaledMouse[1] - this.dragStartPoint[1]
      );

      this.dragStartPoint = [...scaledMouse];
    }

    if (!this.creatingShape) return;

    const mousePoint = this.scaledMouse(ev.offsetX, ev.offsetY);
    if (mouseMode == 'path') {
      const point = this.points.find((p) => p.id == this.endPointId);
      if (!point) return;
      point.updateCoord(mousePoint);

      if (this.mouseIsDown) {
        const shape = this.shapes.find((s) => s.id == this.rawShapeId);
        if (!shape) return;

        const prevSegment = shape.segments[shape.segments.length - 2];
        if (!prevSegment) return;
        if (prevSegment.type == 'doubleCurve') {
          console.log("double");
          const controlPoint = this.points.find((p) => p.id == this.constrolPointId);
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
          const newControlPoint = new SegmentPoint('control', point.coord);
          this.ShapesManager.addPoint(newControlPoint);
          prevSegment.addControlPoint(newControlPoint.id);
          prevSegment.type = 'doubleCurve';
          this.constrolPointId = newControlPoint.id;
        } else {
          const point = this.points.find((p) => p.id == this.endPointId);
          point?.updateCoord(mousePoint);
        }
      }

      return;
    }

    const radiusX = mousePoint[0] - this.startCoord[0];
    const radiusY = mousePoint[1] - this.startCoord[1];

    if (mouseMode == 'rect') {
      if (mousePoint[0] < this.startCoord[0] || mousePoint[1] < this.startCoord[1]) {
        this.ShapesManager.updateShapeSize(
          this.rawShapeId,
          radiusX,
          radiusY,
          mousePoint,
          this.startCoord,
          );
        return;
      }
    }
    this.ShapesManager.updateShapeSize(this.rawShapeId, radiusX, radiusY);
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
        this.ShapesManager.removePoint(this.endPointId);
        this.ShapesManager.removePoint(this.startPointId);
        this.creatingShape = false;
      }

      const shape = this.shapes.find(s => s.id == this.rawShapeId);
      if (!shape) return;

      const startPoint = this.points.find((p) => p.id == shape.segments[0].start);
      if (!startPoint) return;

      startPoint.type = 'union';

      return;
    }

    if (diff) {
      if (mouseMode == 'path') {
        const shape = this.shapes.find((s) => s.id == this.rawShapeId);
        if (!shape) return;

        const startPoint = this.points.find((p) => p.id == shape.segments[0].start);
        if (!startPoint) return;
        startPoint.type = 'union';

        const segment = shape.segments[shape.segments.length - 1];
        segment.type = 'curve';

        const endPoint = this.points.find((p) => p.id == this.endPointId);
        if (!endPoint) return;

        endPoint.type = 'control';
        segment.addControlPoint(endPoint.id);

        const newEndPoint = new SegmentPoint('raw', endPoint.coord);
        this.ShapesManager.addPoint(newEndPoint);
        segment.end = newEndPoint.id;
        this.endPointId = newEndPoint.id;
      } else {
        this.ShapesManager.removePoint(this.endPointId);
        const startPoint = this.points.find((p) => p.id == this.startPointId);
        if (startPoint) {
          startPoint.type = 'union';
          startPoint.show = false;
        }

        this.startCoord = [0, 0];
        this.startPointId = '';
        this.endPointId = '';
        this.rawShapeId = '';
        this.creatingShape = false;
      }
    }
  }

  getPoint(id: string): Duple<number | null> {
    const point = this.points.find((p) => p.id == id);
    if (!point) return [null, null];

    return point.coord;
  }

  getCenter(shapeId: string): string | undefined {
    const shape = this.shapes.find((s) => s.id == shapeId);
    if (!shape) return;

    var center: Duple<number> | undefined = undefined;
    if (shape.type == 'path') {
      var minX: number = Infinity,
      maxX: number = -Infinity,
      minY: number = Infinity,
      maxY: number = -Infinity;
      shape.segments.forEach((s) => {
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
    }

    if (shape.type == 'circle') {
      const point = this.points.find((p) => p.id == shape.start);
      if (!point) return;

      center = point.coord;
    }

    if (shape.type == 'rect') {
      const start = this.points.find((p) => p.id == shape.start);
      if (!start) return;

      center = [
        start.coord[0] + shape.radiusX / 2,
        start.coord[1] + shape.radiusY / 2
      ];
    }

    return center?.map((n) => n + 'px').join(' ');
  }

  scaledMouse(mouseX: number, mouseY: number): Duple<number> {
    const leftFraction: number = mouseX / this.canvasWidth;
    const topFraction: number = mouseY / this.canvasHeight;
    const scaledX = this.viewBoxX + this.viewBoxWidth * leftFraction;
    const scaledY = this.viewBoxY + this.viewBoxHeight * topFraction;

    return [scaledX, scaledY];
  }

  filterByShapeType(type: ShapeType): Shape[] {
    return this.shapes.filter((s) => s.type == type);
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

  getPath(shapeId: string): string {
    const shape = this.shapes.find((s) => s.id == shapeId);
    if (!shape) return '';
    return this.ShapesTranslator.shapeToPath(shape)
      + (!this.creatingShape ? ' Z' : '');
  }

  selectShape(shapeId: string): void {
    const mouseMode = this.ShapesManager.mouseMode;
    if (mouseMode != 'default') return;

    this.ShapesManager.toggleShapeSelection(shapeId);
  }
}
