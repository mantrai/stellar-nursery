import RandomSeedFactory from 'stellar-nursery-shared/lib/random-seed-factory';

export default class MockRandomizer extends RandomSeedFactory {
    count: number = 0;
    results: number[] = [];

    // noinspection JSUnusedLocalSymbols
    between(min: number, max: number): number {
        const output = this.results[this.count];
        this.count++;
        return output;
    }

    createSeed(): RandomSeedFactory {
        return this;
    }

    getSeed(): string | undefined {
        return undefined;
    }

    random(): number {
        const output = this.results[this.count];
        this.count++;
        return output;
    }

    // noinspection JSUnusedLocalSymbols
    setSeed(seed: string): RandomSeedFactory {
        return this;
    }
}
