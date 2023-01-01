import starGeneration from "../data/stars/star-generation.js";
import starLuminosityAndMass from "../data/stars/star-luminosity-and-mass.js";
import starSeparation from "../data/stars/star-separation.js";
import plugin from "js-plugin";

export default (randomLib) => {
    const starGen = starGeneration(randomLib);
    const details = starLuminosityAndMass(randomLib);
    const separation = starSeparation(randomLib);

    const register = () => {
        plugin.register({
            name: "stars",
            stellar(stellar) {
                stellar.functions.createPrimary = (flow) => {
                    let star = starGen.generate(0);
                    flow.orbits.push(
                        { ...{ orbit: 0 }, ...star}
                    );

                    return flow;
                };
                stellar.functions.createAncillaryStars = (flow) => {
                    let orbit = 1;
                    let primary = flow.orbits[0];
                    let star = starGen.generateAncillaryStars(primary, orbit);
                    while (star) {
                        flow.orbits.push(star);
                        orbit++;
                        star = starGen.generateAncillaryStars(primary, orbit);
                    }

                    return flow;
                }
                stellar.functions.addStarDetails = (flow) => {
                    flow.orbits.forEach((star, index) => {
                        let s = details.calculate(star);
                        flow.orbits[index] = s;
                    });
                    return flow;
                }
                stellar.functions.calculateStarSeparations = (flow) => {
                    return separation.calculate(flow);
                }
                stellar.flow.push(stellar.functions.createPrimary);
                stellar.flow.push(stellar.functions.createAncillaryStars);
                stellar.flow.push(stellar.functions.addStarDetails);
                stellar.flow.push(stellar.functions.calculateStarSeparations);
            }
        });
    }

    return { register }
}
