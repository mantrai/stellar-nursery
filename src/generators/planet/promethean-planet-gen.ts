import BasePlanetGen from './base-planet-gen';
import IPlanetGen from '../../interfaces/i-planet-gen';
import Orbit from '../../objects/orbit';
import PlanetTypeWorker from '../../objects/work/planet-type-worker';
import { Chemicals, PlanetType } from '../../types/enum';
import PlanetStats from '../../objects/planet-stats';
import { Score, Zone } from 'stellar-nursery-shared';
import IPlanet from '../../interfaces/i-planet';

export default class PrometheanPlanetGen extends BasePlanetGen implements IPlanetGen {
    getKey(): number {
        return PlanetType.Promethean;
    }

    hasWork(workObj: PlanetTypeWorker): boolean {
        return workObj.type === this.getKey();
    }

    run(workObj: PlanetTypeWorker): Orbit<IPlanet> {
        const stats = new PlanetStats();

        stats.size = this.random.between(5, 10);
        stats.hydrosphere = this.random.between(0, 10);

        const roll: number = this.prometheanChemicalRoll(workObj);

        let ageMod: number = 0;
        let chemical: number = 0;
        let classType: { pc: string; pt: string; pd: string };
        if (roll <= 4) {
            stats.chemistry.push(Chemicals.Water);
            chemical = 1;
            classType = {
                pc: 'GeoTidal',
                pt: 'Promethean',
                pd:
                    'These are Terrestrial worlds whose conditions support a continuous hydrological cycle with a global ocean that is tens of kilometers deep, many of which support advanced biospheres.  These are geologically active silicate worlds covered with a global ocean.  They are typically found around warm K to cool F-type suns.',
            };
        } else if (roll <= 6) {
            stats.chemistry.push(Chemicals.Ammonia);
            ageMod += 1;
            chemical = 2;
            classType = {
                pc: 'GeoTidal',
                pt: 'Burian',
                pd: 'These are geologically active worlds covered in global oceans of liquid ammonia.',
            };
        } else {
            stats.chemistry.push(Chemicals.Methane);
            ageMod += 3;
            chemical = 3;
            classType = {
                pc: 'GeoTidal',
                pt: 'Atlan',
                pd: 'These are geologically active worlds covered in global oceans of liquid methane.',
            };
        }

        stats.biosphere = Score.n0;
        if (workObj.age >= 4 + ageMod) {
            stats.biosphere =
                workObj.star.spectralClass === 'D' ? this.random.between(0, 9) : this.random.between(2, 12);
        } else if (workObj.age >= this.random.between(1, 3) + ageMod) {
            stats.biosphere = this.random.between(1, 3);
        }

        if (chemical === 1 && stats.biosphere >= Score.n3) {
            stats.atmosphere = this.toValue(this.prometheanAtmosphereRoll(stats.size, workObj), Score.n2, Score.n9);
        } else {
            stats.atmosphere = this.random.between(1, 3);
        }

        stats.planetGroup = 'Dwarf';
        stats.planetClass = classType.pc;
        stats.planetType = classType.pt;
        stats.description = classType.pd;

        workObj.planet.orbitStats.planetaryStats = stats;
        workObj.planet = this.response(workObj.planet, workObj.star, workObj.zone, workObj.age, workObj.parent);
        return workObj.planet;
    }

    private prometheanAtmosphereRoll(size: number, workObj: PlanetTypeWorker): number {
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

    private prometheanChemicalRoll(workObj: PlanetTypeWorker): number {
        return (
            this.random.between(1, 6) +
            (workObj.star.spectralClass === 'L' ? 2 : 0) -
            (workObj.zone === Zone.Epistellar ? 2 : 0) +
            (workObj.zone === Zone.OuterZone ? 2 : 0)
        );
    }
}
