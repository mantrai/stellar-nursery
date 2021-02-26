import MockRandomizer from '../mock-randomizer';
import SystemGenerator from '../generators/system-generator';
import StarGenerator from '../generators/star-generator';
import { SystemType } from 'stellar-nursery-shared';

test('One Star', () => {
    const random = new MockRandomizer();
    random.results = [5, 10];
    const systemGen = new SystemGenerator();
    systemGen.random = random;
    const system = systemGen.run();
    expect(system.type).toBe(SystemType.Solitary);
    expect(system.age).toBe(10);
    expect(system.orbits.length).toBe(0);
});

test('Two Star', () => {
    const random = new MockRandomizer();
    random.results = [11, 10];
    const systemGen = new SystemGenerator();
    systemGen.random = random;
    const system = systemGen.run();
    expect(system.type).toBe(SystemType.Binary);
    expect(system.age).toBe(10);
    expect(system.orbits.length).toBe(0);
});

test('Three Star', () => {
    const random = new MockRandomizer();
    random.results = [18, 10];
    const systemGen = new SystemGenerator();
    systemGen.random = random;
    const system = systemGen.run();
    expect(system.type).toBe(SystemType.Trinary);
    expect(system.age).toBe(10);
    expect(system.orbits.length).toBe(0);
});

test('Add Stargen', () => {
    const random = new MockRandomizer();
    const systemGen = new SystemGenerator();
    const starGen = new StarGenerator();
    systemGen.random = random;
    starGen.random = random;
    random.results = [5, 10, 4, 4, 4, 4];
    systemGen.publish.subscribe(starGen);
    const system = systemGen.run();
    expect(system.type).toBe(SystemType.Solitary);
    expect(system.age).toBe(10);
    expect(system.orbits.length).toBe(1);
});
