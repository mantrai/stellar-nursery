'use strict';
import RangeArray from "../../lib/range-array.js";
import {firstOrbit, innerZone, nextOrbit, tooHot} from "../../lib/calculations.js";

export default function(random) {
    const nuOrbits = [
        {min: 1, max: 1, payload: {roll: true, min: 11, max: 20}},
        {min: 2, max: 5, payload: {roll: true, min: 6, max: 15}},
        {min: 6, max: 7, payload: {roll: true, min: 1, max: 10}},
        {min: 8, max: 9, payload: {roll: true, min: 1, max: 5}},
        {min: 10, max: 10000, payload: {roll: false, min: 0, max: 0}},
    ]

    const wd = [
        {min: 1, max: 4, payload: {remove: 2}},
        {min: 5, max: 8, payload: {remove: 4}},
        {min: 9, max: 11, payload: {remove: 6}},
        {min: 12, max: 10000, payload: {remove: 10}},
    ]

    const iz = [
        {min: 1, max: 18, payload: {class: "Asteroid Belt", rank: 1}},
        {min: 19, max: 62, payload: {class: "Terrestrial Planet", rank: 2}},
        {min: 63, max: 71, payload: {class: "Chunk", rank: 3}},
        {min: 72, max: 82, payload: {class: "Gas Giant", rank: 4}},
        {min: 83, max: 86, payload: {class: "Superjovian", rank: 5}},
        {min: 87, max: 96, payload: {class: "Empty Orbit", rank: 6}},
        {min: 97, max: 97, payload: {class: "Interloper", rank: 7}},
        {min: 98, max: 98, payload: {class: "Trojan", rank: 8}},
        {min: 99, max: 99, payload: {class: "Double Planet", rank: 9}},
        {min: 100, max: 100, payload: {class: "Captured Body", rank: 10}},
    ];

    const oz = [
        {min: 1, max: 15, payload: {class: "Asteroid Belt", rank: 1}},
        {min: 16, max: 23, payload: {class: "Terrestrial Planet", rank: 2}},
        {min: 24, max: 35, payload: {class: "Chunk", rank: 3}},
        {min: 36, max: 74, payload: {class: "Gas Giant", rank: 4}},
        {min: 75, max: 84, payload: {class: "Superjovian", rank: 5}},
        {min: 85, max: 94, payload: {class: "Empty Orbit", rank: 6}},
        {min: 95, max: 95, payload: {class: "Interloper", rank: 7}},
        {min: 96, max: 97, payload: {class: "Trojan", rank: 8}},
        {min: 98, max: 99, payload: {class: "Double Planet", rank: 9}},
        {min: 100, max: 100, payload: {class: "Captured Body", rank: 10}},
    ];
    const potentialOrbits = (flow) => {
        flow.orbits.forEach(
            (star, index) => {
                let mod = getModifiers(star, flow.abundanceMod);
                let size = firstOrbit(random, star.mass);
                flow.orbits[index].innerZone = innerZone(star.luminosity);
                if (mod > 0) {
                    for (let i = 0; i < mod; i++) {
                        let d = {type: 'orbit', size: size};
                        flow.orbits[index].orbits.push(d);
                        size = nextOrbit(random, size);
                    }
                }
            }
        );
        return flow;
    }

    const removeOrbits = (flow) => {
        flow.orbits.forEach(
            (star, index) => {
                let parent = star.orbitsStar.at(0);
                let hot = tooHot(star.luminosity);
                let remove = [];

                if (star.rank === 5) {
                    let r = random.between(1, 10);
                    r += (star.mass >= 0.6 && star.mass <= 0.9) ? 2 : 0;
                    r += (star.mass > 0.9) ? 4 : 0;
                    let wdr = RangeArray(wd);
                    hot = wdr.find(r).remove;
                }

                star.orbits.forEach(
                    (orbit, index2) => {
                        if (orbit.size < hot) {
                            remove.push(index2);
                        } else if (parent !== undefined) {
                            if (orbit.size > parent.closest) {
                                remove.push(index2);
                            }
                        }
                    }
                )

                flow.orbits[index].orbits = star.orbits.filter(
                    (v, i) => {
                        return !remove.includes(i);
                    }
                );
            }
        );
        return flow;
    }

    const assignOrbitTypes = (flow) => {
        let ozd = RangeArray(oz);
        let izd = RangeArray(iz);
        flow.orbits.forEach(
            (star, x) => {
                star.orbits.forEach(
                    (orbit, y) => {
                        let planetRoll = random.between(1, 100);
                        let payload;

                        if (orbit.size <= star.innerZone) {
                            payload = izd.find(planetRoll);
                        } else {
                            payload = ozd.find(planetRoll);
                        }

                        flow.orbits[x].orbits[y] = {...flow.orbits[x].orbits[y],...payload};
                    }
                );
            }
        );

        return flow;
    }

    const getModifiers = (star, abundanceMod) => {
        let am = - abundanceMod;
        let roll = random.between(1, 10);
        if (star.rank === 7) {
            am += 5;
        } else {
            if (star.class === 'K' && star.size === 'V' && star.spectral >= 5 && star.spectral <= 9) {
                am += 1;
            } else if (star.class === 'M' && star.size === 'V' && star.spectral >= 0 && star.spectral <= 4) {
                am += 2;
            } else if (star.class === 'M' && star.size === 'V' && star.spectral >= 5 && star.spectral <= 9) {
                am += 3;
            }
        }

        let orbitRoll = 0;
        let orbitRollData = RangeArray(nuOrbits).find(roll + am);

        if (orbitRollData.roll) {
            orbitRoll = random.between(orbitRollData.min, orbitRollData.max);
        } else {
            orbitRoll = 0;
        }

        return orbitRoll;
    }

    return { potentialOrbits, removeOrbits, assignOrbitTypes };
}
