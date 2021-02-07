import MockRandomizer from '../mock-randomizer';
import SystemGenerator from '../generators/system-generator';
import StarGenerator from '../generators/star-generator';

test('Test not set', () => {
    const systemGen = new SystemGenerator();
    expect(() => {
        systemGen.starGen;
    }).toThrowError('StarGen');
    expect(() => {
        systemGen.random;
    }).toThrowError('Random seed factory');
});

test('One Star', () => {
    const random = new MockRandomizer();
    random.results = [5, 10];
    const systemGen = new SystemGenerator();
    systemGen.random = random;
    const system = systemGen.generate();
    expect(system.type).toBe(1);
    expect(system.age).toBe(10);
    expect(system.orbits.length).toBe(0);
});

test('Two Star', () => {
    const random = new MockRandomizer();
    random.results = [11, 10];
    const systemGen = new SystemGenerator();
    systemGen.random = random;
    const system = systemGen.generate();
    expect(system.type).toBe(2);
    expect(system.age).toBe(10);
    expect(system.orbits.length).toBe(0);
});

test('Three Star', () => {
    const random = new MockRandomizer();
    random.results = [18, 10];
    const systemGen = new SystemGenerator();
    systemGen.random = random;
    const system = systemGen.generate();
    expect(system.type).toBe(3);
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
    expect(() => {
        systemGen.starGen;
    }).toThrowError('StarGen');
    systemGen.starGen = starGen;
    expect(() => {
        systemGen.starGen;
    }).not.toThrowError('StarGen');
    const system = systemGen.generate();
    expect(system.type).toBe(1);
    expect(system.age).toBe(10);
    expect(system.orbits.length).toBe(1);
});
