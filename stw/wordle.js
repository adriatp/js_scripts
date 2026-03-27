function possible_words(feedback_list, words_list) {
  // feedback: [[ 'test', 'cicm'], [ 'aaaa', 'mmim'], ...]
  // words_list: [ 'cova', 'mapa', 'gent', 'boda']
  let result = words_list;
  for (const [attempt_word, feedback_word] of feedback_list) {
    console.log(`attempt_word: ${attempt_word} | feedback_word: ${feedback_word}`);
    if (attempt_word.length != feedback_word.length) {
      throw new Error('attempt_word and feedback_word must have the same length');
    }
    for (const [word_index, feedback_letter] of [...feedback_word].entries()) {
      attempt_letter = attempt_word[word_index];
      console.log(`word_index: ${word_index} | feedback_letter: ${feedback_letter} | attempt_letter: ${attempt_letter}`);
      if (feedback_letter == 'i' || feedback_letter == 'm') {
        const occurrences = String([...attempt_word].reduce((n, l, i) => n + (l === attempt_letter && 'cm'.includes(feedback_word[i])), 0));
        console.log(`occurrences: ${occurrences}`);
        if (feedback_letter == 'i') {
          // remove words from words_list that do not have attempt_letter exactly occurrences times
          let regex = new RegExp(`^(?:[^${attempt_letter}]*${attempt_letter}){${occurrences}}[^${attempt_letter}]*$`, 'i');
          result = result.filter((p) => regex.test(p));
        } else if (feedback_letter == 'm') {
          // remove words from words_list that do not have attempt_letter at least occurrences times
          let regex = new RegExp(`^(?:[^${attempt_letter}]*${attempt_letter}){${occurrences},}[^${attempt_letter}]*$`, 'i');
          result = result.filter((p) => regex.test(p));
        }
        // remove words from words_list that have attempt_letter at position word_index
        let regex = new RegExp(`^.{${word_index}}${attempt_letter}`, 'i');
        result = result.filter((p) => !regex.test(p));
      } else if (feedback_letter == 'c') {
        // remove words from words_list that do not have attempt_letter at position word_index
        let regex = new RegExp(`^.{${word_index}}${attempt_letter}`, 'i');
        result = result.filter((p) => regex.test(p));
      } else {
        throw new Error('wtf is this feedback');
      }
    }
  }
  // result sort by possibility
  return result;
}

function suggested_words(feedback_list, possible_words, words_list) {
  // feedback: [['test', 'cicm'], ['aaaa', 'mmim'], ...]
  // words_list: ['cova', 'mapa', 'gent', 'boda']
  // todo
  const result = possible_words;
  // sw = sort by exclusion power
  return result;
}

function feedback_result(word_1, word_2) {
  let feedback = Array(word_1.length).fill('i');
  let counts = {};
  // update counter
  for (let c of word_2) {
    counts[c] = (counts[c] || 0) + 1;
  }
  // update corrects
  for (let i = 0; i < word_1.length; i++) {
    if (word_1[i] === word_2[i]) {
      feedback[i] = 'c';
      counts[word_1[i]]--;
    }
  }
  // update misplaced
  for (let i = 0; i < word_1.length; i++) {
    if (feedback[i] === 'i' && counts[word_1[i]] > 0) {
      feedback[i] = 'p';
      counts[word_1[i]]--;
    }
  }
  return feedback.join('');
}

function entropy(word, list_word) {
  // word: 'asdfg'
  // list_words: ['asdfg', 'qwerty', 'zxcvb', '...']
  const feedback_list = [];
  list_word.forEach((w) => {
    feedback_list.push(feedback_result(word, w));
  });
  const counts = {};
  const n = feedback_list.length;
  for (let f of feedback_list) {
    counts[f] = (counts[f] || 0) + 1;
  }
  let H = 0;
  for (let p in counts) {
    let prob = counts[p] / n;
    H -= prob * Math.log2(prob);
  }
  return H;
}

function entropy_sorted(list_word) {
  const list_entropies = [];
  let i = 1;
  const total = list_word.length;
  [...list_word].forEach((w) => {
    console.log(`${i}/${total}`);
    i = i + 1;
    list_entropies.push([w, entropy(w, list_word)]);
  });
  return list_entropies;
}
