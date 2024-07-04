# Chapter 2: Elementary Strategies
> Your mental models need training. At least 200 epochs. If you don't gradient descent, your accuracy will be low and your loss high.
Option traders have an unbelievably large number of choices available to him. This chapter details a few methods to cut throuhg the noise.

Steps
1. Eliminate a bunch of options
2. Do it over and over again to train pattern recognition
3. Start seeing patterns, develop logic, start building strategies
4. Individual options -> combinations -> complex strategies involving multiple contracts

Valuation: either zero, at/out of money, or intrinsic value

## Buy and sell strategies
![calls and puts](callsputs.png)

Calls
* The intrinsic value has to be greater than the strike price for it to be profitable
* Say you think the contract will rise to 110 before expiration. Then you can buy a 100 call for 2.70. The profit = intrinsic - 2.70 (7.30)
* On the same line, if you believe it's going to 110, you can sell 115 calls for .20 and assume it'll never be called, and pocket the difference.

Puts
* The intrinsic value must be greater than the market price for it to be profitable
* If it rises to 110 by expiration, any put less than 105 is worthless

> An option's value is always determinate on it's underlying asset

We can graph it, but first, profit and loss graph:
![plgraph](plgraph.png)

Put and call graph: 
![graph of puts and calls](callnputgraph.png)
> Holy shit it's relu

## Risk/Reward characteristict
> All the graphs are relu

![longcall](longcall.png)
* The higher the price at expiration, the better - you get more cash/share
* Loss is limited to premium, worst case you'll pay the strike price

![longput](longput.png)
* The lower the price at expiration, the better - you get more shares/cash

![shortcall](shortcall.png)
* You're betting it goes down, so you sell the option to buy it
* Loss theoretically infinite since the asset value can go infinitely up (not likely though) (losing potential earnings)
* Gain is limited to the premium  
* Example is if someone sold me the right to buy NVIDIA at $600 in January, and it rises to $1000. They lose $400 - premium dollars

![shortput](shortput.png)
* You're betting it goes up, so you sell the option to sell it
* Loss capped at strike price
* Gain limited to premium
* Example is if someone sold me the right to sell Boeing at $200, and it drops to $184. I sell, they lose $16 - premium dollars because they pay more for something worth less.

Avoiding risk is impossible as a trader. You've gotta hedge your bets, cover your positions, and consider the probabilities of everything happening. Like russian roulette with a PKP for ten billion dollars.

## Combination strategies
> 

![arbitrage1](arbitrage1.png)
* Maximum loss is 6.4, only if the option is 100 at expiration
* Range for which you make money either way
* Sensible if there's gonna be movement definitely, but you don't know which way

![direction](dontletthemknow.png)

Vice versa for shorts - if you're pretty damn sure it'll stay the same. Otherwise loss is basically uncapped.
![arbitrage2](arbitrage2.png)

You can also long *and* short to create capped profits and losses.
![arbitrage3](arbitrage3.png)

## Rules for the graphs
1. Bends and corners will happen at the exercise prices
2. If the position is long and short equal number of calls, the potential downside risk/reward will be equal to the total amount of credit/debit used to establish the position 
    * If it's short + long, risk/reward is capped by premiums given/taken
3. Above the highest strike price all calls will go into the money, below the lowest exercise price all puts will go into the money
    * "so the entire position will act like an underlying position which is either long or short underlying contracts equal to the number of net long/short calls" for calls above
    * "so the entire position will act like an underlying position which is either long or short underlying contracts equal to the number of net long/short puts" for puts below

Consider:
* Long 95 call at 5.5
* Short three 105 calls at 1.15
* Max downside is 5.5 - 3(1.15) - 2.05
* Max upside is 5.5 + 3(1.15) = 7.95

![arbitrage4](arbitrage4.png)
