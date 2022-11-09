import {Templator} from '../Templator';

import type {PlainObject} from '../../constants/types';

class MockBlock {
  public mockProps: PlainObject;
  constructor(props: PlainObject = {}) {
    this.mockProps = props;
  }
}
const mockBlockInstance = new MockBlock({test: 1});
const mockContext = {
  mockInt: 123,
  mockStr: 'str',
  mockNested: '%{mockStr}%',
  mockNestedNested: '%{mockNested}%',
  mockObj: {mockProp: 123},
  mockFn: jest.fn,
  MockBlock,
  mockBlockInstance,
};
const templator = new Templator(mockContext);

describe('core/Templator', () => {
  it('should resolve strings & numbers', () => {
    expect(templator.resolve('%{mockStr}%'))
        .toEqual(['str']);
    expect(templator.resolve('%{mockInt}%'))
        .toEqual([123]);
    expect(templator.resolve('%{ mockStr }% %{mockStr}%'))
        .toEqual(['str', ' ', 'str']);
    expect(templator.resolve('%{wrongMock}%'))
        .toEqual(['%{wrongMock}%']);
  });

  it('should resolve nested entities', () => {
    expect(templator.resolve('%{mockNested}%'))
        .toEqual(['str']);
    expect(templator.resolve('%{mockNestedNested}%'))
        .toEqual(['str']);
    expect(templator.resolve('%{mockNestedNested}% %{mockStr}%'))
        .toEqual(['str', ' ', 'str']);
  });

  it('should resolve objects & functions', () => {
    expect(templator.resolve('%{mockObj}%'))
        .toEqual([{mockProp: 123}]);
    expect(templator.resolve('%{mockObj.mockProp}%'))
        .toEqual([123]);
    expect(templator.resolve('%{mockBlockInstance}%'))
        .toEqual([mockBlockInstance]);
    expect(templator.resolve('%{MockBlock}%'))
        .toEqual([MockBlock]);
    expect(templator.resolve('%{mockStr}% %{MockBlock}%'))
        .toEqual(['str', ' ', MockBlock]);
    expect(templator.resolve('%{mockFn}%'))
        .toEqual([jest.fn]);
  });

  it('should construct objects with JSON context', () => {
    expect(templator.resolve('%{MockBlock({"test": 1})}%'))
        .toEqual([mockBlockInstance]);
    expect(templator.resolve('%{MockBlock({"test": "1"})}%'))
        .not.toEqual([mockBlockInstance]);
    expect(templator.resolve('%{MockBlock({"test": 1, "testB": 2})}%'))
        .not.toEqual([mockBlockInstance]);
  });

  it('should construct multiple objects from list with spread operator', () => {
    const mockList = JSON.stringify([{item: 1}, {item: 2}, {item: 3}]);
    expect(templator.resolve(`%{MockBlock(${mockList}...)}%`))
        .toEqual([
          new MockBlock({item: 1}),
          new MockBlock({item: 2}),
          new MockBlock({item: 3}),
        ]);
  });

  it('should warn if bad JSON context was provided', () => {
    global.console.warn = jest.fn();

    expect(templator.resolve('%{MockBlock({test: 1})}%'))
        .toEqual([new MockBlock()]);
    expect(console.warn).toBeCalled();
  });
});
