import BasePlanetGen from './base-planet-gen';
import IPlanetGen from '../../interfaces/i-planet-gen';
import {Chemicals, PlanetType} from '../../types/enum';
import PlanetStats from '../../objects/planet-stats';
import {Score, Zone} from 'stellar-nursery-shared';
import Orbit from '../../objects/orbit';
import IPlanet from '../../interfaces/i-planet';
import PlanetTypeWorker from '../../objects/work/planet-type-worker';

export default class AreanPlanetGen extends BasePlanetGen implements IPlanetGen {
    getKey(): number {
        return PlanetType.Arean;
    }

    run(workObj: PlanetTypeWorker): Orbit<IPlanet> {
        const stats = new PlanetStats();

        stats.size = this.random.between(0, 5);

        let roll = this.random.between(1, 6);
        roll -= workObj.star.spectralClass === 'D' ? 2 : 0;
        if (roll <= 3) {
            stats.atmosphere = Score.n1;
        } else {
            stats.atmosphere = Score.nA;
        }

        roll = this.random.between(2, 12);
        roll += stats.size;
        roll -= 7;
        roll -= stats.atmosphere === Score.n1 ? 4 : 0;
        stats.hydrosphere = this.toValue(roll, Score.n0, Score.nG);

        roll = this.random.between(1, 6);
        roll += workObj.zone === Zone.OuterZone ? 2 : 0;
        roll += workObj.star.spectralClass === 'L' ? 2 : 0;

        let ageMod = 0;
        if (roll <= 4) {
            stats.chemistry.push(Chemicals.Water);
            stats.planetType = 'Arean';
            stats.description =
                'These are silicate-rich worlds which typically have relatively quiescent category cores.  Their atmospheres range from thick and volatile-laden to almost vanishingly thin.  In their youth they may have begun a system of plate tectonics, but the lack of a permanent presence of liquid water on the surface quickly arrested that, leaving the surface barren.  The slow build up of geological energy, however, will eventually lead to much more clement conditions, and may harbor the development of simple life, or even more complex forms if there is enough time.  This movement from cold and dry to warm and wet conditions is called a Sisyphean Cycle, and can conceivably be maintained for billions of years.';
        } else if (roll <= 6) {
            stats.chemistry.push(Chemicals.Ammonia);
            stats.planetType = 'Utgardian';
            stats.description =
                'These are carbon-rich worlds which have relatively quiescent cores and surfaces rich with ammonia.  Their atmospheres range from thick to only moderately so, never becoming exceedingly thin due to the distances of such worlds from their primary sun, and the ease which cold temperatures retain atmospheric gases.  The slow build up of geological activity brings these worlds from relatively dry conditions to a state where the surface is marked with liquid ammonia seas, rivers, and possibly even ammonia-based life.  This Ragnarokian Cycle alternates over tens of millions of years, sometimes hundreds of millions, and it could indeed last for billions of years.';
            ageMod += 1;
        } else {
            stats.chemistry.push(Chemicals.Methane);
            stats.planetType = 'Titanian';
            stats.description =
                'These are carbon-rich worlds which have relatively quiescent cores and surfaces rich with methane.  Their atmospheres, because it is so cold and the gases so easily retained in their distant orbital positions, are almost always thick with methane and hydrocarbons.  A greenhouse effect caused by methane is present, but largely negligible due to the distance from the parent sun.  Over time, and because of the lack of heavy geological activity, the atmosphere may slowly diminish, turning the world into a frozen body over the course of several billion years.  Only renewed activity will reform the greenhouse environment, and the seas will again thaw.  This Titanomalchian Cycle alternates over tens of millions of years, sometimes hundreds of millions, and it could indeed last for billions of years.';
            ageMod += 3;
        }

        stats.biosphere = Score.n0;
        if (stats.atmosphere === Score.nA) {
            if (workObj.age >= 4 + ageMod) {
                stats.biosphere = this.toValue(this.random.between(1, 6) + stats.size - 2, Score.n0, Score.nG);
            } else if (workObj.age >= this.random.between(1, 3) + ageMod) {
                stats.biosphere = this.random.between(1, 3);
            }
        } else {
            if (workObj.age >= this.random.between(1, 3) + ageMod) {
                stats.biosphere = this.toValue(this.random.between(1, 6) - 4, Score.n0, Score.nG);
            }
        }

        stats.planetGroup = 'Dwarf';
        stats.planetClass = 'GeoCyclic';

        workObj.planet.orbitStats.planetaryStats = stats;
        workObj.planet = this.response(workObj.planet, workObj.star, workObj.zone, workObj.age, workObj.parent);
        return workObj.planet;
    }
}
