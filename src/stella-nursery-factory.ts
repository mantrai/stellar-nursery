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
import ChthonianPlanetGen from './generators/planet/chthonian-planet-gen';
import HebeanPlanetGen from './generators/planet/hebean-planet-gen';
import JaniLithicPlanetGen from './generators/planet/janiLithic-planet-gen';
import MeltballPlanetGen from './generators/planet/meltball-planet-gen';
import OceanicPlanetGen from './generators/planet/oceanic-planet-gen';
import PrometheanPlanetGen from './generators/planet/promethean-planet-gen';
import RockballPlanetGen from './generators/planet/rockball-planet-gen';
import SnowballPlanetGen from './generators/planet/snowball-planet-gen';
import StygianPlanetGen from './generators/planet/stygian-planet-gen';
import TectonicPlanetGen from './generators/planet/tectonic-planet-gen';
import TelluricPlanetGen from './generators/planet/telluric-planet-gen';
import VesperianPlanetGen from './generators/planet/vesperian-planet-gen';
import MoonGenerator from './generators/moon-generator';

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
            new ChthonianPlanetGen(),
            new HebeanPlanetGen(),
            new HelianPlanetGen(),
            new JaniLithicPlanetGen(),
            new JovianPlanetGen(),
            new MeltballPlanetGen(),
            new OceanicPlanetGen(),
            new PanthalassicPlanetGen(),
            new PrometheanPlanetGen(),
            new RockballPlanetGen(),
            new SnowballPlanetGen(),
            new StygianPlanetGen(),
            new TectonicPlanetGen(),
            new TelluricPlanetGen(),
            new VesperianPlanetGen(),
        ];

        // define Main Generators
        this._systemGenerator = new SystemGenerator();
        const starGen = new StarGenerator();
        const orbitGen = new OrbitGenerator();
        const moonGen = new MoonGenerator();

        // add random
        this._systemGenerator.random = this._random;
        starGen.random = this._random;
        orbitGen.random = this._random;
        moonGen.random = this._random;

        for (const planet of planetSubscriptions) {
            planet.random = this._random;
            for (const category of categorySubscriptions) {
                category.random = this._random;
                category.publish.subscribe(planet);
                orbitGen.publish.subscribe(category);
                moonGen.publish.subscribe(category);
            }
            planet.publish.subscribe(moonGen);
        }

        // join
        starGen.publish.subscribe(orbitGen);
        this._systemGenerator.publish.subscribe(starGen);
    }

    public run() {
        return this._systemGenerator.run();
    }
}
