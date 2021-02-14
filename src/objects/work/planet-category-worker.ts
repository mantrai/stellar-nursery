import Orbit from '../orbit';
import Star from '../star';

export default class PlanetCategoryWorker {
    roll: number;
    star: Star;
    age: number;
    zone: number;
    parent?: Orbit<any>;

    constructor(roll: number, star: Star, age: number, zone: number, parent?: Orbit<any>) {
        this.roll = roll;
        this.star = star;
        this.age = age;
        this.zone = zone;
        this.parent = parent;
    }
}
