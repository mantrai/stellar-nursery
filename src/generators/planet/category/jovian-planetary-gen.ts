import BasePlanetaryGen from "./base-planetary-gen";
import IOrbitGen from "../../../interfaces/i-orbit-gen";
import Star from "../../../objects/star";
import Orbit from "../../../objects/orbit";
import {Zone} from "stellar-nursery-shared";
import {PlanetaryCategory, PlanetType} from "../../../types/enum";
import Jovian from "../../../objects/planetary/jovian";
import IPlanetCategoryGen from "../../../interfaces/i-planet-category-gen";
import PlanetCategoryWorker from "../../../objects/work/planet-category-worker";

export default class JovianPlanetaryGen extends BasePlanetaryGen implements IPlanetCategoryGen {
    constructor(min: number = 68, max: number = 100) {
        super();
        this._min = min;
        this._max = max;
    }


    getKey(): string {
        return PlanetaryCategory.Jovian;
    }

    hasWork(workObj: PlanetCategoryWorker): boolean {
        return this.between(workObj.roll, this._min, this._max);
    }

    run(workObj: PlanetCategoryWorker): Orbit<any> | false {
        const planet = new Orbit<Jovian>(new Jovian());
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

        return this.response(planet, workObj.star, workObj.zone, workObj.age, type, workObj.parent) as Orbit<Jovian> | false;
    }
}
