import IOrbitItem from '../interfaces/i-orbit-item';

export default class Orbit<T extends IOrbitItem> {
    public name: string = '';

    public constructor(stats: T) {
        this.orbitStats = stats;
    }

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

    public get category(): number {
        return this.orbitStats.orbitCategory;
    }

    // noinspection JSUnusedGlobalSymbols
    public toJSON() {
        let json = {
            name: this.name,
        };
        if (this._orbitStats !== undefined) {
            json = { ...json, ...this._orbitStats.toJSON() };
        }

        return json;
    }
}
