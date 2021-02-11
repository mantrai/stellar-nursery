import RandomSeedFactory from 'stellar-nursery-shared/lib/random-seed-factory';
import Orbit from '../objects/orbit';
import Star from '../objects/star';
import IOrbitGen from './i-orbit-gen';
import ISubscriber from "./i-subscriber";
import StarLevelWorker from "../objects/work/star-level-worker";
import IPublisher from "./i-publisher";
import OrbitWorker from "../objects/work/orbit-worker";

export default interface IStarLevelGen extends ISubscriber<number, StarLevelWorker, Orbit<Star>[]> {
    random: RandomSeedFactory;
    publish: IPublisher<number, OrbitWorker, Orbit<any>[]>;
    getKey(): number;
    hasWork(workObj: StarLevelWorker): boolean;
    run(workObj: StarLevelWorker) : Orbit<Star>[];
}
