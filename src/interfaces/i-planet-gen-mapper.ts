import IPlanetGen from './i-planet-gen';
import IPlanetaryGen from './i-planetary-gen';

export default interface IPlanetGenMapper {
    addPlanetaryGen(key: number, planetaryGen: IPlanetaryGen): IPlanetGenMapper;
    hasPlanetaryGen(key: number): boolean;
    getPlanetaryGen(key: number): IPlanetaryGen;

    addPlanetGen(key: number, planetGen: IPlanetGen): IPlanetGenMapper;
    hasPlanetGen(key: number): boolean;
    getPlanetGen(key: number): IPlanetGen;
}
