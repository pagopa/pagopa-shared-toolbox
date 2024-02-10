import React from "react";
import { HashRouter, Route, Switch } from "react-router-dom";
import Layout from "../components/generic/Layout";
import ShowMockResourceList from "../pages/mockresources/ShowMockResourceList";
import EditMockResource from "../pages/mockresources/EditMockResource";
import Landing from "../pages/others/Landing";
import NotFound from "../pages/others/NotFound";
import ShowSimulationMainPage from "../pages/simulation/ShowSimulationMainPage";
import ShowMockResourceDetail from "../pages/mockresources/ShowMockResourceDetail";
import CreateMockResource from "../pages/mockresources/CreateMockResource";
import CreateMockRule from "../pages/mockresources/CreateMockRule";

export default class Routes extends React.Component { 
  
  componentDidMount(){
    document.title = "PagoPA Insights"
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
                {/*<Route path="/mocker/mock-resources/:id" exact render={props => {
                  const edit: boolean = new URLSearchParams(props.location.search).get("edit") !== null;
                  return edit ? <EditMockResource {...props} /> : <ShowMockResourceDetail {...props} />;
                }}/>*/}
                <Route path="/mocker/mock-resources/:id" exact component={ShowMockResourceDetail} />
                <Route path="/mocker/mock-resources/:id/edit" exact component={EditMockResource} />
                <Route path="/mocker/mock-resources/:id/rules/create" exact component={CreateMockRule} />
                {/*<Route path="/mocker/mock-resources/:id/rules/:ruleId/edit" exact component={EditMockRule} />*/}

                <Route path="/mocker/simulation/" exact render={props => { return <ShowSimulationMainPage {...props} /> }} />
                <Route component={NotFound} />
              </Switch>
            </Layout>
          )}
        />
      </HashRouter>
    );
  }
}
