export default function getMockerURL() {
    return process.env.REACT_APP_MOCKER_URL_ROOT !== undefined ? process.env.REACT_APP_MOCKER_URL_ROOT : "";
}