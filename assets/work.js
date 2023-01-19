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
  console.log('loaded data', data);

  // Create a function to remove punctuation from sentences
  function removePunctuation(sentence) {
    return sentence
      .replace(/[.,\/#!$%\^&\*\";:\[\]{}=\-_`~()]/g, '')
      .replace(/\s{2,}/g, ' ')
      .toLowerCase()
      .trim();
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

  console.log('Test case of findNGrams() function:', findNGrams("No longer, it's not a problem anymore", 4));

  // calculate frequency of n-grams using ngrams columns
  let nGrams = data.map(d => d.ngrams);
  let nGramsFlat = nGrams.flat();
  console.log(nGramsFlat);
  let nGramsFreq = {};
  nGramsFlat.forEach(gram => {
    nGramsFreq[gram] = (nGramsFreq[gram] || 0) + 1;
  });
  console.log(nGramsFreq.length);
  let nGramsTable = [];

  // create an array that is: "gram", "frequency", "length"
  Object.keys(nGramsFreq).forEach(gram => {
    nGramsTable.push([gram, nGramsFreq[gram], gram.split(' ').length]);
  });
  console.log(nGramsTable);

  // Let's find the components of the corpus
  let speechTurnsList = data.map(d => d.utterance);
  let speechTurnsListClean = speechTurnsList.map(removePunctuation);
  console.log(speechTurnsListClean);
}

main();
