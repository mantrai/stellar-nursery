import Stellar from "./lib/stellar.js";
import treeify from 'treeify';
import Random from './lib/random.js'
import {SupportedHooks} from "@codeinkit/flows";

// Create random library
const random = Random();
// Create Stellar core class
const stellar = Stellar();
// Register plugins

// initialise stellar
stellar.init();

// monitor flow exceptions (can remove)
stellar.getFlow().hook(SupportedHooks.EXCEPTION, ({flowName, input, output, i, actionFn, error}) => {
    console.log(error);
});

// generate system
let result = await stellar.generate();

// add random seed to result to regenerate
result.random = random.getSeed();
delete result.$$;// remove flow field

// treeify (to remove)
console.log(treeify.asTree(result, true));
