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
          // CHEATS //
          'a' - all weaopns, otherwise you only start with a pistol, and not all the others are available in-game.
          'g' - toggles god mode

You can still fire with the shield, but upon deploying your weapon defaults to pistol. It's the only weapon you can fire with your free hand!
You can still switch you're slung weapon with shield raised, and it will be drawn when the shield is lowered.

Oncoming damage is indicated by a klaxon;
Do not be alarmed by the running Tomer in the first screen. He can be removed in the levels.js file ( + "_Tomer").
The walking shai minigame - walking shais that can be clicked to a stop.
Music is on, by default.

Normal mode only has THREE stages, so far.

Enemies can move with css animation AND jquery. The latter has them turn to face the right direction, but the former does not.

Note...
the spin-up on the chaingun, it was hard to do.
the animation frames on the duke machinegun(4). It's better than the original, trust me.
the changing ammo icons.
the ricochets off raised shield.
the credits.
the chainsaw now has a 'reach' checker, based on "elem.getBoundingClientRect().height", which gives the final height after css.
Will have to be improved for different sized enemies, but for now, it limits chainsaw use to more in-your-face distance.

Current bugs:
You can double-(or triple!) click pickups to get double, before they go.
Machine guns can get stuck on strafe mode - more rare now.
Ammo sometimes reaches -1.
Creatures can get stuck on hurt frame.
Enemy positioning and scale relative to the backgrounds is tricky, especially on generated levels

              
