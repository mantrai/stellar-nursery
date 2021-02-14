import Star from '../star';
import Orbit from '../orbit';

export default class MoonOrbitWorker {
    star: Star;
    age: number;
    zone: number;
    parent: Orbit<any>;

    constructor(star: Star, age: number, zone: number, parent: Orbit<any>) {
        this.star = star;
        this.age = age;
        this.zone = zone;
        this.parent = parent;
    }
}
