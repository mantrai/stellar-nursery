import IOrbitItem from '../interfaces/i-orbit-item';

export default class Orbit<T extends IOrbitItem> {
    public name: string = '';
    private _orbitStats: T | undefined;

    public get orbitStats(): T {
        if (this._orbitStats === undefined) {
            throw Error('stats undefined');
        }

        return this._orbitStats;
    }

    public set orbitStats(stats: T) {
        this._orbitStats = stats;
    }

    public constructor(stats: T) {
        this.orbitStats = stats;
    }

    public get category(): number {
        return this.orbitStats.orbitCategory;
    }
}
