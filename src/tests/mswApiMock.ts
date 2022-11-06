import {setupServer} from 'msw/node';
import {rest} from 'msw';
import {sleep} from '../core/Utils';

const TEST_ENDPOINT = 'http://mockhost';
const API_ENDPOINT = 'https://ya-praktikum.tech/api/v2';

const handlers = [
  rest.get(`${TEST_ENDPOINT}/mock/path`, (req, res, ctx) => {
    const param = req.url.searchParams?.get('param');
    const header = req.headers?.get('mock-header');
    const response = [ctx.status(200)];
    if (param) response.push(ctx.json({param}));
    if (header) response.push(ctx.set('mock-header', header));
    return res(...response);
  }),
  rest.post(`${TEST_ENDPOINT}/mock/path`, async (req, res, ctx) => {
    const data = await req.json();
    return res(ctx.status(200), ctx.json(data));
  }),
  rest.put(`${TEST_ENDPOINT}/mock/path`, async (req, res, ctx) => {
    const data = await req.json();
    return res(ctx.status(200), ctx.json(data));
  }),
  rest.delete(`${TEST_ENDPOINT}/mock/path`, async (req, res, ctx) => {
    const data = await req.json();
    return res(ctx.status(200), ctx.json(data));
  }),
  rest.get(`${TEST_ENDPOINT}/mock/timeout`, async (_, res, ctx) => {
    await sleep(1000);
    return res(ctx.status(200));
  }),

  rest.post(`${API_ENDPOINT}/auth/signin`, (_, res, ctx) => {
    return res(ctx.status(200));
  }),
  rest.post(`${API_ENDPOINT}/auth/logout`, (_, res, ctx) => {
    return res(ctx.status(200));
  }),
];

export const server = setupServer(...handlers);
