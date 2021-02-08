# DoomRep
Controls: 

          1 - Chainsaw;
          2 - Pistol;
          3 - Shotgun;
          4 - Duke3d machineGun;
          5 - Chaingun, spin-up;
          6 - DuelNeutron from Apogee's BlakeStone;
          7 - Duke3d pipebomb
          SPACE - Shields from oncoming damage;
          // CHEATS //
          'a' - all weaopns, otherwise you only start with a pistol.
                All the weapons are available in-game, though.
          'g' - toggles god mode

The main menu has a walking shai minigame - walking shais that can be clicked to a stop.

You can still fire with the shield, but upon deploying your weapon defaults to pistol. It's the only weapon you can fire with your free hand!
You can still switch you're slung weapon with shield raised, and it will be drawn when the shield is lowered.

Oncoming damage is indicated by a klaxon, if you're quick you can gun down your assailant before he hits you.
Music is on, by default.

Normal mode only has THREE stages, so far.

Enemies can move with css animation AND jquery. The latter has them turn to face the right direction, but the former does not.

Note:\
the spin-up on the chaingun, it was hard to do.\
the animation frames on the duke machinegun(4). It's better than the original, trust me.\
the changing ammo icons.\
the ricochets off raised shield.\
the credits. They play at the end, also from the main menu\
the chainsaw now has a 'reach' checker, based on "elem.getBoundingClientRect().height", which gives the final height after css.\
Will have to be improved for different sized enemies, but for now, it limits chainsaw use to more in-your-face distance.\
the pipebomb and explosive barrels have a 'gib' radius, so that close enemies go to pieces, and further ones die normally.\
the headshot system - currently headshots give double damage and have a different death animation, in most cases.\

Current bugs:
You can double-fire the shotgun before the reload kicks in!
Machine guns can get stuck on strafe mode - more rare now.
Ammo sometimes reaches -1.
Creatures can get stuck on hurt frame.
Enemy positioning and scale relative to the backgrounds is tricky, especially on generated levels.
