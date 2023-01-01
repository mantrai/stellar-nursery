'use strict';
import seedrandom from "seedrandom";
import plugin from "js-plugin";
export default (overrideSeed = undefined) => {
    let seed = overrideSeed || Math.floor(Math.random() * 100000000000000000).toString();
    let randomSrc = seedrandom(seed);
    const between = (min, max) => {
        let result = Math.floor(randomSrc() * (max - min + 1) + min);
        result = [result];

        return result[0];
    }

    const random = () => {
        return randomSrc();
    }

    const getSeed = () => {
        return seed;
    }

    const setSeed = (overrideSeed) => {
        seed = overrideSeed;
        randomSrc = seedrandom(seed);
    }

    return { between, getSeed, setSeed, random }
}
