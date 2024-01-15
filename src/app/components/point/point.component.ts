import { Component, EventEmitter, Input, Output } from '@angular/core';
import SegmentPoint from 'src/app/helpers/classes/SegmentPoint.class';
import { ShapesManagerService } from 'src/app/services/shapes-manager.service';

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
}
