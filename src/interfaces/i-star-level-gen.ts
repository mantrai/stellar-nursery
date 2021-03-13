import RandomSeedFactory from 'stellar-nursery-shared/lib/random-seed-factory';
import Orbit from '../objects/orbit';
import Star from '../objects/star';
import ISubscriber from './i-subscriber';
import IPublisher from './i-publisher';
import OrbitWorker from '../objects/work/orbit-worker';
import System from "../objects/system";

export default interface IStarLevelGen extends ISubscriber<System, System> {
    random: RandomSeedFactory;
    publish: IPublisher<OrbitWorker, Orbit<any>[]>;

    getKey(): number;

    hasWork(workObj: System): boolean;

    run(workObj: System): System;
}
