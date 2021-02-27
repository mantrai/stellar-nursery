import BasePlanetGen from './base-planet-gen';
import IPlanetGen from '../../interfaces/i-planet-gen';
import Orbit from '../../objects/orbit';
import PlanetTypeWorker from '../../objects/work/planet-type-worker';
import {Chemicals, PlanetType, Score, Zone} from 'stellar-nursery-shared';
import PlanetStats from '../../objects/planet-stats';
import IPlanet from '../../interfaces/i-planet';

export default class RockballPlanetGen extends BasePlanetGen implements IPlanetGen {
    getKey(): number {
        return PlanetType.Rockball;
    }

    run(workObj: PlanetTypeWorker): Orbit<IPlanet> {
        const stats = new PlanetStats();
        stats.size = this.random.between(0, 5);

        let roll =
            this.random.between(2, 12) +
            stats.size -
            11 +
            (workObj.star.spectralClass === 'L' ? 1 : 0) -
            (workObj.zone === Zone.Epistellar ? 2 : 0) +
            (workObj.zone === Zone.OuterZone ? 2 : 0);

        stats.atmosphere = Score.n0;
        stats.hydrosphere = this.toValue(roll, Score.n0, Score.nG);
        stats.biosphere = Score.n0;
        stats.planetGroup = 'Dwarf';
        stats.planetClass = 'GeoPassive';
        roll = this.random.between(1, 6);
        if (roll <= 2) {
            stats.planetType = 'Ferrinian';
            stats.description =
                'These are dormant worlds composed primarily of metals, and are most commonly found orbiting F-type and earlier suns, or in high metallicity systems.';
            stats.chemistry.push(Chemicals.Metals);
        } else if (roll <= 4) {
            stats.planetType = 'Lithic';
            stats.description =
                'These are dormant worlds composed largely of silicates.  They are common in all star systems.';
            stats.chemistry.push(Chemicals.Silicate);
        } else {
            stats.planetType = 'Carbonian';
            stats.description =
                'These are dormant worlds largely composed of carbon, carbides, or hydrocarbon compounds.';
            stats.chemistry.push(Chemicals.Carbon);
        }
        workObj.planet.orbitStats.planetaryStats = stats;
        workObj.planet = this.response(workObj.planet, workObj.star, workObj.zone, workObj.age, workObj.parent);
        return workObj.planet;
    }
}
