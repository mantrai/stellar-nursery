import RandomSeedFactory from 'stellar-nursery-shared/lib/random-seed-factory';
import System from '../objects/system';
import ISystemLevelGen from '../interfaces/i-system-level-gen';
import IPublisher from '../interfaces/i-publisher';
import Orbit from '../objects/orbit';
import StellarNurseryPublisher from '../stellar-nursery-publisher';
import Star from '../objects/star';
import {SystemType} from 'stellar-nursery-shared';

export default class SystemGenerator implements ISystemLevelGen {
    public publish: IPublisher<System, System> = new StellarNurseryPublisher<System, System>();

    private _random: RandomSeedFactory | undefined;

    public get random(): RandomSeedFactory {
        if (this._random === undefined) {
            throw Error('Random seed factory undefined');
        }

        return this._random;
    }

    public set random(rand: RandomSeedFactory) {
        this._random = rand;
    }

    run(): System {
        let system = new System();
        const roll = this.random.between(3, 18);
        system.type = SystemType.Trinary;
        if (roll <= 10) {
            system.type = SystemType.Solitary;
        } else if (roll <= 15) {
            system.type = SystemType.Binary;
        }
        system.age = this.random.between(0, 15);
        this.publish.getKeys().forEach((key: number) => {
            const sub = this.publish.getSubscription(key);
            if (sub && sub.hasWork(system)) {
                system = sub.run(system);
            }
        });
        return system;
    }
}
