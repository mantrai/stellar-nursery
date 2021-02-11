import Star from "../star";

export default class OrbitWorker {
    star: Star;
    age: number;

    constructor(star: Star, age: number,) {
        this.star = star;
        this.age = age;
    }
}
