'use strict';
import rangeArray from "../../lib/range-array.js";
import Formula from "fparser";
import {round} from "math-precision";

export default function(random) {
    let separation = [
        {min: 1, max: 3, payload: { description: "Very close", distance: "x * 0.005", orbits: true}},
        {min: 4, max: 6, payload: { description: "Close", distance: "x * 0.05", orbits: true}},
        {min: 7, max: 8, payload: { description: "Separated", distance: "x * 3", orbits: false}},
        {min: 9, max: 9, payload: { description: "Distant", distance: "x * 20", orbits: false}},
        {min: 10, max: 10, payload: { description: "Distant", distance: "x * 200", orbits: false}},
    ];
    let eccentricity = [
        {min: 1, max: 2, payload: { eccentricity: "x * 0.01"}},
        {min: 3, max: 4, payload: { eccentricity: "0.1 + x * 0.01"}},
        {min: 5, max: 6, payload: { eccentricity: "0.2 + x * 0.01"}},
        {min: 7, max: 8, payload: { eccentricity: "0.3 + x * 0.01"}},
        {min: 9, max: 9, payload: { eccentricity: "0.4 + x * 0.01"}},
        {min: 10, max: 10, payload: { eccentricity: "0.5 + x * 0.04"}},
    ];

    const nextChar = (c) => {
        let i = (parseInt(c, 36) + 1 ) % 36;
        return (!i * 10 + i).toString(36);
    }

    const calculate = (flow) => {
        let orbitCnt = {orbit: 0};
        let run = 0;
        let currentChar = 'a';
        // add index, orbits and orbitsStar;
        flow.orbits.forEach((obj, index) => {
            obj.index = currentChar.toUpperCase();
            obj.orbitsStar = [];
            obj.orbits = [];
            flow.orbits[index] = obj;
            currentChar = nextChar(currentChar);
        });
        if (flow.orbits.length > 1) {
            let x = 0;
            let y = 1;
            let indexs = [flow.orbits[x].index];
            while (y < flow.orbits.length) {
                let sepData = rangeArray(separation);
                let eccData = rangeArray(eccentricity);
                let indexY = flow.orbits[y].index;
                let indexX = flow.orbits[x].index;
                handlePair(indexs, flow.orbits[y], sepData, eccData);
                let rr = random.between(0, 2,);
                if (flow.orbits[y].orbitsStar.at(-1).t) {
                    if (rr === 0) {
                        indexs = [indexX];
                    } else if (rr === 1) {
                        indexs = [indexY];
                        x = y;
                    } else if (rr === 2) {
                        indexs = [indexX, indexY];
                        x = y;
                    }
                    y++;
                } else {
                    indexs = [indexY];
                    y++;
                    x = y - 1;
                }
            }
        }

        flow.orbits.forEach((obj, index) => {
            if (obj.orbitsStar.length > 0) {
                let closestSeparation = new Formula("m * (1 - e)");
                let furthestSeparation = new Formula("m * (1 + e)");
                let orbitalPeriod = new Formula("(m^3 / (a + b))^0.5");
                let parentObj;
                let parentIndex = obj.orbitsStar.at(0).stars.at(0);
                let s = obj.orbitsStar.at(0);
                parentObj = flow.orbits.filter((obj2) => { return obj2.index === parentIndex; })[0];
                obj.orbitsStar[0].closest = round(closestSeparation.evaluate({m: s.separation, e: s.eccentricity}), 5);
                obj.orbitsStar[0].furthest = round(furthestSeparation.evaluate({m: s.separation, e: s.eccentricity}), 5);
                obj.orbitsStar[0].period = round(orbitalPeriod.evaluate({m: s.separation, a: obj.mass, b: parentObj.mass}), 5);

                if (obj.orbitsStar.at(0).stars.length > 1) {
                    let base = obj.orbitsStar.at(0);
                    for (let i = 1; i < base.stars.length; i++) {
                        parentIndex = base.stars[i];
                        parentObj = flow.orbits.filter((obj2) => { return obj2.index === parentIndex; })[0];
                        if (parentObj.orbitsStar.length > 0) {
                            parentObj.orbitsStar[0].separation = 3 * parentObj.orbitsStar[0].separation;
                            s = parentObj.orbitsStar[0];
                            obj.orbitsStar[0].closest = round(closestSeparation.evaluate({m: s.separation, e: s.eccentricity}), 5);
                            obj.orbitsStar[0].furthest = round(furthestSeparation.evaluate({m: s.separation, e: s.eccentricity}), 5);
                            obj.orbitsStar[0].period = round(orbitalPeriod.evaluate({m: s.separation, a: obj.mass, b: parentObj.mass}), 5);
                        }
                    }
                }
            }
        });

        return flow;
    }

    const handlePair = (joins, b, sepData, eccData) => {
        let sepRoll = random.between(1, 10);
        let eccRoll = random.between(1, 10);
        let sepCRoll = random.between(1, 10);
        let eccCRoll = random.between(1, 10);
        let sep = sepData.find(sepRoll);
        let ecc = eccData.find(eccRoll);
        let s = { stars: [], description: "", separation: 0, eccentricity: 0, t: false};

        let fObj = new Formula(sep.distance);
        s.separation = fObj.evaluate({x: sepCRoll});
        fObj = new Formula(ecc.eccentricity);
        s.eccentricity = round(fObj.evaluate({x: eccCRoll}), 5);
        s.description = sep.description;
        s.stars = joins;
        s.t = sep.orbits;
        b.orbitsStar.push(s);
    }

    return { calculate };
}
