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


Each generator only deals with its own entity and can be set to run related generators if defined.
i.e.
1. System Generator - generates age, and how many stars the system has, if set it will use 2.
2. Star Generator - generates star stats, and if set use 3.
3. Orbit Generator - generates orbits around star in each zone and base planetary type, if set it will use 4.
4. Planetary Generator (Planetary type specific i.e. Dwarf) - generates exact planet type based on zone position, if set it will use 5.
5. Planet Generator (Planet type specific i.e Hebean) - generates stats for planet, if set will use 6 (unless is dealing with moon).
....

Unless the next generator is set, each generator is self-contained making it easier to test.
Randomness is provided by RandomSeedFactory from [stellar-nursery-shared](https://github.com/mantrai/stellar-nursery-shared)
allowing it to be easily mocked even using the core RandomSeedFactory the same seed returns the same result every time.



Stellar Nursery uses the following:

[stellar-nursery-shared](https://github.com/mantrai/stellar-nursery-shared)
[stellar-nursery-denizens](https://github.com/mantrai/stellar-nursery-denizens)
