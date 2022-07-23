import { Message } from 'discord.js';
import badPhrases from '../badPhrases/badPhrases.json';
import { AUTOMOD_DEFINE_LINK, AUTOMOD_ENABLED, AUTOMOD_MAX_LENGTH } from '../../config';
import { get } from 'https';

export function scan_t(content: string) {
    content = content.toLowerCase();
    if (badPhrases.disallow.some(v => content.includes(v))) return 0;
    if (badPhrases.nsfw.some(v => content.includes(v))) return 1;
    if (badPhrases.minor.some(v => content.includes(v))) return 2;
    if (badPhrases.mid.some(v => content.includes(v))) return 3;

    return 10;
}

export function scan(message: Message): Promise<ScanData> {
    return new Promise(async (res, rej) => {
        // Detect Links
        const content = message.content.toLowerCase();
        const link = AUTOMOD_DEFINE_LINK.some(v => content.includes(v));

        // Detect pings
        let ping = false;
        ping = message.mentions.users.size > 0;
        ping = ping ? true : message.mentions.roles.size > 0;
        ping = ping ? true : message.mentions.everyone;
        ping = ping ? true : message.content.includes("@here");
        ping = ping ? true : message.content.includes("@everyone");

        // Detect bad links
        const badLink = await badLinkCheck(content);

        let data = {
            link,
            allow_length: message.content.length <= AUTOMOD_MAX_LENGTH,
            phrases: scan_t(message.content),
            ping,
            badLink
        }

        res(AUTOMOD_ENABLED ? data : { link: false, allow_length: true, phrases: 10, ping: false, badLink: false });
    });
}

// External to help https
function badLinkCheck(content: string): Promise<boolean> {
    return new Promise(async (resolve) => {
        get(`https://badlink.diamondstudios.tk/discord?message="${content}"`, res => {
            res.on('data', d => {
                resolve(JSON.parse(d));
            })
        })
    })
}

interface ScanData {
    link: boolean;
    allow_length: boolean;
    phrases: number;
    ping: boolean;
    badLink: boolean;
}

/*
A RETURN OF 0 IS BANNED
A RETURN OF 1 IS NSFW
A RETURN OF 2 IS MID FILTERED TERMS
A RETURN OF 3 IS MINOR FILTERED TERMS. LEVEL 3 ALSO BANS LINKS/MEDIA

DEFAULT OF 2
*/