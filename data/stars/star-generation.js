'use strict';
import rangeArray from "../../lib/range-array.js";
import clone from "just-clone";

export default (random) => {
    let stars = [
        {min: 1, max: 1, payload: { class: "A", secondary: "", size: "V", type: "star" , rank: 1}},
        {min: 2, max: 4, payload: { class: "F", secondary: "", size: "V", type: "star" , rank: 2}},
        {min: 5, max: 12, payload: { class: "G", secondary: "", size: "V", type: "star" , rank: 3}},
        {min: 13, max: 26, payload: { class: "K", secondary: "", size: "V", type: "star" , rank: 4}},
        {min: 27, max: 36, payload: { class: "White Dwarf", secondary: "", size: "VII", type: "star" , rank: 5}},
        {min: 37, max: 85, payload: { class: "M", secondary: "", size: "V", type: "star" , rank: 6}},
        {min: 86, max: 98, payload: { class: "Brown Dwarf", secondary: "", size: "", type: "star" , rank: 7}},
        {min: 99, max: 99, payload: { class: "TBA", secondary: "Giant", size: "III", type: "star" , rank: 8}},
        {min: 100, max: 100, payload: { class: "Special", secondary: "", size: "", type: "star" , rank: 9}},
    ];
    let starsExtra = [
        {class: "A", payload: [{min: 7, max: 10, payload: { secondary: "SubGiant", size: "IV"}}]},
        {class: "F", payload: [{min: 9, max: 10, payload: { secondary: "SubGiant", size: "IV"}}]},
        {class: "G", payload: [{min: 10, max: 10, payload: { secondary: "SubGiant", size: "IV"}}]},
        {class: "TBA", payload: [
                {min: 1, max: 1, payload: { class: "F"}},
                {min: 2, max: 2, payload: { class: "G"}},
                {min: 3, max: 7, payload: { class: "K"}},
                {min: 8, max: 10, payload: { class: "K", size: "IV"}},
            ]
        },
    ];

    const generate = (orbit = 0) => {
        let data = rangeArray(stars);
        let roll = random.between(1, 100);
        let result = data.find(roll);
        if (result) {
            return generateExtra(result, orbit);
        }

        throw 'Star not found';
    }

    const generateExtra = (star, orbit) => {
        let roll = random.between(1, 10);
        let data = starsExtra.filter((obj) => { return obj.class === star.class});
        let spectral = random.between(0, 9);
        star.spectral = spectral;
        if (!data.length) {
            return star;
        }
        data = rangeArray(data[0].payload);
        let result = data.find(roll);
        if (result) {
            return {...star, ...result};
        }

        throw 'Star Extra error';
    }

    const generateAncillaryStars = (star, orbit) => {
        let multiple = random.between(1, 10);
        if(multiple > 7) {
            let dupe = random.between(1, 10);
            let output = clone(star);
            if (dupe > 3) {
                output = generate(orbit);
                if (output.rank === 8 && output.rank > star.rank) {
                    output = { class: "Brown Dwarf", secondary: "", size: "", type: "star" , rank: 7};
                }
            } else {
                let spectral =
                    random.between(0, 9);
                if (output.spectral < spectral) {
                    output.spectral = spectral;
                }
            }
            output.orbit = orbit;

            return output;
        }

        return false;
    }

    return { generate, generateAncillaryStars };
}
