class Point3D {
    constructor (x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    };

    static name = "Point3D";
    static distance (a, b) {
        const dx = Math.abs(a.x - b.x);
        const dy = Math.abs(a.y - b.y);
        const dz = Math.abs(a.z - b.z);
        return Math.sqrt(dx^2 + dy^2 + dz^2);
    };

    toString() {
        return "(" + this.x + ", " + this.y + ", " + this.z + ")";
    }
}

let p1 = new Point3D(0, 0, 0);
let p2 = new Point3D(1, 1, 1);

console.log("p1.name:", p1.name);
console.log("Point3D.name:", Point3D.name);
console.log("distance between " + p1.toString() + " - " + p2.toString() + ": " + Point3D.distance(p1, p2));
