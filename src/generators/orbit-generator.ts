import RandomSeedFactory from 'stellar-nursery-shared/lib/random-seed-factory';
import IOrbitGen from '../interfaces/i-orbit-gen';
import Star from '../objects/star';
import Orbit from '../objects/orbit';
import { Score, Separation, Zone } from 'stellar-nursery-shared';
import OrbitWorker from "../objects/work/orbit-worker";
import StellarNurseryPublisher from "../stellar-nursery-publisher";
import IPublisher from "../interfaces/i-publisher";
import PlanetCategoryWorker from "../objects/work/planet-category-worker";

export default class OrbitGenerator implements IOrbitGen {
    private _random: RandomSeedFactory | undefined;
    publish: IPublisher<string, PlanetCategoryWorker, Orbit<any> | false> = new StellarNurseryPublisher<string, PlanetCategoryWorker, Orbit<any> | false>();
    getKey(): number {
        return 0;
    }
    hasWork(workObj: OrbitWorker): boolean {
        return this.publish.getKeys().length > 0;
    }
    run(workObj: OrbitWorker): Orbit<any>[] {
        const planetCount: Map<number, number> = new Map<number, number>();
        planetCount.set(Zone.Epistellar, this.getEpistellarZoneQty(workObj.star));
        planetCount.set(Zone.InnerZone, this.getInnerZoneQty(workObj.star));
        planetCount.set(Zone.OuterZone, this.getOuterZoneQty(workObj.star));
        const orbits: Orbit<any>[] = [];

        planetCount.forEach((qty: number,zone: number) => {
            for (let i = 0; i < qty; i++) {
                let roll = this.random.between(1, 100);
                if (workObj.star.spectralClass === 'L') {
                    roll -= 20;
                }

                this.publish.getKeys().forEach((key: string) => {
                    const sub = this.publish.getSubscription(key);
                    const worker = new PlanetCategoryWorker(roll, workObj.star, workObj.age, zone);
                    if (sub && sub.hasWork(worker)) {
                        const orbit: Orbit<any> | false = sub.run(worker);
                        if (orbit) {
                            orbits.push(orbit);
                        }
                    }
                });
            }
        });

        return orbits;
    }

    public get random(): RandomSeedFactory {
        if (this._random === undefined) {
            throw Error('Random seed factory undefined');
        }

        return this._random;
    }

    public set random(rand: RandomSeedFactory) {
        this._random = rand;
    }

    getEpistellarZoneQty(star: Star): number {
        let mod = 0;
        if (star.spectralLuminosityClass === 'M-V') {
            mod = -1;
        }

        let result = 0;
        if (star.spectralClass !== 'L' && star.spectralClass !== 'D' && star.luminosityClass !== '|||') {
            result = this.toValue(this.random.between(1, 6) - 3 + mod, Score.n0, Score.n2);
        }

        return result;
    }

    getInnerZoneQty(star: Star): number {
        let mod = 0;
        let roll = this.random.between(1, 6) - 1;

        if (star.luminosityClass === 'M-V') {
            mod = -1;
        } else if (star.spectralClass === 'L') {
            roll = this.random.between(1, 3);
        }

        let result = 0;

        if (star.separation !== Separation.Close) {
            result = this.toValue(roll + mod, Score.n0);
        }

        return result;
    }

    getOuterZoneQty(star: Star): number {
        let mod = 0;
        const roll = this.random.between(1, 6);

        if (star.luminosityClass === 'M-V' || star.spectralClass === 'L') {
            mod = -1;
        }

        let result = 0;

        if (star.separation !== Separation.Moderate) {
            result = this.toValue(roll + mod);
        }
        return result;
    }

    toValue(input: number, min: number = 0, max: number = 16): number {
        return input <= min ? min : input >= max ? max : input;
    }
}
