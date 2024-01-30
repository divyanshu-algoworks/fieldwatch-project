import { REQUIRED_HEADERS, ALLOWED_HEADERS } from 'Constants/File';
import { LIFETIMERANKS, ALTERNATE_RANKS} from 'Constants/LifeTimeRanksIds';

export function getMissingHeaders(headersInFile = []){
  const missingHeaders = [];

  for (let i = 0; i < REQUIRED_HEADERS.length; i++) {
    const header = REQUIRED_HEADERS[i];
    if (!headersInFile.includes(header)) {
      missingHeaders.push(header);
    }
  }

  return missingHeaders;

}

export function getInvalidHeaders(headersInFile){
  const invalidHeaders = [];

  for (let i = 0; i < headersInFile.length; i++) {
    const header = headersInFile[i];
    const url = window.location.href;
   const isLifetimeRanksIds =  LIFETIMERANKS.LIFETIMERANKSIDS.some(element => url.includes(element))
   const isAternateRanksIds = ALTERNATE_RANKS.ALTERNATE_RANK_IDS.some(element => url.includes(element));
    if (isLifetimeRanksIds) {
      ALLOWED_HEADERS.push('Lifetime Rank')
    }
    if (isAternateRanksIds) {
      ALLOWED_HEADERS.push('Alternate Rank')
    }
    if (!ALLOWED_HEADERS.includes(header)) {
      let spacesAtStart = header.length - header.trimStart().length;
      let spacesAtEnd = header.length - header.trimEnd().length;
      const hasSpaces = spacesAtStart || spacesAtEnd;
      invalidHeaders.push(
        `${header} ${
          hasSpaces
            ? `(${
                spacesAtStart
                  ? `${spacesAtStart} space(s) at the start, `
                  : ''
              }${
                spacesAtEnd ? `${spacesAtEnd} space(s) at the end` : ''
              })`
            : ''
        }`
      );
    }
  }

  return invalidHeaders;
}