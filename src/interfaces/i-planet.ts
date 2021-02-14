import PlanetStats from '../objects/planet-stats';
import IOrbitItem from './i-orbit-item';

export default interface IPlanet extends IOrbitItem {
    type: number;
    planetaryStats: PlanetStats;
}
