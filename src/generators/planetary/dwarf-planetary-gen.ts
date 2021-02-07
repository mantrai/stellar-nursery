import RandomSeedFactory from 'stellar-nursery-shared/lib/random-seed-factory';
import Orbit from '../../objects/orbit';
import Dwarf from '../../objects/planetary/dwarf';
import IPlanetaryGen from '../../interfaces/i-planetary-gen';
import { PlanetaryTypes, PlanetTypes } from '../../types/enum';
import Star from '../../objects/star';
import { Zone } from 'stellar-nursery-shared';
import IPlanetGenMapper from '../../interfaces/i-planet-gen-mapper';

export default class DwarfPlanetaryGen implements IPlanetaryGen {
    private _random: RandomSeedFactory | undefined;
    private _mapper: IPlanetGenMapper | undefined;

    public set random(rand: RandomSeedFactory) {
        this._random = rand;
    }

    public get random(): RandomSeedFactory {
        if (this._random === undefined) {
            throw Error('Random seed factory undefined');
        }

        return this._random;
    }

    public set mapper(map: IPlanetGenMapper) {
        this._mapper = map;
    }

    public get mapper(): IPlanetGenMapper {
        if (this._mapper === undefined) {
            throw Error('Planetary mapper not set');
        }

        return this._mapper;
    }

    public zone: number = 0;

    generate(star: Star, zone: number, parent?: Orbit<any>): Orbit<Dwarf> | false {
        const dwarf = new Dwarf();
        let type: number = -1;
        switch (zone) {
            case Zone.Epistellar:
                type = this.generateEpistellar(this.random.between(1, 6), parent);
                break;
            case Zone.InnerZone:
                type = this.generateInner(this.random.between(1, 6), parent);
                break;
            case Zone.OuterZone:
                type = this.generateOuter(this.random.between(1, 6), parent);
                break;
        }

        return this.mapper.hasPlanetGen(type)
            ? this.mapper.getPlanetGen(type).generate<Dwarf>(star, new Orbit<Dwarf>(dwarf))
            : false;
    }

    generateEpistellar(roll: number, parent?: Orbit<any>): number {
        let output: number;
        if (parent !== undefined && parent.type === PlanetaryTypes.Belt) {
            roll -= 2;
        }
        if (roll <= 3) {
            output = PlanetTypes.Rockball;
        } else if (roll <= 5) {
            output = PlanetTypes.Meltball;
        } else {
            roll = this.random.between(1, 6);
            if (roll <= 4) {
                output = PlanetTypes.Hebean;
            } else {
                output = PlanetTypes.Promethean;
            }
        }
        return output;
    }

    generateInner(roll: number, parent?: Orbit<any>): number {
        let output: number;
        if (parent !== undefined) {
            roll -= parent.type === PlanetaryTypes.Belt ? 2 : 0;
            roll += parent.type === PlanetaryTypes.Helian ? 1 : 0;
            roll += parent.type === PlanetaryTypes.Jovian ? 2 : 0;
        }
        if (roll <= 4) {
            output = PlanetTypes.Rockball;
        } else if (roll <= 6) {
            output = PlanetTypes.Arean;
        } else if (roll <= 7) {
            output = PlanetTypes.Meltball;
        } else {
            roll = this.random.between(1, 6);
            if (roll <= 4) {
                output = PlanetTypes.Hebean;
            } else {
                output = PlanetTypes.Promethean;
            }
        }
        return output;
    }

    generateOuter(roll: number, parent?: Orbit<any>): number {
        let output: number;
        if (parent !== undefined) {
            roll -= parent.type === PlanetaryTypes.Belt ? 1 : 0;
            roll += parent.type === PlanetaryTypes.Helian ? 1 : 0;
            roll += parent.type === PlanetaryTypes.Jovian ? 2 : 0;
        }
        if (roll <= 0) {
            output = PlanetTypes.Rockball;
        } else if (roll <= 4) {
            output = PlanetTypes.Snowball;
        } else if (roll <= 6) {
            output = PlanetTypes.Rockball;
        } else if (roll <= 7) {
            output = PlanetTypes.Meltball;
        } else {
            roll = this.random.between(1, 6);
            if (roll <= 3) {
                output = PlanetTypes.Hebean;
            } else if (roll <= 5) {
                output = PlanetTypes.Arean;
            } else {
                output = PlanetTypes.Promethean;
            }
        }
        return output;
    }
}
