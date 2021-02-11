import Orbit from "../orbit";
import Star from "../star";
import IPlanet from "../../interfaces/i-planet";

export default class PlanetTypeWorker {
    planet: Orbit<IPlanet>;
    star: Star;
    zone: number
    age: number;
    parent?: Orbit<any>

    constructor(planet:Orbit<IPlanet>, star: Star, zone:number, age:number, parent?: Orbit<any>) {
        this.planet = planet;
        this.star = star;
        this.age = age;
        this.parent = parent;
        this.zone = zone;
    }
}
