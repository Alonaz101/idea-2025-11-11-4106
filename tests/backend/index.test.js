const request = require('supertest');
const app = require('../../backend/index');

describe('Backend API CRUD and validation tests', () => {
  // Assuming Express app exported from backend/index.js

  let createdId;

  it('POST /items - create item (positive)', async () => {
    const res = await request(app)
      .post('/items')
      .send({ name: 'TestItem', description: 'A test item', quantity: 5 });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    createdId = res.body.id;
  });

  it('POST /items - validation failure (negative)', async () => {
    const res = await request(app)
      .post('/items')
      .send({ name: '', quantity: -1 });
    expect(res.statusCode).toBe(400);
  });

  it('GET /items/:id - read item (positive)', async () => {
    const res = await request(app).get(`/items/${createdId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id', createdId);
  });

  it('GET /items/:id - not found (negative)', async () => {
    const res = await request(app).get('/items/nonexistentid');
    expect(res.statusCode).toBe(404);
  });

  it('PUT /items/:id - update item (positive)', async () => {
    const res = await request(app)
      .put(`/items/${createdId}`)
      .send({ name: 'UpdatedItem', quantity: 10 });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('name', 'UpdatedItem');
  });

  it('PUT /items/:id - validation failure (negative)', async () => {
    const res = await request(app)
      .put(`/items/${createdId}`)
      .send({ quantity: -10 });
    expect(res.statusCode).toBe(400);
  });

  it('DELETE /items/:id - delete item (positive)', async () => {
    const res = await request(app).delete(`/items/${createdId}`);
    expect(res.statusCode).toBe(204);
  });

  it('DELETE /items/:id - not found (negative)', async () => {
    const res = await request(app).delete('/items/nonexistentid');
    expect(res.statusCode).toBe(404);
  });
});
