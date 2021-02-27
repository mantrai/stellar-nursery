import BasePlanetGen from './base-planet-gen';
import IPlanetGen from '../../interfaces/i-planet-gen';
import Orbit from '../../objects/orbit';
import PlanetTypeWorker from '../../objects/work/planet-type-worker';
import { Chemicals, PlanetType, Score } from 'stellar-nursery-shared';
import PlanetStats from '../../objects/planet-stats';
import IPlanet from '../../interfaces/i-planet';

export default class HebeanPlanetGen extends BasePlanetGen implements IPlanetGen {
    getKey(): number {
        return PlanetType.Hebean;
    }

    run(workObj: PlanetTypeWorker): Orbit<IPlanet> {
        const stats = new PlanetStats();

        stats.size = this.random.between(0, 5);
        stats.atmosphere = this.toValue(this.random.between(1, 6) + stats.size - 6, Score.n0, Score.nG);
        stats.atmosphere = stats.atmosphere >= 2 ? Score.nA : stats.atmosphere;
        stats.hydrosphere = this.toValue(this.random.between(2, 12) + stats.size - 11, Score.n0, Score.nG);
        stats.biosphere = Score.n0;
        stats.planetGroup = 'Dwarf';
        stats.planetClass = 'GeoTidal';
        if (this.random.between(1, 6) <= 3) {
            stats.planetType = 'Hebean';
            stats.description =
                'Named after Hebe, the Greek goddess of youth, these silicate-rich worlds are highly geologically active, but possess large regions of stability as well.  The atmosphere can vary in thickness, with standing water typical only for those larger-massed bodies that have a high level of activity and a resulting thick atmosphere.  The average age of the surface of these worlds is no more than a few million years old, much like active Terrestrial worlds.';
            stats.chemistry.push(Chemicals.Water);
            stats.chemistry.push(Chemicals.Silicate);
        } else {
            stats.planetType = 'Idunnian';
            stats.description =
                'Named after Idunn, the Norse goddess of youth, these carbon-rich worlds are highly geologically active, but possess large regions of stability as well.  The atmosphere can vary in thickness, with standing liquid ammonia typical only for those larger-massed bodies which have a high level of activity and thus thicker atmospheres.  The average age of the surface of these worlds is no more than a few million years old.  They are the carbon analogues to Hebean Type worlds.';
            stats.chemistry.push(Chemicals.Ammonia);
            stats.chemistry.push(Chemicals.Carbon);
        }

        workObj.planet.orbitStats.planetaryStats = stats;
        workObj.planet = this.response(workObj.planet, workObj.star, workObj.zone, workObj.age, workObj.parent);
        return workObj.planet;
    }
}
