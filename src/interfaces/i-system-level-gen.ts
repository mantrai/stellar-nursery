import RandomSeedFactory from 'stellar-nursery-shared/lib/random-seed-factory';
import System from '../objects/system';
import IPublisher from './i-publisher';
import Orbit from '../objects/orbit';
import Star from '../objects/star';

export default interface ISystemLevelGen {
    random: RandomSeedFactory;
    publish: IPublisher<System, System>;

    run(): System;
}
