import Orbit from '../../../objects/orbit';
import { Zone } from 'stellar-nursery-shared';
import BasePlanetaryGen from './base-planetary-gen';
import Terrestrial from '../../../objects/planetary/terrestrial';
import { PlanetaryCategory, PlanetType } from '../../../types/enum';
import IPlanetCategoryGen from '../../../interfaces/i-planet-category-gen';
import PlanetCategoryWorker from '../../../objects/work/planet-category-worker';

export default class TerrestrialPlanetaryGen extends BasePlanetaryGen implements IPlanetCategoryGen {
    constructor(min: number = 36, max: number = 52) {
        super();
        this._min = min;
        this._max = max;
    }

    getKey(): string {
        return PlanetaryCategory.Terrestrial;
    }

    hasWork(workObj: PlanetCategoryWorker): boolean {
        return this.between(workObj.roll, this._min, this._max);
    }

    run(workObj: PlanetCategoryWorker): Orbit<any> | false {
        const planet = new Orbit<Terrestrial>(new Terrestrial());
        let type: number = -1;
        switch (workObj.zone) {
            case Zone.Epistellar:
                type = this.generateEpistellar(this.random.between(1, 6));
                break;
            case Zone.InnerZone:
                type = this.generateInner(this.random.between(2, 12));
                break;
            case Zone.OuterZone:
                type = this.generateOuter(this.random.between(1, 6), workObj.parent);
                break;
        }

        return this.response(planet, workObj.star, workObj.zone, workObj.age, type, workObj.parent) as
            | Orbit<Terrestrial>
            | false;
    }

    generateEpistellar(roll: number): number {
        let output: number;
        if (roll <= 4) {
            output = PlanetType.JaniLithic;
        } else if (roll <= 5) {
            output = PlanetType.Vesperian;
        } else {
            output = PlanetType.Telluric;
        }
        return output;
    }

    generateInner(roll: number): number {
        let output: number;
        if (roll <= 4) {
            output = PlanetType.Telluric;
        } else if (roll <= 6) {
            output = PlanetType.Arid;
        } else if (roll <= 7) {
            output = PlanetType.Tectonic;
        } else if (roll <= 9) {
            output = PlanetType.Oceanic;
        } else if (roll <= 10) {
            output = PlanetType.Tectonic;
        } else {
            output = PlanetType.Telluric;
        }
        return output;
    }

    generateOuter(roll: number, parent?: Orbit<any>): number {
        let output: number;
        if (parent !== undefined) {
            roll += 2;
        }
        if (roll <= 4) {
            output = PlanetType.Arid;
        } else if (roll <= 6) {
            output = PlanetType.Tectonic;
        } else {
            output = PlanetType.Telluric;
        }
        return output;
    }
}
