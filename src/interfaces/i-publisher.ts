import ISubscriber from "./i-subscriber";

export default interface IPublisher<K, O, R> {
    bulkSubscribe(subscribers: Map<K, ISubscriber<K, O, R>>): IPublisher<K, O, R> ;
    getSubscribers(): Map<K, ISubscriber<K, O, R>>;
    subscribe(subscriber: ISubscriber<K, O, R>): IPublisher<K, O, R> ;
    hasSubscription(key: K): boolean;
    getSubscription(key: K): ISubscriber<K, O, R> | false;
    getKeys(): K[];
}
