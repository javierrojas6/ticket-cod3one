const Link = ReactMock();
const PeopleList = ReactMock();
const ModalContainer = { openModal: stub() };
const InviteStaffModal = ReactMock();
const Header = ReactMock();
const Button = ReactMock();
const Icon = ReactMock();
const Loading = ReactMock();
const DepartmentDropdown = ReactMock();

const AdminPanelStaffMembers = requireUnit('app/admin/panel/staff/admin-panel-staff-members', {
  'react-redux': ReduxMock,
  'react-router': { Link },
  'actions/admin-data-actions': {
    retrieveStaffMembers: stub()
  },
  'lib-app/i18n': {
    __esModule: true,
    default: (key) => key
  },
  'lib-app/session-store': {
    getDepartments() {
      return [
        { id: 1, name: 'Support' },
        { id: 2, name: 'Sales' }
      ];
    }
  },
  'app-components/people-list': PeopleList,
  'app-components/modal-container': ModalContainer,
  'app/admin/panel/staff/invite-staff-modal': InviteStaffModal,
  'core-components/header': Header,
  'core-components/button': Button,
  'core-components/icon': Icon,
  'core-components/loading': Loading,
  'app-components/department-dropdown': DepartmentDropdown
});

function createInstance(props) {
  return new AdminPanelStaffMembers({
    dispatch: stub(),
    loading: false,
    staffList: [],
    ...props
  });
}

describe('AdminPanelStaffMembers component', function () {
  it('should mark staff without profile pic as brand fallback entries', function () {
    const instance = createInstance({
      staffList: [
        {
          id: 5,
          name: 'Admin',
          profilePic: '',
          departments: [{ id: 1 }]
        }
      ]
    });
    const staff = instance.getStaffList()[0];

    expect(staff.defaultProfilePic).to.equal(true);
    expect(staff.profilePic).to.match(/\/images\/logo\.png$/);
    expect(staff.name.props.to).to.equal('/admin/panel/staff/view-staff/5');
  });

  it('should preserve uploaded staff avatars in mapped list entries', function () {
    const instance = createInstance({
      staffList: [
        {
          id: 7,
          name: 'Agent',
          profilePic: 'agent.png',
          departments: [{ id: 2 }]
        }
      ]
    });
    const staff = instance.getStaffList()[0];

    expect(staff.defaultProfilePic).to.equal(false);
    expect(staff.profilePic).to.match(/\/system\/download\?file=agent\.png$/);
  });
});
