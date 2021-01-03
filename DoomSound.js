"use strict";
var Pshot = new sound("sound/DSPISTOL.WAV");
var SGshot = new sound("sound/DSSHOTGN.WAV");
var SawUp = new sound("sound/DSSAWUP.WAV");
var Saw = new sound("sound/DSSAWFUL.WAV");
var click = new sound("sound/Turok/insct1ap.wav");
var click2 = new sound("sound/Turok/load2p.wav");
var bizwarn = new sound("sound/Hlife/bizwarn.wav");
var ded = new sound("sound/DSDMPAIN.WAV");
var ded2 = new sound("sound/DSPODTH3.WAV");
var humanDead = new sound("sound/WOLF3D/Death 1.wav");
var bossDed = new sound("sound/DSBRSDTH.WAV");
var Turokscream = new sound("sound/Turok/scream1p.wav");
var Hlifescream1 = new sound("sound/Hlife/sci_pain1.wav");
var Deuscredits = new sound("sound/DeusCredits.mp3"); // error
var UTcredits = new sound("sound/UT_menu.mp3");
// AvP has diff .wav format??
var AvpGun = new sound("sound/AvP/pistol_fire_01.wav");
var Avpminigun = new sound("sound/minigun_shoot_loop_01.mp3");
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
var Bullet4 = new sound("sound/Bullets/bullet_by_08.mp3");
var Bullet5 = new sound("sound/Bullets/bullet_by_09.mp3");
var Bullet6 = new sound("sound/Bullets/bullet_by_10.mp3");
var Bullet7 = new sound("sound/Bullets/bullet_by_11.mp3");
var Bullet8 = new sound("sound/Bullets/bullet_by_12.mp3");
var Turicochet = new sound("sound/Turok/riccht1p_louder.mp3");
var BloodRicochet_1 = new sound("sound/Blood/RICOCHT1.WAV");
var BloodRicochet_2 = new sound("sound/Blood/RICOCHT2.WAV");
Avpminigun.sound.setAttribute("loop", "infinite");
SSamMinigun.sound.setAttribute("loop", "infinite");
SSamRotate.sound.setAttribute("loop", "infinite");
TurokRotate.sound.setAttribute("loop", "infinite");
TurokMinigun.sound.setAttribute("loop", "infinite");
Saw.sound.setAttribute("loop", "infinite");
MGun.sound.setAttribute("loop", "infinite");
