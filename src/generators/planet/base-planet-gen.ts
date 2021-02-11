import RandomSeedFactory from "stellar-nursery-shared/lib/random-seed-factory";
import IPublisher from "../../interfaces/i-publisher";
import MoonOrbitWorker from "../../objects/work/moon-orbit-worker";
import Orbit from "../../objects/orbit";
import StellarNurseryPublisher from "../../stellar-nursery-publisher";
import IPlanet from "../../interfaces/i-planet";
import Star from "../../objects/star";

export default class BasePlanetGen {
    protected _random: RandomSeedFactory | undefined;
    publish: IPublisher<number, MoonOrbitWorker, Orbit<any>[]> = new StellarNurseryPublisher<number, MoonOrbitWorker, Orbit<any>[]>();

    public set random(rand: RandomSeedFactory) {
        this._random = rand;
    }

    public get random(): RandomSeedFactory {
        if (this._random === undefined) {
            throw Error('Random seed factory undefined');
        }

        return this._random;
    }

    public response(star: Star, zone:number, age: number, parent: Orbit<any>): Orbit<IPlanet> {
        this.publish.getKeys().forEach((key: number) => {
            const sub = this.publish.getSubscription(key);
            const worker = new MoonOrbitWorker(star, zone, age, parent);
            if (sub && sub.hasWork(worker)) {
                parent.orbitStats.orbits = sub.run(worker);
            }
        });

        return parent;
    }

    protected toValue(input: number, min: number = 0, max: number = 16): number {
        return input <= min ? min : input >= max ? max : input;
    }
}
