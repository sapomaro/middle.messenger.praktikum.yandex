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
    const mock = jest.fn();

    Store.on('updated', mock);
    Store.setState({test: 2});

    expect(mock).toBeCalledTimes(1);
    expect(mock).toHaveBeenCalledWith({test: 2});
  });

  it('should not emit event if store was not changed', () => {
    const mock = jest.fn();

    Store.setState({test: 3});
    Store.on('updated', mock);
    Store.setState({});
    Store.setState({test: 3});

    expect(mock).not.toHaveBeenCalled();
  });
});

describe('core/StoreSynced', () => {
  it('should update if store was updated', () => {
    const mock = jest.fn() as unknown as typeof Block;
    const mockSynced = new (StoreSynced(mock))();
    mockSynced.setProps = jest.fn();

    Store.setState({test: 4});

    expect(mockSynced.setProps).toBeCalledTimes(1);
    expect(mockSynced.setProps).toHaveBeenCalledWith({test: 4});
  });

  it('should not update if property set to ignored', () => {
    const mock = jest.fn() as unknown as typeof Block;
    const mockSynced = new (StoreSynced(mock))();
    mockSynced.setProps = jest.fn();

    mockSynced.ignoreSync(['test']);
    Store.setState({test: 5});

    expect(mockSynced.setProps).toBeCalledTimes(1);
    expect(mockSynced.setProps).toHaveBeenCalledWith({});
  });
});
