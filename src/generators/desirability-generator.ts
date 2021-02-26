import IPublisher from '../interfaces/i-publisher';
import Orbit from '../objects/orbit';
import StellarNurseryPublisher from '../stellar-nursery-publisher';
import RandomSeedFactory from 'stellar-nursery-shared/lib/random-seed-factory';
import IPlanetGen from '../interfaces/i-planet-gen';
import MoonOrbitWorker from '../objects/work/moon-orbit-worker';
import { OrbitCategory, PlanetType } from '../types/enum';
import PlanetTypeWorker from '../objects/work/planet-type-worker';
import IPlanet from '../interfaces/i-planet';
import { Score, Zone } from 'stellar-nursery-shared';

export default class DesirabilityGenerator implements IPlanetGen {
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

    getKey(): number {
        return PlanetType.Snowball;
    }

    // noinspection JSUnusedLocalSymbols
    hasWork(workObj: PlanetTypeWorker): boolean {
        return true;
    }

    run(workObj: PlanetTypeWorker): Orbit<IPlanet> {
        if (workObj.planet.category !== OrbitCategory.Belt && workObj.planet.category !== OrbitCategory.None) {
            let desire = 0;
            desire -= workObj.planet.orbitStats.planetaryStats.hydrosphere === Score.n0 ? 1 : 0;
            desire -=
                workObj.planet.orbitStats.planetaryStats.size >= Score.nD ||
                workObj.planet.orbitStats.planetaryStats.atmosphere >= Score.nC ||
                workObj.planet.orbitStats.planetaryStats.hydrosphere === Score.nF
                    ? 2
                    : 0;
            desire -= workObj.star.spectralLuminosityClass === 'M-Ve' ? this.random.between(1, 3) : 0;
            if (
                workObj.planet.orbitStats.planetaryStats.size >= Score.n1 &&
                workObj.planet.orbitStats.planetaryStats.size <= Score.n8 &&
                workObj.planet.orbitStats.planetaryStats.atmosphere >= Score.n4 &&
                workObj.planet.orbitStats.planetaryStats.atmosphere <= Score.n9 &&
                workObj.planet.orbitStats.planetaryStats.hydrosphere <= Score.n8
            ) {
                if (
                    workObj.planet.orbitStats.planetaryStats.size >= Score.n5 &&
                    workObj.planet.orbitStats.planetaryStats.size <= Score.nA &&
                    workObj.planet.orbitStats.planetaryStats.hydrosphere >= Score.n4 &&
                    workObj.planet.orbitStats.planetaryStats.hydrosphere <= Score.n8
                ) {
                    desire += 5;
                } else if (workObj.planet.orbitStats.planetaryStats.hydrosphere >= Score.nA) {
                    desire += 3;
                } else if (
                    workObj.planet.orbitStats.planetaryStats.atmosphere >= Score.n2 &&
                    workObj.planet.orbitStats.planetaryStats.atmosphere <= Score.n6 &&
                    workObj.planet.orbitStats.planetaryStats.hydrosphere >= Score.n0 &&
                    workObj.planet.orbitStats.planetaryStats.hydrosphere <= Score.n3
                ) {
                    desire += 2;
                } else {
                    desire += 4;
                }
            }
            desire -=
                workObj.planet.orbitStats.planetaryStats.size >= Score.nA &&
                workObj.planet.orbitStats.planetaryStats.atmosphere >= Score.nF
                    ? 1
                    : 0;
            if (workObj.zone === Zone.InnerZone) {
                desire += workObj.star.spectralLuminosityClass === 'M-V' ? 2 : 0;
                desire += workObj.star.spectralClass === 'D' ? 2 : 0;
                desire +=
                    workObj.planet.orbitStats.planetaryStats.atmosphere >= Score.n6 &&
                    workObj.planet.orbitStats.planetaryStats.atmosphere >= Score.n8
                        ? 1
                        : 0;
            }
            workObj.planet.orbitStats.planetaryStats.desirability = desire;
        }
        return workObj.planet;
    }
}
