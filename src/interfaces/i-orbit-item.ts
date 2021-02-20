import Orbit from '../objects/orbit';

export default interface IOrbitItem {
    orbitCategory: number;
    orbits: Orbit<IOrbitItem>[];
    toJSON(): object;
}
