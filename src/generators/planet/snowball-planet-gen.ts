import BasePlanetGen from './base-planet-gen';
import IPlanetGen from '../../interfaces/i-planet-gen';
import Orbit from '../../objects/orbit';
import PlanetTypeWorker from '../../objects/work/planet-type-worker';
import {Chemicals, PlanetType} from '../../types/enum';
import PlanetStats from '../../objects/planet-stats';
import {Score, Zone} from 'stellar-nursery-shared';
import IPlanet from '../../interfaces/i-planet';

export default class SnowballPlanetGen extends BasePlanetGen implements IPlanetGen {
    getKey(): number {
        return PlanetType.Snowball;
    }

    run(workObj: PlanetTypeWorker): Orbit<IPlanet> {
        const stats = new PlanetStats();
        stats.size = this.random.between(0, 5);
        stats.atmosphere = this.random.between(1, 6) <= 4 ? Score.n0 : Score.n1;
        stats.hydrosphere = this.random.between(1, 6) <= 3 ? Score.nA : this.random.between(0, 10);

        const roll =
            this.random.between(1, 6) +
            (workObj.star.spectralClass === 'L' ? 2 : 0) +
            (workObj.zone === Zone.OuterZone ? 2 : 0);

        let ageMod = 0;
        if (roll <= 4) {
            stats.chemistry.push(Chemicals.Water);
        } else if (roll <= 6) {
            stats.chemistry.push(Chemicals.Ammonia);
            ageMod += 1;
        } else {
            stats.chemistry.push(Chemicals.Methane);
            ageMod += 3;
        }

        stats.biosphere = 0;
        if (stats.hydrosphere < Score.nA && workObj.age >= 6 + ageMod) {
            stats.biosphere = this.toValue(this.random.between(1, 6) - 3, Score.n0, Score.nG);
        } else if (stats.hydrosphere < Score.nA && workObj.age >= this.random.between(1, 6)) {
            stats.biosphere = this.toValue(this.random.between(1, 6) + stats.size - 2, Score.n0, Score.nG);
        }

        stats.planetGroup = 'Dwarf';
        const planetType = this.random.between(1, 6) + (workObj.parent !== undefined ? 2 : 0);

        if (planetType <= 3) {
            stats.planetClass = 'GeoPassive';
            stats.planetType = 'Gelidian';
            stats.description = 'These are dormant worlds largely composed of ices, and are found beyond the snowline.';
        } else if (planetType <= 5) {
            stats.planetClass = 'GeoThermic';
            stats.planetType = 'Erisian';
            stats.description =
                'These are icy worlds which experience cryo-volcanism or crustal evaporation as they move in their elliptical orbit to within the snowline.';
        } else {
            stats.planetClass = 'GeoTidal';
            stats.planetType = 'Plutonian';
            stats.description =
                'These are tidally stretched icy worlds which exhibit varying degrees of cryo-volcanic and other forms of geological activity.  They exist in the outer regions of solar systems, typically as moons to Jovian worlds, although independent bodies may arise as well..';
        }

        workObj.planet.orbitStats.planetaryStats = stats;
        workObj.planet = this.response(workObj.planet, workObj.star, workObj.zone, workObj.age, workObj.parent);
        return workObj.planet;
    }
}
