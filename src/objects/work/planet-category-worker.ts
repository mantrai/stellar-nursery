import Orbit from '../orbit';
import Star from '../star';
import IPlanet from '../../interfaces/i-planet';

export default class PlanetCategoryWorker {
    roll: number;
    star: Star;
    age: number;
    zone: number;
    parent?: Orbit<IPlanet>;

    constructor(roll: number, star: Star, age: number, zone: number, parent?: Orbit<IPlanet>) {
        this.roll = roll;
        this.star = star;
        this.age = age;
        this.zone = zone;
        this.parent = parent;
    }
}
