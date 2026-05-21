const Icon = ReactMock();
const Tooltip = ReactMock();
const Button = ReactMock();
const SubmitButton = ReactMock();
const Form = ReactMock();
const FormField = ReactMock();

const TicketEvent = requireUnit('app-components/ticket-event', {
  'react-redux': ReduxMock,
  'lib-app/i18n': {
    __esModule: true,
    default: (key) => key
  },
  'lib-core/date-transformer': {
    transformToString: stub().returns('DATE')
  },
  'core-components/icon': Icon,
  'core-components/tooltip': Tooltip,
  'core-components/button': Button,
  'core-components/submit-button': SubmitButton,
  'core-components/form': Form,
  'core-components/form-field': FormField
});

describe('TicketEvent component', function () {
  function renderComponent(props) {
    return TestUtils.renderIntoDocument(
      <TicketEvent
        type="COMMENT"
        author={{
          id: 10,
          name: 'Agent',
          staff: true,
          customfields: []
        }}
        content="<p>Hello</p>"
        date="2026-05-20"
        private="0"
        {...props}
      />
    );
  }

  it('should render the brand fallback logo for staff comments without a profile pic', function () {
    const component = renderComponent();
    const node = TestUtils.findRenderedDOMComponentWithClass(component, 'ticket-event');
    const image = node.querySelector('.ticket-event__staff-pic-img');

    expect(image.className).to.contain('ticket-event__staff-pic-img--brand-fallback');
    expect(image.getAttribute('src')).to.match(/\/images\/logo\.png$/);
  });

  it('should render the uploaded staff profile pic without fallback class when available', function () {
    const component = renderComponent({
      author: {
        id: 10,
        name: 'Agent',
        staff: true,
        customfields: [],
        profilePic: 'agent.png'
      }
    });
    const node = TestUtils.findRenderedDOMComponentWithClass(component, 'ticket-event');
    const image = node.querySelector('.ticket-event__staff-pic-img');

    expect(image.className).to.not.contain('brand-fallback');
    expect(image.getAttribute('src')).to.match(/\/system\/download\?file=agent\.png$/);
  });
});
