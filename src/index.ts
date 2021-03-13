import StellaNurseryFactory from './stella-nursery-factory';
import TyrCommonwealthDenizen from "stellar-nursery-denizens/lib/denizens/tyr-commonwealth-denizen";

const factory = new StellaNurseryFactory(new TyrCommonwealthDenizen(), '31403425783176496'); // '11896589443320660'
console.log(factory.getSeed(), JSON.stringify(factory.run()));
