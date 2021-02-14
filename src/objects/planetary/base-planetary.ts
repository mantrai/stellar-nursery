import PlanetaryStats from './planetary-stats';
import Orbit from '../orbit';

export default class BasePlanetary {
    public name: string = '';
    public type: number = 5;
    public orbits: Orbit<any>[] = [];
    private _planetaryStats: PlanetaryStats = new PlanetaryStats();

    public get planetaryStats(): PlanetaryStats {
        return this._planetaryStats;
    }

    public set planetaryStats(stats: PlanetaryStats) {
        this._planetaryStats = stats;
    }
}
