import RandomSeedFactory from 'stellar-nursery-shared/lib/random-seed-factory';
import System from '../objects/system';
import ISystemGen from '../interfaces/i-system-gen';
import IStarGen from '../interfaces/i-star-gen';

export default class SystemGenerator implements ISystemGen {
    private _random: RandomSeedFactory | undefined;
    private _starGen: IStarGen | undefined;

    public set starGen(sf: IStarGen) {
        this._starGen = sf;
    }

    public get starGen(): IStarGen {
        if (this._starGen === undefined) {
            throw Error('StarGen is not set');
        }

        return this._starGen;
    }

    public set random(rand: RandomSeedFactory) {
        this._random = rand;
    }

    public get random(): RandomSeedFactory {
        if (this._random === undefined) {
            throw Error('Random seed factory undefined');
        }

        return this._random;
    }

    generate(): System {
        const system = new System();
        const roll = this.random.between(3, 18);
        system.type = 3; // SystemType.Trinary;
        if (roll <= 10) {
            system.type = 1; // SystemType.Solitary;
        } else if (roll <= 15) {
            system.type = 2; // SystemType.Binary;
        }
        system.age = this.random.between(0, 15);
        if (this._starGen !== undefined) {
            system.orbits = this.starGen.generate(system.age, system.type);
        }
        return system;
    }
}
