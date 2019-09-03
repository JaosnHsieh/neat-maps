const request = require('supertest');
const path = require('path');
const rimraf = require('rimraf');
const fs = require('fs');
const server = require('../../index');
const { uploadDirPath, replaceFirstLineText } = require('../file');

beforeAll(done => {
  rimraf(path.join(`${uploadDirPath}/*`), () => {
    done();
  });
});
afterAll(done => {
  rimraf(path.join(`${uploadDirPath}/*`), () => {
    done();
  });
});

describe('/files API endpoint ', () => {
  const testUserId = 'testuserid';
  const testFileName = 'testfile.csv';
  test('GET /api/v1/files should response empty array of files', async () => {
    const response = await request(global.mockSessionUser(server, { id: testUserId })).get(
      '/api/v1/files',
    );
    expect(response.body).toStrictEqual([]);
  });

  test(`POST /api/v1/files should create a new file ${testFileName} and  file list coule be fetched`, async () => {
    const response = await request(global.mockSessionUser(server, { id: testUserId }))
      .post('/api/v1/files')
      .attach('file', path.join(__dirname, testFileName));

    expect(response.status).toBe(200);
    expect(response.text).toBe(testFileName);

    const response2 = await request(global.mockSessionUser(server, { id: testUserId })).get(
      '/api/v1/files',
    );

    expect(response2.body).toStrictEqual([testFileName]);
  });

  test('GET /api/v1/files/:filename can get file text ', async () => {
    const response = await request(global.mockSessionUser(server, { id: testUserId }))
      .post('/api/v1/files')
      .attach('file', path.join(__dirname, testFileName));

    expect(response.status).toBe(200);
    expect(response.text).toBe(testFileName);

    const response2 = await request(global.mockSessionUser(server, { id: testUserId })).get(
      `/api/v1/files/${testFileName}`,
    );

    expect(response2.text).toEqual(expect.stringContaining('testfile'));
  });

  test('PUT /api/v1/files should response status code 200', async () => {
    const response = await request(global.mockSessionUser(server, { id: testUserId }))
      .post('/api/v1/files')
      .attach('file', path.join(__dirname, testFileName));

    expect(response.status).toBe(200);
    expect(response.text).toBe(testFileName);

    const updateColumnLineText = 'newColumn1,newColumn2,newColumn3';
    const response2 = await request(global.mockSessionUser(server, { id: testUserId }))
      .put(`/api/v1/files/${testFileName}`)
      .send({ columnLineText: updateColumnLineText });

    const originalFileText = fs.readFileSync(path.join(__dirname, testFileName)).toString();
    expect(response2.text).toBe(replaceFirstLineText(originalFileText, updateColumnLineText));
  });
});
