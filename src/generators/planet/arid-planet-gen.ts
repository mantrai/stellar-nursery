import BasePlanetGen from './base-planet-gen';
import IPlanetGen from '../../interfaces/i-planet-gen';
import { Chemicals, PlanetType } from '../../types/enum';
import PlanetStats from '../../objects/planet-stats';
import { Score, Zone } from 'stellar-nursery-shared';
import Orbit from '../../objects/orbit';
import IPlanet from '../../interfaces/i-planet';
import PlanetTypeWorker from '../../objects/work/planet-type-worker';

export default class AridPlanetGen extends BasePlanetGen implements IPlanetGen {
    getKey(): number {
        return PlanetType.Arid;
    }

    hasWork(workObj: PlanetTypeWorker): boolean {
        return true;
    }

    run(workObj: PlanetTypeWorker): Orbit<IPlanet> {
        const stats = new PlanetStats();

        stats.size = this.random.between(1, 6) + 4;

        let roll = this.random.between(1, 6);
        roll += workObj.star.spectralLuminosityClass === 'K-V' ? 2 : 0;
        roll += workObj.star.spectralLuminosityClass === 'M-V' ? 4 : 0;
        roll += workObj.star.spectralClass === 'L' ? 5 : 0;
        roll += workObj.zone === Zone.OuterZone ? 2 : 0;

        let ageMod = 0;
        let water = false;
        if (roll <= 6) {
            stats.chemistry.push(Chemicals.Water);
            stats.planetType = 'Darwinian';
            stats.description =
                "These are Arid worlds with less than 30% surface water coverage, and lacking any kind of plate tectonics. Most of the planet's water is locked up within its biomass, which aids in maintaining global habitability.";
            water = true;
        } else if (roll <= 8) {
            stats.chemistry.push(Chemicals.Ammonia);
            stats.planetType = 'Saganian';
            stats.description =
                "These are ammonia equivalents of Darwinian worlds, the planet's water being mixed with liquid ammonia, the biomass fully adapted and dependent on its presence.";
            ageMod += 1;
        } else {
            stats.chemistry.push(Chemicals.Methane);
            stats.planetType = 'Asimovian';
            stats.description =
                "These are methane equivalents of Darwinian worlds, the planet's water being mixed with liquid methane, the biomass fully adapted and dependent on its presence.  These worlds are found around the dimmer M-type dwarf stars..";
            ageMod += 3;
        }

        stats.hydrosphere = this.random.between(1, 3);
        if (workObj.age >= 4 + ageMod) {
            stats.biosphere = this.random.between(2, 12);
        } else if (workObj.age >= this.random.between(1, 3) + ageMod) {
            stats.biosphere = this.random.between(1, 3);
        } else {
            stats.biosphere = Score.n0;
        }

        stats.atmosphere = Score.nA;
        if (stats.biosphere >= Score.n3 && water) {
            stats.atmosphere = this.toValue(this.random.between(2, 12) + stats.size - 7, Score.n2, Score.n9);
        }

        stats.planetGroup = 'Terrestrial';
        stats.planetClass = 'Arid';

        workObj.planet.orbitStats.planetaryStats = stats;
        workObj.planet = this.response(workObj.planet, workObj.star, workObj.zone, workObj.age, workObj.planet);
        return workObj.planet;
    }
}
