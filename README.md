# Flappy bird racing

![Screenshot](/screenshot.png)

This is a [TINS 2023](https://tins.amarillion.org/2023) entry by [Victor Williams Stafusa da Silva](https://github.com/victorwss).

## How to run it?

Download everything in a folder and run the `flappy-bird-racing.html` into your browser.

## How is the game?

This is a multiplayer racing flappy bird game, although you may also play lonely if you want to, it's quite challenging.

The first player to reach the end wins!

However, to reach the end, it will be a long and troublesome path full of hazards and enemies. Everything kills you,
so watch out. But, you have infinite lifes, and will respawn a few seconds after the death, so you can always try again
until you do it.

First, choose if you want the easy mode (5 levels + ending in level 6) or the hard mode (13 levels + ending in level 14).
The levels get harder and harder as you progress through them.
Then, you also select how many players you want to have, from 1 to 6.

## The players

It might be problematic to fit more than two players in the screen,
but if you really want to, you might use your browser zoom-out feature to fit everything.

When you start the game, every bird will randomly pick a color and a language between
English, Spanish, French, German, Portuguese or Italian.

* Player 1 flaps with the Spacebar.
* Player 2 flaps with the Enter key.
* Player 3 flaps with the Numpad 5 key.
* Player 4 flaps with the Q key.
* Player 5 flaps with the P key.
* Player 6 flaps with the T key.

Fitting 6 people around a single keyboard is difficulty, but by plugging an extra USB keyboard into your computer,
this becomes easy.

Also, clicking one of the screens with the mouse makes the corresponding bird flap,
so one of the players could use the mouse instead.

I didn't checked into touchscreen mobile devices, but it might work as well.
However, it is possible to have issues if not on single-player mode.

## The game starts

The game is a fable about birds that take a long journey to distant lands because... Well, just because!

When you start the game, you'll be flashing in iridescent colors for 5 seconds. During this time, you are invulnerable.
This is important to avoid insta-death after respawning when there is a cat in the respawn spot or some other hazard
that would be impassable otherwise.

The hazards are the ceiling, the floor, the platforms (movable on later levels), the bar charts and the enemies.
If you touch any of them, you're dead! After some time, your dead body will become transparent and iridescent and
then will respawn.

There are two enemy types:

* **The turtles** - They sit quiet if you don't disturb them.
If you do disturb them, they will say something nasty and will spin around the screen killing every bird they touch.

* **The cats** - They like to jump and chase birds!
They will be one of your worst nightmares in this game!

Also, the game changes back and forth between the musics
*Learn to Fly* from *Foo Fighters* and *Iridescent* by *Linkin' Park*.
However, to avoid RIAA and non-free-content issues (as suggested by Amarillion during the competition),
they are just MID versions of the original songs converted to MP3.

* Have a lot fun!
* Amusez-vous beaucoup !
* ¡Diviértete mucho!
* Hab viel Spaß!
* Divirta-se bastante!
* Divertiti molto!

## Tips

Type `cheat();` in the browser console to unlock all the levels. Also, you might easily see the ending by doing that.

## TINS 2023

The [rules of the competition](https://tins.amarillion.org/2023/rules) were:

> genre rule #41:<br>Fable: all characters are animals
> 
> **Comments**: Put animal characters in your game! If you want to interpret the rule literally, then you could follow the classic defintition of a fable: "A usually short narrative making an edifying or cautionary point and often employing as characters animals that speak and act like humans.".

> art rule #18:<br>Iridescence
>
> **Comments**: [Iridescence](https://en.wikipedia.org/wiki/Iridescence), a colorful, rainbow-like effect that you see in things like soap bubbles, oil slicks, seashells and butterflies.

> art rule #32:<br>All Dialog must be implemented comic-book bubble style
>
> **Comments**: A comic book convention, [speech balloons](https://en.wikipedia.org/wiki/Speech_balloon) and thought bubbles are widely used in games too. 

> tech rule #65:<br>Implement a chart (bar chart, pie chart, any kind of chart)
>
> **Comments**: A good chart is useful in a sim or management game, to optimize your strategy. Also action games can use charts, to visualize player achievements. But the earliest use of charts in games is probably [Pacman](https://tins.amarillion.org/upload/images/pacman-graph-not-pacman-287927883.jpeg)
> [image omitted for brevity, just click the above link if you want to]

> bonus rule #24:<br>Dynamic Duo - If you make your game suitable for two players, you may skip one rule.
>
> **Comments**: Basically, you may substitute any rule that you dislike for this rule. If you choose to do so, declare this in your game description for the sake of clarity. All kinds of two-player styles are allowed: online, split-screen, competive or cooperative, hot seat, assymetric, you name it. 

How it is implemented? Well a image is worth 1000 words, so see those for the 2000-word equivalent:

![Screenshot](/screenshot.png)

![Screenshot 2](/screenshot2.png)

## Changes after the submission

Since this is for a competition,
I prefer to keep the changes after the submission small and minimally affecting the gameplay.
So far, the changes are those:

- With two or more players, it used be difficulty to tell for sure which bird who is controlling.
[**Fixed in this commit.**](https://github.com/victorwss/flappy-bird-racing/commit/b7d8577ae6539c04fd13dd106e6b3f9cbb516b7a)
Now, you see only your bird freshly (re)spawned birds having iridescent colors in your game view
instead of all of the them, so that is the one you are controlling.

- The music and sound effects might become boring and annoying after listening them over and over again.
[**Fixed in this commit.**](https://github.com/victorwss/flappy-bird-racing/commit/46f49f63cc5c166883868470b99b198833b6667e)
Now you can turn them on or off as you wish.

- A jumping cat that is seated is just weird.
[**Fixed in this commit.**](https://github.com/victorwss/flappy-bird-racing/commit/badc83e89cb4a0c646b216a22413c1c4f015d3ee)
The cat animation when jumping is better.
Note that this change is entirely cosmetic and don't change the actual gameplay mechanics.

- If you hold down the Enter key after pressing some button without clicking anything else in-between,
it would erroneously trigger multiple clicks to that button.
This could lead to restarting the game multiple times per second until the Enter key is released.
[**Fixed in this commit.**](https://github.com/victorwss/flappy-bird-racing/commit/287a1a22f451019324ffbcc267e4c7bc855c66bd)

- Added credits and relevant links, including to the [TINS 2023](https://tins.amarillion.org/2023/) site.
[**Changed in this commit.**](https://github.com/victorwss/flappy-bird-racing/commit/933d7537bb0a1bdabf66114a333848fc0732c672)

- After the level 9 in hard mode or in the ending level in easy mode,
the text colors in the top and botton label could be wrong.
Further the size of the bottom label could be wrong too.
[**Fixed in this commit.**](https://github.com/victorwss/flappy-bird-racing/commit/e0f735ff0a5752a7d5c77825dff02318ac3a9915)

- The fable text could overflow its box.
[**Fixed in this commit.**](https://github.com/victorwss/flappy-bird-racing/commit/60ad033e8601bb15c43466042bedc97e97ce2819)

- A bar chart with a negative value used to omit its minus sign.
[**Fixed in this commit.**](https://github.com/victorwss/flappy-bird-racing/commit/259b8cb1cc15eec34d1e218819a24893f1cf3b1a)

- The baseline of the chart was missing because a NaN was produced when trying to calculate its coordinates.
[**Fixed in this commit.**](https://github.com/victorwss/flappy-bird-racing/commit/19a50c894aef1c91987e16dd6f74fd0f96ebf2f8)

- The spacebar and Enter words from German were swapped as pointed out by Elias.
[**Fixed in this commit.**](https://github.com/victorwss/flappy-bird-racing/commit/650dcf143515cad234be6a9d82a539b831fd49d9)

- A lot of changes to this very README and its screenshots.

## Known issues

- The sounds and music are likely to fail to load in Safari due to lack of MP3 support.
Since every other modern browser does support MP3 and converting it might take a some time and space, I think it is ok.
I will do it later if there is demand.

- Not tested in mobile devices.

- Excessive memory and CPU usage.

# Licenses

## Pinyon Script font

- [Obtained from Google fonts as a free font.](https://fonts.google.com/specimen/Pinyon+Script)

- [Available at GitHub.](https://github.com/SorkinType/Pinyon)

- [Open Font License version 1.1.](/fonts/Pinyon_Script/OFL.txt)

## Parisienne font

- [Obtained from Google fonts as a free font.](https://fonts.google.com/specimen/Parisienne)

- [Open Font License version 1.1.](/fonts/Parisienne/OFL.txt)
