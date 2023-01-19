// This file is to work out the functions based on Senthil's Python code.
async function main() {
  console.log('Hello World!');
  let container = d3.select('#container');

  //   Let's load an initial conversation from dtrs
  //   We already have a way of loading the files using the input element. So this is just for working:
  let data = await d3.dsv(';', './assets/data/dtrs-11-05-designing-cocreation-workshops-day-2.txt', d => {
    return {
      dataset: d.dataset,
      speaker: d.speaker,
      session: d.session,
      utterance: d.utterance,
      ngrams: findNGrams(d.utterance, 4),
    };
  });
  console.log(data);

  //   Accessors for working with DTRS data
  // TODO - consider adding accessors as part of the UI.
  let dataset = d => d.dataset;
  let speaker = d => d.speaker;
  let session = d => d.session;
  let utterance = d => d.utterance;

  // Create a function to remove punctuation from sentences
  function removePunctuation(sentence) {
    return sentence
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
      .replace(/\s{2,}/g, ' ')
      .toLowerCase();
  }

  // Create a function to find n-grams.
  function findNGrams(sentence, n) {
    // Given a sentence, find all the n-grams of length from 1 to n.
    const cleanSentence = removePunctuation(sentence);
    const wordList = cleanSentence.split(' ');
    let _ngrams = [];
    let idx = n + 1;
    while (--idx) {
      for (let i = 0; i < wordList.length - idx + 1; i++) {
        _ngrams.push(wordList.slice(i, i + idx).join(' '));
      }
    }
    return _ngrams;
  }
  // findNGrams("No longer, it's not a problem anymore", 4);
}
main();
