const Button = ReactMock();
const SessionActionsMock = require('actions/__mocks__/session-actions-mock');
const API = {
  getFileLink(file) {
    return `/files/${file}`;
  },
  getURL() {
    return 'http://localhost';
  }
};

const AdminPanelStaffWidget = requireUnit('app/admin/panel/admin-panel-staff-widget', {
  'react-redux': ReduxMock,
  'core-components/button': Button,
  'actions/session-actions': SessionActionsMock,
  'lib-app/api-call': API
});

describe('AdminPanelStaffWidget component', function () {
  function renderComponent(session) {
    return TestUtils.renderIntoDocument(<AdminPanelStaffWidget dispatch={stub()} session={session} />);
  }

  it('should use fallback wrapper and logo when user has no profile pic', function () {
    const component = renderComponent({ userName: 'Admin', userProfilePic: '' });
    const node = TestUtils.findRenderedDOMComponentWithClass(component, 'admin-panel-staff-widget');
    const wrapper = node.querySelector('.admin-panel-staff-widget__profile-pic-wrapper');
    const image = node.querySelector('.admin-panel-staff-widget__profile-pic');

    expect(wrapper.className).to.contain('admin-panel-staff-widget__profile-pic-wrapper--brand-fallback');
    expect(image.className).to.contain('admin-panel-staff-widget__profile-pic--brand-fallback');
    expect(image.getAttribute('src')).to.equal('http://localhost/images/logo.png');
  });

  it('should use uploaded profile pic when available', function () {
    const component = renderComponent({ userName: 'Admin', userProfilePic: 'avatar.png' });
    const node = TestUtils.findRenderedDOMComponentWithClass(component, 'admin-panel-staff-widget');
    const wrapper = node.querySelector('.admin-panel-staff-widget__profile-pic-wrapper');
    const image = node.querySelector('.admin-panel-staff-widget__profile-pic');

    expect(wrapper.className).to.not.contain('brand-fallback');
    expect(image.className).to.not.contain('brand-fallback');
    expect(image.getAttribute('src')).to.equal('/files/avatar.png');
  });
});
