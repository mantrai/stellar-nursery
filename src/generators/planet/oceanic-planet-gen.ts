import BasePlanetGen from './base-planet-gen';
import IPlanetGen from '../../interfaces/i-planet-gen';
import Orbit from '../../objects/orbit';
import PlanetTypeWorker from '../../objects/work/planet-type-worker';
import {Chemicals, PlanetType, Score, Zone} from 'stellar-nursery-shared';
import PlanetStats from '../../objects/planet-stats';
import IPlanet from '../../interfaces/i-planet';

export default class OceanicPlanetGen extends BasePlanetGen implements IPlanetGen {
    getKey(): number {
        return PlanetType.Oceanic;
    }

    run(workObj: PlanetTypeWorker): Orbit<IPlanet> {
        const stats = new PlanetStats();

        stats.size = this.random.between(5, 10);
        stats.hydrosphere = Score.nB;

        let roll: number = this.oceanicChemicalRoll(workObj);

        let ageMod: number = 0;
        let chemical: number;
        let classType: { pc: string; pt: string; pd: string }[];
        if (roll <= 6) {
            stats.chemistry.push(Chemicals.Water);
            chemical = 1;
            classType = [
                {
                    pc: 'Oceanic',
                    pt: 'Pelagic',
                    pd:
                        'These are Terrestrial worlds whose conditions support a continuous hydrological cycle with a global ocean that is tens of kilometers deep, many of which support advanced biospheres.  These are geologically active silicate worlds covered with a global ocean.  They are typically found around warm K to cool F-type suns.',
                },
                {
                    pc: 'Tectonic',
                    pt: 'BathyGaian',
                    pd:
                        'These are Terrestrial worlds whose conditions support a continuous hydrological cycle, and quite often an accompanying biosphere.  The crust of these worlds are separated into thinner and heavier oceanic crust, and thicker and lighter raised continental crust.',
                },
            ];
        } else if (roll <= 8) {
            stats.chemistry.push(Chemicals.Ammonia);
            ageMod += 2;
            chemical = 2;
            classType = [
                {
                    pc: 'Oceanic',
                    pt: 'Nunnic',
                    pd: 'These are geologically active worlds covered in global oceans of liquid ammonia.',
                },
                {
                    pc: 'Tectonic',
                    pt: 'BathyAmunian',
                    pd:
                        "The atmospheres are very dense that retain large amounts of carbon monoxide and 'humid' with ammonia.  These worlds are capable of supporting liquid ammonia at higher temperatures because of the greater atmospheric pressure.  These atmospheres may contain significant amounts of volcanic and possibly sulfuric gases, depending on the inherent geological activity of the planet.  Large portions of the extant biomass will be located in the upper atmosphere, where it is cooler, as well as within the oceans and seas.  Such organisms are considered to be extremophiles by the standards of the rest of the planet.",
                },
            ];
        } else {
            stats.chemistry.push(Chemicals.Methane);
            ageMod += 3;
            chemical = 3;
            classType = [
                {
                    pc: 'Oceanic',
                    pt: 'Teathic',
                    pd: 'These are geologically active worlds covered in global oceans of liquid methane.',
                },
                {
                    pc: 'Tectonic',
                    pt: 'BathyTartarian',
                    pd:
                        'hey possess plate tectonics, a dynamic climate, and sometimes an advanced biosphere.  There are, however, differences in climate, hydrology, meteorology, and geology, all of which are significant.  They are colder than Gaian worlds, forming beyond the habitable zone of their sun, but still receive enough energy to melt methane, and their atmospheres tend to be dense and rich in nitrogen, with significant amounts of methane and hydrogen',
                },
            ];
        }

        stats.biosphere = Score.n0;
        if (workObj.age >= 4 + ageMod) {
            stats.biosphere =
                workObj.star.spectralClass === 'D' ? this.random.between(0, 9) : this.random.between(2, 12);
        } else if (workObj.age >= this.random.between(1, 3) + ageMod) {
            stats.biosphere = this.random.between(1, 3);
        }

        if (chemical === 1) {
            stats.atmosphere = this.toValue(this.oceanicAtmosphereRoll(stats.size, workObj), Score.n1, Score.nC);
        } else {
            roll = this.random.between(1, 6);
            if (roll <= 1) {
                stats.atmosphere = Score.n1;
            } else if (roll <= 4) {
                stats.atmosphere = Score.nA;
            } else {
                stats.atmosphere = Score.nC;
            }
        }

        roll = this.random.between(0, 1);
        stats.planetGroup = 'Terrestrial';
        stats.planetClass = classType[roll].pc;
        stats.planetType = classType[roll].pt;
        stats.description = classType[roll].pd;

        workObj.planet.orbitStats.planetaryStats = stats;
        workObj.planet = this.response(workObj.planet, workObj.star, workObj.zone, workObj.age, workObj.techLevel, workObj.parent);
        return workObj.planet;
    }

    private oceanicAtmosphereRoll(size: number, workObj: PlanetTypeWorker): number {
        return (
            this.random.between(1, 12) +
            size -
            6 -
            (workObj.star.spectralLuminosityClass === 'K-V' ? 1 : 0) -
            (workObj.star.spectralLuminosityClass === 'M-V' ? 2 : 0) -
            (workObj.star.spectralClass === 'L' ? 3 : 0) -
            (workObj.star.luminosityClass === 'IV' ? 1 : 0)
        );
    }

    private oceanicChemicalRoll(workObj: PlanetTypeWorker): number {
        return (
            this.random.between(1, 6) +
            (workObj.star.spectralLuminosityClass === 'K-V' ? 2 : 0) +
            (workObj.star.spectralLuminosityClass === 'M-V' ? 4 : 0) +
            (workObj.star.spectralClass === 'L' ? 5 : 0) +
            (workObj.zone === Zone.OuterZone ? 2 : 0)
        );
    }
}
