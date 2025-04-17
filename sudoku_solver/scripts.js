function init_js() {
  init_sudoku();
}

function init_sudoku() {
  sudoku_tbody = $('#sudoku_table > tbody');
  rows = 0;
  for (var i=0; i<9; i++) {
    tr = document.createElement('tr');
    cols = 0;
    for (var j=0; j<9; j++) {
      number = "<td><input type='text' class='input-number' data-row='" + i + "' data-col='" + j + "' maxlength=1' readonly></td>"
      $(tr).append(number);
      if (cols % 3 == 0) {
        $(tr).find('td').last().addClass('left-border-strong');
      }
      cols++;
    }
    if (rows % 3 == 0) 
      $(tr).addClass('top-border-strong');
    rows++;
    sudoku_tbody.append(tr);
  }
}
