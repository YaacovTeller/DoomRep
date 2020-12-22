const pics = {
    guns: {
        chainsaw: "assets/guns/ChainSaw.gif",
        chainsaw_firing: "assets/guns/Saw.png",
        pistol: "assets/guns/pistol_right.png",
        shotgun: "assets/guns/Ggun2.png",
        dukeMgun: "assets/guns/DukeMgun.png",
        dukeMgun_firing: "assets/guns/DukeMgunFire.gif",
        minigun: "assets/guns/ChainGun150.png",
        minigun_firing: "assets/guns/ChainGunFiring150_8.gif",
        minigun_spinup: "assets/guns/ChainGunSpin_Up_150_8.gif",
        minigun_frame2: "assets/guns/ChainGun150_Alt.png",
        dualNuetron: "assets/guns/DN.png",
        dualNuetron_firing: "assets/guns/DN110.gif",
    },
    ammoIcons: {
        bullet: "assets/icons/Slug.png",
        bullets: "assets/icons/Bullets.png",
        shell: "assets/icons/Shell.png",
    },
    pickups: {
        bullets:{
            big:"assets/pickups/bullets_box.png",
            small: "assets/pickups/bullets_clip.png"
        },
        shells:{
            big:"assets/pickups/Shells.png",
            small: "assets/pickups/shells_4.png"
        },
        health: {
            big:"assets/pickups/health_big.png",
            small: "assets/pickups/health_small.png"
        },
        Pistol: "assets/pickups/Pistol.png",
        Shotgun: "assets/pickups/Shotgun.png",
        DukeMgun: "assets/pickups/DukeMGun.png",
        Minigun: "assets/pickups/Chaingun.png",
        ChainSaw: "assets/pickups/Chainsaw.png",
        DualNeutron: "assets/pickups/DualNeutron.png",
        misc: {
            fizzy: "assets/pickups/DeusSoda.png",
        }
    },
    background: {
        doom1: "assets/backgrounds/Doom1.png",
        doom2: "assets/backgrounds/Doom2.png",
        doom3: "assets/backgrounds/Doom3.png",
        doom4: "assets/backgrounds/Doom4.png",
        doom5: "assets/backgrounds/Doom5.png",
        doom6: "assets/backgrounds/Doom6.png",
        wide: "assets/backgrounds/WideBack.jpg",
        boss: "assets/backgrounds/BossBack.jpg"
    },
    blood: "assets/Blood_10.gif",
}

const enemyPics = {
    Troop: "assets/enemies/Troop.gif",
    ShotGun_Troop: "assets/enemies/ShotGGuy.gif",
    Imp: "assets/enemies/Imp.gif",
    ChainGuy: "assets/enemies/ChainGuy.gif",
    TroopLeft: "assets/enemies/TroopLeft.gif",
    TroopLeft_Tomer: "assets/enemies/TroopLeft_Tomer.gif",
    hurt: {
        Troop: "assets/enemies/Troop_Hurt.png",
        ShotGun_Troop: "assets/enemies/ShotGGuy_Hurt.png",
        Imp: "assets/enemies/Imp_Hurt.png",
        ChainGuy: "assets/enemies/ChainGuy_Hurt.png",
    },
    // dead: {
    //     Troop: "assets/potplant.png",
    //     ShotGun_Troop: "assets/potplant.png",
    //     Imp: "assets/potplant.png",
    //     ChainGuy: "assets/moneyBag.png",
    //     TroopLeft: "assets/moneyBag.png",
    //     TroopLeft_Tomer: "assets/moneyBag.png",
    // }
    dead: {
        Troop: "assets/enemies/Troop_Dead.gif",
        ShotGun_Troop: "assets/enemies/ShotGGuy_Dead.gif",
        Imp: "assets/enemies/Imp_Dead.gif",
        ChainGuy: "assets/enemies/ChainGuy_DeadEd.gif",
        TroopLeft: "assets/enemies/TroopLeft_Dead.gif",
        TroopLeft_Tomer: "assets/enemies/TroopLeft_Tomer_Dead.gif",
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