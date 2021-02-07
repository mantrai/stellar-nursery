import IPlanetGenMapper from '../interfaces/i-planet-gen-mapper';
import IPlanetGen from '../interfaces/i-planet-gen';
import IPlanetaryGen from '../interfaces/i-planetary-gen';

export default class PlanetMapper implements IPlanetGenMapper {
    private _planetaryMaps: Map<number, IPlanetaryGen> = new Map<number, IPlanetaryGen>();
    private _planetMaps: Map<number, IPlanetGen> = new Map<number, IPlanetGen>();

    addPlanetaryGen(key: number, planetaryGen: IPlanetaryGen): IPlanetGenMapper {
        this._planetaryMaps.set(key, planetaryGen);
        return this;
    }

    getPlanetaryGen(key: number): IPlanetaryGen {
        if (!this._planetaryMaps.has(key)) {
            throw Error('No Matching planetary generator');
        }
        return this._planetaryMaps.get(key) as IPlanetaryGen;
    }

    hasPlanetaryGen(key: number): boolean {
        return this._planetaryMaps.has(key);
    }

    addPlanetGen(key: number, planetGen: IPlanetGen): IPlanetGenMapper {
        this._planetMaps.set(key, planetGen);
        return this;
    }

    getPlanetGen(key: number): IPlanetGen {
        if (!this._planetMaps.has(key)) {
            throw Error('No Matching planet generator');
        }
        return this._planetMaps.get(key) as IPlanetGen;
    }

    hasPlanetGen(key: number): boolean {
        return this._planetMaps.has(key);
    }
}
