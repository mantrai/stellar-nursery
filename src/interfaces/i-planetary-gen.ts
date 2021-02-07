import RandomSeedFactory from 'stellar-nursery-shared/lib/random-seed-factory';
import Orbit from '../objects/orbit';
import Star from '../objects/star';
import IPlanetGenMapper from './i-planet-gen-mapper';

export default interface IPlanetaryGen {
    random: RandomSeedFactory;
    mapper: IPlanetGenMapper;
    generate(star: Star, zone: number, parent?: Orbit<any>): Orbit<any> | false;
}
