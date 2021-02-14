import ISystemLevelGen from './interfaces/i-system-level-gen';
import RandomSeedFactory from 'stellar-nursery-shared/lib/random-seed-factory';
import DefaultRandomizer from 'stellar-nursery-shared/lib/default-randomizer';
import SystemGenerator from './generators/system-generator';
import StarGenerator from './generators/star-generator';
import OrbitGenerator from './generators/orbit-generator';
import DwarfPlanetaryGen from './generators/planet/category/dwarf-planetary-gen';
import TerrestrialPlanetaryGen from './generators/planet/category/terrestrial-planetary-gen';
import HelianPlanetaryGen from './generators/planet/category/helian-planetary-gen';
import JovianPlanetaryGen from './generators/planet/category/jovian-planetary-gen';
import IPlanetGen from './interfaces/i-planet-gen';
import HelianPlanetGen from './generators/planet/helian-planet-gen';
import JovianPlanetGen from './generators/planet/jovian-planet-gen';
import PanthalassicPlanetGen from './generators/planet/panthalassic-planet-gen';
import AcheronianPlanetGen from './generators/planet/acheronian-planet-gen';
import AreanPlanetGen from './generators/planet/arean-planet-gen';
import AridPlanetGen from './generators/planet/arid-planet-gen';
import AsphodelianPlanetGen from './generators/planet/asphodelian-planet-gen';
import IPlanetCategoryGen from './interfaces/i-planet-category-gen';

export default class StellaNurseryFactory {
    protected _random: RandomSeedFactory | undefined;
    private _systemGenerator: ISystemLevelGen;

    constructor(seed?: string) {
        this._random = new DefaultRandomizer();
        if (seed === undefined) {
            this._random.createSeed();
        } else {
            this._random.setSeed(seed);
        }

        // define subscriptions
        const categorySubscriptions: IPlanetCategoryGen[] = [
            new DwarfPlanetaryGen(),
            new TerrestrialPlanetaryGen(),
            new HelianPlanetaryGen(),
            new JovianPlanetaryGen(),
        ];
        const planetSubscriptions: IPlanetGen[] = [
            new AcheronianPlanetGen(),
            new AreanPlanetGen(),
            new AridPlanetGen(),
            new AsphodelianPlanetGen(),
            new HelianPlanetGen(),
            new JovianPlanetGen(),
            new PanthalassicPlanetGen(),
        ];

        // define Main Generators
        this._systemGenerator = new SystemGenerator();
        const starGen = new StarGenerator();
        const orbitGen = new OrbitGenerator();

        // add random
        this._systemGenerator.random = this._random;
        starGen.random = this._random;
        orbitGen.random = this._random;

        for (const planet of planetSubscriptions) {
            planet.random = this._random;
            for (const category of categorySubscriptions) {
                category.random = this._random;
                category.publish.subscribe(planet);
                orbitGen.publish.subscribe(category);
            }
        }

        // join
        starGen.publish.subscribe(orbitGen);
        this._systemGenerator.publish.subscribe(starGen);
    }

    public run() {
        return this._systemGenerator.run();
    }
}
