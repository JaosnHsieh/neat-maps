import React from 'react';

/**
 * Select values from
 * https://gist.github.com/mj12albert/9d38d273a98e3a65aeedd4355b1738a6
 */
export const aviableColumnsMap = {
  address: 'ADDRESS',
  city: 'CITY',
  state: 'STATE',
  zipcode: 'ZIPCODE',
  category: 'CATEGORY',
};
export const aviableColumns = Object.values(aviableColumnsMap);

const ColumnsOptions = () => (
  <select autoFocus>
    <option hidden="true">Choose Column</option>
    {aviableColumns.map((columnText, i) => (
      <option value={columnText} key={i}>
        {columnText}
      </option>
    ))}
  </select>
);

export default ColumnsOptions;
