import { createRoot } from 'react-dom/client';
import App from '../App';

export const mount = (el: HTMLElement) => {
  const root = createRoot(el);
  root.render(<App />);
  return {
    unmount() {
      root.unmount();
    },
  };
};
