import BasePlanetGen from './base-planet-gen';
import IPlanetGen from '../../interfaces/i-planet-gen';
import Orbit from '../../objects/orbit';
import PlanetTypeWorker from '../../objects/work/planet-type-worker';
import { PlanetType } from '../../types/enum';
import PlanetStats from '../../objects/planet-stats';
import { Score } from 'stellar-nursery-shared';
import IPlanet from '../../interfaces/i-planet';

export default class StygianPlanetGen extends BasePlanetGen implements IPlanetGen {
    getKey(): number {
        return PlanetType.Stygian;
    }

    run(workObj: PlanetTypeWorker): Orbit<IPlanet> {
        const stats = new PlanetStats();

        stats.size = this.random.between(0, 6);
        stats.atmosphere = Score.n0;
        stats.hydrosphere = Score.n0;
        stats.biosphere = Score.n0;
        stats.planetGroup = 'Dwarf';
        stats.planetClass = 'GeoPassive';
        stats.planetType = 'Stygian';
        stats.description =
            "These are Dwarf Terrestrial worlds which have survived the movement of their primary sun off of the main sequence, and its subsequent evolution towards a stellar corpse.  The surfaces of these bodies show ample evidence of transformation due to the primary's stellar evolution.";

        workObj.planet.orbitStats.planetaryStats = stats;
        workObj.planet = this.response(workObj.planet, workObj.star, workObj.zone, workObj.age, workObj.parent);
        return workObj.planet;
    }
}
