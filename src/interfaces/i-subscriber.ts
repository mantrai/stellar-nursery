export default interface ISubscriber<O, R> {
    getKey(): number;

    hasWork(workObj: O): boolean;

    run(workObj: O): R;
}
