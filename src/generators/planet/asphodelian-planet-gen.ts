import BasePlanetGen from "./base-planet-gen";
import IPlanetGen from "../../interfaces/i-planet-gen";
import {PlanetType} from "../../types/enum";
import PlanetaryStats from "../../objects/planetary/planetary-stats";
import {Score} from "stellar-nursery-shared";
import Orbit from "../../objects/orbit";
import IPlanet from "../../interfaces/i-planet";
import PlanetTypeWorker from "../../objects/work/planet-type-worker";

export default class AsphodelianPlanetGen extends BasePlanetGen implements IPlanetGen {
    getKey(): number {
        return PlanetType.Asphodelian;
    }

    hasWork(workObj: PlanetTypeWorker): boolean {
        return true;
    }

    run(workObj: PlanetTypeWorker): Orbit<IPlanet> {
        const stats = new PlanetaryStats();

        stats.size = this.random.between(10, 15);
        stats.atmosphere = Score.n1;
        stats.hydrosphere = Score.n0;
        stats.biosphere = Score.n0;
        stats.planetGroup = 'Helian';
        stats.planetClass = 'GeoHelian';
        stats.planetType = 'Asphodelian';
        stats.description = 'These are worlds that were directly affected by their primary\'s transition from the main sequence; their atmosphere has been boiled away, leaving the surface exposed.';

        workObj.planet.orbitStats.planetaryStats = stats;
        workObj.planet = this.response(workObj.planet, workObj.star, workObj.zone, workObj.age, workObj.planet);
        return workObj.planet;
    }
}
