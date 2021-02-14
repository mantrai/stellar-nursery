import RandomSeedFactory from 'stellar-nursery-shared/lib/random-seed-factory';
import Orbit from '../objects/orbit';
import ISubscriber from './i-subscriber';
import IPublisher from './i-publisher';
import PlanetTypeWorker from '../objects/work/planet-type-worker';
import PlanetCategoryWorker from '../objects/work/planet-category-worker';

export default interface IPlanetCategoryGen extends ISubscriber<string, PlanetCategoryWorker, Orbit<any> | false> {
    random: RandomSeedFactory;
    publish: IPublisher<number, PlanetTypeWorker, Orbit<any>>;
    getKey(): string;
    hasWork(workObj: PlanetCategoryWorker): boolean;
    run(workObj: PlanetCategoryWorker): Orbit<any> | false;
}
