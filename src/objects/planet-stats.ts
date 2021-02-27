import {Rings, Score} from 'stellar-nursery-shared';

export default class PlanetStats {
    planetGroup: string = '';
    planetClass: string = '';
    planetType: string = '';
    size: number = 0;
    atmosphere: number = 0;
    hydrosphere: number = 0;
    biosphere: number = 0;
    description: string = '';
    chemistry: string[] = [];
    population: number = 0;
    desirability: number = 0;
    rings: number = Rings.None;

    public toJSON(): object {
        return {
            planetGroup: this.planetGroup,
            planetClass: this.planetClass,
            planetType: this.planetType,
            size: Score[this.size].replace('n', ''),
            atmosphere: Score[this.atmosphere].replace('n', ''),
            hydrosphere: Score[this.hydrosphere].replace('n', ''),
            biosphere: Score[this.biosphere].replace('n', ''),
            population: Score[this.population].replace('n', ''),
            desirability: this.desirability,
            description: this.description,
            chemistry: this.chemistry,
            rings: Rings[this.rings],
        };
    }
}
