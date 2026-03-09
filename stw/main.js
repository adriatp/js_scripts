function set_listeners() {
  // change dictionary
  document.querySelector(`#select_dict`).addEventListener('change', (event) => {
    dictionary_words();
    load()
  });
  // keyboard
}

function solve() {
  const fl = feedback_list();
  const dw = dictionary_words();
  const pw = possible_words(fl, dw);
  const sw = suggested_words(fl, pw, dw);
  populate_word_containers(pw, sw);
}

function load() {
  const dw = dictionary_words();
  const sw = suggested_words([], dw, dw);
  populate_word_containers(dw, sw);
  set_listeners();
}

function reset() {
  window.wordle_rows = 1;
  window.wordle_cells = 5;
  window.added_words = 0;
  add_wordle_rows('input_container', window.wordle_rows, window.wordle_cells);
  load();
}

reset();
