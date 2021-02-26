import MockRandomizer from '../mock-randomizer';
import StarGenerator from '../generators/star-generator';
import Orbit from '../objects/orbit';
import Star from '../objects/star';
import StarLevelWorker from '../objects/work/star-level-worker';

test('Test 1 star', () => {
    const random = new MockRandomizer();
    random.results = [2, 1];
    const starGen = new StarGenerator();
    starGen.random = random;
    const worker = new StarLevelWorker(1, 1);
    const stars: Orbit<Star>[] = starGen.run(worker);
    expect(stars.length).toBe(1);
    expect(stars[0].orbitStats.separation).toBe(0);
    expect(stars[0].orbitStats.spectralClass).toBe('A');
    expect(stars[0].orbitStats.luminosityClass).toBe('V');
    expect(stars[0].orbitStats.spectralLuminosityClass).toBe('A-V');
});
