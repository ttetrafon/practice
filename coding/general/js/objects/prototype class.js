////////////////////////////////
///   DEFINITION & METHODS   ///
////////////////////////////////
function Vector (x, y) {
    this.x = x;
    this.y = y;
}

// Using prototype outside of the class's definition means that older instances will also get the new methods.
Vector.prototype.toString = function() {
    return '(x: ' + this.x + ', y: ' + this.y + ')';
}

let v1 = new Vector(1, 5);
console.log(v1.toString());

Vector.prototype.add = function(vector) {
    this.x += vector.x;
    this.y += vector.y;
}
let v2 = new Vector(2, -2);
console.log(v1.toString() + ' + ' + v2.toString() + ' =');
v1.add(v2);
console.log(v1.toString());


///////////////////////
///   INHERITANCE   ///
///////////////////////
function Point (x, y, colour) {
    Vector.apply(this, arguments);
    this.colour = colour;
}

Point.prototype = new Vector;
Point.prototype.constructor = Point;

p = new Point(1, 2, 'red');
console.log("p:", p.x, p.y, p.colour);