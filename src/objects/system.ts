import Orbit from './orbit';
import Star from './star';
import {Score, SystemType} from 'stellar-nursery-shared';

export default class System {
    public name: string = '';
    public age: number = 0;
    public type: number = SystemType.Solitary;
    public orbits: Orbit<Star>[] = [];
    public techLevel:number = Score.n0;
    public faction: string = '';

    // noinspection JSUnusedGlobalSymbols
    public toJSON(): object {
        return {
            name: this.name,
            type: SystemType[this.type],
            age: this.age,
            orbits: this.orbits,
            techLevel: Score[this.techLevel].replace('n', ''),
            faction: this.faction
        };
    }
}
