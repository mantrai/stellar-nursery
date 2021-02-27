import Orbit from './orbit';
import Star from './star';
import { SystemType } from 'stellar-nursery-shared';

export default class System {
    public name: string = '';
    public age: number = 0;
    public type: number = SystemType.Solitary;
    public orbits: Orbit<Star>[] = [];

    // noinspection JSUnusedGlobalSymbols
    public toJSON(): object {
        return {
            name: this.name,
            type: SystemType[this.type],
            age: this.age,
            orbits: this.orbits,
        };
    }
}
