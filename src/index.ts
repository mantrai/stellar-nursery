import StellaNurseryFactory from './stella-nursery-factory';

const factory = new StellaNurseryFactory('31403425783176496'); // '11896589443320660'
console.log(factory.getSeed(), JSON.stringify(factory.run()));
