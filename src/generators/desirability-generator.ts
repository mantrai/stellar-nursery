import IPublisher from '../interfaces/i-publisher';
import Orbit from '../objects/orbit';
import StellarNurseryPublisher from '../stellar-nursery-publisher';
import RandomSeedFactory from 'stellar-nursery-shared/lib/random-seed-factory';
import IPlanetGen from '../interfaces/i-planet-gen';
import MoonOrbitWorker from '../objects/work/moon-orbit-worker';
import {OrbitCategory, Score, Zone} from 'stellar-nursery-shared';
import PlanetTypeWorker from '../objects/work/planet-type-worker';
import IPlanet from '../interfaces/i-planet';
import Star from "../objects/star";
import IOrbitItem from "../interfaces/i-orbit-item";

export default class DesirabilityGenerator implements IPlanetGen {
    publish: IPublisher<MoonOrbitWorker, Orbit<any>[]> = new StellarNurseryPublisher<MoonOrbitWorker,
        Orbit<any>[]>();

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
        return 10000;
    }

    // noinspection JSUnusedLocalSymbols
    hasWork(workObj: PlanetTypeWorker): boolean {
        return true;
    }

    run(workObj: PlanetTypeWorker): Orbit<IPlanet> {
        workObj.planet = this.calculateDesire(workObj.planet, workObj.star, workObj.zone);
        workObj.planet = this.moreWork(workObj.techLevel, workObj.planet, workObj.star, workObj.zone, workObj.age);
        workObj.planet.orbitStats.orbits.forEach((value:Orbit<IOrbitItem>, index:number) => {
            let moon = value as Orbit<IPlanet>;
            moon = this.calculateDesire(moon, workObj.star, workObj.zone);
            moon = this.moreWork(workObj.techLevel, moon, workObj.star, workObj.zone, workObj.age, workObj.planet);
            moon = this.calculateDesire(moon, workObj.star, workObj.zone);// rerun after more work to recalculate for changes
            workObj.planet.orbitStats.orbits[index] = moon;
        });
        workObj.planet = this.calculateDesire(workObj.planet, workObj.star, workObj.zone);// rerun after more work to recalculate for changes
        return workObj.planet;
    }

    public moreWork(techLevel: number, orbit: Orbit<IPlanet>, star: Star, zone: number, age: number, parent?: Orbit<any>): Orbit<IPlanet> {
        this.publish.getKeys().forEach((key: number) => {
            const sub = this.publish.getSubscription(key);
            const worker = new MoonOrbitWorker(star, zone, age, techLevel, orbit, parent);
            worker.techLevel = techLevel;
            if (sub && sub.hasWork(worker)) {
                orbit.orbitStats.orbits = sub.run(worker);
            }
        });

        return orbit;
    }

    calculateDesire(planet: Orbit<IPlanet>, star: Star, zone: number): Orbit<IPlanet> {
        if (planet.category !== OrbitCategory.Belt && planet.category !== OrbitCategory.None) {
            let desire = 0;
            desire -= planet.orbitStats.planetaryStats.hydrosphere === Score.n0 ? 1 : 0;
            desire -=
                planet.orbitStats.planetaryStats.size >= Score.nD ||
                planet.orbitStats.planetaryStats.atmosphere >= Score.nC ||
                planet.orbitStats.planetaryStats.hydrosphere === Score.nF
                    ? 2
                    : 0;
            desire -= star.spectralLuminosityClass === 'M-Ve' ? this.random.between(1, 3) : 0;
            if (
                planet.orbitStats.planetaryStats.size >= Score.n1 &&
                planet.orbitStats.planetaryStats.size <= Score.n8 &&
                planet.orbitStats.planetaryStats.atmosphere >= Score.n4 &&
                planet.orbitStats.planetaryStats.atmosphere <= Score.n9 &&
                planet.orbitStats.planetaryStats.hydrosphere <= Score.n8
            ) {
                if (
                    planet.orbitStats.planetaryStats.size >= Score.n5 &&
                    planet.orbitStats.planetaryStats.size <= Score.nA &&
                    planet.orbitStats.planetaryStats.hydrosphere >= Score.n4 &&
                    planet.orbitStats.planetaryStats.hydrosphere <= Score.n8
                ) {
                    desire += 5;
                } else if (planet.orbitStats.planetaryStats.hydrosphere >= Score.nA) {
                    desire += 3;
                } else if (
                    planet.orbitStats.planetaryStats.atmosphere >= Score.n2 &&
                    planet.orbitStats.planetaryStats.atmosphere <= Score.n6 &&
                    planet.orbitStats.planetaryStats.hydrosphere >= Score.n0 &&
                    planet.orbitStats.planetaryStats.hydrosphere <= Score.n3
                ) {
                    desire += 2;
                } else {
                    desire += 4;
                }
            }
            desire -=
                planet.orbitStats.planetaryStats.size >= Score.nA &&
                planet.orbitStats.planetaryStats.atmosphere >= Score.nF
                    ? 1
                    : 0;
            if (zone === Zone.InnerZone) {
                desire += star.spectralLuminosityClass === 'M-V' ? 2 : 0;
                desire += star.spectralClass === 'D' ? 2 : 0;
                desire +=
                    planet.orbitStats.planetaryStats.atmosphere >= Score.n6 &&
                    planet.orbitStats.planetaryStats.atmosphere >= Score.n8
                        ? 1
                        : 0;
            }
            planet.orbitStats.planetaryStats.desirability = desire;
        }
        return planet;
    }
}
