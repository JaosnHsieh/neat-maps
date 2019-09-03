import React from 'react';
import { render } from '@testing-library/react';
import Auth from '../Auth';

test('<Auth /> render', () => {
  /**
   * Warning: An update to Auth inside a test was not wrapped in act(...).
   * https://github.com/testing-library/react-testing-library/issues/281
   */
  render(<Auth />);
});