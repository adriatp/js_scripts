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

function clear_active_row() {
  active_input_word().value = '';
  active_input_feedback().value = 'i'.repeat(window.wordle_cells)
  active_wordle_row().querySelectorAll('.wordle_square').forEach((s) => {
    s.innerHTML = '';
  });
}

function write_word(word) {
  clear_active_row();
  [...word].forEach((l) => {
    process_letter(l.toUpperCase());
  });
}

function populate_word_container(words, id_prefix, color, max) {
  const container = document.querySelector(`#${id_prefix}_words_container`);
  container.innerHTML = "";
  for (let i=0; i<words.length; i++) {
    const span = document.createElement("span");
    if (i<max) {
      span.className = `word-badge cursor-pointer user-select-none badge text-bg-${color} m-1`;
      span.textContent = words[i];
      container.appendChild(span);
    }
    else {
      span.className = `badge text-decoration-none text-bg-${color} m-1`;
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
      const square = document.createElement('button');
      square.className = 'feedback-cell wordle_square border rounded d-flex align-items-center justify-content-center fw_bold fs_2 text_uppercase';
      square.style.flex = '1 1 0';
      square.style.maxWidth = '60px';
      square.style.aspectRatio = '1 / 1';
      square.dataset.index = j;
      squares_wrapper.appendChild(square);
      square.addEventListener('click', function(event) {
        process_feedback(event.target);
      });
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

function active_input_feedback() {
  return active_wordle_row().querySelector('.input_feedback');
}

function active_input_word_size() {
  return active_input_word().value.length;
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

function process_feedback(wordle_square) {
  const wordle_row = wordle_square.closest('.wordle_row')
  if (wordle_row == active_wordle_row()) {
    return
  }
  const square_index = Number(wordle_square.dataset.index);
  let feedback_input = wordle_row.querySelector('.input_feedback');
  const next_state = { 'i':'m', 'm':'c', 'c':'i' }
  // update feedback_input
  const value_array = feedback_input.value.split('');
  value_array[square_index] = next_state[value_array[square_index]];
  feedback_input.value = value_array.join('');
  // next class to color
  let feedback_class = Array.from(wordle_square.classList).find(c => /^feedback-[cmi]$/.test(c));
  if (feedback_class) wordle_square.classList.replace(feedback_class, `feedback-${next_state[feedback_class.split('-')[1]]}`);  
}

function stored_inputs() {
  let input_words = [...document.querySelectorAll('.input_word')].slice(0, -1).map(e => e.value);
  let input_feedback = [...document.querySelectorAll('.input_feedback')].slice(0, -1).map(e => e.value);
  return [input_words, input_feedback];
}

function process_row() {
  const active_word = active_input_word();
  const active_word_value = active_word.value;
  const active_wordle_cells = cells_active_wordle_row();
  const active_feedback = active_input_feedback();
  const [stored_words, stored_feedback] = stored_inputs();
  if (active_word_value.length < window.wordle_cells) {
    trigger_feedback_shake();
    show_error_message("Not enough letters");
    return;
  }
  if (!dictionary_words().includes(active_word_value.toLowerCase())) {
    trigger_feedback_shake();
    show_error_message("Not in word list")
    return;
  }
  for (let i=0; i<window.wordle_cells; i++) {
    const active_cell = active_wordle_cells[i];
    const letter = active_word.value[i];
    let correct_letter = false;
    for (let j=0; j<stored_words.length; j++) {
      if (stored_words[j][i] === letter) {
        if (stored_feedback[j][i] === 'c') {
          correct_letter = true;
        }
        break;
      }
    }
    if (correct_letter) {
      active_feedback.value = active_feedback.value.slice(0,i) + 'c' + active_feedback.value.slice(i+1);
      active_cell.classList.add('feedback-c');
    }
    else {
      active_cell.classList.add('feedback-i');
    }
    active_cell.classList.remove('feedback-cell');
  }
  add_wordle_rows('input_container', window.wordle_rows, window.wordle_cells);
}

function process_enter() {
  solve()
}

function process_backspace() {
  const wordle_rows = document.querySelectorAll('.wordle_row');
  if (active_word().length > 0) {
    last_wordle_square().innerHTML = '';
    active_input_word().value = active_word().slice(0, -1);
  }
  else if (wordle_rows.length > 1) {
    active_wordle_row().remove();
    cells_active_wordle_row().forEach(wordle_square => {
      let feedback_class = Array.from(wordle_square.classList).find(c => /^feedback-[cmi]$/.test(c));
      wordle_square.classList.replace(feedback_class, 'feedback-cell');  
      active_input_feedback().value = "i".repeat(window.wordle_cells);
    })
  }
}

function process_letter(letter) {
  if (active_word().length < window.wordle_cells) {
    next_wordle_square().innerHTML = letter;
    let aiw = active_input_word();
    aiw.value = aiw.value + letter;
  }
  if (active_word().length == window.wordle_cells) {
    process_row();
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

//  listener process keydown
window.addEventListener('keydown', function(event) {
  process_keydown(event.key);
});
//  listener solve
const button_solve = document.querySelector('#solve_btn');
button_solve.addEventListener('click', function(event) {
  solve();
});
const pw_container = document.querySelector('#possible_words_container')
pw_container.addEventListener('click', function(event) {
  const badge = event.target.closest('.word-badge');
  if (!badge) return;
  const word = badge.innerHTML;
  write_word(word);
});
const sw_container = document.querySelector('#suggested_words_container')
sw_container.addEventListener('click', function(event) {
  const badge = event.target.closest('.word-badge');
  if (!badge) return;
  const word = badge.innerHTML;
  write_word(word);
});
