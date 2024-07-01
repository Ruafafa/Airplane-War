// Type: Resource
import e1LiveImage from '../../assets/images/enemy1.png';
import e1DownAudio from '../../assets/audio/enemy1_down.wav';
import e1DownSstImage from '../../assets/spritesheets/enemy1_down.png';

// 导出资源对象
export const enemy1Images = {
    e1_live: e1LiveImage,
};

export const enemy1Audio = {
    e1_down: e1DownAudio,
};

export const enemy1Spritesheets = {
    e1_down_sst: {
        key: "e1_down_sst",
        path: e1DownSstImage,
        frameConfig: { frameWidth: 57, frameHeight: 51 },
    },
};

// 导出动画对象
export const enemy1Animations = [
    {
        key: 'e1_down',
        spritesheetKey: 'e1_down_sst',
        frames: { start: 0, end: 3 },
        frameRate: 12,
        repeat: 0,
    },
];
