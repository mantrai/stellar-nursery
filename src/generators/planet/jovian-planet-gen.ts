import BasePlanetGen from "./base-planet-gen";
import IPlanetGen from "../../interfaces/i-planet-gen";
import {Chemicals, PlanetType} from "../../types/enum";
import Star from "../../objects/star";
import PlanetaryStats from "../../objects/planetary/planetary-stats";
import {Score, Zone} from "stellar-nursery-shared";
import Orbit from "../../objects/orbit";
import IPlanet from "../../interfaces/i-planet";
import PlanetTypeWorker from "../../objects/work/planet-type-worker";

export default class JovianPlanetGen extends BasePlanetGen implements IPlanetGen {
    getKey(): number {
        return PlanetType.Jovian;
    }

    hasWork(workObj: PlanetTypeWorker): boolean {
        return true;
    }

    run(workObj: PlanetTypeWorker): Orbit<IPlanet> {
        const stats = new PlanetaryStats();
        stats.size = Score.nG;
        stats.atmosphere = Score.nG;
        stats.hydrosphere = Score.nG;
        let roll:number = this.random.between(1, 6) ;
        roll += (workObj.zone === Zone.InnerZone) ? 2 : 0;

        stats.biosphere = Score.n0;
        if (roll > 5) {
            roll = this.random.between(1, 6);
            if (workObj.age >= 7) {
                stats.biosphere = this.random.between(2, 12);
                stats.biosphere -= (workObj.star.spectralClass === 'D') ? 3 : 0;
            } else if (workObj.age >= roll) {
                stats.biosphere = this.random.between(1, 3);
            }
        }


        stats.planetGroup = 'Jovian';
        if (stats.biosphere > Score.n0) {
            stats.planetClass = 'DwarfJovian';
            stats.planetType = 'Saturnian';
            stats.description = 'These are DwarfJovians which orbit beyond the snowline, and which possess dynamic atmospheres, though they are often obscured by methane and ammonia.';
        } else {
            stats.planetClass = 'SuperJovian';
            stats.planetType = 'SuperJovic';
            stats.description = 'These are SuperJovian worlds which orbit beyond the snowline, and which possess dynamic atmospheres.';
        }

        if (stats.biosphere > Score.n0) {
            roll = this.random.between(1, 6);
            roll += (workObj.star.spectralClass === 'L') ? 1 : 0;
            roll -= (workObj.zone === Zone.Epistellar) ? 2 : 0;
            roll += (workObj.zone === Zone.OuterZone) ? 2 : 0;
            if (roll <= 3) {
                stats.planetType = 'Brammian';
                stats.description = 'These are DwarfJovians which orbit within the snowline, and have large amounts of water within their atmospheres.  Of all the Jovians to be found in this orbital region, these are the most likely to develop atmospheric-based life, although it rarely evolves past simple microbial forms.';
                stats.chemistry.push(Chemicals.Water)
            } else {
                stats.planetType = 'Khonsonian';
                stats.description = 'These are DwarfJovians which orbit just outside of the snowline, and thus have a low instance of water within their atmospheres.  However, they are ammonia-rich, and their upper atmospheres are highly altered by the presence of ammonia-based life.';
                stats.chemistry.push(Chemicals.Ammonia)
            }
        }

        workObj.planet.orbitStats.planetaryStats = stats;
        workObj.planet = this.response(workObj.planet, workObj.star, workObj.zone, workObj.age, workObj.planet);
        return workObj.planet;
    }
}
