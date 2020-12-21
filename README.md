# DoomRep
Controls: 
          1 - Chainsaw;
          2 - Pistol;
          3 - Shotgun;
          4 - Duke3d machineGun;
          5 - N/A
          6 - Chaingun, spin-up;
          7 - DuelNeutron from Apogee's BlakeStone;
          SPACE - Shields from oncoming damage;

'a' gives all weaopns, otherwise you only start with a pistol, and not all the others are available in-game.

You can still fire with the shield, but upon deploying your weapon defaults to pistol. It's the only weapon you can fire with your free hand!
You can only switch weapons when your shield is lowered, you've only got two hands, right?

Oncoming damage is indicated by a klaxon;
Do not be alarmed by the running Tomer in the first screen. He can be removed in the level.ts file.
At the mo, the second menu button only links to files on my computer.
Music is on, by default.

Normal mode only has ONE stage so far.

Note...
the spin-up on the chaingun, it was hard to do.
the animation frames on the duke machinegun(6). It's better than the original, trust me.
the changing ammo icons.
the ricochets off raised shield.
the credits.
the chainsaw now has a 'reach' checker, based on "elem.getBoundingClientRect().height", which gives the final height after css.
Will have to be improved for different sized enemies, but for now, it limits chainsaw use to more in-your-face distance.

Current bugs:
Machine guns can get stuck on strafe mode - more rare now.
Ammo sometimes reaches -1.
Creatures can get stuck on hurt frame.
Enemy positioning and scale relative to the backgrounds is tricky, especially on generated levels

              
