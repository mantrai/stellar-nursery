import ISubscriber from './i-subscriber';

export default interface IPublisher<O, R> {
    bulkSubscribe(subscribers: Map<number, ISubscriber<O, R>>): IPublisher<O, R>;

    getSubscribers(): Map<number, ISubscriber<O, R>>;

    subscribe(subscriber: ISubscriber<O, R>): IPublisher<O, R>;

    hasSubscription(key: number): boolean;

    getSubscription(key: number): ISubscriber<O, R> | false;

    getKeys(): number[];
}
