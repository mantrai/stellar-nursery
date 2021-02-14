import Star from '../star';
import Orbit from '../orbit';
import IPlanet from '../../interfaces/i-planet';

export default class MoonOrbitWorker {
    star: Star;
    age: number;
    zone: number;
    parent: Orbit<IPlanet>;

    constructor(star: Star, age: number, zone: number, parent: Orbit<IPlanet>) {
        this.star = star;
        this.age = age;
        this.zone = zone;
        this.parent = parent;
    }
}
