const SessionActionsMock = require('actions/__mocks__/session-actions-mock');
const APICallMockModule = require('lib-app/__mocks__/api-call-mock');
const APICallMock = APICallMockModule.default || APICallMockModule;

const PasswordRecovery = ReactMock({ focusEmail: stub() });
const AuthBrand = ReactMock();
const Button = ReactMock();
const Form = ReactMock();
const FormField = ReactMock();
const SubmitButton = ReactMock();
const Message = ReactMock();
const Widget = ReactMock();
const WidgetTransition = ReactMock();
const Captcha = ReactMock();

const AdminLoginPage = requireUnit('app/admin/admin-login-page', {
  'react-redux': ReduxMock,
  'actions/session-actions': SessionActionsMock,
  'lib-app/api-call': {
    __esModule: true,
    default: APICallMock
  },
  'app-components/password-recovery.js': PasswordRecovery,
  'app-components/auth-brand': AuthBrand,
  'core-components/button': Button,
  'core-components/form': Form,
  'core-components/form-field': FormField,
  'core-components/submit-button': SubmitButton,
  'core-components/message': Message,
  'core-components/widget': Widget,
  'core-components/widget-transition': WidgetTransition,
  'app/main/captcha': Captcha
});

describe('AdminLoginPage component', function () {
  let component;
  let widgetTransition;
  let passwordRecovery;
  let authBrand;
  let forgotPasswordButton;

  function renderComponent(props) {
    component = TestUtils.renderIntoDocument(
      <AdminLoginPage dispatch={stub()} session={{ pending: false, failed: false, loginAttempts: 0 }} {...props} />
    );
    widgetTransition = TestUtils.scryRenderedComponentsWithType(component, WidgetTransition)[0];
    passwordRecovery = TestUtils.scryRenderedComponentsWithType(component, PasswordRecovery)[0];
    authBrand = TestUtils.scryRenderedComponentsWithType(component, AuthBrand)[0];
    forgotPasswordButton = TestUtils.scryRenderedComponentsWithType(component, Button)[0];
  }

  beforeEach(function () {
    renderComponent();
  });

  it('should render the auth brand block in the login side', function () {
    expect(authBrand.props.className).to.equal('admin-login-page__brand');
  });

  it('should pass branded recovery props to the password recovery card', function () {
    expect(passwordRecovery.props.className).to.equal('admin-login-page__recovery-content');
    expect(passwordRecovery.props.renderLogo).to.equal(true);
  });

  it('should show the recovery side when forgot password is clicked', function () {
    expect(widgetTransition.props.sideToShow).to.equal('front');

    forgotPasswordButton.props.onClick();

    expect(widgetTransition.props.sideToShow).to.equal('back');
  });

  it('should render captcha after the free login attempts are exceeded', function () {
    renderComponent({
      session: { pending: false, failed: false, loginAttempts: 4 },
      sitekey: 'site-key'
    });

    expect(TestUtils.scryRenderedComponentsWithType(component, Captcha)).to.have.length(1);
  });
});
