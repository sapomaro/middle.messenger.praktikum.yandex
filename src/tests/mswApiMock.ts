import {setupServer} from 'msw/node';
import {rest} from 'msw';

const handlers = [
  rest.post(`${process.env.API_ENDPOINT}/auth/signin`, (req, res, ctx) => {
    console.log('Call login endpoind', req);
    return res(ctx.status(200));
  }),
  rest.post(`${process.env.API_ENDPOINT}/auth/logout`, (req, res, ctx) => {
    console.log('Call logout endpoind', req);
    return res(ctx.status(200));
  }),
];

export const server = setupServer(...handlers);
