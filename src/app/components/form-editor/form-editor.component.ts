import { Component, OnInit } from '@angular/core';
import Shape from 'src/app/helpers/classes/Shape.class';
import { ShapesManagerService } from 'src/app/services/shapes-manager.service';

@Component({
  selector: 'app-form-editor',
  templateUrl: './form-editor.component.html',
  styleUrls: ['./form-editor.component.scss']
})
export class FormEditorComponent implements OnInit {
  selectedShapes: Shape[] = [];

  rotate?: number;
  scaleX?: number;
  scaleY?: number;
  transX?: number;
  transY?: number;

  constructor(
    private ShapesManager: ShapesManagerService,
  ) {}

  ngOnInit(): void {
    this.ShapesManager.$shapes.subscribe((v) => {
      this.selectedShapes = v.filter((s) => s.selected);
      if (!this.selectedShapes.length) return;

      const first = this.selectedShapes[0];

      const eqRotate = this.selectedShapes.every((s) => s.rotate == first.rotate);
      const eqScaleX = this.selectedShapes.every((s) => s.scale[0] == first.scale[0]);
      const eqScaleY = this.selectedShapes.every((s) => s.scale[1] == first.scale[1]);
      const eqTransX = this.selectedShapes.every((s) => s.translate[0] == first.translate[0]);
      const eqTransY = this.selectedShapes.every((s) => s.translate[1] == first.translate[1]);

      this.rotate = eqRotate ? first.rotate : undefined;
      this.scaleX = eqScaleX ? first.scale[0] : undefined;
      this.scaleY = eqScaleY ? first.scale[1] : undefined;
      this.transX = eqTransX ? first.translate[0] : undefined;
      this.transY = eqTransY ? first.translate[1] : undefined;

      console.log(this.scaleY);
    });
  }

  handleTransforms(ev: SubmitEvent): void {
    if (!this.validateTransforms([
      this.rotate,
      this.scaleX,
      this.scaleY,
      this.transX,
      this.transY
    ])) return;

    this.selectedShapes.forEach((s) => {
      s.setTransforms(
        this.rotate || 0,
        [
          this.scaleX || 1,
          this.scaleY || 1
        ],
        [
          this.transX || 0,
          this.transY || 0
        ],
      );
    });
  }

  validateTransforms(values: any[]): boolean {
    console.log(values);
    try {
      const isNumber = values.every((v) => !isNaN(v));
      return isNumber;
    } catch (err) {
      return false;
    }
  }
}
