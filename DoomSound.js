"use strict";
var Pshot = new sound("sound/DSPISTOL.WAV");
var Pshot2 = new sound("sound/DSPISTOL.WAV");
var SGshot = new sound("sound/DSSHOTGN.WAV");
var SawUp = new sound("sound/DSSAWUP.WAV");
var Saw = new sound("sound/DSSAWFUL.WAV");
var SawIdle = new sound("sound/DSSAWIDL.WAV");
var toggle = new sound("sound/DSSWTCHN.WAV");
var toggle2 = new sound("sound/DSSWTCHN.WAV");
var click = new sound("sound/Turok/insct1ap.wav");
var click2 = new sound("sound/Turok/load2p.wav");
var ammoClick = new sound("sound/WOLF3D/Ammo.wav");
var bizwarn = new sound("sound/Hlife/bizwarn.wav");
var buzwarn = new sound("sound/Hlife/buzwarn.wav");
var demonPain = new sound("sound/Doom_Pinky/DSDMPAIN.WAV"); // UNUSED
var humanDead = new sound("sound/WOLF3D/Death 1.wav");
var bossDed = new sound("sound/DSBRSDTH.WAV"); // UNUSED
var Turokscream = new sound("sound/Turok/scream1p.wav");
var Hlifescream1 = new sound("sound/Hlife/sci_pain1.wav");
var explosion = new sound("sound/Doom_misc/DSBAREXP.WAV");
var collectPowerup = new sound("sound/Doom_misc/DSGETPOW.WAV");
var collectItem = new sound("sound/Doom_misc/DSITEMUP.WAV");
var keenDth = new sound("sound/Doom_misc/DSKEENDT.WAV");
var DoomguyPain = new sound("sound/Doom_misc/DSPLPAIN.WAV");
var Imp_Shout_1 = new sound("sound/Doom_Imp/DSBGSIT1.WAV");
var Imp_Shout_2 = new sound("sound/Doom_Imp/DSBGSIT2.WAV");
var Imp_Pain = new sound("sound/Doom_Zombies/DSPOPAIN.WAV");
var Imp_Idle = new sound("sound/Doom_Imp/DSBGACT.WAV");
var Imp_Death_1 = new sound("sound/Doom_Imp/DSBGDTH1.WAV");
var Imp_Death_2 = new sound("sound/Doom_Imp/DSBGDTH2.WAV");
var Imp_Attack = new sound("sound/Doom_Imp/DSCLAW.WAV");
var Troop_Shout_1 = new sound("sound/Doom_Zombies/DSPOSIT1.WAV");
var Troop_Shout_2 = new sound("sound/Doom_Zombies/DSPOSIT2.WAV");
var Troop_Shout_3 = new sound("sound/Doom_Zombies/DSPOSIT3.WAV");
var Troop_Pain = new sound("sound/Doom_Zombies/DSPOPAIN.WAV");
var Troop_Idle = new sound("sound/Doom_Zombies/DSPOSACT.WAV");
var Troop_Death_1 = new sound("sound/Doom_Zombies/DSPODTH1.WAV");
var Troop_Death_2 = new sound("sound/Doom_Zombies/DSPODTH2.WAV");
var Troop_Death_3 = new sound("sound/Doom_Zombies/DSPODTH3.WAV");
var Patrol_Shout_1 = new sound("sound/BLAKESTONE/Halt.wav");
var Patrol_Shout_2 = new sound("sound/BLAKESTONE/intruder.wav");
var Patrol_Death_1 = new sound("sound/BLAKESTONE/SPdeath.wav");
var Patrol_Death_2 = new sound("sound/BLAKESTONE/SciDeath.wav");
var patrolShouts = [Patrol_Shout_1, Patrol_Shout_2];
var patrolDeaths = [Patrol_Death_1, Patrol_Death_2, humanDead]; // use from WOLF??
var troopShouts = [Troop_Shout_1, Troop_Shout_2, Troop_Shout_3];
var troopDeaths = [Troop_Death_1, Troop_Death_2, Troop_Death_3];
var ImpShouts = [Imp_Shout_1, Imp_Shout_2, Imp_Idle]; // use idle??
var ImpDeaths = [Imp_Death_1, Imp_Death_2];
var Deuscredits = new sound("sound/Music/DeusCredits.mp3");
var UTcredits = new sound("sound/Music/UT_menu.mp3");
var BSMenu = new sound("sound/Music/BS/03_Meeting.ogg");
var AliensOfGold = new sound("sound/Music/BS/02_Aliens_of_Gold.ogg");
var DarkHall = new sound("sound/Music/BS/06_Dark_Hall.ogg");
var Jungle = new sound("sound/Music/BS/07_Jungle.ogg");
var RacShuffle = new sound("sound/Music/BS/08_Rac_Shuffle.ogg");
var BlakeMusic = [AliensOfGold, DarkHall, Jungle, RacShuffle];
var Intermission = new sound("sound/Music/DOOM/113_Intermission_From_DOOM.ogg");
var DoomsGate = new sound("sound/Music/DOOM/102_At_Doom's_Gate.ogg");
var Secrets = new sound("sound/Music/DOOM/110_Hiding_the_Secrets.ogg");
var Demons = new sound("sound/Music/DOOM/112_The_Demons_From_Adrian's_Pen.ogg"); // slow start
var Untitled = new sound("sound/Music/DOOM/118_Untitled.ogg");
var Donna = new sound("sound/Music/DOOM/119_Donna_to_the_Rescue.ogg");
var Spider = new sound("sound/Music/DOOM/121_Facing_the_Spider.ogg");
var DoomMusic = [DoomsGate, Secrets, Untitled, Donna, Spider];
// AvP has diff .wav format??
//var AvpGun = new sound("sound/AvP/pistol_fire_01.wav")
var Avpminigun = new sound("sound/minigun_shoot_loop_01.mp3");
var Avpminigun2 = new sound("sound/minigun_shoot_loop_01.mp3");
// 
var MGun = new sound("sound/MachineGun.mp3");
var TurokRotate = new sound("sound/Turok/gatlin1p.wav"); //End gap
var TurokMinigun = new sound("sound/Turok/mchgun2p.wav"); //Too slow!
var SSamRotate = new sound("sound/SSam/Rotate.wav");
var SSamRotate2 = new sound("sound/SSam/RotateUp.wav");
var SSamMinigun = new sound("sound/SSam/Fire.wav"); //Too slow! Use for DN
var Bullet1 = new sound("sound/Bullets/bullet_by_01.mp3");
var Bullet2 = new sound("sound/Bullets/bullet_by_02.mp3");
var Bullet3 = new sound("sound/Bullets/bullet_by_03.mp3");
//var Bullet4 = new sound("sound/Bullets/bullet_by_08.mp3") odd?
var Bullet5 = new sound("sound/Bullets/bullet_by_09.mp3");
var Bullet6 = new sound("sound/Bullets/bullet_by_10.mp3");
var Bullet7 = new sound("sound/Bullets/bullet_by_11.mp3");
var Bullet8 = new sound("sound/Bullets/bullet_by_12.mp3");
var Turicochet = new sound("sound/Turok/riccht1p_louder.mp3");
var BloodRicochet_1 = new sound("sound/Blood/RICOCHT1.WAV");
var BloodRicochet_2 = new sound("sound/Blood/RICOCHT2.WAV");
Avpminigun.sound.setAttribute("loop", "infinite"); //CHAINGUN
SSamMinigun.sound.setAttribute("loop", "infinite"); //DUALNEUTRON
SSamRotate.sound.setAttribute("loop", "infinite");
//TurokRotate.sound.setAttribute("loop", "infinite");
TurokMinigun.sound.setAttribute("loop", "infinite");
Saw.sound.setAttribute("loop", "infinite");
MGun.sound.setAttribute("loop", "infinite"); //DukeMgun
SawIdle.sound.setAttribute("loop", "infinite");
