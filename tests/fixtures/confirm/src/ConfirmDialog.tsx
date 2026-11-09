// window.confirm() is a no-op in installed apps; this component replaces
// confirm( and alert( calls with an in-app dialog.
/* Never call confirm() directly. */
export function ConfirmDialog() {
  return <div role="alertdialog">Are you sure?</div>;
}
