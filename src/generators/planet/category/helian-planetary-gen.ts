import BasePlanetaryGen from "./base-planetary-gen";
import Orbit from "../../../objects/orbit";
import Helian from "../../../objects/planetary/helian";
import {Zone} from "stellar-nursery-shared";
import {PlanetaryCategory, PlanetType} from "../../../types/enum";
import IPlanetCategoryGen from "../../../interfaces/i-planet-category-gen";
import PlanetCategoryWorker from "../../../objects/work/planet-category-worker";

export default class HelianPlanetaryGen extends BasePlanetaryGen implements IPlanetCategoryGen {
    constructor(min: number = 52, max: number = 68) {
        super();
        this._min = min;
        this._max = max;
    }

    getKey(): string {
        return PlanetaryCategory.Helian;
    }

    hasWork(workObj: PlanetCategoryWorker): boolean {
        return this.between(workObj.roll, this._min, this._max);
    }

    run(workObj: PlanetCategoryWorker): Orbit<any> | false {
        const planet = new Orbit<Helian>(new Helian());
        let type: number = -1;
        switch (workObj.zone) {
            case Zone.Epistellar:
                if (this.random.between(1, 6) <= 5) {
                    type = PlanetType.Helian;
                } else {
                    type = PlanetType.Asphodelian;
                }
                break;
            case Zone.InnerZone:
                if (this.random.between(1, 6) <= 4) {
                    type = PlanetType.Helian;
                } else {
                    type = PlanetType.Panthalassic;
                }
                break;
            case Zone.OuterZone:
                type = PlanetType.Helian;
                break;
        }

        return this.response(planet, workObj.star, workObj.zone, workObj.age, type, workObj.parent) as Orbit<Helian> | false;
    }
}
