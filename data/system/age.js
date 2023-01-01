'use strict';
import {round} from "math-precision";
import {lifespan, resizeByLuminosityAndTemp} from "../../lib/calculations.js";
import RangeArray from "../../lib/range-array.js";

export default function(random) {
    let abundance = [
        {min: 3, max: 9, payload: {description: "Exceptional", mod: 2}},
        {min: 10, max: 12, payload: {description: "High", mod: 1}},
        {min: 13, max: 18, payload: {description: "Normal", mod: 0}},
        {min: 19, max: 21, payload: {description: "Poor", mod: -1}},
        {min: 22, max: 100000, payload: {description: "Depleted", mod: -3}},
    ];

    let stars = [
        {class: "B", min: 0, max: 9, age:[0, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1], mod:[0,0,0,0,0,0,0,0,0,0,0]},
        {class: "A", min: 0, max: 4, age:[0, 0.1, 0.1, 0.2, 0.2, 0.3, 0.3, 0.4, 0.4, 0.5, 0.6], mod:[0,0,0,0,0,0,0,0,0,0,0]},
        {class: "A", min: 5, max: 9, age:[0, 0.3, 0.6, 1, 1.3, 1.6, 2, 2.3, 2.6, 2.9, 3.2], mod:[0, -20, -20, -10, -10, 0, 0, 10, 10, 20, 20]},
        {class: "F", min: 0, max: 4, age:[0, 0.3, 0.6, 1, 1.3, 1.6, 2, 2.3, 2.6, 2.9, 3.2], mod:[0, -40, -30, -20, -10, 0, 10, 20, 30, 40, 50]},
        {class: "F", min: 5, max: 9, age:[0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5], mod:[0, -40, -30, -20, -10, 0, 10, 20, 30, 40, 50]},
        {class: "G", min: 0, max: 4, age:[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], mod:[0, -40, -30, -20, -10, 0, 10, 20, 30, 40, 50]},
        {class: "G", min: 5, max: 9, age:[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], mod:[0, -40, -30, -20, -10, 0, 0, 0, 10, 20, 30]},
        {class: "K", min: 0, max: 4, age:[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], mod:[0, -20, -15, -10, -5, 0, 0, 0, 0, 0, 5]},
        {class: "K", min: 5, max: 9, age:[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], mod:[0, -10, -5, 0, 0, 0, 0, 0, 0, 0, 0]},
        {class: "M", min: 0, max: 9, age:[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], mod:[0, -10, -5, 0, 0, 0, 0, 0, 0, 0, 0]}
    ]
    let wd = {
        age: [
            0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10
        ],
        mod: [
            0, 4, -4, -3, -3, -2, -2, -1, -1, 0, 0
        ]
    };
    let bd = {
        age: [
           0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10
        ],
        mod: [
            0, 0, 1, 1, 2, 2, 3, 4, 5, 6, 7
        ]
    };
    const calculateSystemAge = (flow) => {
        let orbit = flow.orbits[0];
        let age;
        let mod;
        if (orbit.rank === 9) {
            return flow;
        }
        let roll = random.between(1, 10);
        if (orbit.type === "star") {
            if (orbit.rank === 5) {
                age = wd.age[roll];
                mod = wd.mod[roll];
            } else if (orbit.rank === 7) {
                age = bd.age[roll];
                mod = bd.mod[roll];
            } else {
                let combos = stars.filter(
                    (star) => {
                        return star.class === orbit.class && star.min <= orbit.spectral && star.max >= orbit.spectral;
                    }
                )
                if (!combos.length) {
                    throw 'age not found';
                }
                let combo = combos.shift();
                if (orbit.rank === 8 || orbit.secondary === "SubGiant") {
                    age = combo.age[10];
                } else {
                    age = combo.age[roll];
                }
                age = combo.age[roll];
                mod = combo.mod[roll];
                if (orbit.rank === 8) {
                    age = round((age + ((age/100) * 20)), 2);
                } else if (orbit.secondary === "SubGiant") {
                    age = round((age + ((age/100) * 10)), 2);
                }
            }
        }
        let abd = RangeArray(abundance);
        let abdResult = abd.find(age);
        flow.abundance = abdResult ? abdResult.description : '';
        flow.abundanceMod = abdResult ? abdResult.mod : '';
        flow.orbits.forEach(
            (star, index) => {
                if (star.type === "star") {
                    star.age = age;
                    star.luminosity = round((star.luminosity + ((star.luminosity/100) * mod)), 5);
                    star.radius = resizeByLuminosityAndTemp(star.luminosity, star.temp);
                    star.lifespan = lifespan(star.mass, star.luminosity);
                }
            }
        );
        return flow;
    }

    return { calculateSystemAge };
}
