import RandomSeedFactory from 'stellar-nursery-shared/lib/random-seed-factory';
import Orbit from '../objects/orbit';
import ISubscriber from './i-subscriber';
import IPublisher from './i-publisher';
import PlanetTypeWorker from '../objects/work/planet-type-worker';
import MoonOrbitWorker from '../objects/work/moon-orbit-worker';

export default interface IPlanetGen extends ISubscriber<number, PlanetTypeWorker, Orbit<any>> {
    random: RandomSeedFactory;
    publish: IPublisher<number, MoonOrbitWorker, Orbit<any>[]>;
    getKey(): number;
    hasWork(workObj: PlanetTypeWorker): boolean;
    run(workObj: PlanetTypeWorker): Orbit<any>;
}
