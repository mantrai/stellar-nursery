'use strict';
import { Flows } from '@codeinkit/flows';
import plugin from "js-plugin";

export default () => {
    const flow = new Flows('stellar');
    let stellar = {
        flow: [],
        functions: {}
    };

    const getFlow = () => {
        return flow;
    }

    const init = () => {
        plugin.invoke("stellar", stellar);
        flow.register('stellar', stellar.flow);
    }
    const generate = () => {
        return flow.execute('stellar', {
            orbits: []
        })
    }

    return { generate, getFlow, init }
}
