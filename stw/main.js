function set_listeners() {
  // change dictionary
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

const language_select = document.querySelector('#select_dict');
const selected_dictionary = localStorage.getItem('selected_dictionary');
if (selected_dictionary != null) {
  language_select.value = selected_dictionary;
}
language_select.addEventListener('change', function (event) {
  localStorage.setItem('selected_dictionary', event.target.value);
  load();
});

reset();
