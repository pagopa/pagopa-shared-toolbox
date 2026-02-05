import React from "react";
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
} from "@azure/msal-react";
import Routes from "./util/routes";
import Login from "./pages/others/Login";

const App: React.FC = () => (
  <div>
    <AuthenticatedTemplate>
      <Routes />
    </AuthenticatedTemplate>

    <UnauthenticatedTemplate>
      <Login />
    </UnauthenticatedTemplate>
  </div>
);

export default App;
