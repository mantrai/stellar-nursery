import RandomSeedFactory from 'stellar-nursery-shared/lib/random-seed-factory';
import Orbit from '../objects/orbit';
import Star from '../objects/star';
import IPlanetGenMapper from './i-planet-gen-mapper';

export default interface IOrbitGen {
    random: RandomSeedFactory;
    mapper: IPlanetGenMapper;
    addOption(maxRoll: number, key: number): IOrbitGen;
    generate(star: Star, age: number): Orbit<any>[];
}
