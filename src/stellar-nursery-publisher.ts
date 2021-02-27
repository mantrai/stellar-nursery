import IPublisher from './interfaces/i-publisher';
import ISubscriber from './interfaces/i-subscriber';

export default class StellarNurseryPublisher<K, O, R> implements IPublisher<K, O, R> {
    private _subscriptions: Map<K, ISubscriber<K, O, R>> = new Map<K, ISubscriber<K, O, R>>();

    bulkSubscribe(subscribers: Map<K, ISubscriber<K, O, R>>): IPublisher<K, O, R> {
        this._subscriptions = subscribers;
        return this;
    }

    getSubscribers(): Map<K, ISubscriber<K, O, R>> {
        return this._subscriptions;
    }

    getSubscription(key: K): ISubscriber<K, O, R> | false {
        return this.hasSubscription(key) ? (this._subscriptions.get(key) as ISubscriber<K, O, R>) : false;
    }

    hasSubscription(key: K): boolean {
        return this._subscriptions.has(key);
    }

    subscribe(subscriber: ISubscriber<K, O, R>): IPublisher<K, O, R> {
        this._subscriptions.set(subscriber.getKey(), subscriber);
        return this;
    }

    getKeys(): K[] {
        return Array.from(this._subscriptions.keys()).sort() as K[];
    }
}
