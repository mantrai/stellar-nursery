import RandomSeedFactory from 'stellar-nursery-shared/lib/random-seed-factory';
import IPublisher from '../../interfaces/i-publisher';
import MoonOrbitWorker from '../../objects/work/moon-orbit-worker';
import Orbit from '../../objects/orbit';
import StellarNurseryPublisher from '../../stellar-nursery-publisher';
import IPlanet from '../../interfaces/i-planet';
import Star from '../../objects/star';
import { OrbitCategory, PlanetType } from 'stellar-nursery-shared';
import PlanetTypeWorker from '../../objects/work/planet-type-worker';

export default class BasePlanetGen {
    publish: IPublisher<number, MoonOrbitWorker, Orbit<any>[]> = new StellarNurseryPublisher<
        number,
        MoonOrbitWorker,
        Orbit<any>[]
    >();

    protected _random: RandomSeedFactory | undefined;

    public get random(): RandomSeedFactory {
        if (this._random === undefined) {
            throw Error('Random seed factory undefined');
        }

        return this._random;
    }

    public set random(rand: RandomSeedFactory) {
        this._random = rand;
    }

    public getKey(): number {
        return PlanetType.None;
    }

    public hasWork(workObj: PlanetTypeWorker): boolean {
        let result = workObj.type === this.getKey();
        if (workObj.star.luminosityClass === 'III' || workObj.star.spectralClass === 'D') {
            switch (workObj.type) {
                case OrbitCategory.Dwarf:
                    result = PlanetType.Stygian === this.getKey();
                    break;
                case OrbitCategory.Terrestrial:
                    result = PlanetType.Acheronian === this.getKey();
                    break;
                case OrbitCategory.Helian:
                    result = PlanetType.Asphodelian === this.getKey();
                    break;
                case OrbitCategory.Jovian:
                    result = PlanetType.Chthonian === this.getKey();
                    break;
            }
        }
        return result;
    }

    public response(orbit: Orbit<IPlanet>, star: Star, zone: number, age: number, parent?: Orbit<any>): Orbit<IPlanet> {
        this.publish.getKeys().forEach((key: number) => {
            const sub = this.publish.getSubscription(key);
            const worker = new MoonOrbitWorker(star, zone, age, orbit, parent);
            if (sub && sub.hasWork(worker)) {
                orbit.orbitStats.orbits = sub.run(worker);
            }
        });

        return orbit;
    }

    protected toValue(input: number, min: number = 0, max: number = 16): number {
        return input <= min ? min : input >= max ? max : input;
    }
}
