import { AllHtmlEntities } from 'html-entities';

export const {
    encode: encodeEntities,
    decode: decodeEntities
} = new AllHtmlEntities();

export const generateUniqueId = () => {
    return (
        new Date()
            .getTime()
            .toString()
            .substr(-5) +
        Math.random()
            .toString()
            .substr(-7)
    );
};

export const regexScan = (s: string, regex: RegExp) => {
    const res = [];

    for (let match = regex.exec(s); match !== null; match = regex.exec(s)) {
        match.shift();
        res.push(match);
    }

    return res;
};
