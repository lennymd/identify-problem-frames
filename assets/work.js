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
      nGram: find_ngram(d.utterance, 4),
    };
  });
  console.log('loaded data', data);

  // Create a function to remove punctuation from sentences
  function remove_punctuation(sentence) {
    return sentence
      .replace(/[.,\/#!$%\^&\*\"\';:\[\]?{}=\-_`~()]/g, '')
      .replace(/\s{2,}/g, ' ')
      .toLowerCase()
      .trim();
  }
  // Create a function to find n-grams.
  function find_ngram(sentence, n) {
    // Given a sentence, find all the n-grams of length from 1 to n.
    const cleanSentence = remove_punctuation(sentence);
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
  let nGramList = data.map(d => d.ngrams);
  let nGramFlat = nGramList.flat();
  let nGramFreq = {};
  nGramFlat.forEach(gram => {
    nGramFreq[gram] = (nGramFreq[gram] || 0) + 1;
  });
  // console.log(nGramFreq);

  // create an array that is populated by objects in the form {"gram", "frequency", "length"}
  let nGramTally = [];
  Object.keys(nGramFreq).forEach(gram => {
    nGramTally.push({ngram: gram, frequency: nGramFreq[gram], length: gram.split(' ').length});
  });
  console.log('nGramTally', nGramTally);

  // Filter nGramTally to only include n-grams of length > 1, and frequency > 1
  let nGramTallyFiltered = nGramTally.filter(d => d.length > 1 && d.frequency > 1);
  console.log('nGramTallyFiltered', nGramTallyFiltered);

  // Let's create the corpus by cleaning and joining all the utterances
  let speechTurnsList = data.map(d => d.utterance);
  let speechTurnsListClean = speechTurnsList.map(remove_punctuation);
  // console.log(speechTurnsListClean);
  let corpus = speechTurnsListClean.flat().join(' ');
  console.log(corpus);

  // Create a frequency table for the corpus
  let corpusWordCounts = {};
  corpus.split(' ').forEach(word => {
    corpusWordCounts[word] = (corpusWordCounts[word] || 0) + 1;
  });
  console.log(corpusWordCounts);
  console.log(corpusWordCounts['we']);

  // Create a function to calculate the Mutual Information of a given n-gram
  function mutualInformation(ngram, corpus, corpusWordCounts, showWork = false) {
    const nGramWordList = ngram.split(' ');
    const totalWords = Object.values(corpusWordCounts).reduce((a, b) => a + b);
    // why is allWordProbs defined as 1?
    const allWordProbs = 1;
    let wordProbability = 0.0;
    if (showWork) {
      console.log(`total words in corpus: ${totalWords}`);
      console.log(`n-gram: ${ngram}`);
    }
    nGramWordList.forEach(word => {
      wordProbability = corpusWordCounts[word] / totalWords;
      if (showWork) {
        console.log(`count for "${word}": ${corpusWordCounts[word]}`);
        console.log(`prob. for "${word}": ${wordProbability}`);
      }
    });
    const nGramProb = nGramFreq[ngram] / totalWords;
    const mutualInfo = Math.log2(nGramProb / allWordProbs);

    if (showWork) {
      console.log('prob. for all words:', allWordProbs);
      console.log('count for "', ngram, '":', nGramFreq[ngram]);
      console.log('prob. for "', ngram, '":', nGramProb);
    }
    return mutualInfo;
  }
  console.log(mutualInformation('problem solving', corpus, corpusWordCounts, true));

  // TODO add mutual information as a column to nGramTallyFiltered
}

main();
