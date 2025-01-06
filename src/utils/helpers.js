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

export function handleAddCardSubmit(request, evt, loadingText = "Saving...") {
  evt.preventDefault();

  const submitBtn = evt.submitter;
  const initialText = submitBtn.textContent;

  SetButtonText(true, submitBtn, initialText, loadingText);

  request()
    .then(() => {
      evt.target.reset();
    })
    .catch(console.error)
    .finally(() => {
      SetButtonText(false, submitBtn, initialText);
    });
}