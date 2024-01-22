import GetRandomString from "../functions/GetRandomString.func";
import Duple from "../types/Duple.type";
import PointType from "../types/PointType.type";

class SegmentPoint {
  id: string;
  type: PointType;
  coord: [number, number];
  selected: boolean = false;
  show: boolean = false;

  constructor(type: PointType, coord: Duple<number>, move = false) {
    this.type = type;
    this.coord = coord;
    this.id = GetRandomString();

    if (move) {
      this.show = true;
      setInterval(() => {
        coord[0] = coord[0] + 10;
      }, 1000);
    }
  }

  updateCoord(coord: Duple<number>): void {
    this.coord = coord;
  }

  moveByDelta(deltaX: number, deltaY: number): void {
    this.coord[0] = this.coord[0] + deltaX;
    this.coord[1] = this.coord[1] + deltaY;
  }
}

export default SegmentPoint;
