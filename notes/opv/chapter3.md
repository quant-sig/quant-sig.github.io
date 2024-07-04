# Chapter 3: Introduction to Theoretical Pricing Models 
> Correctly predicting speed *and* direction is usually beyond most traders' capabilities
> Quantitative trading is more suited to highly complex markets with more hidden trends and patterns, more dimensions to play with

### Quantifying strategies with numbers rather than "probably"
* Direction of market heavily influences trading strategy
* Normal investors might buy one thing, wait until it hits the target price, then sell
* Option traders have more to deal with; options constantly change and opportunities open and close very frequently
* Underlying market trader is interested exclusively in how the market moves, option traders also watch how people move - how fast the market moves 
* Speed is essential - you get the speed wrong, you die

At minimum a trader must consider:
1. Price of underlying contract
2. Exercise price
3. The amount of remaining time
4. The direction he expects the underlying market to move
5. The expected movement speed

Ideally, you can quantify everything, use a formula, and derive a value for the option (like arbitrage betting). The goal of option evaluation is to **analyze an option based on the terms of the option contract, as well as current market conditions and future expectations.**

## Expected return and theoretical value
Expected return is exactly what you'd expect

Theoretical value: the price you'd expect to pay to break even. 
> The most common considerations are the expected return and value of proposition, but there are other considerations: **carrying cost** 

e.g roulette. 
* You give the casino 0.95, and if you lose, you give it to them immediately; if you win, and they will send you the $36 in 2 months.
* The 0.95 you took out could've been compounding in the bank (book give 12%, insane) so you'd lose 0.02 on that. 
* So the theoretical value of the bet is the E[x] of 0.95 - 0.02 carrying cost = 0.93

Exchanges are basically casinos.

## Notes on models
> In each case, the model is constructed to help us better understand the world in which we live. However, it is unwise, and sometimes dangerous, to assume that the model and the real world which it represents are indentical in every way.

* Knowing about them is important but by no means do they ensure success
* Can't rely on one thing
* "A new option trader is like someone entering a dark room, and the models a dim candle. He can pick out the general layout, but not the fine details. What he sees may also be distorted by the candle."

Have full awareness of the limitations; a lot of successful option traders use them, so just be smart about it.

## A simple approach

