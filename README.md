# Flappy bird racing

![Screenshot](https://github.com/victorwss/flappy-bird-racing/blob/main/screenshot.png?raw=true)

This is a [TINS 2023](https://tins.amarillion.org/2023) entry by [Victor Williams Stafusa da Silva](https://github.com/victorwss).

## How to run it?

Download everything in a folder and run the `flappy-bird-racing.html` into your browser.

## How is the game?

This is a multiplayer racing flappy bird game, although you may also play lonely if you want to, it's quite challenging.

The first player to reach the end wins!

However, to reach the end, it will be a long and troublesome path full of hazards and enemies. Everything kills you,
so watch out. But, you have infinite lifes, and will respawn a few seconds after the death, so you can always try again
until you do it.

First, choose if you want the easy mode (5 levels) or the hard mode (13 levels). They gets harder and harder.
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
***Learn to Fly*** from ***Foo Fighters*** and ***Iridescent*** by ***Linkin' Park***.
However, to avoid RIAA and non-free-content issues (as suggested by Amarillion during the competition),
they are just MID versions of the original songs converted to MP3.

Have a lot fun! Amusez-vous beaucoup ! ¡Diviértete mucho! Hab viel Spaß! Divirta-se bastante! Divertiti molto!

## Tips

Type `cheat();` in the browser console to unlock all the levels. Also, you might see the ending by doing that.

## Changes after the submission

Since this is for a compettion, I prefer to keep the changes after the submission small and minimally affecting the
gameplay. So far the changes are those:

- With two or more players, it used be difficulty to tell for sure which bird who is controlling.
[**Fixed in this commit.**](https://github.com/victorwss/flappy-bird-racing/commit/b7d8577ae6539c04fd13dd106e6b3f9cbb516b7a)
Now, you see only your bird freshly (re)spawned birds having iridescent colors in your game view
instead of all of the them, so that is the one you are controlling.

- The music and sound effects might become boring and annoying after listening them over and over again.
[**Fixed in this commit.**](https://github.com/victorwss/flappy-bird-racing/commit/46f49f63cc5c166883868470b99b198833b6667e)
Now you can turn them on or off as you wish.

## Known issues

- The sounds and music are likely to fail to load in Safari due to lack of MP3 support.
Since every other modern browser does support MP3 and converting it might take a some time and space, I think it is ok.
I will do it later if there is demand.

- Not tested in mobile devices.

- Excessive memory and CPU usage.

- To avoid the control buttons capturing the Enter key, click the blank area in the page before playing.

# Licenses

## Pinyon Script font

- [Obtained from Google fonts as a free font.](https://fonts.google.com/specimen/Pinyon+Script)

- [Available at GitHub.](https://github.com/SorkinType/Pinyon)

- [Open Font License version 1.1.](/fonts/Pinyon_Script/OFL.txt)

## Parisienne font

- [Obtained from Google fonts as a free font.](https://fonts.google.com/specimen/Parisienne)

- [Open Font License version 1.1.](/fonts/Parisienne/OFL.txt)
