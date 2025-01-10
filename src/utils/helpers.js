export function SetButtonText(
  isLoading,
  btn,
  defaultText = "Save",
  loadingText = "Saving..."
) {
  if (isLoading) {
    btn.textContent = loadingText;
  } else {
    btn.textContent = defaultText;
  }
}

export function handleSubmit(request, evt, loadingText = "Saving...") {
  evt.preventDefault();

  const submitButton = evt.submitter;
  const initialText = submitButton.textContent;

  SetButtonText(true, submitButton, initialText, loadingText);

  request()
    .then(() => {
      evt.target.reset();
    })
    .catch(console.error)
    .finally(() => {
      SetButtonText(false, submitButton, initialText);
    });
}