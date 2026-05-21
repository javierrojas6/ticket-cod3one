const AuthBrand = requireUnit('app-components/auth-brand', {
  'lib-app/runtime-config': {
    getRoot: stub().returns('http://localhost')
  }
});

describe('AuthBrand component', function () {
  let node;

  beforeEach(function () {
    const container = reRenderIntoDocument(<AuthBrand className="custom-brand" />);
    node = container.querySelector('.auth-brand');
  });

  it('should render logo, title and subtitle', function () {
    const image = node.querySelector('.auth-brand__logo');
    const title = node.querySelector('.auth-brand__title');
    const subtitle = node.querySelector('.auth-brand__subtitle');

    expect(node.className).to.contain('auth-brand');
    expect(node.className).to.contain('custom-brand');
    expect(image.getAttribute('src')).to.equal('http://localhost/images/logo.png');
    expect(image.getAttribute('alt')).to.equal('Tick3t One');
    expect(title.textContent.replace(/\s+/g, ' ').trim()).to.equal('TICK3T ONE');
    expect(subtitle.textContent).to.equal('Support Platform');
  });
});
