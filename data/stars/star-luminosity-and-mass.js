'use strict';
import {round} from "math-precision";
import Formula from 'fparser';
import {luminosityByRadiusAndTemp, resizeByLuminosityAndTemp} from "../../lib/calculations.js";

export default function(random) {
    let luminosity = [
        {class: "B", size: "V", values: [13000, 7800, 4700, 2800, 1700, 1000, 600, 370, 220, 130] },
        {class: "A", size: "V", values: [80, 62, 48, 38, 29, 23, 18, 14, 11, 8.2] },
        {class: "F", size: "V", values: [6.4, 5.5, 4.7, 4.0, 3.4, 2.9, 2.5, 2.16, 1.85, 1.58] },
        {class: "G", size: "V", values: [1.36, 5.5, 4.7, 4.0, 3.4, 2.9, 2.5, 2.16, 1.85, 1.58] },
        {class: "K", size: "V", values: [0.46, 0.39, 0.32, 0.27, 0.23, 0.19, 0.16, 0.14, 0.11, 0.10] },
        {class: "M", size: "V", values: [0.08, 0.04, 0.02, 0.012, 0.006, 0.003, 0.0017, 0.0009, 0.0005, 0.0002] },
        {class: "A", size: "IV", values: [156, 127, 102, 83, 67, 54, 44, 36, 29, 23] },
        {class: "F", size: "IV", values: [19, 16.9, 15.1, 13.4, 12.0, 10.7, 9.5, 8.5, 7.6, 6.7] },
        {class: "G", size: "IV", values: [6.2, 5.9, 5.6, 5.4, 5.2, 5.0, 4.8, 4.6, 4.4, 4.2] },
        {class: "K", size: "IV", values: [4,4,4,4,4,4,4,4,4,4] },
        {class: "A", size: "III", values: [280, 240, 200, 170, 140, 120, 100, 87, 74, 63] },
        {class: "F", size: "III", values: [53, 51, 49, 47, 46, 45, 46, 47, 48, 49] },
        {class: "G", size: "III", values: [50, 55, 60, 65, 70, 77, 85, 92, 101, 110] },
        {class: "K", size: "III", values: [120, 140, 160, 180, 210, 240, 270, 310, 360, 410] },
        {class: "M", size: "III", values: [470, 600, 900, 1300, 1800, 2300, 2400, 2500, 2600, 2700] },
    ];
    let mass = [
        {class: "B", size: "V", values: [17.5, 15.1, 13.0, 11.1, 9.5, 8.2, 7.0, 6.0, 5.0, 4.0] },
        {class: "A", size: "V", values: [3.0, 2.8, 2.6, 2.5, 2.3, 2.2, 2.0, 1.9, 1.8, 1.7] },
        {class: "F", size: "V", values: [1.6, 1.53, 1.47, 1.42, 1.36, 1.31, 1.26, 1.21, 1.17, 1.12] },
        {class: "G", size: "V", values: [1.08, 1.05, 1.02, 0.99, 0.96, 0.94, 0.92, 0.89, 0.87, 0.85] },
        {class: "K", size: "V", values: [0.82, 0.79, 0.75, 0.72, 0.69, 0.66, 0.63, 0.61, 0.56, 0.49] },
        {class: "M", size: "V", values: [0.46, 0.38, 0.32, 0.26, 0.21, 0.18, 0.15, 0.12, 0.10, 0.08] },
        {class: "A", size: "IV", values: [6, 5.1, 4.6, 4.3, 4.0, 3.7, 3.4, 3.1, 2.9, 2.7] },
        {class: "F", size: "IV", values: [2.5, 2.4, 2.3, 2.2, 2.1, 2.0, 1.95, 1.90, 1.80, 1.70] },
        {class: "G", size: "IV", values: [1.60, 1.55, 1.52, 1.49, 1.47, 1.45, 1.44, 1.43, 1.42, 1.41] },
        {class: "K", size: "IV", values: [1.40, 1.40, 1.40, 1.40, 1.40, 1.40, 1.40, 1.40, 1.40, 1.40] },
        {class: "A", size: "III", values: [12, 11.5, 11.0, 10.5, 10, 9.6, 9.2, 8.9, 8.6, 8.3] },
        {class: "F", size: "III", values: [8.0, 7.0, 6.0, 5.2, 4.7, 4.3, 3.9, 3.5, 3.1, 2.8] },
        {class: "G", size: "III", values: [2.5, 2.4, 2.5, 2.5, 2.6, 2.7, 2.7, 2.8, 2.8, 2.9] },
        {class: "K", size: "III", values: [3, 3.3, 3.6, 3.9, 4.2, 4.5, 4.8, 5.1, 5.4, 5.8] },
        {class: "M", size: "III", values: [6.2, 6.4, 6.6, 6.8, 7.2, 7.4, 7.8, 8.3, 8.8, 9.3] },
    ];
    let temp = [
        {class: "B", size: "V", values: [28000, 25000, 22000, 19000, 17000, 15000, 14000, 13000, 12000, 11000] },
        {class: "A", size: "V", values: [10000, 9750, 9500, 9250, 9000, 8750, 8500, 8250, 8000, 7750] },
        {class: "F", size: "V", values: [7500, 7350, 7200, 7050, 6900, 6750, 6600, 6450, 6300, 6150] },
        {class: "G", size: "V", values: [6000, 5900, 5800, 5700, 5600, 5500, 5400, 5300, 5200, 5100] },
        {class: "K", size: "V", values: [5000, 4850, 4700, 4550, 4400, 4250, 4100, 3950, 3800, 3650] },
        {class: "M", size: "V", values: [3500, 3350, 3200, 3050, 2900, 2750, 2600, 2450, 2300, 2200] },
        {class: "A", size: "IV", values: [9700, 9450, 9200, 8950, 8700, 8450, 8200, 7950, 7700, 7500] },
        {class: "F", size: "IV", values: [7300, 7200, 7100, 6950, 6800, 6650, 6500, 6350, 6200, 6050] },
        {class: "G", size: "IV", values: [5900, 5750, 5600, 5450, 5300, 5200, 5100, 5000, 4900, 4800] },
        {class: "K", size: "IV", values: [4700, 4700, 4700, 4700, 4700, 4700, 4700, 4700, 4700, 4700] },
        {class: "A", size: "III", values: [9500, 9250, 9000, 8750, 8500, 8250, 8000, 7750, 7500, 7350] },
        {class: "F", size: "III", values: [7200, 7050, 6900, 6750, 6600, 6450, 6300, 6150, 6000, 5900] },
        {class: "G", size: "III", values: [5800, 5700, 5600, 5500, 5400, 5250, 5100, 4950, 4800, 4650] },
        {class: "K", size: "III", values: [4500, 4400, 4300, 4200, 4100, 4000, 3900, 3800, 3700, 3550] },
        {class: "M", size: "III", values: [3400, 3200, 3100, 3000, 2800, 2650, 2500, 2400, 2300, 2200] },
    ];
    let radius = [
        {class: "B", size: "V", values: [4.9, 4.8, 4.8, 4.8, 4.8, 4.7, 4.2, 3.8, 3.5, 3.2] },
        {class: "A", size: "V", values: [3, 2.8, 2.6, 2.4, 2.2, 2.1, 2.0, 1.8, 1.7, 1.6] },
        {class: "F", size: "V", values: [1.5, 1.5, 1.4, 1.4, 1.3, 1.3, 1.2, 1.2, 1.2, 1.1] },
        {class: "G", size: "V", values: [1.1, 1.1, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.9, 0.9] },
        {class: "K", size: "V", values: [0.9, 0.9, 0.9, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8] },
        {class: "M", size: "V", values: [0.8, 0.6, 0.5, 0.4, 0.3, 0.25, 0.2, 0.17, 0.14, 0.11] },
        {class: "A", size: "IV", values: [4.5, 4.2, 4.0, 3.8, 3.6, 3.5, 3.3, 3.2, 3.1, 2.9] },
        {class: "F", size: "IV", values: [2.7, 2.7, 2.6, 2.6, 2.5, 2.5, 2.5, 2.5, 2.4, 2.4] },
        {class: "G", size: "IV", values: [2.4, 2.4, 2.5, 2.6, 2.7, 2.8, 2.8, 2.9, 2.9, 3.0] },
        {class: "K", size: "IV", values: [3.0, 3.0, 3.0, 3.0, 3.0, 3.0, 3.0, 3.0, 3.0, 3.0] },
        {class: "A", size: "III", values: [6.2, 6.1, 5.9, 5.7, 5.6, 5.5, 5.3, 5.2, 5.1, 4.9] },
        {class: "F", size: "III", values: [4.7, 4.8, 4.9, 5.1, 5.2, 5.4, 5.7, 6.1, 6.5, 6.8] },
        {class: "G", size: "III", values: [7.1, 7.7, 8.3, 9.0, 9.7, 10.7, 11.9, 13.2, 14.7, 16.3] },
        {class: "K", size: "III", values: [18.2, 20.4, 22.8, 25.6, 28.8, 32.4, 36.5, 41.2, 46.5, 54] },
        {class: "M", size: "III", values: [63, 80, 105, 135, 180, 230, 260, 290, 325, 360] },
    ];


    const calculate = (star) => {
        let rnd = random.between(1, 10);

        if (star.rank === 5 || star.rank === 7 || star.rank === 9) {
            // handle brown and special
            return handleNonStdStars(star, rnd);
        }
        let lumValues = luminosity
            .filter((obj) => { return (star.class === obj.class && star.size === obj.size); })
            .map((obj) => { return obj.values})[0];
        let tempValues = temp
            .filter((obj) => { return (star.class === obj.class && star.size === obj.size); })
            .map((obj) => { return obj.values})[0];
        let massValues = mass
            .filter((obj) => { return (star.class === obj.class && star.size === obj.size); })
            .map((obj) => { return obj.values})[0];
        let radiusValues = radius
            .filter((obj) => { return (star.class === obj.class && star.size === obj.size); })
            .map((obj) => { return obj.values})[0];


        star.luminosity = lumValues[star.spectral];
        star.temp = tempValues[star.spectral];
        star.mass = massValues[star.spectral];
        star.radius = radiusValues[star.spectral];

        if (star.size === 'IV' && rnd >= 3) {
            let mod = [0, 0, 0, -10, -20, -30, -40, 10, 20, 30, 40];
            let massVal = mod[rnd];
            let lumVal = mod[rnd] * 2;
            if (massVal < 0) {
                star.mass = round((star.mass - ((star.mass/ 100) * Math.abs(massVal))), 5);
                star.luminosity = round((star.luminosity - ((star.luminosity/ 100) * Math.abs(lumVal))), 5);
            } else {
                star.mass = round((star.mass + ((star.mass/ 100) * Math.abs(massVal))), 5);
                star.luminosity = round((star.luminosity + ((star.luminosity/ 100) * Math.abs(lumVal))), 5);
            }
            star.radius = resizeByLuminosityAndTemp(star.temp, star.luminosity);
        } else if (star.size === 'III') {
            let modMass = [0, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0, 1.25, 1.5];
            let modLum = [0, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0, 1.5, 2.0];
            let massVal = modMass[rnd];
            let lumVal = modLum[rnd];
            star.mass = round((star.mass * massVal), 5);
            star.luminosity = round((star.luminosity * lumVal), 5);
            star.radius = resizeByLuminosityAndTemp(star.temp, star.luminosity);
        }

        return star;
    }

    const handleNonStdStars = (star, rnd) => {
        if (star.rank === 9) {
            // handle special
            return star;
        }

        if (star.rank === 5) {
            let mass5 = [0, 1.3 , 1.1, 0.9, 0.7, 0.6, 0.55, 0.50, 0.45, 0.40, 0.35];
            let radius5 = [0, 0.004, 0.007, 0.009, 0.010, 0.011, 0.012, 0.013, 0.014, 0.015, 0.016];
            let temp5 = [0, 30000, 25000, 20000, 16000, 14000, 12000, 10000, 8000, 6000, 4000];
            star.mass = mass5[rnd];
            star.temp = temp5[rnd];
            star.radius = radius5[rnd];
        } else if (star.rank === 7) {
            let mass7 = [0, 0.070, 0.064, 0.058, 0.052, 0.046, 0.040, 0.026, 0.020, 0.014];
            let radius7 = [0, 0.07, 0.08, 0.09, 0.10, 0.11, 0.12, 0.12, 0.12, 0.12, 0.12];
            let temp7 = [0, 2200, 2000, 1800, 1600, 1400, 1200, 1000, 900, 800, 700];
            star.mass = mass7[rnd];
            star.temp = temp7[rnd];
            star.radius = radius7[rnd];
        }

        star.luminosity = luminosityByRadiusAndTemp(star.radius, star.temp);
        return star;
    }

    return { calculate };
}
