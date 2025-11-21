import { render } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';

// Custom render function that includes providers
const customRender = (ui: React.ReactElement, options = {}) => {
  return render(ui, {
    wrapper: ({ children }) => (
      <Router>
        {children}
      </Router>
    ),
    ...options,
  });
};

export * from '@testing-library/react';
export { customRender as render };
