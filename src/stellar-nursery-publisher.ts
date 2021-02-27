import IPublisher from './interfaces/i-publisher';
import ISubscriber from './interfaces/i-subscriber';

export default class StellarNurseryPublisher<O, R> implements IPublisher<O, R> {
    private _subscriptions: Map<number, ISubscriber<O, R>> = new Map<number, ISubscriber<O, R>>();

    bulkSubscribe(subscribers: Map<number, ISubscriber<O, R>>): IPublisher<O, R> {
        this._subscriptions = subscribers;
        return this;
    }

    getSubscribers(): Map<number, ISubscriber<O, R>> {
        return this._subscriptions;
    }

    getSubscription(key: number): ISubscriber<O, R> | false {
        return this.hasSubscription(key) ? (this._subscriptions.get(key) as ISubscriber<O, R>) : false;
    }

    hasSubscription(key: number): boolean {
        return this._subscriptions.has(key);
    }

    subscribe(subscriber: ISubscriber<O, R>): IPublisher<O, R> {
        this._subscriptions.set(subscriber.getKey(), subscriber);
        return this;
    }

    getKeys(): number[] {
        return Array.from(this._subscriptions.keys()).sort((a, b) => {
            return a - b;
        });
    }
}
