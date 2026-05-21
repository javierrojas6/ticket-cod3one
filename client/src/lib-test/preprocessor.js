'use strict';

const jsdom = require('jsdom').jsdom;

globalThis.document = jsdom('<html><body></body></html>', {
  url: 'http://localhost'
});
globalThis.window = document.defaultView;
globalThis.Node = globalThis.window.Node;
Object.defineProperty(globalThis, 'navigator', {
  value: globalThis.window.navigator,
  configurable: true,
  writable: true
});
globalThis.React = require('react');
globalThis.ReactDOM = require('react-dom');
globalThis.chai = require('chai');
globalThis.expect = chai.expect;
globalThis.sinon = require('sinon');
globalThis.stub = sinon.stub;
globalThis.spy = sinon.spy;
globalThis.proxyquire = require('proxyquire');
globalThis.ReactMock = require('lib-test/react-mock');
chai.use(require('sinon-chai'));
globalThis.TestUtils = require('react-addons-test-utils');
globalThis.requireUnit = function (path, mocks) {
  return proxyquire(process.cwd() + '/src/' + path + '.js', mocks);
};
globalThis.reRenderIntoDocument = (function () {
  let div;

  return function (jsx) {
    if (!div) {
      div = document.createElement('div');
    }

    ReactDOM.render(jsx, div);
    return div;
  };
})();
globalThis.ReduxMock = {
  connect: stub().returns(stub().returnsArg(0))
};
globalThis.__OS_PUBLIC_CONFIG__ = {
  version: 'test',
  root: 'http://localhost',
  apiRoot: 'http://localhost/api',
  showLogs: false,
  globalIndexPath: ''
};

Array.prototype.swap = function (x, y) {
  var b = this[x];
  this[x] = this[y];
  this[y] = b;
  return this;
};
