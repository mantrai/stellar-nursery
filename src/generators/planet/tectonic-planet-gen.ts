import BasePlanetGen from './base-planet-gen';
import IPlanetGen from '../../interfaces/i-planet-gen';
import Orbit from '../../objects/orbit';
import PlanetTypeWorker from '../../objects/work/planet-type-worker';
import {Chemicals, PlanetType, Score, Zone} from 'stellar-nursery-shared';
import PlanetStats from '../../objects/planet-stats';
import IPlanet from '../../interfaces/i-planet';

export default class TectonicPlanetGen extends BasePlanetGen implements IPlanetGen {
    getKey(): number {
        return PlanetType.Tectonic;
    }

    run(workObj: PlanetTypeWorker): Orbit<IPlanet> {
        const stats = new PlanetStats();
        stats.size = this.random.between(5, 10);

        let roll =
            this.random.between(1, 6) +
            (workObj.star.spectralLuminosityClass === 'K-V' ? 2 : 0) +
            (workObj.star.spectralLuminosityClass === 'M-V' ? 4 : 0) +
            (workObj.star.spectralClass === 'L' ? 5 : 0) +
            (workObj.zone === Zone.OuterZone ? 2 : 0);

        let ageMod = 0;
        let chem = 'none';
        if (roll <= 6) {
            stats.chemistry.push(Chemicals.Silicate);
            roll = this.random.between(2, 12);
            if (roll <= 8) {
                stats.planetType = 'Gaian';
                stats.description =
                    " These are silicate-rich Tectonic worlds, non-tidally locked, with a continuous geological cycle and often quite geologically active.  They tend to be located around stars ranging from F8 V to K3 V, and are often in systems with one or more large outer system Jovians. They are usually attended by one or more large moons, which aids in stabilizing the planet's axial tilt, and thus supports a stable biosphere.";
                stats.chemistry.push(Chemicals.Water);
                chem = Chemicals.Water;
            } else if (roll <= 11) {
                stats.planetType = 'ThioGaian';
                stats.description =
                    'These are Gaian worlds based on sulfur photosynthesis rather than oxygen photosynthesis.  The protein S8, which is produced in photosynthesis, is carried to the upper atmosphere and shields the surface from radiation, while the sulfuric acid which is also produced by this process is used to produce sulfur dioxide by plankton-like faunaforms or microbes, which is then produced by other life forms, which in turn produce carbon dioxide and hydrogen sulfide as a waste product.  These are then used by the floraforms to continue the cycle.  Such worlds tend to have yellowish skies, and the soil may be stained red from extensive rust deposits.';
                stats.chemistry.push(Chemicals.Sulfur);
                chem = Chemicals.Sulfur;
            } else {
                stats.planetType = 'ChloriticGaian';
                stats.description =
                    'These are Gaian worlds which are quite rare and tend to be located around warmer G and cooler F-type stars.  They typically have little or no complex surface life, with most forms remaining in marine environments.  They are marked by the presence of large quantities of integrated chlorine in the environment, which is integral to any biomes present.  in appearance, the oceans and clouds are somewhat greenish, while the continents tend to be a somewhat barren brown.';
                stats.chemistry.push(Chemicals.Chlorine);
                chem = Chemicals.Chlorine;
            }
        } else if (roll <= 8) {
            stats.planetType = 'Amunian';
            stats.description =
                ' These are carbon-rich worlds, and thus deprived of water, silicates, and other oxygen-bearing compounds.  They are rich in carbides, hydrocarbons, and other carbon compounds.  The soils of these particular worlds are also rich in nitrogen.  Life on these worlds forms not in water, then, which is rock-hard at the temperatures involved, but in liquid ammonia.  These worlds are found around M and K-dwarf suns, as the ultraviolet flux of anything greater would break down the planetary supply of ammonia.';
            stats.chemistry.push(Chemicals.Carbon);
            stats.chemistry.push(Chemicals.Ammonia);
            ageMod += 1;
        } else {
            stats.planetType = 'Tartarian';
            stats.description =
                'These are worlds rich in methane and carbon compounds.  Life on these worlds forms not in water, which is rock hard at the temperatures involved, but in liquid methane.  These worlds are found around dimmer suns, or in the outer regions of Solar-type suns.';
            stats.chemistry.push(Chemicals.Carbon);
            stats.chemistry.push(Chemicals.Methane);
            ageMod += 3;
        }

        stats.biosphere = 0;
        if (workObj.age >= 4 + ageMod) {
            stats.biosphere = this.toValue(this.random.between(1, 3), Score.n0, Score.nG);
        } else if (workObj.age >= this.random.between(1, 3) + ageMod - (workObj.star.spectralClass === 'D' ? 3 : 0)) {
            stats.biosphere = this.toValue(this.random.between(2, 12), Score.n0, Score.nG);
        }

        stats.atmosphere = Score.nA;
        if (stats.biosphere >= Score.n3 && chem === Chemicals.Water) {
            stats.atmosphere = this.toValue(this.random.between(2, 12) + stats.size - 7, Score.n2, Score.n9);
        } else if (stats.biosphere >= Score.n3 && (chem === Chemicals.Chlorine || chem === Chemicals.Sulfur)) {
            stats.atmosphere = Score.nB;
        }
        stats.hydrosphere = this.random.between(0, 10);
        stats.planetGroup = 'Terrestrial';
        stats.planetClass = 'Tectonic';

        workObj.planet.orbitStats.planetaryStats = stats;
        workObj.planet = this.response(workObj.planet, workObj.star, workObj.zone, workObj.age, workObj.techLevel, workObj.parent);
        return workObj.planet;
    }
}
