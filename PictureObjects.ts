const pics = {
    guns: {
        chainsaw: "Pics/ChainSaw.gif",
        chainsaw_firing: "Pics/Saw.png",
        pistol: "Pics/pistol_right.png",
        shotgun: "Pics/Ggun2.png",
        dukeMgun: "Pics/DukeMgun.png",
        dukeMgun_firing: "Pics/DukeMgunFire.gif",
        chaingun: "Pics/ChainGun150.png",
        chaingun_firing: "Pics/ChainGunFiring150_8.gif",
        chaingun_spinup: "Pics/ChainGunSpin_Up_150_8.gif",
        chaingun_frame2: "Pics/ChainGun150_Alt.png",
        dualNuetron: "Pics/DN.png",
        dualNuetron_firing: "Pics/DN110.gif",
    },
    ammo: {
        bullet: "Pics/Slug.png",
        bullets: "Pics/Bullets.png",
        shell: "Pics/Shell.png",
    },
    background: {
        doom1: "Pics/Doom1.png",
        doom2: "Pics/Doom2.png",
        doom3: "Pics/Doom3.png",

        doom4: "Pics/Doom4.png",
        doom6: "Pics/Doom6.png",
        wide: "Pics/WideBack.jpg",
        boss: "Pics/BossBack.jpg"
    },
    blood: "Pics/Blood_10.gif",
}

const enemyPics = {
    Troop: "pics/Troop.gif",
    ShotGGuy: "pics/ShotGGuy.gif",
    Imp: "pics/Imp.gif",
    ChainGuy: "pics/ChainGuy.gif",
    TroopLeft: "pics/TroopLeft.gif",
    TroopLeft_Tomer: "pics/TroopLeft_Tomer.gif",
    hurt: {
        Troop: "pics/Troop_Hurt.png",
        ShotGGuy: "pics/ShotGGuy_Hurt.png",
        Imp: "pics/Imp_Hurt.png",
        ChainGuy: "pics/ChainGuy_Hurt.png",
    },
    dead: {
        Troop: "pics/Troop_Dead.gif",
        ShotGGuy: "pics/ShotGGuy_Dead.gif",
        Imp: "pics/Imp_Dead.gif",
        ChainGuy: "pics/ChainGuy_DeadEd.gif",
        TroopLeft: "pics/TroopLeft_Dead.gif",
        TroopLeft_Tomer: "pics/TroopLeft_Tomer_Dead.gif",
    }
}

const elements = {
    blood: document.getElementById("blood"),
    oneshot: document.getElementById("shot"),
    Bar: document.getElementById("BossBar1"),
    backImg: document.getElementById("BackImg1"),
    menuImage: document.getElementById("menuImage"),
    ammoCount: document.getElementById("ammo"),
    ammoType: document.getElementById("ammoType"),
    health: document.getElementById("health"),
    menu: document.getElementById("menu"),
    riotShield: document.getElementById("riotShield"),
    weaponDiv: document.getElementById("weapon"),
    weaponImg: document.getElementById("weaponImg"),
    killCounter: document.getElementById("DCount"),
    finishMsg: document.getElementById("fin"),
    targetBackdrop: document.getElementById("targetBackdrop"),
    credits: document.getElementById("CreditScreen")
}