import BasePlanetGen from './base-planet-gen';
import IPlanetGen from '../../interfaces/i-planet-gen';
import {PlanetType} from '../../types/enum';
import PlanetStats from '../../objects/planet-stats';
import {Score} from 'stellar-nursery-shared';
import Orbit from '../../objects/orbit';
import IPlanet from '../../interfaces/i-planet';
import PlanetTypeWorker from '../../objects/work/planet-type-worker';

export default class HelianPlanetGen extends BasePlanetGen implements IPlanetGen {
    getKey(): number {
        return PlanetType.Helian;
    }

    run(workObj: PlanetTypeWorker): Orbit<IPlanet> {
        const stats = new PlanetStats();
        stats.size = this.random.between(10, 15);
        stats.atmosphere = Score.nD;
        const roll = this.random.between(1, 6);
        if (roll <= 2) {
            stats.hydrosphere = Score.n0;
        } else if (roll <= 4) {
            stats.hydrosphere = this.random.between(0, 11);
        } else {
            stats.hydrosphere = Score.nF;
        }
        stats.biosphere = Score.n0;
        stats.planetGroup = 'Helian';
        stats.planetClass = stats.hydrosphere >= Score.n9 ? 'GeoHelian' : 'Nebulous';
        stats.planetType = '';
        if (stats.hydrosphere >= Score.n9) {
            stats.description =
                'These are Helian worlds with masses ranging from 3 to 15 times that of Earth, and which lack a layer of liquid or super-condensed volatiles, having either expended them long ago, or never having had them to begin with.  Older, more stable regions may be heavily cratered, but much of the surface of these worlds tends to be geologically young.';
            stats.planetClass = 'GeoHelian';
        } else {
            stats.description =
                'These are Helian worlds with masses ranging from 3 to 15 times that of Earth.  Their atmospheres are extremely dense and support a layer of super-condensed volatiles.';
            stats.planetClass = 'Nebulous';
        }

        workObj.planet.orbitStats.planetaryStats = stats;
        workObj.planet = this.response(workObj.planet, workObj.star, workObj.zone, workObj.age, workObj.parent);
        return workObj.planet;
    }
}
