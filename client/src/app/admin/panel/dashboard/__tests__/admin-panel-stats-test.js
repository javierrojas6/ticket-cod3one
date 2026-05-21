const AdminPanelStats = requireUnit('app/admin/panel/dashboard/admin-panel-stats', {
  'react-redux': ReduxMock,
  'lib-app/i18n': {
    __esModule: true,
    default: (key) => key
  }
});

function createInstance(props) {
  return new AdminPanelStats({
    tags: [],
    departments: [],
    staffList: [],
    ...props
  });
}

describe('AdminPanelStats component', function () {
  it('should render brand fallback avatars for staff without profile pic in autocomplete items', function () {
    const instance = createInstance({
      staffList: [{ id: '5', name: 'Admin', profilePic: '' }]
    });
    const item = instance.getStaffItems()[0];
    const selectedImage = item.contentOnSelected.props.children[0];
    const optionImage = item.content.props.children[0];

    expect(item.id).to.equal(5);
    expect(item.name).to.equal('admin');
    expect(selectedImage.props.className).to.contain('admin-panel-stats__staff-selected__profile-pic--brand-fallback');
    expect(optionImage.props.className).to.contain('admin-panel-stats__staff-option__profile-pic--brand-fallback');
    expect(selectedImage.props.src).to.match(/\/images\/logo\.png$/);
    expect(optionImage.props.src).to.match(/\/images\/logo\.png$/);
  });

  it('should keep uploaded staff avatars without fallback classes in autocomplete items', function () {
    const instance = createInstance({
      staffList: [{ id: '7', name: 'Agent', profilePic: 'agent.png' }]
    });
    const item = instance.getStaffItems()[0];
    const selectedImage = item.contentOnSelected.props.children[0];
    const optionImage = item.content.props.children[0];

    expect(selectedImage.props.className).to.equal('admin-panel-stats__staff-selected__profile-pic');
    expect(optionImage.props.className).to.equal('admin-panel-stats__staff-option__profile-pic');
    expect(selectedImage.props.src).to.match(/\/system\/download\?file=agent\.png$/);
    expect(optionImage.props.src).to.match(/\/system\/download\?file=agent\.png$/);
  });
});
