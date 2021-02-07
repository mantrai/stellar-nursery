# stellar-nursery

At this stage this is mainly a learning exercise to test/learn:
* Typescript
* JS/Typescript unit testing
* Project linting/formatting
* Adding/Updating/Using my own projects in NPM

Beyond the above reasons for this project, the goal of this project
is to generate realistic Star systems based upon RTT (traveller) pen and paper rules.

When finished the goals will be:
* Generation of json object that describes a star system, its stars and planets.
* Using stellar-nursery-denizens generate star/planet/moon names as well as allowing for terraforming based on faction/tech level
* Be written/broken down in such a way that a user can replace generators with their own, or add more to provide more information.


Unless the next generator is set, each generator is self-contained making it easier to test.
Randomness is provided by RandomSeedFactory from [stellar-nursery-shared](https://github.com/mantrai/stellar-nursery-shared)
allowing it to be easily mocked even using the core RandomSeedFactory the same seed returns the same result every time.



Stellar Nursery uses the following:

[stellar-nursery-shared](https://github.com/mantrai/stellar-nursery-shared)
[stellar-nursery-denizens](https://github.com/mantrai/stellar-nursery-denizens)
