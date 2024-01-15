import GetRandomString from "../functions/GetRandomString.func";
import Shape from "./Shape.class";

class ShapeGroup {
  id: string;
  shapes: Shape[] = [];

  constructor() {
    this.id = GetRandomString();
  }
}

export default ShapeGroup;
