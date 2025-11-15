function mergeNameMaps(...maps) {
  const merged = new Map();

  for (const map of maps) {
    for (const [key, names] of map.entries()) {
      if (merged.has(key)) {
        const existing = merged.get(key);
        const combined = [...new Set([...existing, ...names])];
        merged.set(key, combined);
      } else {
        merged.set(key, [...names]);
      }
    }
  }
  return merged;
}

let dictionary = mergeNameMaps(dict_es, dict_es_female_names, dict_es_male_names);

function clear_input() {
	const div = document.querySelector('#found_words');
	div.textContent = '';
}

function find_words(){
	let input_letters = document.querySelector("#input_letters");
	let sorted_letters = sort_word(input_letters.value);
	const div = document.querySelector('#found_words');
	div.textContent = '';
	if (dictionary.has(sorted_letters)) {
		const ul = document.createElement('ul');
		ul.className = 'list-group';
		div.appendChild(ul);
		for (let found_word of dictionary.get(sorted_letters)) {
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

function sort_word(word){
	return word.toLowerCase().split('').sort().join('');
}

const input = document.querySelector('#input_letters');
input.addEventListener('input', (event) => {
	clear_input();
	if (event.target.value.length > 3) {
		find_words();
	}
});
