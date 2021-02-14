import IPlanet from '../interfaces/i-planet';
import Orbit from './orbit';
import PlanetStats from './planet-stats';
import { OrbitCategory } from '../types/enum';

export default class Planet implements IPlanet {
    public orbitCategory: number = OrbitCategory.None;
    public name: string = '';
    public type: number = 5;
    public orbits: Orbit<IPlanet>[] = [];
    private _planetaryStats: PlanetStats;

    constructor(orbitCategory: number) {
        this.orbitCategory = orbitCategory;
        this._planetaryStats = new PlanetStats();
        this.name = '';
    }

    public get planetaryStats(): PlanetStats {
        return this._planetaryStats;
    }

    public set planetaryStats(stats: PlanetStats) {
        this._planetaryStats = stats;
    }
}
