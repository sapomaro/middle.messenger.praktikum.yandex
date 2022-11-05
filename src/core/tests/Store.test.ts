import {Store, StoreSynced} from '../Store';
import type {Block} from '../Block';

describe('core/Store', () => {
  it('should get state', () => {
    expect(Store.getState()).toEqual(Store.state);
  });

  it('should have default state', () => {
    const defaultState = {
      user: null,
      chats: [],
      activeChatId: 0,
      activeChatToken: '',
      activeChatMessages: [],
      isLoading: false,
    };

    expect(Store.getState()).toEqual(defaultState);
  });

  it('should set state', () => {
    Store.setState({test: 1});

    expect(Store.state).toHaveProperty('test', 1);
  });

  it('should emit event after store was updated', () => {
    const mockFn = jest.fn();

    Store.on('updated', mockFn);
    Store.setState({test: 2});

    expect(mockFn).toBeCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith({test: 2});
  });

  it('should not emit event if store was not changed', () => {
    const mockFn = jest.fn();

    Store.setState({test: 3});
    Store.on('updated', mockFn);
    Store.setState({});
    Store.setState({test: 3});

    expect(mockFn).not.toHaveBeenCalled();
  });
});

describe('core/StoreSynced', () => {
  it('should update if store was updated', () => {
    const MockBlock = jest.fn() as unknown as typeof Block;
    const mockSynced = new (StoreSynced(MockBlock))();
    mockSynced.setProps = jest.fn();

    Store.setState({test: 4});

    expect(mockSynced.setProps).toBeCalledTimes(1);
    expect(mockSynced.setProps).toHaveBeenCalledWith({test: 4});
  });

  it('should not update if property set to ignored', () => {
    const MockBlock = jest.fn() as unknown as typeof Block;
    const mockSynced = new (StoreSynced(MockBlock))();
    mockSynced.setProps = jest.fn();

    mockSynced.ignoreSync(['test']);
    Store.setState({test: 5});

    expect(mockSynced.setProps).toBeCalledTimes(1);
    expect(mockSynced.setProps).toHaveBeenCalledWith({});
  });
});
