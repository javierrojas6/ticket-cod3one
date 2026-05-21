import React from 'react';

import MainSignUpWidget from 'app/main/main-signup/main-signup-widget';

class MainSignUpPage extends React.Component {
  render() {
    return (
      <div className="main-signup-page">
        <MainSignUpWidget className="main-signup-page__widget" />
      </div>
    );
  }
}

export default MainSignUpPage;
