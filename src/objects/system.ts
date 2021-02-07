import Orbit from './orbit';
import Star from './star';

export default class System {
    public name: string = '';
    public age: number = 0;
    public type: number = 1;
    public orbits: Orbit<Star>[] = [];
}
