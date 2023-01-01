import Formula from "fparser";
import {round} from "math-precision";

export const resizeByLuminosityAndTemp = (l, t) => {
    const fObj = new Formula('l^0.5 * (5800/t)^2');
    return round(
        fObj.evaluate({l: l, t: t}),
        2
    );
}

export const luminosityByRadiusAndTemp = (r, t) => {
    const fObj = new Formula('r^2 * t^4 / 5800^4');
    let result = fObj.evaluate({r: r, t: t});
    return round(result, 6);
}

export const lifespan = (m, l) => {
    const fObj = new Formula('10 * m / l');
    let result = fObj.evaluate({m: m, l: l});
    return round(result, 0);
}

export const firstOrbit = (random, mass) => {
    let roll = random.between(1, 10);
    const fObj = new Formula('0.05 * m^2 * r')
    let result = fObj.evaluate({m: mass, r: roll});
    return round(result, 5);
}

export const nextOrbit = (random, current) => {
    let roll = random.between(1, 10);
    let result = (current * (1.1+(roll*0.1))) + 0.1;
    return round(result, 5);
}

export const tooHot = (lum) => {
    const fObj = new Formula('0.025 * l^0.5')
    let result = fObj.evaluate({l: lum});
    return round(result, 5);
}

export const innerZone = (lum) => {
    const fObj = new Formula('4 * l^0.5')
    let result = fObj.evaluate({l: lum});
    return round(result, 5);
}
