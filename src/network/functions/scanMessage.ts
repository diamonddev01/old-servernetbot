import badPhrases from '../badPhrases/badPhrases.json';
const { nsfw, mid, minor, disallow } = badPhrases;

export function scan(content: string) {
    for (const term of disallow) {
        if (content.includes(term)) return 0;
    }

    for (const term of nsfw) {
        if (content.includes(term)) return 1;
    }

    for (const term of mid) {
        if (content.includes(term)) return 2;
    }

    for (const term of minor) {
        if (content.includes(term)) return 3;
    }

    return 4;
}

/*
A RETURN OF 0 IS BANNED
A RETURN OF 1 IS NSFW
A RETURN OF 2 IS MID FILTERED TERMS
A RETURN OF 3 IS MINOR FILTERED TERMS. LEVEL 3 ALSO BANS LINKS/MEDIA

DEFAULT OF 2
*/