import PlanetaryStats from './planetary-stats';

export default class BasePlanetary {
    public name: string = '';
    public type: number = 5;
    private _planetaryStats: PlanetaryStats = new PlanetaryStats();

    public get planetaryStats(): PlanetaryStats {
        return this._planetaryStats;
    }

    public set planetaryStats(stats: PlanetaryStats) {
        this._planetaryStats = stats;
    }
}
