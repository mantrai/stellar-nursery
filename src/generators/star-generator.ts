import RandomSeedFactory from 'stellar-nursery-shared/lib/random-seed-factory';
import Orbit from '../objects/orbit';
import Star from '../objects/star';
import {Separation} from 'stellar-nursery-shared';
import IStarLevelGen from '../interfaces/i-star-level-gen';
import StarLevelWorker from '../objects/work/star-level-worker';
import IPublisher from '../interfaces/i-publisher';
import OrbitWorker from '../objects/work/orbit-worker';
import StellarNurseryPublisher from '../stellar-nursery-publisher';

export default class StarGenerator implements IStarLevelGen {
    publish: IPublisher<OrbitWorker, Orbit<any>[]> = new StellarNurseryPublisher<OrbitWorker,
        Orbit<any>[]>();

    private _random: RandomSeedFactory | undefined;

    public get random(): RandomSeedFactory {
        if (this._random === undefined) {
            throw Error('Random seed factory undefined');
        }

        return this._random;
    }

    public set random(rand: RandomSeedFactory) {
        this._random = rand;
    }

    getKey(): number {
        return 0;
    }

    // noinspection JSUnusedLocalSymbols
    hasWork(workObj: StarLevelWorker): boolean {
        return true;
    }

    run(workObj: StarLevelWorker): Orbit<Star>[] {
        const orbits = [];
        let mod = 0;
        for (let i = 0; i < workObj.qty; i++) {
            const stats = this.calculateStats(
                this.getStarClass(this.random.between(2, 12) + mod),
                workObj.age,
                this.random.between(1, 6),
            );
            stats.separation = i > 0 ? this.getSeparation(this.random.between(1, 6)) : 0;
            const orbit = new Orbit<Star>(stats);
            this.publish.getKeys().forEach((key: number) => {
                const sub = this.publish.getSubscription(key);
                const worker = new OrbitWorker(orbit.orbitStats, workObj.age);
                if (sub && sub.hasWork(worker)) {
                    orbit.orbitStats.orbits = sub.run(worker);
                }
            });
            orbits.push(orbit);
            mod += this.random.between(0, 5);
        }

        return orbits;
    }

    getStarClass(roll: number): string {
        let output = 'L';
        if (roll <= 2) {
            output = 'A';
        } else if (roll <= 3) {
            output = 'F';
        } else if (roll <= 4) {
            output = 'G';
        } else if (roll <= 5) {
            output = 'K';
        } else if (roll <= 13) {
            output = 'M';
        }

        return output;
    }

    getSeparation(roll: number): number {
        let output = Separation.Distant;
        if (roll <= 2) {
            output = Separation.Tight;
        } else if (roll <= 4) {
            output = Separation.Close;
        } else if (roll <= 5) {
            output = Separation.Moderate;
        }

        return output;
    }

    calculateStats(baseStarClass: string, age: number, reRollRoll: number): Star {
        const stats = new Star();
        switch (baseStarClass) {
            case 'A':
                stats.spectralClass = 'D';
                stats.luminosityClass = '';
                if (age <= 2) {
                    stats.spectralClass = 'A';
                    stats.luminosityClass = 'V';
                } else if (age <= 3) {
                    if (reRollRoll <= 2) {
                        stats.spectralClass = 'F';
                        stats.luminosityClass = 'V';
                    } else if (reRollRoll <= 3) {
                        stats.spectralClass = 'K';
                        stats.luminosityClass = 'III';
                    }
                }
                break;
            case 'F':
                stats.spectralClass = 'D';
                stats.luminosityClass = '';
                if (age <= 5) {
                    stats.spectralClass = 'F';
                    stats.luminosityClass = 'V';
                } else if (age <= 6) {
                    if (reRollRoll <= 4) {
                        stats.spectralClass = 'G';
                        stats.luminosityClass = 'IV';
                    } else if (reRollRoll <= 6) {
                        stats.spectralClass = 'M';
                        stats.luminosityClass = 'III';
                    }
                }
                break;
            case 'G':
                stats.spectralClass = 'D';
                stats.luminosityClass = '';
                if (age <= 11) {
                    stats.spectralClass = 'G';
                    stats.luminosityClass = 'V';
                } else if (age <= 13) {
                    if (reRollRoll <= 3) {
                        stats.spectralClass = 'K';
                        stats.luminosityClass = 'IV';
                    } else if (reRollRoll <= 6) {
                        stats.spectralClass = 'M';
                        stats.luminosityClass = 'III';
                    }
                }
                break;
            case 'K':
                stats.spectralClass = 'K';
                stats.luminosityClass = 'V';
                break;
            case 'M':
                stats.spectralClass = 'L';
                stats.luminosityClass = '';
                if (age <= 9) {
                    stats.spectralClass = 'M';
                    stats.luminosityClass = 'V';
                } else if (age <= 12) {
                    stats.spectralClass = 'M';
                    stats.luminosityClass = 'Ve';
                }
                break;
            case 'L':
                stats.spectralClass = 'L';
                stats.luminosityClass = '';
                break;
        }

        return stats;
    }
}
