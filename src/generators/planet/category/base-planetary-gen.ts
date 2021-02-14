import RandomSeedFactory from 'stellar-nursery-shared/lib/random-seed-factory';
import Orbit from '../../../objects/orbit';
import Star from '../../../objects/star';
import IPlanet from '../../../interfaces/i-planet';
import IPublisher from '../../../interfaces/i-publisher';
import PlanetTypeWorker from '../../../objects/work/planet-type-worker';
import StellarNurseryPublisher from '../../../stellar-nursery-publisher';

export default class BasePlanetaryGen {
    protected _random: RandomSeedFactory | undefined;
    protected _min: number = -1;
    protected _max: number = -1;
    public publish: IPublisher<number, PlanetTypeWorker, Orbit<any>> = new StellarNurseryPublisher<
        number,
        PlanetTypeWorker,
        Orbit<any>
    >();

    public set random(rand: RandomSeedFactory) {
        this._random = rand;
    }

    public get random(): RandomSeedFactory {
        if (this._random === undefined) {
            throw Error('Random seed factory undefined');
        }

        return this._random;
    }

    public between(val: number, min: number, max: number): boolean {
        return val > min && val <= max;
    }

    public response(
        orbit: Orbit<IPlanet>,
        star: Star,
        zone: number,
        age: number,
        type: number,
        parent?: Orbit<any>,
    ): Orbit<IPlanet> | false {
        if (this.publish.hasSubscription(type)) {
            const sub = this.publish.getSubscription(type);
            const worker = new PlanetTypeWorker(orbit, star, zone, age, parent);
            if (sub && sub.hasWork(worker)) {
                return sub.run(worker);
            }
        }

        return false;
    }
}
