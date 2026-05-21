import _ from 'lodash';

import Reducer from 'reducers/reducer';
import sessionStore from 'lib-app/session-store';

class ConfigReducer extends Reducer {
  getInitialState() {
    return {
      language: sessionStore.getItem('language'),
      initDone: false,
      initError: null,
      installedDone: false,
      installed: false
    };
  }

  getTypeHandlers() {
    return {
      CHANGE_LANGUAGE: this.onLanguageChange,
      INIT_CONFIGS_FULFILLED: this.onInitConfigs,
      INIT_CONFIGS_REJECTED: this.onInitConfigsRejected,
      CHECK_INSTALLATION_FULFILLED: this.onInstallationChecked,
      CHECK_INSTALLATION_REJECTED: this.onInstallationCheckRejected,
      UPDATE_DATA_FULFILLED: this.onInitConfigs,
      UPDATE_DATA_REJECTED: this.onInitConfigsRejected,
      UPDATE_USER_SYSTEM_SETTINGS: this.onUserSystemSettingsChange
    };
  }

  onLanguageChange(state, payload) {
    sessionStore.setItem('language', payload);

    return _.extend({}, state, {
      language: payload
    });
  }

  onInitConfigs(state, payload) {
    let currentLanguage = sessionStore.getItem('language');

    if (payload.data.allowedLanguages && !_.includes(payload.data.allowedLanguages, currentLanguage)) {
      currentLanguage = payload.data.language;
    }
    sessionStore.storeConfigs(
      _.extend({}, payload.data, {
        language: currentLanguage || payload.data.language
      })
    );

    return _.extend({}, state, payload.data, {
      language: currentLanguage || payload.data.language || 'en',
      registration: !!(payload.data.registration * 1),
      'mandatory-login': !!(payload.data['mandatory-login'] * 1),
      'allow-attachments': !!(payload.data['allow-attachments'] * 1),
      'maintenance-mode': !!(payload.data['maintenance-mode'] * 1),
      departments:
        payload.data.departments &&
        payload.data.departments.map((department) => _.extend({}, department, { private: department.private * 1 })),
      initDone: true,
      initError: null,
      'default-department-id': payload.data['default-department-id'],
      'default-is-locked': payload.data['default-is-locked']
    });
  }

  onInitConfigsRejected(state, payload) {
    return _.extend({}, state, {
      initDone: true,
      initError: payload && payload.message ? payload.message : 'Unable to load application settings.'
    });
  }

  onUserSystemSettingsChange(state, payload) {
    return _.extend({}, state, {
      'mandatory-login': !!(payload['mandatory-login'] * 1),
      registration: !!(payload['registration'] * 1)
    });
  }

  onInstallationChecked(state, payload) {
    return _.extend({}, state, {
      installedDone: true,
      installed: payload.data
    });
  }

  onInstallationCheckRejected(state) {
    return _.extend({}, state, {
      installedDone: true,
      installed: state.installed
    });
  }
}

export default ConfigReducer.getInstance();
