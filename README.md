Simple Mastermind
=================

A simple web version of the famous board game [Mastermind][Mastermindwikipedia].

**[Play it here!](https://lenaindelaforetmagique.github.io/MasterMind/)**

Controls
--------

- Click or touch the code pegs on the right to compose a combination guess.
- Submit it with the button _Play_.
- Correct it with the button _Clear_

Query string
------------
Query arguments may be added to URL after '?':
- digits=x : the number of pegs composing the combination (default: 4 ; 1≤x≤8),
- colors=x : the number of colors for pegs (default: 6 ; 1≤x≤8),
- limit=x : the max-number of tries before Game Over (default: 10 ; 1≤x≤20).


Screenshot!
-----------

![Screenshot](screenshot.png)

License
=======

_Simple Mastermind_ is licensed under the [MIT License](LICENSE.txt). Distribute and modify at will!

A lot of things were inspired and copied from [Eltzi's Tetris 2048][Eltzi], MIT License.

Gentium Book Basic font from [Google Fonts](https://www.google.com/fonts/specimen/Gentium+Book+Basic), distributed under the [SIL Open Font License, 1.1](http://scripts.sil.org/cms/scripts/page.php?site_id=nrsi&id=OFL).

[Mastermindwikipedia]:https://en.wikipedia.org/wiki/Mastermind_(board_game)
[Eltzi]: https://github.com/castux/eltzi/
