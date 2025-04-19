let dictionary = null;
let words = [];
let sorted_words = [];

function create_dictionary(url) {
	fetch(url)
    .then(response => response.text())
    .then(dict => {
			words = dict.split(/\r?\n/).map(p => p
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/([aeiou])[\u0300-\u036f]/gi, (_, base) => base)
      ).filter(p => p.length);
			for (let word of words) {
				const sorted_word = sort_word(word);
				if (!dictionary.has(sorted_word)){
					dictionary.set(sorted_word, []);
				}
				dictionary.get(sorted_word).push(word);
			}
			console.log("ready");
			download_object_as_json(dictionary);
    })
    .catch(error => {
        console.error("Error:", error);
    });
}

function download_object_as_json(obj) {
	const json = JSON.stringify(Object.fromEntries(obj));
	const blob = new Blob([json], { type: 'application/json' });
	const url = URL.createObjectURL(blob);
	const a = document.createElement('a');
	a.href = url;
	a.download = 'data.json';
	a.style.display = 'none';
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
	URL.revokeObjectURL(url);
}

function get_dictionary(url) {
	fetch(url)
  .then(res => {
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  })
  .then(obj => {
    dictionary = new Map(Object.entries(obj));
    console.log('✅ Map loaded');
  })
  .catch(err => {
    console.error('❌ Failed to load JSON:', err);
  });
}

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

// get_dictionary("https://raw.githubusercontent.com/adriatp/js_scripts/refs/heads/main/buscaparaules/es.json");



dictionary = cat_dict;
sorted_words = [...dictionary.keys()];

const input = document.querySelector('#input_letters');
input.addEventListener('input', (event) => {
	clear_input();
	if (event.target.value.length > 3) {
		find_all_words();
	}
});