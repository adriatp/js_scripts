function feedback_list() {
  let input_words =  document.querySelectorAll('.input_word');
  let input_feedback = document.querySelectorAll('.input_feedback');
  let combined = Array.from(input_words).slice(0,-1).map((el, i) => [el.value, input_feedback[i].value]);
  return combined;
}

function dictionary_words() {
  const select = document.querySelector(`#select_dict`);
  window.active_dict = window.dictionaries[`${select.value}`];
  return window.active_dict;
}

function populate_word_container(words, id_prefix, color, max) {
  const container = document.querySelector(`#${id_prefix}_words_container`);
  container.innerHTML = "";
  for (let i=0; i<words.length; i++) {
    const span = document.createElement("span");
    span.className = `badge text-bg-${color} m-1`;
    if (i<max) {
      span.textContent = words[i];
      container.appendChild(span);
    }
    else {
      span.textContent = '...';
      container.appendChild(span);
      break;
    }
  }
  const total_container = document.querySelector(`#${id_prefix}_words_count`);
  total_container.innerHTML = words.length > max ? `+${max}` : `${words.length}`;
}

function populate_word_containers(possible_words, suggested_words) {
  populate_word_container(possible_words, 'possible', 'success', 99);
  populate_word_container(suggested_words, 'suggested', 'info', 99);
}

function add_wordle_rows(container_id, row_count, cell_count) {
    const container = document.getElementById(container_id);

    for (let i = 0; i < row_count; i++) {
        const row_container = document.createElement('div');
        row_container.className = 'wordle_row w-100';

        const squares_wrapper = document.createElement('div');
        squares_wrapper.className = 'd-flex gap-2 mb-2 w-100 justify-content-center';

        for (let j = 0; j < cell_count; j++) {
            const square = document.createElement('div');
            square.className = 'wordle_square border rounded d-flex align-items-center justify-content-center fw_bold fs_2 text_uppercase';
            
            square.style.flex = '1 1 0';
            square.style.maxWidth = '60px';
            square.style.aspectRatio = '1 / 1';
            square.style.background = 'rgba(255, 255, 255, 0.05)';
            
            squares_wrapper.appendChild(square);
        }

        const input_word = document.createElement('input');
        input_word.type = 'hidden';
        input_word.className = 'input_word';

        const input_feedback = document.createElement('input');
        input_feedback.type = 'hidden';
        input_feedback.className = 'input_feedback';
        input_feedback.value = "i".repeat(cell_count);

        row_container.appendChild(squares_wrapper);
        row_container.appendChild(input_word);
        row_container.appendChild(input_feedback);
        
        container.appendChild(row_container);
    }
}

function active_wordle_row() {
  const awr = document.querySelectorAll('.wordle_row');
  return awr[awr.length - 1];
}

function active_input_word() {
  return active_wordle_row().querySelector('.input_word');
}

function active_input_word_size() {
  return active_wordle_row().querySelector('.input_word').value.length;
}

function cells_active_wordle_row() {
   return active_wordle_row().querySelectorAll('.wordle_square');
}

function last_wordle_square() {
  const active_input_size = active_input_word_size();
  if (active_input_size == 0) {
    return null;
  }
  return cells_active_wordle_row()[active_input_size - 1];
}

function next_wordle_square() {
  const active_input_size = active_input_word_size();
  if (active_input_size >= window.wordle_cells) {
    return null;
  }
  return cells_active_wordle_row()[active_input_size];
}

function active_word() {
  return active_input_word().value;
}

function process_enter() {
  if (active_word().length < window.wordle_cells) {
    console.log("error: word is too short")
    return;
  }
  if (!dictionary_words().includes(active_word().toLowerCase())) {
    console.log("error: word is not in the active dictionary")
    return;
  }
  add_wordle_rows('input_container', window.wordle_rows, window.wordle_cells);
}

function process_backspace() {
  if (active_word().length > 0) {
    last_wordle_square().innerHTML = '';
    active_input_word().value = active_word().slice(0, -1);
  }
}

function process_letter(letter) {
  if (active_word().length < window.wordle_cells) {
    next_wordle_square().innerHTML = letter;
    let aiw = active_input_word();
    aiw.value = aiw.value + letter;
  }
}

function process_keydown(input) {
  let letter = input.toUpperCase();
  const is_letter = /^[A-ZÇÑ]$/i.test(input);

  if (input === "Dead") {
    window.dead_key_active = true;
  }
  else {
    if (input === "Enter" || input === "Process") {
      process_enter();
    }
    else if (input === "Backspace") {
      process_backspace();
    }
    else if (is_letter) {
      if (window.dead_key_active) {
        if (letter === "C") {
          letter = 'Ç';
        }
        else if (letter === "N") {
          letter = 'Ñ';
        }
      }
      process_letter(letter);
    }
    window.dead_key_active = false; 
  }
}

window.addEventListener('keydown', function(event) {
  process_keydown(event.key);
});

