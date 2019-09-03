import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import _has from 'lodash/has';
import _get from 'lodash/get';
import ColumnsSelect, { availableColumnsMap } from './ColumnsSelect';
import { csvToArray, SERVER_URL } from './utils';

function getRangeNumberOrChar(cur, end) {
  let array = [];
  while (cur <= end) {
    array.push(cur);
    cur = isNaN(cur) ? String.fromCharCode(cur.charCodeAt() + 1) : cur + 1;
  }
  return array;
}

/**
 * uploadFile
 * formData needed coz formiadble error: 'bad content-type header, unknown content-type: text/csv'
 * reference:
 * https://muffinman.io/uploading-files-using-fetch-multipart-form-data/
 * https://github.com/node-formidable/node-formidable/issues/495
 */
const uploadFile = async (file, done = () => {}) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch(`${SERVER_URL}/api/v1/files`, {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });
    if (!response.ok) {
      const error = await response.json();
      _has(error, 'message') && alert(_get(error, 'message'));
    }
    done();
  } catch (err) {
    console.log('err', err);
    done();
  }
};

const updateColumnLineTextByFileName = async (
  filename = '',
  columnLineText = '',
  done = () => {},
) => {
  try {
    await fetch(`${SERVER_URL}/api/v1/files/${filename}`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ columnLineText }),
    });
    done();
  } catch (err) {
    done();
  }
};
const sheetInit = {
  aToZ: getRangeNumberOrChar('A', 'Z'),
  oneTo20: getRangeNumberOrChar(1, 20),
};

const Sheet = ({ setCompleteAddresses }) => {
  const [fileList, setFileList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [csvText, setCsvText] = useState('');
  const [fileName, setFileName] = useState('');
  const [csvColumns, setCsvColumns] = useState([]);
  const isDefaultSheet = csvText.length === 0;
  // const csvArray = isDefaultSheet ? [] : csvToArray(csvText);
  const columnRow = isDefaultSheet ? sheetInit.aToZ : csvColumns;
  const dataRows = isDefaultSheet
    ? sheetInit.oneTo20.map(num => [num, ...sheetInit.aToZ.map(() => '')])
    : csvToArray(csvText).map((r, i) => [i + 1, ...r]);
  const loadFileList = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${SERVER_URL}/api/v1/files`, {
        method: 'GET',
        credentials: 'include',
      });
      setIsLoading(false);
      const fileList = await response.json();
      setFileList(fileList);
    } catch (err) {
      setIsLoading(false);
    }
  };
  const loadCsvFile = async filename => {
    try {
      setIsLoading(true);
      const response = await fetch(`${SERVER_URL}/api/v1/files/${filename}`, {
        method: 'GET',
        credentials: 'include',
      });
      setIsLoading(false);
      const csvFileTextWithColumns = await response.text();
      const csvFileTextWithColumnsRows = csvFileTextWithColumns.split('\n');
      setCsvColumns(csvFileTextWithColumnsRows[0].split(','));
      setCsvText(csvFileTextWithColumnsRows.slice(1).join('\n'));
      // Array.from({ length: Math.max(...csvArray.map(r => r.length)) }, () => '');
    } catch (err) {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    loadFileList();
  }, []);
  useEffect(() => {
    const { zipcode, state, city, address } = availableColumnsMap;
    const getCellText = (row = [], columnName = '') => row[csvColumns.indexOf(columnName) + 1];

    // only update completedAddresses when every address columns has been selected
    if ([zipcode, state, city, address].every(c => csvColumns.includes(c))) {
      setCompleteAddresses(
        dataRows.map(
          row =>
            `${getCellText(row, address)}, ${getCellText(row, city)}, ${getCellText(
              row,
              state,
            )} ${getCellText(row, zipcode)}`,
        ),
      );
    }
  }, [csvColumns]);
  const fileInput = (
    <input
      id="csvfile"
      type="file"
      onChange={async event => {
        const file = event.target.files[0];

        const reader = new FileReader();
        reader.onload = function(event) {
          setCsvColumns(',,,,'.split(','));
          setCsvText(event.target.result);
          setFileName(file.name);
        };

        reader.readAsText(file);
        setIsSaving(true);

        await uploadFile(file, () => {
          setIsSaving(false);
          loadFileList();
        });
      }}
    />
  );
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
        <div>{fileInput}</div>
      </div>
    </div>
  );
  const toolBar = (
    <>
      <span>select csv file {fileInput}</span>
      <div style={{ height: '25px', padding: '10px' }}>
        {!isDefaultSheet && isSaving && <div style={{ float: 'right' }}>Saving</div>}
        {!isDefaultSheet && isLoading && <div style={{ float: 'right' }}>Loading</div>}
        <div style={{ display: 'inline-block' }}>
          <span style={{ paddingRight: '5px' }}>saved files</span>
          {fileList.map((name, i) => (
            <button
              key={i}
              onClick={() => {
                setFileName(name);
                loadCsvFile(name);
              }}
            >
              {name}
            </button>
          ))}
        </div>
      </div>
    </>
  );
  return (
    <>
      {toolBar}
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
              {columnRow.map((c, i) => (
                <th key={i}>
                  {isDefaultSheet ? (
                    c
                  ) : (
                    <ColumnsSelect
                      value={c}
                      onColumnChange={columnText => {
                        setCsvColumns(s => {
                          s[i] = columnText;
                          setIsSaving(true);
                          updateColumnLineTextByFileName(fileName, csvColumns.join(','), () => {
                            setIsSaving(false);
                          });
                          return [...s];
                        });
                      }}
                    />
                  )}
                </th>
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
    </>
  );
};

Sheet.propTypes = {
  setCompleteAddresses: PropTypes.func,
};
export default Sheet;
