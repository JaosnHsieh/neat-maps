import React from 'react';
import PropTypes from 'prop-types';
import ColumnsSelect from './ColumnsSelect';
import { csvToArray } from './utils';

function getRangeNumberOrChar(cur, end) {
  let array = [];
  while (cur <= end) {
    array.push(cur);
    cur = isNaN(cur) ? String.fromCharCode(cur.charCodeAt() + 1) : cur + 1;
  }
  return array;
}
const sheetInit = {
  aToZ: getRangeNumberOrChar('A', 'Z'),
  oneTo20: getRangeNumberOrChar(1, 20),
};

const Sheet = ({ csvText = '', setCsvText }) => {
  const isDefaultSheet = csvText.length === 0;
  const csvArray = isDefaultSheet ? [] : csvToArray(csvText);
  const columnRow = isDefaultSheet
    ? sheetInit.aToZ
    : Array.from({ length: Math.max(...csvArray.map(r => r.length)) }, () => '');
  const dataRows = isDefaultSheet
    ? sheetInit.oneTo20.map(num => [num, ...sheetInit.aToZ.map(() => '')])
    : csvToArray(csvText).map((r, i) => [i + 1, ...r]);

  const fileInputOverlay = (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        position: 'absolute',
        height: '100%',
        width: '100%',
        zIndex: 10,
        backgroundColor: '#222',
        opacity: 0.8,
      }}
    >
      <label
        htmlFor="csvfile"
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
        }}
      ></label>
      <div style={{ position: 'absolute', top: '20%', color: 'white' }}>
        <label>select csv file</label>
        <div>
          <input
            id="csvfile"
            type="file"
            onChange={() => {
              var file = event.target.files[0];
              var reader = new FileReader();
              reader.onload = function(event) {
                console.log('event.target.result', event.target.result);
                setCsvText(event.target.result);
              };
              reader.readAsText(file);
            }}
          />
        </div>
      </div>
    </div>
  );
  return (
    <div style={{ height: '100%', position: 'relative' }}>
      <style>
        {`
          table {
            border-collapse: collapse;
          }
          th,
          td {
            border: 1px solid #ccc;
          }
          th {
            background: #ddd;
          }
          td div {
            text-align: right;
            width: 120px;
            min-height: 1.2em;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          div.text {
            text-align: left;
          }
          td.error{
              background-color:#f2dede;
          }
      `}
      </style>
      {isDefaultSheet && fileInputOverlay}
      <table>
        <tbody>
          <tr>
            <th style={{ width: '10px' }} />
            {columnRow.map((char, i) => (
              <th key={i}>{char ? char : <ColumnsSelect />}</th>
            ))}
          </tr>
          {dataRows.map((row, i) => (
            <tr key={i}>
              <th>{row[0]}</th>
              {row.slice(1).map((text, j) => (
                <td key={j}>
                  <div>{text}</div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

Sheet.propTypes = {
  csvText: PropTypes.string,
  setCsvText: PropTypes.func,
};
export default Sheet;
