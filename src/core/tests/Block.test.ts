import {Block} from '../Block';

describe('core/Block', () => {
  it('should be created with props and have uid', () => {
    const block = new Block({id: 'testId', mockProp: 1});

    expect(block.props).toHaveProperty('mockProp', 1);
    expect(block).toHaveProperty('blockuid');
  });

  it('should be assigned with new props', () => {
    const block = new Block({id: 'testId', mockProp: 1});
    const mockFn = jest.fn();

    block.on('updated', mockFn);
    block.setProps({mockProp: 2});

    expect(block.props).toHaveProperty('mockProp', 2);
    expect(mockFn).toBeCalledTimes(1);
  });

  it('should not update with same props', () => {
    const block = new Block({id: 'testId', mockProp: 1});
    const mockFn = jest.fn();

    block.on('updated', mockFn);
    block.setProps({mockProp: 1});
    block.setProps({});

    expect(mockFn).not.toHaveBeenCalled();
  });

  it('should build and mount to document.body', async () => {
    const block = new Block({id: 'testId', mockProp: 'a'});
    block.render = (props) =>
      `<div id="${props?.id}">${props?.mockProp}%{mockProp}%</div>`;
    const mockFn = jest.fn();

    block.on('mounted', mockFn);
    block.renderToBody();

    expect(block.isInDOM()).toBe(true);
    expect(document.getElementById('testId')).not.toBe(null);
    expect(block.getContent()[0].nodeType).toBe(1);
    expect(block.getContent()[0].textContent).toBe('aa');
    expect(mockFn).toBeCalledTimes(1);
  });

  it('should refresh/rerender with new props', async () => {
    const block = new Block({id: 'testId', mockProp: 'a'});
    block.render = (props) =>
      `<div id="${props?.id}">${props?.mockProp}</div>`;
    const mockFn = jest.fn();

    block.renderToBody();
    block.on('rendered', mockFn);
    block.setProps({mockProp: 'b'});
    block.refresh();

    expect(document.getElementById('testId')?.textContent).toBe('b');
    expect(mockFn).toBeCalledTimes(2);
  });

  it('should not rerender with setPropsWithoutRerender', () => {
    const block = new Block({id: 'testId', mockProp: 'a'});
    block.render = (props) =>
      `<div id="${props?.id}">${props?.mockProp}</div>`;
    const mockFn = jest.fn();

    block.renderToBody();
    block.on('rendered', mockFn);
    block.setPropsWithoutRerender({mockProp: 'b'});

    expect(mockFn).not.toHaveBeenCalled();
    expect(block.props).toHaveProperty('mockProp', 'b');
    expect(document.getElementById('testId')?.textContent).toBe('a');
  });

  it('should unmount', async () => {
    const block = new Block({id: 'testId', mockProp: 'a'});
    block.render = (props) =>
      `<div id="${props?.id}">${props?.mockProp}</div>`;
    const mockFn = jest.fn();

    block.renderToBody();
    block.on('unmounting', mockFn);
    block.unmount();

    expect(block.isInDOM()).toBe(false);
    expect(document.getElementById('testId')).toBe(null);
    expect(block.getContent().length).toBe(0);
    expect(mockFn).toBeCalledTimes(1);
  });

  it('should have DOM events attached and emitted', async () => {
    const mockFn = jest.fn();
    const block = new Block({id: 'testId', onclick: mockFn});
    block.render = (props) =>
      `<button id="${props?.id}" onclick="%{onclick}%">Click</button>`;
    const clickEvent = new Event('click', {
      bubbles: true,
      cancelable: true,
    });

    block.renderToBody();
    document.getElementById('testId')?.dispatchEvent(clickEvent);

    expect(mockFn).toBeCalledTimes(1);
  });

  it('should render with child blocks', async () => {
    const block = new Block({id: 'testId', content: 'parent', mock: 'mock'});
    block.render = (props) =>
      `<div id="${props?.id}">%{childBlockA}% %{childBlockB}%</div>`;
    const childBlockA = new Block({id: 'testIdA', content: 'mockA'});
    childBlockA.render = (props) =>
      `<span id="${props?.id}">%{content}%</span>`;
    const childBlockB = new Block({id: 'testIdB', content: '%{mock}%'});
    childBlockB.render = (props) =>
      `<span id="${props?.id}">${props?.content}</span>`;

    block.setProps({childBlockA, childBlockB});
    block.renderToBody();

    expect(childBlockA.isInDOM()).toBe(true);
    expect(document.getElementById('testIdA')).not.toBe(null);
    expect(document.getElementById('testIdA')?.textContent).toBe('mockA');
    expect(childBlockB.isInDOM()).toBe(true);
    expect(document.getElementById('testIdB')).not.toBe(null);
    expect(document.getElementById('testIdB')?.textContent).toBe('mock');
  });

  it('should listDescendants', async () => {
    const block = new Block({id: 'testId', mockProp: 'parent'});
    block.render = (props) =>
      `<div id="${props?.id}">%{childBlockA}% %{childBlockB}%</div>`;
    const childBlockA = new Block({id: 'testIdA'});
    childBlockA.render = (props) =>
      `<span id="${props?.id}">${props?.mockProp || ''}</span>`;
    const childBlockB = new Block({id: 'testIdB'});
    childBlockB.render = (props) =>
      `<span id="${props?.id}">${props?.mockProp || ''}</span>`;

    block.setProps({childBlockA, childBlockB});
    block.renderToBody();

    block.listDescendants((childBlock: Block) => {
      childBlock.setProps({mockProp: 'child'});
    });

    expect(childBlockA.props).toHaveProperty('mockProp', 'child');
    expect(childBlockB.props).toHaveProperty('mockProp', 'child');
    expect(block.props).toHaveProperty('mockProp', 'parent');
    expect(document.getElementById('testIdA')?.textContent).toBe('child');
    expect(document.getElementById('testIdB')?.textContent).toBe('child');
  });
});
