import RandomSeedFactory from 'stellar-nursery-shared/lib/random-seed-factory';
import Orbit from '../objects/orbit';
import StellarNurseryPublisher from '../stellar-nursery-publisher';
import IPublisher from '../interfaces/i-publisher';
import PlanetCategoryWorker from '../objects/work/planet-category-worker';
import MoonOrbitWorker from '../objects/work/moon-orbit-worker';
import IMoonGen from '../interfaces/i-moon-gen';
import IPlanet from '../interfaces/i-planet';

export default class MoonGenerator implements IMoonGen {
    publish: IPublisher<number, PlanetCategoryWorker, Orbit<any>> = new StellarNurseryPublisher<number,
        PlanetCategoryWorker,
        Orbit<any>>();

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
        // if workObj.parent is defined this has already been run before and we dont do moon of moons.
        return this.publish.getKeys().length > 0 && workObj.parent === undefined;
    }

    run(workObj: MoonOrbitWorker): Orbit<any>[] {
        // loop though moons
        workObj.current.orbitStats.orbits.forEach((orbit, index) => {
            this.publish.getKeys().forEach((key: number) => {
                const sub = this.publish.getSubscription(key);
                const worker = new PlanetCategoryWorker(
                    0,
                    workObj.star,
                    workObj.age,
                    workObj.zone,
                    workObj.current,
                    orbit as Orbit<IPlanet>,
                );
                if (sub && sub.hasWork(worker)) {
                    orbit = sub.run(worker);
                    if (orbit) {
                        workObj.current.orbitStats.orbits[index] = orbit;
                    }
                }
            });
        });

        return workObj.current.orbitStats.orbits;
    }
}
