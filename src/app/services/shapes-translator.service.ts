import { Injectable, OnInit } from '@angular/core';
import { ShapesManagerService } from './shapes-manager.service';
import Shape from '../helpers/classes/Shape.class';
import SegmentPoint from '../helpers/classes/SegmentPoint.class';
import Segment from '../helpers/classes/Segment.class';
import { SegmentEquivalences } from '../helpers/HelperObjects';

@Injectable({
  providedIn: 'root'
})
export class ShapesTranslatorService {
  constructor(
    private ShapesManager: ShapesManagerService,
  ) { }

  segmentToPath(segment: Segment): string {
    const points = this.ShapesManager.getPoints();
    const startPoint = points.find((p) => p.id == segment.start);
    const endPoint = points.find((p) => p.id == segment.end);

    if (!startPoint || !endPoint) return '';
    const type = segment.type;
    const controlPoints = segment.controlPoints.map((pId) => {
      const point = points.find((p) => p.id == pId);
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

  shapeToPath(shape: Shape | string): string {
    if (typeof shape == 'string') {
      const tryShape = this.ShapesManager.getShapes(shape);
      if (!tryShape.length) return '';

      shape = tryShape[0];
    }

    const segments = shape.segments;
    const segmentPaths = segments.map((s) => this.segmentToPath(s));
    const path = segmentPaths[0] + ' ' + segmentPaths.slice(1).map((p) => {
      const ps = p.split(' ').slice(2)
      return ps.join(' ');
    }).join(' ');

    return path;
  }
}
