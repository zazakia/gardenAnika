import Utils from './utils.js';

/**
 * Sound system for Garden Paradise
 */

class SoundSystem {
    constructor() {
        this.isMuted = false;
        this.volume = 0.5;
        this.audioCtx = null;
        this.soundPrefs = this.loadSoundPrefs();
    }

    loadSoundPrefs() {
        const prefs = localStorage.getItem('soundPrefs');
        if (prefs) return JSON.parse(prefs);
        // Default: all enabled
        return {
            success: true, error: true, warning: true, info: true, plant: true, water: true, harvest: true, purchase: true, click: true, select: true, level_up: true, achievement: true
        };
    }

    saveSoundPrefs() {
        localStorage.setItem('soundPrefs', JSON.stringify(this.soundPrefs));
    }

    setSoundEnabled(type, enabled) {
        this.soundPrefs[type] = enabled;
        this.saveSoundPrefs();
    }

    isSoundEnabled(type) {
        return this.soundPrefs[type] !== false;
    }

    init() {
        // No-op for beep system
    }

    play(soundName) {
        if (this.isMuted || !this.isSoundEnabled(soundName)) return;
        if (!window.AudioContext && !window.webkitAudioContext) return;
        if (!this.audioCtx) {
            this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        const ctx = this.audioCtx;
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        // Sound profiles for different events
        const soundProfiles = {
            success: { freq: 880, duration: 0.12 },
            error:   { freq: 220, duration: 0.25 },
            warning: { freq: 440, duration: 0.18 },
            info:    { freq: 660, duration: 0.10 },
            plant:   { freq: 520, duration: 0.10 },
            water:   { freq: 340, duration: 0.10 },
            harvest: { freq: 1040, duration: 0.15 },
            purchase:{ freq: 600, duration: 0.13 },
            click:   { freq: 700, duration: 0.07 },
            select:  { freq: 500, duration: 0.08 },
            level_up:{ freq: 1200, duration: 0.18 },
            achievement: { freq: 1500, duration: 0.20 },
        };
        const profile = soundProfiles[soundName] || { freq: 400, duration: 0.10 };
        osc.type = 'sine';
        osc.frequency.value = profile.freq;
        gain.gain.value = this.volume;
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + profile.duration);
        osc.onended = () => {
            osc.disconnect();
            gain.disconnect();
        };
    }

    setVolume(value) {
        this.volume = Math.max(0, Math.min(1, value));
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        return this.isMuted;
    }
}

// Export as singleton
const soundSystem = new SoundSystem();
export default soundSystem; 