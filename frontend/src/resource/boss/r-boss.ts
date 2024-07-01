import bossLive1 from '../../assets/images/enemy3_n1.png';
import bossHit from '../../assets/images/enemy3_hit.png';

import bossLiveAudio from '../../assets/audio/enemy3_flying.wav';
import bossDownAudio from '../../assets/audio/enemy3_down.wav';

import bossDownSst from '../../assets/spritesheets/boss_down.png';
import bossLiveSst from '../../assets/spritesheets/boss_live.png';

export const bossImages = {
    boss_live1: bossLive1,
    boss_hit: bossHit,
};

export const bossAudio = {
    boss_live: bossLiveAudio,
    boss_down: bossDownAudio,
};

export const bossSpritesheets = {
    boss_down_sst: {
        key: "boss_down_sst",
        path: bossDownSst,
        frameConfig: { frameWidth: 165, frameHeight: 261 },
    },
    boss_live_sst: {
        key: "boss_live_sst",
        path: bossLiveSst,
        frameConfig: { frameWidth: 167, frameHeight: 251 },
    },
};

export const bossAnimations = [
    {
        key: 'boss_down',
        spritesheetKey: 'boss_down_sst',
        frames: { start: 0, end: 5 },
        frameRate: 6,
        repeat: 0,
    },
    {
        key: 'boss_live',
        spritesheetKey: 'boss_live_sst',
        frames: { start: 0, end: 1 },
        frameRate: 12,
        repeat: -1,
    },
];
