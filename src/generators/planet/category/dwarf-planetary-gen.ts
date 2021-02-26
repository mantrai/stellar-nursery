import Orbit from '../../../objects/orbit';
import { OrbitCategory, PlanetType } from '../../../types/enum';
import { Zone } from 'stellar-nursery-shared';
import BasePlanetaryGen from './base-planetary-gen';
import IPlanetCategoryGen from '../../../interfaces/i-planet-category-gen';
import PlanetCategoryWorker from '../../../objects/work/planet-category-worker';
import Planet from '../../../objects/planet';
import IPlanet from '../../../interfaces/i-planet';

export default class DwarfPlanetaryGen extends BasePlanetaryGen implements IPlanetCategoryGen {
    constructor(min: number = 20, max: number = 36) {
        super();
        this._min = min;
        this._max = max;
    }

    getKey(): number {
        return OrbitCategory.Dwarf;
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
                    type = this.generateEpistellar(this.random.between(1, 6), workObj.parent);
                    break;
                case Zone.InnerZone:
                    type = this.generateInner(this.random.between(1, 6), workObj.parent);
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
                type   = workObj.current.category;
            }
        }

        return this.response(planet, workObj.star, workObj.zone, workObj.age, type, workObj.parent) as Orbit<IPlanet>;
    }

    generateChildren(planet: Orbit<IPlanet>): Orbit<IPlanet> {
        if (this.random.between(1, 6) === 6) {
            planet.orbitStats.orbits.push(new Orbit<IPlanet>(new Planet(OrbitCategory.Dwarf)));
        }

        return planet;
    }

    generateEpistellar(roll: number, parent?: Orbit<any>): number {
        let output: number;
        if (parent !== undefined && parent.category === OrbitCategory.Belt) {
            roll -= 2;
        }
        if (roll <= 3) {
            output = PlanetType.Rockball;
        } else if (roll <= 5) {
            output = PlanetType.Meltball;
        } else {
            roll = this.random.between(1, 6);
            if (roll <= 4) {
                output = PlanetType.Hebean;
            } else {
                output = PlanetType.Promethean;
            }
        }
        return output;
    }

    generateInner(roll: number, parent?: Orbit<any>): number {
        let output: number;
        if (parent !== undefined) {
            roll -= parent.category === OrbitCategory.Belt ? 2 : 0;
            roll += parent.category === OrbitCategory.Helian ? 1 : 0;
            roll += parent.category === OrbitCategory.Jovian ? 2 : 0;
        }
        if (roll <= 4) {
            output = PlanetType.Rockball;
        } else if (roll <= 6) {
            output = PlanetType.Arean;
        } else if (roll <= 7) {
            output = PlanetType.Meltball;
        } else {
            roll = this.random.between(1, 6);
            if (roll <= 4) {
                output = PlanetType.Hebean;
            } else {
                output = PlanetType.Promethean;
            }
        }
        return output;
    }

    generateOuter(roll: number, parent?: Orbit<any>): number {
        let output: number;
        if (parent !== undefined) {
            roll -= parent.category === OrbitCategory.Belt ? 1 : 0;
            roll += parent.category === OrbitCategory.Helian ? 1 : 0;
            roll += parent.category === OrbitCategory.Jovian ? 2 : 0;
        }
        if (roll <= 0) {
            output = PlanetType.Rockball;
        } else if (roll <= 4) {
            output = PlanetType.Snowball;
        } else if (roll <= 6) {
            output = PlanetType.Rockball;
        } else if (roll <= 7) {
            output = PlanetType.Meltball;
        } else {
            roll = this.random.between(1, 6);
            if (roll <= 3) {
                output = PlanetType.Hebean;
            } else if (roll <= 5) {
                output = PlanetType.Arean;
            } else {
                output = PlanetType.Promethean;
            }
        }
        return output;
    }
}
