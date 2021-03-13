import Star from '../star';

export default class OrbitWorker {
    star: Star;
    age: number;
    starQty: number;

    constructor(star: Star, age: number, starQty: number) {
        this.star = star;
        this.age = age;
        this.starQty = starQty;
    }
}
