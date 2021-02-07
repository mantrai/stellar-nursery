import RandomSeedFactory from 'stellar-nursery-shared/lib/random-seed-factory';
import System from '../objects/system';
import IStarGen from './i-star-gen';

export default interface ISystemGen {
    random: RandomSeedFactory;
    starGen: IStarGen;
    generate(): System;
}
