import RandomSeedFactory from 'stellar-nursery-shared/lib/random-seed-factory';
import System from '../objects/system';
import IPublisher from './i-publisher';
import Orbit from '../objects/orbit';
import Star from '../objects/star';
import StarLevelWorker from '../objects/work/star-level-worker';

export default interface ISystemLevelGen {
    random: RandomSeedFactory;
    publish: IPublisher<StarLevelWorker, Orbit<Star>[]>;

    run(): System;
}
