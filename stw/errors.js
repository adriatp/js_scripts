function show_error_message(message) {
  let container = document.getElementById('error-container');

  if (!container) {
    container = document.createElement('div');
    container.id = 'error-container';
    document.body.appendChild(container);
  }

  const errorElement = document.createElement('div');
  errorElement.className = 'toast-error';
  errorElement.textContent = message;

  container.prepend(errorElement);

  setTimeout(() => {
    errorElement.classList.add('toast-hidden');
    setTimeout(() => {
      errorElement.remove();
      if (container.childElementCount === 0) {
        container.remove();
      }
    }, 400);
  }, 1000);
}

function trigger_feedback_shake() {
  const cells = document.querySelectorAll('.feedback-cell');

  cells.forEach((cell) => {
    cell.classList.remove('shake-horizontal');

    void cell.offsetWidth;

    cell.classList.add('shake-horizontal');

    setTimeout(() => {
      cell.classList.remove('shake-horizontal');
    }, 500);
  });
}
