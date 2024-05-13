const pics = {
    guns: {
        blank: "assets/guns/blank.png",
        chainsaw: "assets/guns/Saw-2.gif",
        chainsaw_firing: "assets/guns/Saw-2.png",
        pistol: "assets/guns/pistol_right-3.png",
        shotgun: "assets/guns/Shotgun.png",
        //shotgun_firing: "assets/guns/Shotgun.png",
        
        reloading: {
             shotgun: "assets/guns/shotgunReload_big.gif",
            //shotgun: "assets/guns/shotgunReload_slow.gif", 
        },
        firing: {
            pistol: "assets/guns/pistol_right_firing.png",
            shotgun: "assets/guns/shotgunShot_fast.gif",
            dukeMgun: "assets/guns/DukeMgunFire-3.gif",
            dualNeutron: "assets/guns/DualNeutronFiring.gif",
            Pipebomb: "assets/guns/pipe.gif",
        },
        dukeMgun: "assets/guns/DukeMgun-2.png",
        minigun: "assets/guns/ChainGun.png",
        minigun_firing: "assets/guns/ChainGunFiring.gif",
        minigun_spinup: "assets/guns/ChainGunSpin_Up.gif",
        minigun_frame2: "assets/guns/ChainGun_Alt.png",
        dualNeutron: "assets/guns/DualNeutron.png",
        pipebomb: "assets/guns/Pipe.png",
    },
    ammoIcons: {
        bullet: "assets/icons/Slug.png",
        bullets: "assets/icons/Bullets.png",
        shell: "assets/icons/Shell.png",
        pipe: "assets/icons/pipe.png",
    },
    pickups: {
        cells: {
            big: "assets/pickups/cells.png",
            small: "assets/pickups/cells_half.png",
        },
        bullets:{
            box:"assets/pickups/bullets_box.png",
            box_chain:"assets/pickups/bullets_box_chain.png",
            chain:"assets/pickups/bullets_chain.png",
            scattered:"assets/pickups/bullets_scattered.png",
            scattered_b:"assets/pickups/bullets_scattered_b.png",
            clip: "assets/pickups/bullets_clip.png"
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
        Pipebomb: "assets/pickups/pipe.png",
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
    SectorPatrol: "assets/enemies/SectorPatrol/blue_face.png",
    Troop: "assets/enemies/Troop/Troop_fwd.gif",
    ShotgunTroop: "assets/enemies/ShotGGuy/ShotGGuy_fwd.gif",
    Imp: "assets/enemies/Imp/Imp_fwd-2.gif",
    ChaingunGuy: "assets/enemies/ChainGuy/ChainGuy_fwd.gif",

    TroopLeft: "assets/enemies/Troop/Troop_left_g.gif",
    TroopLeft_Tomer: "assets/enemies/Troop/TroopLeft_Tomer.gif",
    barrel: "assets/Barrel-1.gif",

    forward:{
        SectorPatrol: "assets/enemies/SectorPatrol/blue_fwd.gif",
    },
    left: {
        SectorPatrol: "assets/enemies/SectorPatrol/blue_left.gif",
        Troop: "assets/enemies/Troop/Troop_left_g.gif",
        ShotgunTroop: "assets/enemies/ShotGGuy/SGunGuy_left.gif",
        ChaingunGuy: "assets/enemies/ChainGuy/chain_left.gif",
        Imp: "assets/enemies/Imp/Imp_left.gif",
    },
    right: {
        SectorPatrol: "assets/enemies/SectorPatrol/blue_right.gif",
        Troop: "assets/enemies/Troop/Troop_right_g.gif",
        ShotgunTroop: "assets/enemies/ShotGGuy/SGunGuy_right.gif",
        ChaingunGuy: "assets/enemies/ChainGuy/chain_right.gif",
        Imp: "assets/enemies/Imp/Imp_right.gif",
    },
    hurt: {
        SectorPatrol: "assets/enemies/SectorPatrol/blue_hurt.png",
        Troop: "assets/enemies/Troop/Troop_Hurt.png",
        ShotgunTroop: "assets/enemies/ShotGGuy/ShotGGuy_Hurt.png",
        Imp: "assets/enemies/Imp/Imp_Hurt.png",
        ChaingunGuy: "assets/enemies/ChainGuy/ChainGuy_Hurt.png",
        barrel: "assets/Barrel_hurt.PNG",
    },
    dead: {
        SectorPatrol: "assets/enemies/SectorPatrol/blue_die.gif",
        Troop: "assets/enemies/Troop/Troop_Dead.gif",
        ShotgunTroop: "assets/enemies/ShotGGuy/ShotGGuy_Dead.gif",
        Imp: "assets/enemies/Imp/Imp_brutal_death_150.gif",
        Imp_alt: "assets/enemies/Imp/Imp_newCollapse.gif",
        ChaingunGuy: "assets/enemies/ChainGuy/ChainGuy_DeadEd.gif",

        TroopLeft: "assets/enemies/Troop/Troop_Dead.gif",
        TroopLeft_Tomer: "assets/enemies/Troop/Troop_Dead.gif",
        barrel: "assets/Barrel_explode.gif",
    },
    headshot: {
        Troop: "assets/enemies/Troop/troop_brutal_death.gif",
        ShotgunTroop: "assets/enemies/ShotGGuy/ShotGGuy_Dead_headshot.gif",
        Imp: "assets/enemies/Imp/Imp_Dead.gif",
    },
    explode: {
        SectorPatrol: "assets/enemies/Troop/Troop_explode.gif",//"assets/enemies/SectorPatrol/blue_die.gif",
        Troop: "assets/enemies/Troop/Troop_explode.gif",
        ShotgunTroop: "assets/enemies/ShotGGuy/ShotGGuy_explode.gif",
        Imp: "assets/enemies/Imp/Imp_explode.gif",
        ChaingunGuy: "assets/enemies/ChainGuy/ChainGuy_explode.gif",

        TroopLeft: "assets/enemies/Troop/Troop_explode.gif",
        TroopLeft_Tomer: "assets/enemies/Troop/Troop_explode.gif",
        barrel: "assets/Barrel_explode.gif",
    },
    firing: {
        SectorPatrol: "assets/enemies/SectorPatrol/blue_fire.gif",
        Troop: "assets/enemies/Troop/Troop_firing.gif",
        ShotgunTroop: "assets/enemies/ShotGGuy/ShotGGuy_firing.gif",
        Imp: "assets/enemies/Imp/Imp_firing.gif",
        ChaingunGuy: "assets/enemies/ChainGuy/ChainGuy_firing.gif",
        TroopLeft: "assets/enemies/Troop/TroopLeft_Dead.gif",
        TroopLeft_Tomer: "assets/enemies/Troop/TroopLeft_Tomer_Dead.gif",
    },
    dead_alt: {
        SectorPatrol: "assets/pickups/DeusSoda1.png",
        Troop: "assets/potplant.png",
        ShotgunTroop: "assets/potplant.png",
        //Imp: "assets/pickups/DeusSoda.png",
        Imp: "assets/box.png",
        ChaingunGuy: "assets/moneyBag.png",
        TroopLeft: "assets/moneyBag.png",
        TroopLeft_Tomer: "assets/moneyBag.png",

        barrel: "assets/Barrel_explode.gif",
    }
}

const elements = {
    blood: document.getElementById("blood") as HTMLImageElement,
    oneshot: document.getElementById("shot") as HTMLImageElement,
    explosion: document.getElementById("explosion") as HTMLImageElement,
    explosion_small: document.getElementById("explosion_small") as HTMLImageElement,
    riotShield: document.getElementById("riotShield"),
    weaponDiv: document.getElementById("weapon"),
    weaponImg: document.getElementById("weaponImg") as HTMLImageElement,
    progressCounter: document.getElementById("progressCounter"),
    
    Bar: document.getElementById("BossBar1"),
    loadingBar: document.getElementById("loadingBar"),
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
    invincible: document.getElementById("invincible"),
    highScores: document.getElementById("highScores"),
}