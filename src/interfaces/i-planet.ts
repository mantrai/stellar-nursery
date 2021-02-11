import PlanetaryStats from "../objects/planetary/planetary-stats";

export default interface IPlanet {
    name: string;
    type: number;
    planetaryStats: PlanetaryStats;
}
