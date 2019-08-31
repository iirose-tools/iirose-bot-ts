export const regexScan = (s: string, regex: RegExp) => {
  const res = [];

  for (let match = regex.exec(s); match !== null; match = regex.exec(s)) {
    match.shift();
    res.push(match);
  }

  return res;
};
