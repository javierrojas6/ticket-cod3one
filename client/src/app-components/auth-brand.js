import React from 'react';
import classNames from 'classnames';

import runtimeConfig from 'lib-app/runtime-config';

const AuthBrand = ({ className }) => (
  <div className={classNames('auth-brand', className)}>
    <img className="auth-brand__logo" src={runtimeConfig.getRoot() + '/images/logo.png'} alt="Tick3t One" />
    <div className="auth-brand__copy">
      <div className="auth-brand__title">
        <span className="auth-brand__title-accent">TICK3T</span> ONE
      </div>
      <div className="auth-brand__subtitle">Support Platform</div>
    </div>
  </div>
);

AuthBrand.propTypes = {
  className: React.PropTypes.string
};

AuthBrand.defaultProps = {
  className: ''
};

export default AuthBrand;
