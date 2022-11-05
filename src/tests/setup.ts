import {server} from './mswApiMock'

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
