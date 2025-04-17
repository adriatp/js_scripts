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
    })
    .catch(error => {
        console.error("Error:", error);
    });
}

function find_words(){
	let input_letters = document.querySelector("#input_letters");
	let sorted_letters = sort_word(input_letters.value);
	alert(dictionary.get(sorted_letters));
}

function sort_word(word){
	return word.split('').sort().join('');
}

create_dictionary("https://raw.githubusercontent.com/lorenbrichter/Words/refs/heads/master/Words/es.txt");
