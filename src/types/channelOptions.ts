export interface ChannelOptions {
    id: string;
    webhook?: boolean;
    wh?: wh;
    warns?: number;
    warnings?: Warn[];
    filterLevel: number;
}

export interface wh {
    id: string;
    token: string;
}

export interface WebhookEnabledChannel {
    id: string;
    webhook: true;
    wh: wh;
}

export interface WebhookDisabledChannel {
    id: string;
    webhook: false;
}

export interface Warn {
    id: string;
    reason: string;
    time: number;
    type?: ChannelWarnTypes;
}

type ChannelWarnTypes = 'WebhookGetFail' | 'WebhookSendFail' | 'ChannelGetFail' | 'ChannelSendFail';