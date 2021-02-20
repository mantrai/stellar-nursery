import BasePlanetaryGen from './base-planetary-gen';
import Orbit from '../../../objects/orbit';
import { Zone } from 'stellar-nursery-shared';
import { OrbitCategory, PlanetType } from '../../../types/enum';
import IPlanetCategoryGen from '../../../interfaces/i-planet-category-gen';
import PlanetCategoryWorker from '../../../objects/work/planet-category-worker';
import IPlanet from '../../../interfaces/i-planet';
import Planet from '../../../objects/planet';

export default class JovianPlanetaryGen extends BasePlanetaryGen implements IPlanetCategoryGen {
    constructor(min: number = 68, max: number = 100) {
        super();
        this._min = min;
        this._max = max;
    }

    getKey(): number {
        return OrbitCategory.Jovian;
    }

    hasWork(workObj: PlanetCategoryWorker): boolean {
        return this.between(workObj.roll, this._min, this._max);
    }

    run(workObj: PlanetCategoryWorker): Orbit<any> {
        const planet = new Orbit<IPlanet>(new Planet(this.getKey()));
        let type: number = -1;
        switch (workObj.zone) {
            case Zone.Epistellar:
                if (this.random.between(1, 6) <= 5) {
                    type = PlanetType.Jovian;
                } else {
                    type = PlanetType.Chthonian;
                }
                break;
            case Zone.InnerZone:
                type = PlanetType.Jovian;
                break;
            case Zone.OuterZone:
                type = PlanetType.Jovian;
                break;
        }

        return this.response(planet, workObj.star, workObj.zone, workObj.age, type, workObj.parent) as Orbit<IPlanet>;
    }
}
