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

The library is designed so each generator deals with a specific job.

*note: Subscribed generators when called calls hasWork to see if the subscribed generator should be run.

- System Generator (ISystemLevelGen)
    - Generates age, and how many stars the system has.
    - IStarLevelGen can be subscribed to this generator
        - Subscribers are called once and will run ALL which have work
- Star Generator (IStarLevelGen)
    - Generates star stats.
    - IOrbitGen can be subscribed to this generator
        - Subscribers are  called once and will stop when it finds first that has work.
- Orbit Generator  (IOrbitGen)
    - Calculates how many orbits in each zone.
    - IPlanetCategoryGen can be subscribed to this generator
        - Subscribers are called once per orbit and will stop when it finds first that has work (for each orbit).
- Planet Category Generator (IPlanetCategoryGen)
    - Calculates base planet type.
    - IPlanetGen can be subscribed to this generator
        - Subscribers are called once and will stop when it finds first that has work.
- Planet Generator (IPlanetGen)
    - Calculates exact planet type from base
    - Generates stats for planet
    - (To Come) IMoonOrbitGen can be subscribed to this generator
        - Subscribers are called once if planet is not a moon and will stop when it finds first that has work.
- (To Come) Moon Generator (IMoonOrbitGen)
    - (To Come) IPlanetCategoryGen can be subscribed to this generator
        - (To Come) Subscribers are called once per orbit and will stop when it finds first that has work (for each orbit).
        - (To Come) This means you can use the same Planet Category Generator and publishers in this to generate moons.

Due to this setup it means each generator can be tested individually, extra generators subscribed or not.


(To Come) Better readme

Randomness is provided by RandomSeedFactory from [stellar-nursery-shared](https://github.com/mantrai/stellar-nursery-shared)
allowing it to be easily mocked even using the core RandomSeedFactory the same seed returns the same result every time.



Stellar Nursery uses the following:

[stellar-nursery-shared](https://github.com/mantrai/stellar-nursery-shared)
[stellar-nursery-denizens](https://github.com/mantrai/stellar-nursery-denizens)
