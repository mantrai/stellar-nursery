import DefaultRandomizer from 'stellar-nursery-shared/lib/default-randomizer';
import safeStringify from 'fast-safe-stringify';
import SystemGenerator from './generators/system-generator';
import StarGenerator from './generators/star-generator';

const random = new DefaultRandomizer();
random.setSeed('11896589443320660');
const systemFactory = new SystemGenerator();
const starFactory = new StarGenerator();
systemFactory.random = random;
systemFactory.starGen = starFactory;
starFactory.random = random;
console.log(safeStringify(systemFactory.generate()));
