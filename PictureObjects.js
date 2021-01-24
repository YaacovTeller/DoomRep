"use strict";
const pics = {
    guns: {
        chainsaw: "assets/guns/Saw-2.gif",
        chainsaw_firing: "assets/guns/Saw-2.png",
        pistol: "assets/guns/pistol_right-2.png",
        //     pistol: "assets/shotgunReload_big.gif",
        shotgun: "assets/guns/Shotgun.png",
        dukeMgun: "assets/guns/DukeMgun.png",
        dukeMgun_firing: "assets/guns/DukeMgunFire-2.gif",
        minigun: "assets/guns/ChainGun.png",
        minigun_firing: "assets/guns/ChainGunFiring.gif",
        minigun_spinup: "assets/guns/ChainGunSpin_Up.gif",
        minigun_frame2: "assets/guns/ChainGun_Alt.png",
        dualNeutron: "assets/guns/DualNeutron.png",
        dualNeutron_firing: "assets/guns/DualNeutronFiring.gif",
        reloading: {
            shotgun: "assets/shotgunReload_big.gif",
        }
    },
    ammoIcons: {
        bullet: "assets/icons/Slug.png",
        bullets: "assets/icons/Bullets.png",
        shell: "assets/icons/Shell.png",
    },
    pickups: {
        bullets: {
            big: "assets/pickups/bullets_box.png",
            small: "assets/pickups/bullets_clip.png"
        },
        shells: {
            big: "assets/pickups/Shells.png",
            small: "assets/pickups/shells_4.png"
        },
        health: {
            big: "assets/pickups/health_big.png",
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
};
const enemyPics = {
    SectorPatrol: "assets/enemies/SectorPatrol/blue_face.png",
    Troop: "assets/enemies/Troop/Troop_fwd.gif",
    ShotGun_Troop: "assets/enemies/ShotGGuy/ShotGGuy_fwd.gif",
    Imp: "assets/enemies/Imp/Imp_fwd.gif",
    ChainGuy: "assets/enemies/ChainGuy/ChainGuy_fwd.gif",
    TroopLeft: "assets/enemies/Troop/Troop_left_g.gif",
    TroopLeft_Tomer: "assets/enemies/Troop/TroopLeft_Tomer.gif",
    barrel: "assets/Barrel_0.PNG",
    forward: {
        SectorPatrol: "assets/enemies/SectorPatrol/blue_fwd.gif",
    },
    left: {
        SectorPatrol: "assets/enemies/SectorPatrol/blue_left.gif",
        Troop: "assets/enemies/Troop/Troop_left_g.gif",
        ShotGun_Troop: "assets/enemies/ShotGGuy/SGunGuy_left.gif",
        ChainGuy: "assets/enemies/ChainGuy/chain_left.gif",
        Imp: "assets/enemies/Imp/Imp_left.gif",
    },
    right: {
        SectorPatrol: "assets/enemies/SectorPatrol/blue_right.gif",
        Troop: "assets/enemies/Troop/Troop_right_g.gif",
        ShotGun_Troop: "assets/enemies/ShotGGuy/SGunGuy_right.gif",
        ChainGuy: "assets/enemies/ChainGuy/chain_right.gif",
        Imp: "assets/enemies/Imp/Imp_right.gif",
    },
    hurt: {
        SectorPatrol: "assets/enemies/SectorPatrol/blue_hurt.png",
        Troop: "assets/enemies/Troop/Troop_Hurt.png",
        ShotGun_Troop: "assets/enemies/ShotGGuy/ShotGGuy_Hurt.png",
        Imp: "assets/enemies/Imp/Imp_Hurt.png",
        ChainGuy: "assets/enemies/ChainGuy/ChainGuy_Hurt.png",
        barrel: "assets/Barrel_hurt.PNG",
    },
    dead: {
        SectorPatrol: "assets/enemies/SectorPatrol/blue_die.gif",
        Troop: "assets/enemies/Troop/Troop_Dead.gif",
        ShotGun_Troop: "assets/enemies/ShotGGuy/ShotGGuy_Dead.gif",
        Imp: "assets/enemies/Imp/Imp_Dead.gif",
        Imp_alt: "assets/enemies/Imp/Imp_newCollapse.gif",
        ChainGuy: "assets/enemies/ChainGuy/ChainGuy_DeadEd.gif",
        TroopLeft: "assets/enemies/Troop/Troop_Dead.gif",
        TroopLeft_Tomer: "assets/enemies/Troop/Troop_Dead.gif",
        barrel: "assets/Barrel_explode.gif",
    },
    explode: {
        SectorPatrol: "assets/enemies/Troop/Troop_explode.gif",
        Troop: "assets/enemies/Troop/Troop_explode.gif",
        ShotGun_Troop: "assets/enemies/ShotGGuy/ShotGGuy_explode.gif",
        Imp: "assets/enemies/Imp/Imp_explode.gif",
        ChainGuy: "assets/enemies/ChainGuy/ChainGuy_explode.gif",
        TroopLeft: "assets/enemies/Troop/Troop_explode.gif",
        TroopLeft_Tomer: "assets/enemies/Troop/Troop_explode.gif",
        barrel: "assets/Barrel_explode.gif",
    },
    firing: {
        SectorPatrol: "assets/enemies/SectorPatrol/blue_fire.gif",
        Troop: "assets/enemies/Troop/Troop_firing.gif",
        ShotGun_Troop: "assets/enemies/ShotGGuy/ShotGGuy_firing.gif",
        Imp: "assets/enemies/Imp/Imp_firing.gif",
        ChainGuy: "assets/enemies/ChainGuy/ChainGuy_firing.gif",
        TroopLeft: "assets/enemies/Troop/TroopLeft_Dead.gif",
        TroopLeft_Tomer: "assets/enemies/Troop/TroopLeft_Tomer_Dead.gif",
    },
    dead_alt: {
        SectorPatrol: "assets/pickups/DeusSoda1.png",
        Troop: "assets/potplant.png",
        ShotGun_Troop: "assets/potplant.png",
        //Imp: "assets/pickups/DeusSoda.png",
        Imp: "assets/box.png",
        ChainGuy: "assets/moneyBag.png",
        TroopLeft: "assets/moneyBag.png",
        TroopLeft_Tomer: "assets/moneyBag.png",
        barrel: "assets/Barrel_explode.gif",
    }
};
const elements = {
    blood: document.getElementById("blood"),
    oneshot: document.getElementById("shot"),
    riotShield: document.getElementById("riotShield"),
    weaponDiv: document.getElementById("weapon"),
    weaponImg: document.getElementById("weaponImg"),
    progressCounter: document.getElementById("progressCounter"),
    Bar: document.getElementById("BossBar1"),
    backImg: document.getElementById("BackImg1"),
    menuImage: document.getElementById("menuImage"),
    killCounter: document.getElementById("DCount"),
    ammoCount: document.getElementById("ammo"),
    ammoType: document.getElementById("ammoType"),
    health: document.getElementById("health"),
    menu: document.getElementById("menu"),
    muteLabel: document.getElementById('muteLabel'),
    targetBackdrop: document.getElementById("targetBackdrop"),
    finishMsg: document.getElementById("fin"),
    credits: document.getElementById("CreditScreen"),
    invincible: document.getElementById("invincible")
};
