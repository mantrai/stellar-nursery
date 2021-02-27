import RandomSeedFactory from 'stellar-nursery-shared/lib/random-seed-factory';
import Orbit from '../objects/orbit';
import ISubscriber from './i-subscriber';
import IPublisher from './i-publisher';
import OrbitWorker from '../objects/work/orbit-worker';
import PlanetCategoryWorker from '../objects/work/planet-category-worker';

export default interface IOrbitGen extends ISubscriber<OrbitWorker, Orbit<any>[]> {
    random: RandomSeedFactory;
    publish: IPublisher<PlanetCategoryWorker, Orbit<any>>;

    getKey(): number;

    hasWork(workObj: OrbitWorker): boolean;

    run(workObj: OrbitWorker): Orbit<any>[];
}
