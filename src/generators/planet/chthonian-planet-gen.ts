import BasePlanetGen from './base-planet-gen';
import IPlanetGen from '../../interfaces/i-planet-gen';
import Orbit from '../../objects/orbit';
import PlanetTypeWorker from '../../objects/work/planet-type-worker';
import {PlanetType, Score} from 'stellar-nursery-shared';
import PlanetStats from '../../objects/planet-stats';
import IPlanet from '../../interfaces/i-planet';

export default class ChthonianPlanetGen extends BasePlanetGen implements IPlanetGen {
    getKey(): number {
        return PlanetType.Chthonian;
    }

    run(workObj: PlanetTypeWorker): Orbit<IPlanet> {
        const stats = new PlanetStats();

        stats.size = Score.nG;
        stats.atmosphere = Score.n1;
        stats.hydrosphere = Score.n0;
        stats.biosphere = Score.n0;
        stats.planetGroup = 'Jovian';
        stats.planetClass = 'Chthonian';
        stats.planetType = '';
        stats.description =
            'These are Jovian worlds with masses ranging from 0.015 to 0.24 times that of Jupiter.  They are the exposed cores of Jovian worlds which have lost their gaseous envelopes through solar evaporation.  This typically occurs to older Jovians in tight solar orbits, or Jovians that have been greatly affected by the evolution of their primary sun.';

        workObj.planet.orbitStats.planetaryStats = stats;
        workObj.planet = this.response(workObj.planet, workObj.star, workObj.zone, workObj.age, workObj.techLevel, workObj.parent);
        return workObj.planet;
    }
}
