import GetRandomString from "../functions/GetRandomString.func";
import SegmentType from "../types/SegmentType.type";

class Segment {
  id: string;
  type: SegmentType;
  start: string;
  end: string;
  controlPoints: string[] = [];
  selected: boolean = false;

  constructor(type: SegmentType, start: string, end: string) {
    this.id = GetRandomString();
    this.type = type;
    this.start = start;
    this.end = end;
  }

  addControlPoint(point: string): void {
    if (this.controlPoints.length >= 2) return;
    this.controlPoints.push(point);
  }
}

export default Segment;
