import Orbit from '../orbit';
import Star from '../star';
import IPlanet from '../../interfaces/i-planet';

export default class PlanetTypeWorker {
    planet: Orbit<IPlanet>;
    star: Star;
    zone: number;
    age: number;
    parent?: Orbit<IPlanet>;
    type: number;

    constructor(type: number, planet: Orbit<IPlanet>, star: Star, zone: number, age: number, parent?: Orbit<IPlanet>) {
        this.planet = planet;
        this.star = star;
        this.age = age;
        this.parent = parent;
        this.zone = zone;
        this.type = type;
    }
}
