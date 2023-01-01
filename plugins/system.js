import plugin from "js-plugin";
import age from "../data/system/age.js";

export default (randomLib) => {
    const ageData = age(randomLib);

    const register = () => {
        plugin.register({
            name: "system",
            stellar(stellar) {
                stellar.functions.calculateSystemAge = (flow) => {
                    return ageData.calculateSystemAge(flow);
                };

                stellar.flow.push(stellar.functions.calculateSystemAge);
            }
        });
    }

    return { register }
}
