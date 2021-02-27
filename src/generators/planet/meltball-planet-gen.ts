import BasePlanetGen from './base-planet-gen';
import IPlanetGen from '../../interfaces/i-planet-gen';
import Orbit from '../../objects/orbit';
import PlanetTypeWorker from '../../objects/work/planet-type-worker';
import { Chemicals, PlanetType, Score, Zone } from 'stellar-nursery-shared';
import PlanetStats from '../../objects/planet-stats';
import IPlanet from '../../interfaces/i-planet';

export default class MeltballPlanetGen extends BasePlanetGen implements IPlanetGen {
    getKey(): number {
        return PlanetType.Meltball;
    }

    run(workObj: PlanetTypeWorker): Orbit<IPlanet> {
        const stats = new PlanetStats();

        stats.size = this.random.between(0, 5);
        stats.atmosphere = Score.n1;
        stats.hydrosphere = Score.nF;
        stats.biosphere = Score.n0;

        let roll = this.random.between(1, 6);
        if (workObj.zone === Zone.Epistellar) {
            roll -= 2;
        }

        stats.planetGroup = 'Dwarf';
        if (roll <= 3) {
            stats.planetClass = 'GeoThermic';
            roll = this.random.between(1, 6);
            if (roll <= 2) {
                stats.planetType = 'Phaethonic';
                stats.description =
                    'These are metal-rich worlds which experience intense volcanism as they approach their parent sun at extreme epistellar distances.  While the planetary core may not be geologically active, the surface of the world itself is the driving force behind the intermittent geology as the crust continually melts and re-cools.  This Type is named after Phaethon of Greek mythology, who drove his solar chariot too close to the Earth, scorching it.';
                stats.chemistry.push(Chemicals.Metals);
            } else if (roll <= 4) {
                stats.planetType = 'Apollonian';
                stats.description =
                    'These are silicate-rich worlds which experience intense volcanism as they approach their parent sun at extreme epistellar distances.  While the planetary core may not be geologically active, the surface of the world itself is the driving force behind the intermittent geology as the crust continually melts and re-cools.';
                stats.chemistry.push(Chemicals.Silicate);
            } else {
                stats.planetType = 'Sethian';
                stats.description =
                    'These are carbon-rich worlds which experience intense hydrocarbon volcanism as they approach their parent sun at extreme epistellar distances.  While the planetary core may not be geologically active, the surface of the world itself is the driving force behind the intermittent geology as the crust continually melts and re-cools.  This Type is named after Seth of Egyptian mythology, who protected the sun god Ra during his nightly journey through the underworld.';
                stats.chemistry.push(Chemicals.Carbon);
            }
        } else {
            stats.planetClass = 'GeoTidal';
            roll = this.random.between(1, 6);
            if (roll <= 3) {
                stats.planetType = 'Hephaestian';
                stats.description =
                    'These are the most geologically active of planets, with surfaces that are almost entirely molten, and which change constantly.  The entire planetary map can be utterly changed within a period less than a year Standard.';
                stats.chemistry.push(Chemicals.Metals);
            } else {
                stats.planetType = 'Lokian';
                stats.description =
                    'These are the most active of carbon planets, with surfaces that are almost entirely molten, and a geology which changes on an almost yearly basis.  They are carbon-analogues to Hephaestian worlds.';
                stats.chemistry.push(Chemicals.Carbon);
            }
        }

        workObj.planet.orbitStats.planetaryStats = stats;
        workObj.planet = this.response(workObj.planet, workObj.star, workObj.zone, workObj.age, workObj.parent);
        return workObj.planet;
    }
}
