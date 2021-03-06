import BasePlanetGen from './base-planet-gen';
import IPlanetGen from '../../interfaces/i-planet-gen';
import {PlanetType, Score} from 'stellar-nursery-shared';
import PlanetStats from '../../objects/planet-stats';
import Orbit from '../../objects/orbit';
import IPlanet from '../../interfaces/i-planet';
import PlanetTypeWorker from '../../objects/work/planet-type-worker';

export default class AcheronianPlanetGen extends BasePlanetGen implements IPlanetGen {
    getKey(): number {
        return PlanetType.Acheronian;
    }

    run(workObj: PlanetTypeWorker): Orbit<IPlanet> {
        const stats = new PlanetStats();

        stats.size = this.random.between(5, 10);
        stats.atmosphere = Score.n1;
        stats.hydrosphere = Score.n0;
        stats.biosphere = Score.n0;
        stats.planetGroup = 'Terrestrial';
        stats.planetClass = 'Telluric';
        stats.planetType = 'Acheronian';
        stats.description =
            "These are worlds that were directly affected by their primary's transition from the main sequence; the atmosphere and oceans have been boiled away, leaving a scorched, dead planet.\n";

        workObj.planet.orbitStats.planetaryStats = stats;
        workObj.planet = this.response(workObj.planet, workObj.star, workObj.zone, workObj.age, workObj.techLevel, workObj.parent);
        return workObj.planet;
    }
}
