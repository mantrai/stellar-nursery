import safeStringify from 'fast-safe-stringify';
import StellaNurseryFactory from './stella-nursery-factory';

const factory = new StellaNurseryFactory('11896589443320660');
console.log(safeStringify(factory.run()));
