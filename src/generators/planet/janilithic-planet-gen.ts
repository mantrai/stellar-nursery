import BasePlanetGen from './base-planet-gen';
import IPlanetGen from '../../interfaces/i-planet-gen';
import Orbit from '../../objects/orbit';
import PlanetTypeWorker from '../../objects/work/planet-type-worker';
import {PlanetType, Score} from 'stellar-nursery-shared';
import PlanetStats from '../../objects/planet-stats';
import IPlanet from '../../interfaces/i-planet';

export default class JanilithicPlanetGen extends BasePlanetGen implements IPlanetGen {
    getKey(): number {
        return PlanetType.Janilithic;
    }

    run(workObj: PlanetTypeWorker): Orbit<IPlanet> {
        const stats = new PlanetStats();

        stats.size = this.random.between(5, 10);
        stats.atmosphere = this.random.between(1, 6) >= 4 ? Score.nA : Score.n1;
        stats.hydrosphere = Score.n0;
        stats.biosphere = Score.n0;
        stats.planetGroup = 'Terrestrial';
        stats.planetClass = 'Epistellar';
        stats.planetType = 'Janilithic';
        stats.description =
            'These are rocky, dry, geologically active worlds with greatly varying degrees of geological activity.  As such, their atmospheres are also quite varied, but typically are primarily composed of carbon dioxide.';

        workObj.planet.orbitStats.planetaryStats = stats;
        workObj.planet = this.response(workObj.planet, workObj.star, workObj.zone, workObj.age, workObj.parent);
        return workObj.planet;
    }
}
