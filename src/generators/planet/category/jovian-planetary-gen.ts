import BasePlanetaryGen from './base-planetary-gen';
import Orbit from '../../../objects/orbit';
import {OrbitCategory, PlanetType, Rings, Zone} from 'stellar-nursery-shared';
import IPlanetCategoryGen from '../../../interfaces/i-planet-category-gen';
import PlanetCategoryWorker from '../../../objects/work/planet-category-worker';
import IPlanet from '../../../interfaces/i-planet';
import Planet from '../../../objects/planet';

export default class JovianPlanetaryGen extends BasePlanetaryGen implements IPlanetCategoryGen {
    constructor(min: number = 68, max: number = 100) {
        super();
        this._min = min;
        this._max = max;
    }

    getKey(): number {
        return OrbitCategory.Jovian;
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
                    if (this.random.between(1, 6) <= 5) {
                        type = PlanetType.Jovian;
                    } else {
                        type = PlanetType.Chthonian;
                    }
                    break;
                case Zone.InnerZone:
                    type = PlanetType.Jovian;
                    break;
                case Zone.OuterZone:
                    type = PlanetType.Jovian;
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
        const children = this.random.between(1, 6);
        if (this.random.between(1, 6) === 6) {
            if (this.random.between(1, 6) === 6) {
                planet.orbitStats.orbits.push(new Orbit<IPlanet>(new Planet(OrbitCategory.Helian)));
            } else {
                planet.orbitStats.orbits.push(new Orbit<IPlanet>(new Planet(OrbitCategory.Terrestrial)));
            }
        }
        while (planet.orbitStats.orbits.length < children) {
            planet.orbitStats.orbits.push(new Orbit<IPlanet>(new Planet(OrbitCategory.Dwarf)));
        }

        if (this.random.between(1, 6) >= 5) {
            planet.orbitStats.planetaryStats.rings = Rings.Complex;
        } else {
            planet.orbitStats.planetaryStats.rings = Rings.Minor;
        }

        return planet;
    }
}
