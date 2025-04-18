const dictionary = new Map();
let words = [];

function create_dictionary(url) {
	fetch(url)
    .then(response => response.text())
    .then(dict => {
			words = dict.split(/\r?\n/).map(p => p.trim()).filter(p => p.length);
			for (let word of words) {
				const sorted_word = sort_word(word);
				if (!dictionary.has(sorted_word)){
					dictionary.set(sorted_word, []);
				}
				dictionary.get(sorted_word).push(word);
			}
			console.log("ready");
			// download_object_as_json(dictionary);
    })
    .catch(error => {
        console.error("Error:", error);
    });
}

function download_object_as_json(obj) {
	const json = JSON.stringify(Object.fromEntries(obj));
	console.log(obj)
	console.log(json)
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

function find_words(){
	let input_letters = document.querySelector("#input_letters");
	let sorted_letters = sort_word(input_letters.value);
	const ul = document.querySelector('#found_words');
	ul.textContent = '';
	for (let found_word of dictionary.get(sorted_letters)) {
		const li = document.createElement('li');
		li.className = 'list-group-item';
		li.textContent = found_word;
		ul.appendChild(li);
	}
	// alert(dictionary.get(sorted_letters));
}

function sort_word(word){
	return word.split('').sort().join('');
}

create_dictionary("https://raw.githubusercontent.com/lorenbrichter/Words/refs/heads/master/Words/es.txt");
