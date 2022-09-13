import { AnyComponent, Attachment, Component, Embed, Sticker } from 'discord.js';

export interface WEBHOOKOPTS {
    filtered: WEBHOOKOPTS_N;
    norm: WEBHOOKOPTS_N;
}

export interface WEBHOOKOPTS_N {
    avatarURL?: string;
    username?: string;
}

export interface OPTS {
    embeds?: Embed[];
    stickers?: Sticker[];
    components?: Component<AnyComponent>[];
    attatchments?: Attachment[];
}

export interface PRIOPTIONS {
    limit_Level?: number;
    limit_Exceeded_string?: string;
    limit_Exceeded_string_wh?: string;
}

export interface m {
    wh: string;
    ch: string;
}