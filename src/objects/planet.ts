import IPlanet from '../interfaces/i-planet';
import Orbit from './orbit';
import PlanetStats from './planet-stats';
import {OrbitCategory, PlanetType} from '../types/enum';

export default class Planet implements IPlanet {
    public orbitCategory: number = OrbitCategory.None;
    public type: number = 5;
    public orbits: Orbit<IPlanet>[] = [];
    private _planetaryStats: PlanetStats;

    constructor(orbitCategory: number) {
        this.orbitCategory = orbitCategory;
        this._planetaryStats = new PlanetStats();
    }

    public get planetaryStats(): PlanetStats {
        return this._planetaryStats;
    }

    public set planetaryStats(stats: PlanetStats) {
        this._planetaryStats = stats;
    }

    public toJSON(): object {
        let json =  {
            orbitCategory: OrbitCategory[this.orbitCategory],
            type: PlanetType[this.type],
            orbits: this.orbits,
        };

        if (this._planetaryStats !== undefined) {
            json = { ...json, ...this._planetaryStats.toJSON()};
        }

        return json;
    }
}
