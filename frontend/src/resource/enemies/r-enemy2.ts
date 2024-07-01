import e2LiveImage from '../../assets/images/enemy2.png';
import e2HitImage from '../../assets/images/enemy2_hit.png';
import e2DownAudio from '../../assets/audio/enemy2_down.wav';
import e2DownSstImage from '../../assets/spritesheets/fastenemy_down.png';

export const enemy2Images = {
    e2_live: e2LiveImage,
    e2_hit: e2HitImage,
};

export const enemy2Audio = {
    e2_down: e2DownAudio,
};

export const enemy2Spritesheets = {
    e2_down_sst: {
        key: "e2_down_sst",
        path: e2DownSstImage,
        frameConfig: { frameWidth: 69, frameHeight: 95 },
    },
};

export const enemy2Animations = [
    {
        key: 'e2_down',
        spritesheetKey: 'e2_down_sst',
        frames: { start: 0, end: 3 },
        frameRate: 12,
        repeat: 0,
    },
];
