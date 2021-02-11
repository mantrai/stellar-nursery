export default interface ISubscriber<K, O, R> {
    getKey(): K;
    hasWork(workObj: O): boolean;
    run(workObj: O) : R;
}
