import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import SegmentPoint from 'src/app/helpers/classes/SegmentPoint.class';
import Duple from 'src/app/helpers/types/Duple.type';
import { ShapesManagerService } from 'src/app/services/shapes-manager.service';
import DragPointObj from 'src/app/helpers/types/DragPointObj.type';

@Component({
  selector: 'app-point',
  templateUrl: './point.component.html',
  styleUrls: ['./point.component.scss']
})
export class PointComponent {
  @Input() point!: SegmentPoint;
  @Input() x: number = 0;
  @Input() y: number = 0;
  @Output() emitPointId = new EventEmitter<string>();
  @Output() draggingPoint = new EventEmitter<DragPointObj>();
  @ViewChild('pointRef') pointRef!: ElementRef;

  startCoord: Duple<number> | null = null;

  constructor(
    private ShapesManager: ShapesManagerService,
  ) {}

  handleClick(ev: MouseEvent): void {
    ev.stopPropagation();
    const mouseMode = this.ShapesManager.mouseMode;
    if (mouseMode == 'default') {
      this.point.selected = !this.point.selected;

      return;
    }

    this.emitPointId.emit(this.point.id);
  }

  handleMouseDown(ev: MouseEvent): void {
    const mouseMode = this.ShapesManager.mouseMode;
    if (mouseMode != 'default') return;

    this.startCoord = [ev.clientX, ev.clientY];
  }

  handleMouseUp(ev: MouseEvent): void {
    ev.stopPropagation();
    ev.preventDefault();

    const mouseMode = this.ShapesManager.mouseMode;
    if (mouseMode != 'default') return;

    this.startCoord = [0, 0];
  }

  handleDrag(ev: DragEvent): void {
    ev.stopPropagation();
    ev.preventDefault();

    const mouseMode = this.ShapesManager.mouseMode;
    if (mouseMode != 'default') return;

    if (!this.startCoord) return;
    const obj: DragPointObj = {
      id: this.point.id,
      start: [...this.startCoord],
      end: [ev.clientX, ev.clientY],
    }

    this.draggingPoint.emit(obj);
    this.startCoord = [...obj.end];
  }
}
