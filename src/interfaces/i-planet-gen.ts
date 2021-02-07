import RandomSeedFactory from 'stellar-nursery-shared/lib/random-seed-factory';
import Star from '../objects/star';
import Orbit from '../objects/orbit';

export default interface IPlanetGen {
    random: RandomSeedFactory;
    generate<T>(star: Star, basePlanet: Orbit<T>): Orbit<T>;
}
