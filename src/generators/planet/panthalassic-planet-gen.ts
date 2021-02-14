import BasePlanetGen from './base-planet-gen';
import IPlanetGen from '../../interfaces/i-planet-gen';
import { Chemicals, PlanetType } from '../../types/enum';
import PlanetaryStats from '../../objects/planetary/planetary-stats';
import { Score } from 'stellar-nursery-shared';
import Orbit from '../../objects/orbit';
import IPlanet from '../../interfaces/i-planet';
import PlanetTypeWorker from '../../objects/work/planet-type-worker';

export default class PanthalassicPlanetGen extends BasePlanetGen implements IPlanetGen {
    getKey(): number {
        return PlanetType.Panthalassic;
    }

    hasWork(workObj: PlanetTypeWorker): boolean {
        return true;
    }

    run(workObj: PlanetTypeWorker): Orbit<IPlanet> {
        const stats = new PlanetaryStats();
        stats.size = this.random.between(10, 15);
        stats.atmosphere = this.random.between(9, 13);
        stats.hydrosphere = Score.nB;

        let roll = this.random.between(1, 6);
        roll += workObj.star.spectralLuminosityClass === 'K-V' ? 2 : 0;
        roll += workObj.star.spectralLuminosityClass === 'M-V' ? 4 : 0;
        roll += workObj.star.spectralClass === 'L' ? 5 : 0;

        let ageMod = 0;
        if (roll <= 6) {
            roll = this.random.between(2, 12);
            if (roll <= 8) {
                stats.chemistry.push(Chemicals.Water);
            } else if (roll <= 11) {
                stats.chemistry.push(Chemicals.Sulfur);
            } else {
                stats.chemistry.push(Chemicals.Chlorine);
            }
        } else if (roll <= 8) {
            stats.chemistry.push(Chemicals.Methane);
            ageMod += 1;
        } else {
            stats.chemistry.push(Chemicals.Methane);
            ageMod += 3;
        }

        stats.biosphere = Score.n0;
        if (workObj.age >= 4 + ageMod) {
            stats.biosphere = this.random.between(2, 12);
        } else if (workObj.age >= this.random.between(1, 3) + ageMod) {
            stats.biosphere = this.random.between(1, 3);
        }

        stats.planetGroup = 'Helian';
        stats.planetClass = 'Panthalassic';
        stats.planetType = '';
        stats.description =
            "These are Helian worlds with masses ranging from 3 to 13 times that of Earth.  They are actually best described as aborted gas giants, having initially begun their formation beyond their solar system's snowline.  However, tidal dragging caused by interactions with the accretion disk caused them to migrate inward of the snowline, where their growth was slowed or halted due to the sudden lack of abundant icy materials (which swiftly feed the growth of Jovian worlds).  However, being composed of largely icy materials, they develop tremendously deep oceanic surfaces and thick atmospheres of water, hydrogen, and oxygen.";

        workObj.planet.orbitStats.planetaryStats = stats;
        workObj.planet = this.response(workObj.planet, workObj.star, workObj.zone, workObj.age, workObj.planet);
        return workObj.planet;
    }
}
