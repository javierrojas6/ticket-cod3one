const TicketList = ReactMock();
const AreYouSure = { openModal: stub() };
const Form = ReactMock();
const FormField = ReactMock();
const SubmitButton = ReactMock();
const Message = ReactMock();
const Button = ReactMock();
const Icon = ReactMock();
const Loading = ReactMock();

const StaffEditor = requireUnit('app/admin/panel/staff/staff-editor', {
  'react-redux': ReduxMock,
  'actions/admin-data-actions': {
    retrieveStaffMembers: stub()
  },
  'lib-app/i18n': stub().returnsArg(0),
  'lib-app/session-store': {
    getDepartments() {
      return [{ id: 1 }, { id: 2 }];
    }
  },
  'app-components/ticket-list': TicketList,
  'app-components/are-you-sure': AreYouSure,
  'core-components/form': Form,
  'core-components/form-field': FormField,
  'core-components/submit-button': SubmitButton,
  'core-components/message': Message,
  'core-components/button': Button,
  'core-components/icon': Icon,
  'core-components/loading': Loading
});

describe('StaffEditor component', function () {
  function createInstance(props) {
    return new StaffEditor(
      Object.assign(
        {
          myAccount: false,
          staffId: 7,
          userId: 1,
          email: 'agent@example.com',
          name: 'Agent',
          profilePic: '',
          level: 1,
          departments: [{ id: 1 }],
          sendEmailOnNewTicket: false,
          staffList: []
        },
        props
      )
    );
  }

  it('should add the brand fallback class when the staff member uses the default logo', function () {
    const instance = createInstance();

    expect(instance.getPictureWrapperClass(true)).to.contain('staff-editor__card-pic-wrapper--brand-fallback');
  });

  it('should keep loading and regular picture classes separate for uploaded avatars', function () {
    const instance = createInstance({ profilePic: 'agent.png' });

    instance.state.loadingPicture = true;

    expect(instance.getPictureWrapperClass(false)).to.contain('staff-editor__card-pic-wrapper_loading');
    expect(instance.getPictureWrapperClass(false)).to.not.contain('brand-fallback');
  });
});
