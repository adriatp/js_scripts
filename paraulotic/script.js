function clear_input() {
	const div = document.querySelector('#found_words');
	div.textContent = '';
}

function write_words(words) {
	const div = document.querySelector('#found_words');
	div.textContent = '';
	if (dictionary.has(words)) {
		const ul = document.createElement('ul');
		ul.className = 'list-group';
		div.appendChild(ul);
		for (let found_word of dictionary.get(words)) {
			const li = document.createElement('li');
			li.className = 'list-group-item';
			li.textContent = found_word;
			ul.appendChild(li);
		}
	} else {
		const alert = document.createElement('div');
		alert.className = 'alert alert-warning alert-dismissible fade show';
		alert.role = 'alert';
		alert.innerHTML = `
			No s'ha trobat <strong>cap paraula</strong> formada per les lletres introduïdes.
			<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
		`;
		div.appendChild(alert);
	}
}

function find_words(){
	let input_letters = document.querySelector("#input_letters");
	let sorted_letters = sort_word(input_letters.value);
  write_words(sorted_letters);
}

function find_all_words() {
	const input_letters = document.querySelector("#input_letters");
	const sorted_letters = sort_word(input_letters.value);
  const required_chars = 'b';
  let filtered_words = sorted_words.filter(word =>
    [...word].every(char => sorted_letters.includes(char))
  );
  filtered_words = filtered_words.filter(word =>
    [...required_chars].every(char => word.includes(char))
  );
  filtered_words.sort((a, b) => b.length - a.length);
	const div = document.querySelector('#found_words');
	div.textContent = '';
  if (filtered_words.length > 0) {
    const ul = document.createElement('ul');
    ul.className = 'list-group';
    div.appendChild(ul);
    for (let filtered_word of filtered_words) {
      if (dictionary.has(filtered_word)) {
        for (let found_word of dictionary.get(filtered_word)) {
          const li = document.createElement('li');
          li.className = 'list-group-item';
          li.textContent = found_word;
          ul.appendChild(li);
        }
      } else {
        const alert = document.createElement('div');
        alert.className = 'alert alert-warning alert-dismissible fade show';
        alert.role = 'alert';
        alert.innerHTML = `
          No s'ha trobat <strong>cap paraula</strong> formada per les lletres introduïdes.
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
        div.appendChild(alert);
      }
    }
  }
}

function sort_word(word){
	return word.split('').sort().join('');
}

let dictionary = dict_ca;
sorted_words = [...dictionary.keys()];

const input = document.querySelector('#input_letters');
input.addEventListener('input', (event) => {
	clear_input();
	if (event.target.value.length > 3) {
		find_all_words();
	}
});