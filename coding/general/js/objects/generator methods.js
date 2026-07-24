// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes#generator_methods
class Polygon {
  constructor(...sides) {
    this.sides = sides;
  }

  // Method
  *getSides() {
    for(const side of this.sides){
      yield side;
    }
  }
}

const pentagon = new Polygon(1,2,3,4,5);

console.log([...pentagon.getSides()]); // [1,2,3,4,5]
