import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

const handlers = [
  http.post('*/login', () =>
    HttpResponse.json({ token: 'test-token' }, { status: 200 })
  ),
  http.post('*/register', () => HttpResponse.json({}, { status: 201 })),
];

export const server = setupServer(...handlers);