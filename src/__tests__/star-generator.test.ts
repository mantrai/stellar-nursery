import MockRandomizer from '../mock-randomizer';
import StarGenerator from '../generators/star-generator';
import Orbit from '../objects/orbit';
import Star from '../objects/star';

test('Test not set', () => {
    const starGen = new StarGenerator();
    expect(() => {
        starGen.orbitGen;
    }).toThrowError('OrbitGen');
    expect(() => {
        starGen.random;
    }).toThrowError('Random seed factory');
});

test('Test 1 star', () => {
    const random = new MockRandomizer();
    random.results = [2, 1];
    const starGen = new StarGenerator();
    starGen.random = random;
    const stars: Orbit<Star>[] = starGen.generate(1, 1);
    expect(stars.length).toBe(1);
    expect(stars[0].orbitStats.separation).toBe(0);
    expect(stars[0].orbitStats.spectralClass).toBe('A');
    expect(stars[0].orbitStats.luminosityClass).toBe('V');
    expect(stars[0].orbitStats.spectralLuminosityClass).toBe('A-V');
});
