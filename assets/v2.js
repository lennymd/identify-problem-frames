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

  console.log('Test case of find_ngram() function:', find_ngram("No longer, it's not a problem anymore", 4));

  // calculate frequency of n-grams using ngrams columns
  let ngram_list = data.map(d => d.ngrams).flat();
  let ngram_freq = {};
  nGramFlat.forEach(gram => {
    ngram_freq[gram] = (ngram_freq[gram] || 0) + 1;
  });
  // console.log(ngram_freq);

  // Let's create the corpus by cleaning and joining all the utterances
  let speech_turns_list = data.map(d => d.utterance);
  let speech_turns_list_clean = speech_turns_list.map(remove_punctuation);
  // console.log(speech_turns_list_clean);
  let corpus = speech_turns_list_clean.flat().join(' ');
  console.log(corpus);

  // Create a frequency table for the corpus
  let corpus_word_count = {};
  corpus.split(' ').forEach(word => {
    corpus_word_count[word] = (corpus_word_count[word] || 0) + 1;
  });
  console.log(corpus_word_count);
  console.log(corpus_word_count['we']);

  // Create a function to calculate the Mutual Information of a given n-gram
  function mutual_information(ngram, corpus, corpus_word_count, show_work = false) {
    const nGramWordList = ngram.split(' ');
    const totalWords = Object.values(corpus_word_count).reduce((a, b) => a + b);
    // why is all_word_probs defined as 1?
    const all_word_probs = 1;
    let wordProbability = 0.0;
    if (show_work) {
      console.log(`total words in corpus: ${totalWords}`);
      console.log(`n-gram: ${ngram}`);
    }
    nGramWordList.forEach(word => {
      wordProbability = corpus_word_count[word] / totalWords;
      if (show_work) {
        console.log(`count for "${word}": ${corpus_word_count[word]}`);
        console.log(`prob. for "${word}": ${wordProbability}`);
      }
    });
    const ngram_prob = ngram_freq[ngram] / totalWords;
    const mutualInfo = Math.log2(ngram_prob / all_word_probs);

    if (show_work) {
      console.log(`prob. for all words: ${all_word_probs}`);
      console.log(`count for "${ngram}": ${ngram_freq[ngram]}`);
      console.log(`prob. for "${ngram}": ${ngram_prob}`);
    }
    return mutualInfo;
  }
  console.log(mutual_information('problem solving', corpus, corpus_word_count, true));

  // TODO Compute mutual information for all n-grams that are length > 1 and frequency > 1. Store in an object.
  // TODO Sort the n-grams by mutual information and print the top 10.
}

main();
