export interface AudioSong {
    album: string;
    allowFeedback: boolean;
    artist: string;
    cover: string;
    feedback: string;
    id: string;
    sleep: boolean;
    title: string;
}

export interface AudioStyle {
    allowDelete: boolean;
    allowRename: boolean;
    allowSkip: boolean;
    hasAudio: boolean;
    id: string;
    name: string;
    shared: boolean;
    visible: boolean;
}

export interface VisualSong {
    album: string;
    allowFeedback: boolean;
    artist: string;
    cover: string;
    feedback: string;
    id: string;
    sleep: boolean;
    title: string;
}

export interface PlayerError {
    code: string;
    message: string;
}

export interface PlayerMessage {
    title: string;
    type: string;
}

export interface PlayerData {
    allowSkipBackward: boolean;
    allowSkipForward: boolean;
    connected: boolean;
    currentAudioSong: AudioSong;
    currentAudioStyle: AudioStyle;
    currentVisualSong: VisualSong;
    currentVisualStyle?: any;
    disableSkip: boolean;
    error: PlayerError;
    message: PlayerMessage;
    muted: boolean;
    nextStyleTime: string;
    state: string;
    volume: number;
    zoneId: number;
}

export interface Status {
    code: string;
    operationId: number;
    timestamp: number;
}

export interface PlayerStatus {
    data: PlayerData;
    status: Status;
}

