function dictionary_form_wordlist(url) {
	fetch(url)
  .then(response => response.text())
  .then(dict => {
    const dictionary = new Map();
    words = dict.split(/\r?\n/).map(p => p.trim()).filter(p => p.length);
    for (let word of words) {
      const sorted_word = sort_word(word);
      if (!dictionary.has(sorted_word)){
        dictionary.set(sorted_word, []);
      }
      dictionary.get(sorted_word).push(word);
    }
    return dictionary;
  })
  .catch(error => {
      console.error("Error:", error);
  });
}

function download_object_as_json(obj, dict_iso) {
	const json = `const dict_${ dict_iso }=new Map(Object.entries(${ JSON.stringify(Object.fromEntries(obj)) }));`;
	const blob = new Blob([json], { type: 'application/json' });
	const url = URL.createObjectURL(blob);
	const a = document.createElement('a');
	a.href = url;
	a.download = `${ dict_iso }.js`;
	a.style.display = 'none';
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
	URL.revokeObjectURL(url);
}

function wordlist_to_dictionary_file(dict_iso) {
  const dict_path = "https://raw.githubusercontent.com/adriatp/js_scripts/refs/heads/main/.dict/wordlists";
  dictionary = dictionary_form_wordlist(`${ dict_path }/${ dict_iso }.txt`);
  download_object_as_json(dictionary, dict_iso);
}

// Upload the wordlist to github under .dict/wordlists/${iso}.txt
// Include the dict.js in an index.html (<script src="../.scripts/dicts.js"></script>)
// Run wordlist_to_dictionary_file(dict_iso) from console