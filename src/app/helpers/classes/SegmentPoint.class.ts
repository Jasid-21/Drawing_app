import GetRandomString from "../functions/GetRandomString.func";
import Duple from "../types/Duple.type";
import PointType from "../types/PointType.type";

class SegmentPoint {
  id: string;
  type: PointType;
  coord: [number, number];
  selected: boolean = false;
  show: boolean = false;

  constructor(type: PointType, coord: Duple<number>) {
    this.type = type;
    this.coord = coord;
    this.id = GetRandomString();
  }

  updateCoord(coord: Duple<number>): void {
    this.coord = coord;
  }
}

export default SegmentPoint;
