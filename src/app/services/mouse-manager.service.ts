import { Injectable } from '@angular/core';
import MouseMode from '../helpers/types/MouseMode.type';
import { ShapesManagerService } from './shapes-manager.service';
import Shape from '../helpers/classes/Shape.class';
import SegmentPoint from '../helpers/classes/SegmentPoint.class';
import SegmentType from '../helpers/types/SegmentType.type';

@Injectable({
  providedIn: 'root'
})
export class MouseManagerService {

  mouseIsDown: boolean = false;

  constructor(
    private ShapesManager: ShapesManagerService,
  ) { }
}
