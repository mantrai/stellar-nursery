import RandomSeedFactory from 'stellar-nursery-shared/lib/random-seed-factory';
import System from '../objects/system';
import ISystemLevelGen from '../interfaces/i-system-level-gen';
import IPublisher from "../interfaces/i-publisher";
import Orbit from "../objects/orbit";
import Star from "../objects/star";
import StellarNurseryPublisher from "../stellar-nursery-publisher";
import StarLevelWorker from "../objects/work/star-level-worker";

export default class SystemGenerator implements ISystemLevelGen {
    private _random: RandomSeedFactory | undefined;
    public publish: IPublisher<number, StarLevelWorker, Orbit<Star>[]> = new StellarNurseryPublisher<number, StarLevelWorker, Orbit<Star>[]>();

    public set random(rand: RandomSeedFactory) {
        this._random = rand;
    }

    public get random(): RandomSeedFactory {
        if (this._random === undefined) {
            throw Error('Random seed factory undefined');
        }

        return this._random;
    }

    run(): System {
        const system = new System();
        const roll = this.random.between(3, 18);
        system.type = 3; // SystemType.Trinary;
        if (roll <= 10) {
            system.type = 1; // SystemType.Solitary;
        } else if (roll <= 15) {
            system.type = 2; // SystemType.Binary;
        }
        system.age = this.random.between(0, 15);
        this.publish.getKeys().forEach((key: number) => {
            const sub = this.publish.getSubscription(key);
            const worker = new StarLevelWorker(system.age, system.type);
            if (sub && sub.hasWork(worker)) {
                system.orbits = sub.run(worker);
            }
        });
        return system;
    }
}
