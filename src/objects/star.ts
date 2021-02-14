import Orbit from './orbit';
import IOrbitItem from '../interfaces/i-orbit-item';
import { OrbitCategory } from '../types/enum';

export default class Star implements IOrbitItem {
    public spectralClass: string = '';
    public luminosityClass: string = '';
    public get spectralLuminosityClass(): string {
        return this.spectralClass + '-' + this.luminosityClass;
    }
    public separation: number = 0;
    public orbits: Orbit<Star>[] = [];
    public orbitCategory: number = OrbitCategory.Star;
}
