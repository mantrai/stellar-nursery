import RandomSeedFactory from 'stellar-nursery-shared/lib/random-seed-factory';
import Orbit from '../objects/orbit';
import ISubscriber from './i-subscriber';
import IPublisher from './i-publisher';
import PlanetCategoryWorker from '../objects/work/planet-category-worker';
import MoonOrbitWorker from '../objects/work/moon-orbit-worker';

export default interface IMoonGen extends ISubscriber<number, MoonOrbitWorker, Orbit<any>[]> {
    random: RandomSeedFactory;
    publish: IPublisher<number, PlanetCategoryWorker, Orbit<any>>;

    getKey(): number;

    hasWork(workObj: MoonOrbitWorker): boolean;

    run(workObj: MoonOrbitWorker): Orbit<any>[];
}
