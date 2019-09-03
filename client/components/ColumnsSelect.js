import React from 'react';
import PropTypes from 'prop-types';

/**
 * Select values from
 * https://gist.github.com/mj12albert/9d38d273a98e3a65aeedd4355b1738a6
 */
export const availableColumnsMap = {
  address: 'ADDRESS',
  city: 'CITY',
  state: 'STATE',
  zipcode: 'ZIPCODE',
  category: 'CATEGORY',
};
export const availableColumns = Object.values(availableColumnsMap);

const ColumnsOptions = ({ value, onColumnChange }) => (
  <select
    autoFocus
    value={value}
    onChange={e => {
      onColumnChange(e.target.value);
    }}
  >
    <option hidden></option>
    {availableColumns.map((columnText, i) => (
      <option value={columnText} key={i}>
        {columnText}
      </option>
    ))}
  </select>
);

ColumnsOptions.propTypes = {
  onColumnChange: PropTypes.func,
  value: PropTypes.string,
};

export default ColumnsOptions;
