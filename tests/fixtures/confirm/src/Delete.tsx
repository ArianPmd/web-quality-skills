export function Delete() {
  const onClick = () => {
    if (window.confirm('Delete this?')) alert('Deleted');
  };
  return <button onClick={onClick}>Delete</button>;
}
