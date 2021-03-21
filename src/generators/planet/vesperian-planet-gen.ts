import BasePlanetGen from './base-planet-gen';
import IPlanetGen from '../../interfaces/i-planet-gen';
import Orbit from '../../objects/orbit';
import PlanetTypeWorker from '../../objects/work/planet-type-worker';
import {Chemicals, PlanetType, Score} from 'stellar-nursery-shared';
import PlanetStats from '../../objects/planet-stats';
import IPlanet from '../../interfaces/i-planet';

export default class VesperianPlanetGen extends BasePlanetGen implements IPlanetGen {
    getKey(): number {
        return PlanetType.Vesperian;
    }

    run(workObj: PlanetTypeWorker): Orbit<IPlanet> {
        const stats = new PlanetStats();
        stats.size = this.random.between(5, 10);

        const roll = this.random.between(2, 12);

        let chem: string;
        if (roll <= 11) {
            stats.chemistry.push(Chemicals.Water);
            chem = Chemicals.Water;
        } else {
            stats.chemistry.push(Chemicals.Chlorine);
            chem = Chemicals.Chlorine;
        }

        stats.biosphere = 0;
        if (workObj.age >= 4) {
            stats.biosphere = this.random.between(1, 3);
        } else if (workObj.age >= this.random.between(1, 3)) {
            stats.biosphere = this.random.between(2, 12);
        }

        stats.atmosphere = Score.nA;
        if (stats.biosphere >= Score.n3 && chem === Chemicals.Water) {
            stats.atmosphere = this.toValue(this.random.between(2, 12) + stats.size - 7, Score.n2, Score.n9);
        } else if (stats.biosphere >= Score.n3 && chem === Chemicals.Chlorine) {
            stats.atmosphere = Score.nB;
        }
        stats.hydrosphere = this.random.between(0, 10);
        stats.planetGroup = 'Dwarf';
        stats.planetClass = 'Epistellar';
        stats.planetType = 'Vesperian';
        stats.description =
            'These are silicate worlds with continuous geological activity which may be plate tectonics, or a similar mechanism.  Because of their proximity to cooler late k-type or M-type stars, they have temperatures suitable for the development of life.  And while a large number of circumstances must be met for these worlds to be life bearing, circumstances which are rare, the sheer number of stars which can host these worlds makes the presence of Vesperian planets only slightly less common than Gaian worlds.';

        workObj.planet.orbitStats.planetaryStats = stats;
        workObj.planet = this.response(workObj.planet, workObj.star, workObj.zone, workObj.age, workObj.techLevel, workObj.parent);
        return workObj.planet;
    }
}
