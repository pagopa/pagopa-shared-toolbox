import * as env from 'env-var';
import {getConfig} from "./config";

export const ENV = {
    ENV: env.get('REACT_APP_ENV').required().default('dev').asString(),
    FEATURES: {
        MOCKER: env.get('REACT_APP_FEATURE_MOCKER').required().asBool(),
        MOCKER_ARCHETYPES: env.get('REACT_APP_FEATURE_MOCKER_ARCHETYPES').required().asBool(),
        MOCKER_SIMULATOR: env.get('REACT_APP_FEATURE_MOCKER_SIMULATOR').required().asBool(),
        AUTHORIZER: env.get('REACT_APP_FEATURE_AUTHORIZER').required().asBool(),
    },
    AUTH: {
        CLIENT_ID: env.get('REACT_APP_AUTH_CLIENT_ID').required().asString(),
        REDIRECT_URL: env.get('REACT_APP_AUTH_REDIRECT_URI').required().asString(),
        TENANT: env.get('REACT_APP_AUTH_TENANT').required().asString(),
        SCOPES: getConfig('REACT_APP_AUTH_SCOPES', {required: true}),
    },
    MOCKCONFIG: {
        HOST: env.get('REACT_APP_MOCKCONFIG_HOST').required().asString(),
        BASEPATH: env.get('REACT_APP_MOCKCONFIG_BASEPATH').required().asString(),
    },
    MOCKER: {
        URL: env.get('REACT_APP_MOCKER_URL').required().asString(),
    }
}