import Orbit from '../../../objects/orbit';
import {OrbitCategory, PlanetType, Zone} from 'stellar-nursery-shared';
import BasePlanetaryGen from './base-planetary-gen';
import IPlanetCategoryGen from '../../../interfaces/i-planet-category-gen';
import PlanetCategoryWorker from '../../../objects/work/planet-category-worker';
import IPlanet from '../../../interfaces/i-planet';
import Planet from '../../../objects/planet';

export default class TerrestrialPlanetaryGen extends BasePlanetaryGen implements IPlanetCategoryGen {
    constructor(min: number = 36, max: number = 52) {
        super();
        this._min = min;
        this._max = max;
    }

    getKey(): number {
        return OrbitCategory.Terrestrial;
    }

    hasWork(workObj: PlanetCategoryWorker): boolean {
        if (workObj.parent === undefined) {
            return this.between(workObj.roll, this._min, this._max);
        } else {
            if (workObj.current === undefined) {
                return false;
            }
            return workObj.current.category === this.getKey();
        }
    }

    run(workObj: PlanetCategoryWorker): Orbit<any> {
        let planet = new Orbit<IPlanet>(new Planet(this.getKey()));
        let type: number = -1;
        if (workObj.parent === undefined) {
            switch (workObj.zone) {
                case Zone.Epistellar:
                    type = this.generateEpistellar(this.random.between(1, 6));
                    break;
                case Zone.InnerZone:
                    type = this.generateInner(this.random.between(2, 12));
                    break;
                case Zone.OuterZone:
                    type = this.generateOuter(this.random.between(1, 6), workObj.parent);
                    break;
            }

            planet.orbitStats.type = type;

            planet = this.generateChildren(planet);
        } else {
            if (workObj.current === undefined) {
                type = OrbitCategory.Dwarf;
                planet.orbitStats.type = type;
            } else {
                planet = workObj.current;
                type = workObj.current.category;
            }
        }

        return this.response(planet, workObj.star, workObj.zone, workObj.age, type, workObj.parent) as Orbit<IPlanet>;
    }

    generateChildren(planet: Orbit<IPlanet>): Orbit<IPlanet> {
        if (this.random.between(1, 6) >= 5) {
            planet.orbitStats.orbits.push(new Orbit<IPlanet>(new Planet(OrbitCategory.Dwarf)));
        }

        return planet;
    }

    generateEpistellar(roll: number): number {
        let output: number;
        if (roll <= 4) {
            output = PlanetType.Janilithic;
        } else if (roll <= 5) {
            output = PlanetType.Vesperian;
        } else {
            output = PlanetType.Telluric;
        }
        return output;
    }

    generateInner(roll: number): number {
        let output: number;
        if (roll <= 4) {
            output = PlanetType.Telluric;
        } else if (roll <= 6) {
            output = PlanetType.Arid;
        } else if (roll <= 7) {
            output = PlanetType.Tectonic;
        } else if (roll <= 9) {
            output = PlanetType.Oceanic;
        } else if (roll <= 10) {
            output = PlanetType.Tectonic;
        } else {
            output = PlanetType.Telluric;
        }
        return output;
    }

    generateOuter(roll: number, parent?: Orbit<any>): number {
        let output: number;
        if (parent !== undefined) {
            roll += 2;
        }
        if (roll <= 4) {
            output = PlanetType.Arid;
        } else if (roll <= 6) {
            output = PlanetType.Tectonic;
        } else {
            output = PlanetType.Telluric;
        }
        return output;
    }
}
