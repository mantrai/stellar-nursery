import Orbit from './orbit';
import IOrbitItem from '../interfaces/i-orbit-item';
import {OrbitCategory} from 'stellar-nursery-shared';

export default class Star implements IOrbitItem {
    public spectralClass: string = '';
    public luminosityClass: string = '';
    public separation: number = 0;
    public orbits: Orbit<IOrbitItem>[] = [];
    public orbitCategory: number = OrbitCategory.Star;

    public get spectralLuminosityClass(): string {
        return this.spectralClass + '-' + this.luminosityClass;
    }

    public toJSON(): object {
        return {
            spectralClass: this.spectralClass,
            luminosityClass: this.luminosityClass,
            spectralLuminosityClass: this.spectralLuminosityClass,
            orbits: this.orbits,
            orbitCategory: OrbitCategory[this.orbitCategory],
        };
    }
}
