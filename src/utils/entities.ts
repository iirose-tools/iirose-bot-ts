import { AllHtmlEntities } from 'html-entities';

export const {
  encode: encodeEntities,
  decode: decodeEntities
} = new AllHtmlEntities();
