import { Component, type ReactNode } from 'react';
import { Route, Routes } from 'react-router-dom';

class Boundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? <p>Something broke. Reload</p> : this.props.children;
  }
}

export function App() {
  return (
    <Boundary>
      <Routes>
        <Route path="/" element={<p>Home</p>} />
        <Route path="*" element={<p>Not found</p>} />
      </Routes>
    </Boundary>
  );
}
