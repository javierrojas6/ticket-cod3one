const Form = ReactMock();
const FormField = ReactMock();
const Widget = ReactMock();
const Button = ReactMock();
const SubmitButton = ReactMock();
const Message = ReactMock();
const AuthBrand = ReactMock();

const PasswordRecovery = requireUnit('app-components/password-recovery', {
  'core-components/form': Form,
  'core-components/form-field': FormField,
  'core-components/widget': Widget,
  'core-components/button': Button,
  'core-components/submit-button': SubmitButton,
  'core-components/message': Message,
  'app-components/auth-brand': AuthBrand
});

describe('PasswordRecovery component', function () {
  let component;
  let form;
  let field;
  let backButton;

  function renderComponent(props = {}) {
    component = TestUtils.renderIntoDocument(
      <PasswordRecovery
        formProps={{ errors: {}, onSubmit: stub(), onValidateErrors: stub() }}
        onBackToLoginClick={stub()}
        {...props}
      />
    );

    form = TestUtils.scryRenderedComponentsWithType(component, Form)[0];
    field = TestUtils.scryRenderedComponentsWithType(component, FormField)[0];
    backButton = TestUtils.scryRenderedComponentsWithType(component, Button)[0];
  }

  beforeEach(function () {
    renderComponent();
  });

  it('should render the email field with large size', function () {
    expect(form.props.errors).to.deep.equal({});
    expect(field.props.name).to.equal('email');
    expect(field.props.fieldProps).to.deep.equal({ size: 'large' });
  });

  it('should render auth brand when requested', function () {
    renderComponent({ renderLogo: true });
    const authBrand = TestUtils.scryRenderedComponentsWithType(component, AuthBrand)[0];

    expect(authBrand.props.className).to.equal('password-recovery__brand');
  });

  it('should not render auth brand by default', function () {
    expect(TestUtils.scryRenderedComponentsWithType(component, AuthBrand)).to.have.length(0);
  });

  it('should call back to login handler from the link button', function () {
    const onBackToLoginClick = stub();
    renderComponent({ onBackToLoginClick });

    backButton.props.onClick();
    expect(onBackToLoginClick).to.have.been.calledOnce;
  });

  it('should render recover sent message when recoverSent is true', function () {
    renderComponent({ recoverSent: true });
    const message = TestUtils.scryRenderedComponentsWithType(component, Message)[0];

    expect(message.props.type).to.equal('info');
    expect(message.props.className).to.equal('password-recovery__message');
    expect(message.props.leftAligned).to.equal(true);
  });
});
