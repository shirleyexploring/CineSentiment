import { pipeline } from '@xenova/transformers';

const analyser = await pipeline(
  'sentiment-analysis',
  'Xenova/distilbert-base-uncased-finetuned-sst-2-english'
);
// ==> first call downloads weights to ~/.cache/huggingface/transformers

export async function analyseSentiment(text) {
  const [{ label, score }] = await analyser(text);
  return { label: label.toLowerCase(), score };     // unify casing
}
