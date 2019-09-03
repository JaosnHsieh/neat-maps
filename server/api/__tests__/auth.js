const request = require('supertest');
const server = require('../../index');

describe('/isAuthed API endpoint ', () => {
  test('should response status code 401 before login', async () => {
    const response = await request(global.mockSessionUser(server)).get('/isAuthed');
    expect(response.statusCode).toBe(401);
  });

  test('should response status code 200 after login', async () => {
    const response = await request(global.mockSessionUser(server, {})).get('/isAuthed');
    expect(response.statusCode).toBe(200);
  });
});
