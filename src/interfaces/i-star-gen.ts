import RandomSeedFactory from 'stellar-nursery-shared/lib/random-seed-factory';
import Orbit from '../objects/orbit';
import Star from '../objects/star';
import IOrbitGen from './i-orbit-gen';

export default interface IStarGen {
    random: RandomSeedFactory;
    orbitGen: IOrbitGen;
    generate(age: number, qty: number): Orbit<Star>[];
}
