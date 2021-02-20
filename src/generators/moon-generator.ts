import RandomSeedFactory from 'stellar-nursery-shared/lib/random-seed-factory';
import Star from '../objects/star';
import Orbit from '../objects/orbit';
import { Score, Separation, Zone } from 'stellar-nursery-shared';
import OrbitWorker from '../objects/work/orbit-worker';
import StellarNurseryPublisher from '../stellar-nursery-publisher';
import IPublisher from '../interfaces/i-publisher';
import PlanetCategoryWorker from '../objects/work/planet-category-worker';
import MoonOrbitWorker from '../objects/work/moon-orbit-worker';
import IMoonGen from '../interfaces/i-moon-gen';
import IPlanet from '../interfaces/i-planet';

export default class MoonGenerator implements IMoonGen {
    publish: IPublisher<number, PlanetCategoryWorker, Orbit<any>> = new StellarNurseryPublisher<
        number,
        PlanetCategoryWorker,
        Orbit<any>
    >();

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

    getKey(): number {
        return 0;
    }

    hasWork(workObj: MoonOrbitWorker): boolean {
        return this.publish.getKeys().length > 0;
    }

    run(workObj: MoonOrbitWorker): Orbit<any>[] {
        workObj.parent.orbitStats.orbits.forEach((orbits, index) => {
            this.publish.getKeys().forEach((key: number) => {
                const sub = this.publish.getSubscription(key);
                const worker = new PlanetCategoryWorker(0, workObj.star, workObj.age, workObj.zone, workObj.parent);
                if (sub && sub.hasWork(worker)) {
                    const orbit: Orbit<any> = sub.run(worker);
                    if (orbit) {
                        workObj.parent.orbitStats.orbits[index] = orbit;
                    }
                }
            });
        });

        return workObj.parent.orbitStats.orbits;
    }
}
