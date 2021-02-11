import PlanetaryStats from "../objects/planetary/planetary-stats";
import Orbit from "../objects/orbit";

export default interface IPlanet {
    name: string;
    type: number;
    planetaryStats: PlanetaryStats;
    orbits: Orbit<any>[];
}
