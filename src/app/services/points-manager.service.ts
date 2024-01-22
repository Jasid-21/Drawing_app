import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import SegmentPoint from '../helpers/classes/SegmentPoint.class';

@Injectable({
  providedIn: 'root'
})
export class PointsManagerService {
  $points = new BehaviorSubject<SegmentPoint[]>([]);

  constructor() {

  }

  getPoints(pointsIds: string[]): SegmentPoint[] {
    const points = this.$points.getValue();
    if (!pointsIds.length) return points;

    const finalPoints: SegmentPoint[] = [];
    pointsIds.forEach((id) => {
      const point = points.find(p => p.id == id);
      if (point) finalPoints.push(point);
    });

    return finalPoints;
  }

  addPoint(point: SegmentPoint): void {
    if (!point) return;

    const points = this.$points.getValue();
    this.$points.next([...points, point]);
  }

  movePoint(id: string): void {
    const points = this.$points.getValue();
    const point = points.find(p => p.id == id);
    if (!point) return;

    point.coord = [
      point.coord[0] + 50,
      point.coord[1],
    ];

    this.$points.next(points);
  }
}
