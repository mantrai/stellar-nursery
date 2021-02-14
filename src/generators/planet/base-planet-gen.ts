import RandomSeedFactory from 'stellar-nursery-shared/lib/random-seed-factory';
import IPublisher from '../../interfaces/i-publisher';
import MoonOrbitWorker from '../../objects/work/moon-orbit-worker';
import Orbit from '../../objects/orbit';
import StellarNurseryPublisher from '../../stellar-nursery-publisher';
import IPlanet from '../../interfaces/i-planet';
import Star from '../../objects/star';

export default class BasePlanetGen {
    publish: IPublisher<number, MoonOrbitWorker, Orbit<any>[]> = new StellarNurseryPublisher<
        number,
        MoonOrbitWorker,
        Orbit<any>[]
    >();

    protected _random: RandomSeedFactory | undefined;

    public get random(): RandomSeedFactory {
        if (this._random === undefined) {
            throw Error('Random seed factory undefined');
        }

        return this._random;
    }

    public set random(rand: RandomSeedFactory) {
        this._random = rand;
    }

    public response(orbit: Orbit<IPlanet>, star: Star, zone: number, age: number, parent?: Orbit<any>): Orbit<IPlanet> {
        if (parent === undefined) {
            this.publish.getKeys().forEach((key: number) => {
                const sub = this.publish.getSubscription(key);
                const worker = new MoonOrbitWorker(star, zone, age, orbit);
                if (sub && sub.hasWork(worker)) {
                    orbit.orbitStats.orbits = sub.run(worker);
                }
            });
        }

        return orbit;
    }

    protected toValue(input: number, min: number = 0, max: number = 16): number {
        return input <= min ? min : input >= max ? max : input;
    }
}
