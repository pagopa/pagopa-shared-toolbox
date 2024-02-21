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

export default class Routes extends React.Component { 
  
  componentDidMount(){
    document.title = "PagoPA Shared Toolbox"
  }

  render(): React.ReactNode {
    return (
      <HashRouter>
        <Route render={(props: any) => (
            <Layout {...props}>
              <Switch>
                <Route path="/" exact component={Landing} />
                <Route path="/mocker/mock-resources" exact component={ShowMockResourceList } />
                <Route path="/mocker/mock-resources/create" exact component={CreateMockResource} />
                <Route path="/mocker/mock-resources/:id" exact component={ShowMockResourceDetail} />
                <Route path="/mocker/mock-resources/:id/edit" exact component={EditMockResource} />
                <Route path="/mocker/mock-resources/:id/rules/create" exact component={CreateMockRule} />
                <Route path="/mocker/mock-resources/:id/rules/:ruleid/edit" exact component={EditMockRule} />
                
                <Route path="/mocker/simulation" exact render={props => { return <ShowSimulationMainPage {...props} /> }} />
                <Route component={NotFound} />
              </Switch>
            </Layout>
          )}
        />
      </HashRouter>
    );
  }
}
