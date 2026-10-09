import React from "react";
import { HashRouter, Route, Switch } from "react-router-dom";
import Layout from "../components/generic/Layout";
import ShowMockResourceList from "../pages/mocker/configuration/ShowMockResourceList";
import EditMockResource from "../pages/mocker/configuration/EditMockResource";
import Landing from "../pages/others/Landing";
import NotFound from "../pages/others/NotFound";
import ShowSimulationMainPage from "../pages/mocker/simulator/ShowSimulationMainPage";
import ShowMockResourceDetail from "../pages/mocker/configuration/ShowMockResourceDetail";
import CreateMockResource from "../pages/mocker/configuration/CreateMockResource";
import CreateMockRule from "../pages/mocker/configuration/CreateMockRule";
import EditMockRule from "../pages/mocker/configuration/EditMockRule";
import Partner from "../pages/partner/Partner";
import PaymentOutcomePage from "../pages/partner/PaymentOutcomePage";

export default class Routes extends React.Component {
  componentDidMount() {
    document.title = "PagoPA Shared Toolbox";
  }

  render(): React.ReactNode {
    return (
      <HashRouter>
        <Route
          render={(props: any) => (
            <Layout {...props}>
              <Switch>
                <Route path="/" exact component={Landing} />
                <Route path="/partner" exact component={Partner} />
                <Route
                  path="/demo/payment/success"
                  exact
                  render={() => (
                    <PaymentOutcomePage
                      title="Pagamento andato a buon fine"
                      description="Il pagamento è stato completato correttamente."
                      severity="success"
                    />
                  )}
                />
                <Route
                  path="/demo/payment/cancel"
                  exact
                  render={() => (
                    <PaymentOutcomePage
                      title="Pagamento cancellato"
                      description="Il pagamento è stato cancellato."
                      severity="info"
                    />
                  )}
                />
                <Route
                  path="/demo/payment/error"
                  exact
                  render={() => (
                    <PaymentOutcomePage
                      title="Pagamento andato in errore"
                      description="Si è verificato un errore durante il pagamento."
                      severity="error"
                    />
                  )}
                />
                <Route
                  path="/demo/payment/waiting"
                  exact
                  render={() => (
                    <PaymentOutcomePage
                      title="Pagamento in attesa"
                      description="Il pagamento è in attesa di completamento."
                      severity="warning"
                    />
                  )}
                />
                <Route
                  path="/mocker/mock-resources"
                  exact
                  component={ShowMockResourceList}
                />
                <Route
                  path="/mocker/mock-resources/create"
                  exact
                  component={CreateMockResource}
                />
                <Route
                  path="/mocker/mock-resources/:id"
                  exact
                  component={ShowMockResourceDetail}
                />
                <Route
                  path="/mocker/mock-resources/:id/edit"
                  exact
                  component={EditMockResource}
                />
                <Route
                  path="/mocker/mock-resources/:id/rules/create"
                  exact
                  component={CreateMockRule}
                />
                <Route
                  path="/mocker/mock-resources/:id/rules/:ruleid/edit"
                  exact
                  component={EditMockRule}
                />

                <Route
                  path="/mocker/simulation"
                  exact
                  render={(props) => <ShowSimulationMainPage {...props} />}
                />
                <Route component={NotFound} />
              </Switch>
            </Layout>
          )}
        />
      </HashRouter>
    );
  }
}
