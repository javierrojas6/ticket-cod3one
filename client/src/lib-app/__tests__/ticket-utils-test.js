const API = {
  getFileLink(file) {
    return `/files/${file}`;
  },
  getURL() {
    return 'http://localhost';
  }
};

const TicketUtils = requireUnit('lib-app/ticket-utils', {
  'lib-app/api-call': API
});

describe('ticket-utils', function () {
  it('should detect when a staff member uses the default profile pic', function () {
    expect(TicketUtils.isDefaultStaffProfilePic({ profilePic: null })).to.equal(true);
    expect(TicketUtils.isDefaultStaffProfilePic({ profilePic: 'avatar.png' })).to.equal(false);
  });

  it('should resolve custom and default staff profile pictures', function () {
    expect(TicketUtils.getStaffProfilePic({ profilePic: 'avatar.png' })).to.equal('/files/avatar.png');
    expect(TicketUtils.getStaffProfilePic({ profilePic: '' })).to.equal('http://localhost/images/logo.png');
  });

  it('should render brand fallback class when staff option uses the default logo', function () {
    const option = TicketUtils.renderStaffOption({ id: 1, name: 'Admin', profilePic: '' });
    const image = option.props.children[0];

    expect(image.props.className).to.contain('ticket-query-filters__staff-option__profile-pic--brand-fallback');
    expect(image.props.src).to.equal('http://localhost/images/logo.png');
  });

  it('should render selected staff content without fallback class for custom pictures', function () {
    const selected = TicketUtils.renderStaffSelected({ id: 2, name: 'Agent', profilePic: 'avatar.png' });
    const image = selected.props.children[0];

    expect(image.props.className).to.equal('ticket-query-filters__staff-selected__profile-pic');
    expect(image.props.src).to.equal('/files/avatar.png');
  });
});
