import Orbit from './orbit';

export default class Star {
    public spectralClass: string = '';
    public luminosityClass: string = '';
    public get spectralLuminosityClass(): string {
        return this.spectralClass + '-' + this.luminosityClass;
    }
    public separation: number = 0;
    public orbits: Orbit<any>[] = [];
}
