import {EventBus} from '../EventBus';
import {sleep} from '../Utils';

describe('core/EventBus', () => {
  it('should subscribe to and publish custom events', () => {
    const mockFn = jest.fn();

    EventBus.on('mockEvent1, mockEvent2', mockFn);
    EventBus.emit('mockEvent1, mockEvent2', 'mockParam');

    expect(mockFn).toBeCalledTimes(2);
    expect(mockFn).toHaveBeenCalledWith('mockParam');
  });

  it('should unsubscribe from custom events', () => {
    const mockFn = jest.fn();

    EventBus.on('mockEvent3', mockFn);
    EventBus.off('mockEvent3', mockFn);
    EventBus.emit('mockEvent3', 'mockParam');

    expect(mockFn).not.toHaveBeenCalled();
  });

  it('should handle DOM load', async () => {
    const mockFn = jest.fn();

    EventBus.on('load', mockFn);

    await sleep(100);

    expect(mockFn).toBeCalledTimes(1);
    expect(['interactive', 'complete'].includes(document.readyState))
        .toBe(true);
  });
});
