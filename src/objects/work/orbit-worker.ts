import Star from '../star';

export default class OrbitWorker {
    star: Star;
    age: number;
    starQty: number;
    techLevel: number;

    constructor(star: Star, age: number, techLevel: number, starQty: number) {
        this.star = star;
        this.age = age;
        this.starQty = starQty;
        this.techLevel = techLevel;
    }
}
