import { bossImages, bossAudio, bossSpritesheets, bossAnimations } from './boss/r-boss';
import { bulletImages } from './bullets/r-bullet';
import {enemy1Images, enemy1Audio, enemy1Spritesheets, enemy1Animations} from './enemies/r-enemy1';
import {enemy2Images, enemy2Audio, enemy2Spritesheets, enemy2Animations} from './enemies/r-enemy2';
import { shootingEnemyImages } from './enemies/r-shooting-enemy';
import {player1Animations, player1Images, player1Spritesheets} from './players/r-player1';
import {bulletSupplyAudios, bulletSupplyImages} from './supplies/r-bullet-supply';
import {bombSupplyAudios, bombSupplyImages} from './supplies/r-bomb-supply';
import {firePowerSupplyAudio, firePowerSupplyImg} from './supplies/r-firepower-supply';
import menuBgm from '../assets/audio/game_music.ogg';
import battleBgm from '../assets/audio/game_music.ogg';
import battleBgmUpgrade from '../assets/audio/game_music_upgrade.mp3';
import bulletAudio from '../assets/audio/bullet.wav';
import buttonAudio from '../assets/audio/button.wav';
import bombAudio from '../assets/audio/explode3.ogg';
import getDamageAudio from '../assets/audio/me_down.wav';
import background from '../assets/images/background.png';
import backgroundGrade from '../assets/images/background_upgrade.png';
import p1Button from '../assets/images/single_player.png';
import leaderboard from '../assets/images/leaderboard.png';
import pauseButtonNor from '../assets/images/pause_nor.png';
import pauseButtonPressed from '../assets/images/pause_pressed.png';
import resumeButtonNor from '../assets/images/resume_nor.png';
import resumeButtonPressed from '../assets/images/resume_pressed.png';
import shield from '../assets/images/shield.png';
import bomb from '../assets/images/bomb.png';
import summaryBackgroundImg from '../assets/images/summary_background.png';
import rankBackgroundImg from '../assets/images/rank_background.png';
import outButton from '../assets/images/out.png';
import outButtonPressed from '../assets/images/out_pressed.png';
import firepowerIcon from '../assets/images/firepower_icon.png';
import logImg from '../assets/images/logo.png';
import p5Bgm from '../assets/audio/p5.mp3';
import p5BgmUpgrade from '../assets/audio/p5_upgrade.mp3';

export const images = {
    logo: logImg,
    background: background,
    background_grade: backgroundGrade,
    summary_background: summaryBackgroundImg,
    rank_background: rankBackgroundImg,
    p1Button: p1Button,
    leaderboard: leaderboard,
    pauseButton_nor: pauseButtonNor,
    pauseButton_pressed: pauseButtonPressed,
    resumeButton_nor: resumeButtonNor,
    resumeButton_pressed: resumeButtonPressed,
    shield: shield,
    bomb: bomb,
    out_button: outButton,
    out_button_pressed: outButtonPressed,
    firepower_icon: firepowerIcon,


    ...bossImages,
    ...bulletImages,
    ...enemy1Images,
    ...enemy2Images,
    ...shootingEnemyImages,
    ...player1Images,
    ...bombSupplyImages,
    ...bulletSupplyImages,
    ...firePowerSupplyImg,

};

export const audio = {
    menu_bgm: menuBgm,
    battle_bgm: battleBgm,
    battle_bgm_upgrade: battleBgmUpgrade,
    bullet: bulletAudio,
    button: buttonAudio,
    bomb: bombAudio,
    p5_bgm: p5Bgm,
    p5_bgm_upgrade: p5BgmUpgrade,

    get_damage: getDamageAudio,

    ...bossAudio,
    ...enemy1Audio,
    ...enemy2Audio,
    ...firePowerSupplyAudio,
    ...bombSupplyAudios,
    ...bulletSupplyAudios,

};

export const spritesheets = {
    ...bossSpritesheets,
    ...enemy1Spritesheets,
    ...enemy2Spritesheets,
    ...player1Spritesheets
};

export const animations = [
    ...bossAnimations,
    ...enemy1Animations,
    ...player1Animations,
    ...enemy2Animations,
];
