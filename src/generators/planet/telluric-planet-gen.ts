import BasePlanetGen from './base-planet-gen';
import IPlanetGen from '../../interfaces/i-planet-gen';
import Orbit from '../../objects/orbit';
import PlanetTypeWorker from '../../objects/work/planet-type-worker';
import {PlanetType} from '../../types/enum';
import PlanetStats from '../../objects/planet-stats';
import {Score} from 'stellar-nursery-shared';
import IPlanet from '../../interfaces/i-planet';

export default class TelluricPlanetGen extends BasePlanetGen implements IPlanetGen {
    getKey(): number {
        return PlanetType.Telluric;
    }

    run(workObj: PlanetTypeWorker): Orbit<IPlanet> {
        const stats = new PlanetStats();

        stats.size = this.random.between(5, 10);
        stats.atmosphere = Score.nC;
        if (this.random.between(1, 6) <= 4) {
            stats.hydrosphere = Score.n0;
            stats.planetType = 'Cytherean';
            stats.description =
                'These are the archetypical Telluric worlds, their trademark thick atmospheres having been formed by unrelenting geological activity and the buildup of major greenhouse gases over hundreds of millions of years.  While these worlds may form with an appreciable amount of water, the formation of this hothouse environment will eventually cause it all to evaporate and breakdown into its component atoms.  Tectonic activity, which may have been in the formative stages, ceases, but the associated geology continues unabated.  Eventually the build up of gases produces the incredibly dense atmosphere, while the volcanism thickens the crust, until a point is reached when volcanism may actually become rare.  However, a buildup of subsurface pressure is inevitable, and every few hundred million years the surface literally melts as the molten mantle boils up.  Once this pressure has been globally released, the process of thickening the crust begins once more.';
        } else {
            stats.hydrosphere = Score.nF;
            stats.planetType = 'Phosphorian';
            stats.description =
                'These are the most extreme of Telluric worlds.  They form much closer to their sun than other Telluric worlds, and have correspondingly higher temperatures.  Because of the extreme solar heat, there is little to no cloud cover, although the atmospheres remain quite dense.';
        }

        stats.biosphere = Score.n0;
        stats.planetGroup = 'Terrestrial';
        stats.planetClass = 'Telluric';
        workObj.planet.orbitStats.planetaryStats = stats;
        workObj.planet = this.response(workObj.planet, workObj.star, workObj.zone, workObj.age, workObj.parent);
        return workObj.planet;
    }
}
