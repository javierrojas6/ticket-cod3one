const DateTransformer = {
  transformToString: stub().returns('DATE')
};
const Menu = ReactMock();

const StaggeredMotion = React.createClass({
  render() {
    return <div>{this.props.children(this.props.defaultStyles)}</div>;
  }
});

const PeopleList = requireUnit('app-components/people-list', {
  'lib-core/date-transformer': DateTransformer,
  'core-components/menu': Menu,
  'react-motion': {
    StaggeredMotion,
    spring: (value) => value
  }
});

describe('PeopleList component', function () {
  function renderComponent(list) {
    return TestUtils.renderIntoDocument(<PeopleList list={list} page={1} pageSize={4} onPageSelect={stub()} />);
  }

  it('should add fallback classes when the profile pic is the default logo', function () {
    const component = renderComponent([
      {
        profilePic: '/images/logo.png',
        defaultProfilePic: true,
        name: 'Admin',
        assignedTickets: 1,
        closedTickets: 2,
        lastLogin: '2026-05-20'
      }
    ]);
    const node = ReactDOM.findDOMNode(component);
    const wrapper = node.querySelector('.people-list__item-profile-pic-wrapper');
    const image = node.querySelector('.people-list__item-profile-pic');

    expect(wrapper.className).to.contain('people-list__item-profile-pic-wrapper--brand-fallback');
    expect(image.className).to.contain('people-list__item-profile-pic--brand-fallback');
    expect(image.getAttribute('src')).to.equal('/images/logo.png');
  });

  it('should keep regular classes for custom profile pics', function () {
    const component = renderComponent([
      {
        profilePic: '/files/custom.png',
        defaultProfilePic: false,
        name: 'Agent',
        assignedTickets: 1,
        closedTickets: 2,
        lastLogin: '2026-05-20'
      }
    ]);
    const node = ReactDOM.findDOMNode(component);
    const wrapper = node.querySelector('.people-list__item-profile-pic-wrapper');
    const image = node.querySelector('.people-list__item-profile-pic');

    expect(wrapper.className).to.not.contain('brand-fallback');
    expect(image.className).to.not.contain('brand-fallback');
  });
});
