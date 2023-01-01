import plugin from "js-plugin";
import systemOrbits from "../data/system/system-orbits.js";

export default (randomLib) => {
    const so = systemOrbits(randomLib);

    const register = () => {
        plugin.register({
            name: "orbits",
            stellar(stellar) {
                stellar.functions.potentialOrbits = (flow) => {
                    return so.potentialOrbits(flow);
                };
                stellar.functions.removeOrbits = (flow) => {
                    return so.removeOrbits(flow);
                };
                stellar.functions.assignOrbitTypes = (flow) => {
                    return so.assignOrbitTypes(flow);
                };
                stellar.flow.push(stellar.functions.potentialOrbits);
                stellar.flow.push(stellar.functions.removeOrbits);
                stellar.flow.push(stellar.functions.assignOrbitTypes);
            }
        });
    }

    return { register }
}
