// src/assets/player1-resources.ts
import playerNormalImage from '../../assets/images/me_normal/me1.png';
import playerBlurImage from '../../assets/images/me_normal/me1_fastmove.png';

import playerNormalSpritesheet from '../../assets/spritesheets/player_normal.png';
import playerFastSpritesheet from '../../assets/spritesheets/player_fast.png';

export const player1Images = {
    player_normal: playerNormalImage,
    player_blur: playerBlurImage,
};

export const player1Spritesheets = {
    player_normal_sst: {
        key: "player_normal_sst",
        path: playerNormalSpritesheet,
        frameConfig: { frameWidth: 102, frameHeight: 126 },
    },
    player_fast_sst: {
        key: "player_fast_sst",
        path: playerFastSpritesheet,
        frameConfig: { frameWidth: 102, frameHeight: 153 },
    },
};

export const player1Animations = [
    {
        key: "player_normal",
        spritesheetKey: "player_normal_sst",
        frames: { start: 0, end: 1 },
        frameRate: 12,
        repeat: 0,
    },
    {
        key: "player_fast",
        spritesheetKey: "player_fast_sst",
        frames: { start: 0, end: 1 },
        frameRate: 12,
        repeat: -1,
    },
];
