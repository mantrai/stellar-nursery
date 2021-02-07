import IOrbitGen from '../interfaces/i-orbit-gen';
import RandomSeedFactory from 'stellar-nursery-shared/lib/random-seed-factory';
import IPlanetaryGen from '../interfaces/i-planetary-gen';
import Star from '../objects/star';
import Orbit from '../objects/orbit';
import { Score, Separation, Zone } from 'stellar-nursery-shared';
import IPlanetGenMapper from '../interfaces/i-planet-gen-mapper';

export default class OrbitGenerator implements IOrbitGen {
    private _options: Map<number, number> = new Map<number, number>();
    private _random: RandomSeedFactory | undefined;
    private _mapper: IPlanetGenMapper | undefined;

    public get random(): RandomSeedFactory {
        if (this._random === undefined) {
            throw Error('Random seed factory undefined');
        }

        return this._random;
    }

    public set random(rand: RandomSeedFactory) {
        this._random = rand;
    }

    public get mapper(): IPlanetGenMapper {
        if (this._mapper === undefined) {
            throw Error('Planetary mapper not set');
        }

        return this._mapper;
    }

    public set mapper(map: IPlanetGenMapper) {
        this._mapper = map;
    }

    addOption(maxRoll: number, key: number): IOrbitGen {
        this._options.set(maxRoll, key);
        return this;
    }

    generate(star: Star, age: number): Orbit<any>[] {
        let planetaryGenKey = -1;
        const planetCount: Map<number, number> = new Map<number, number>();
        planetCount.set(Zone.Epistellar, this.getEpistellarZoneQty(star));
        planetCount.set(Zone.InnerZone, this.getInnerZoneQty(star));
        planetCount.set(Zone.OuterZone, this.getOuterZoneQty(star));

        if (this._options.size > 0) {
            const keys: number[] = Array.from(this._options.keys()).sort();
            const max: number = keys.reduce((a: number, b: number) => (a > b ? a : b));

            planetaryGenKey = this.getOrbit(star, keys, max);
        }
        const orbits: Orbit<any>[] = [];

        if (planetaryGenKey !== -1 && this.mapper.hasPlanetaryGen(planetaryGenKey)) {
            const gen: IPlanetaryGen = this.mapper.getPlanetaryGen(planetaryGenKey);
            planetCount.forEach((qty: number, zone: number) => {
                for (let i = 0; i < qty; i++) {
                    const output: Orbit<any> | false = gen.generate(star, zone);
                    if (output) {
                        orbits.push(output);
                    }
                }
            });
        }
        return orbits;
    }

    getOrbit(star: Star, optionMaxRolls: number[], max: number): number {
        let mod = 0;
        if (star.spectralClass !== 'L') {
            mod -= 1;
        }

        const roll = this.random.between(1, max) + mod;
        optionMaxRolls.sort().map((optionMaxRoll) => {
            if (roll <= optionMaxRoll) {
                return this._options.get(optionMaxRoll);
            }
        });

        return -1;
    }

    getEpistellarZoneQty(star: Star): number {
        let mod = 0;
        if (star.spectralLuminosityClass === 'M-V') {
            mod = -1;
        }

        let result = 0;
        if (star.spectralClass !== 'L' && star.spectralClass !== 'D' && star.luminosityClass !== '|||') {
            result = this.toValue(this.random.between(1, 6) - 3 + mod, Score.n0, Score.n2);
        }

        return result;
    }

    getInnerZoneQty(star: Star): number {
        let mod = 0;
        let roll = this.random.between(1, 6) - 1;

        if (star.luminosityClass === 'M-V') {
            mod = -1;
        } else if (star.spectralClass === 'L') {
            roll = this.random.between(1, 3);
        }

        let result = 0;

        if (star.separation !== Separation.Close) {
            result = this.toValue(roll + mod, Score.n0);
        }

        return result;
    }

    getOuterZoneQty(star: Star): number {
        let mod = 0;
        const roll = this.random.between(1, 6);

        if (star.luminosityClass === 'M-V' || star.spectralClass === 'L') {
            mod = -1;
        }

        let result = 0;

        if (star.separation !== Separation.Moderate) {
            result = this.toValue(roll + mod);
        }
        return result;
    }

    toValue(input: number, min: number = 0, max: number = 16): number {
        return input <= min ? min : input >= max ? max : input;
    }
}
