import React from "react";
import { Button, Table } from "react-bootstrap";
import { FaPlus, FaSpinner } from "react-icons/fa";
import { toast } from "react-toastify";
import MockResourceListItem from "../../components/mockresource/MockResourceListItem";
import Paginator from "../../components/Paginator";
import { MockConfigApi } from "../../util/apiclient";
import { MsalContext } from "@azure/msal-react";
import { loginRequest } from "../../util/authconfig";
import { isErrorResponse } from "../../util/client-utils";
import { ProblemJson } from "../../api/generated/ProblemJson";
import { AuthenticationResult } from "@azure/msal-browser";
import { PageInfo } from "../../api/generated/PageInfo";
import Filters from "../../components/Filters";

interface IProps {
  history: {
    push(url: string): void;
  };
}

interface IState {
  pageInfo: PageInfo,
  filters: {
    soapaction: string;
    tag: string;
  };
  isContentLoading: boolean;
  showDeleteModal: boolean;
  mockResources: any;
  mockResourceTarget: string;
}

export default class ShowMockResourceList extends React.Component<IProps, IState> {

  static contextType = MsalContext;
  context!: React.ContextType<typeof MsalContext>

  private filter: { [item: string]: any };

  constructor(props: IProps) {
    super(props);
    this.state = {
      pageInfo: {
        page: 0,
        limit: 50,
        items_found: 0,
        total_pages: 1,
      },
      filters: {
        soapaction: "",
        tag: "",
      },
      isContentLoading: false,
      showDeleteModal: false,
      mockResources: [],
      mockResourceTarget: "",
    };

    this.filter = {
      soapaction: {
          visible: true,
          placeholder: "SOAP Action"
      },
      tag: {
          visible: true,
          placeholder: "Tag"
      }
    };

    this.readPaginatedMockResourceList.bind(this);
    this.changeMockResourceListPage.bind(this);
  }

  toastError(message: string) {
    toast.error(() => <div className={"toast-width"}>{message}</div>, {
      theme: "colored",
    });
  }

  readPaginatedMockResourceList = (page: number): void => {
    
    this.setState({ isContentLoading: true });
    this.context.instance.acquireTokenSilent({
      ...loginRequest,
      account: this.context.accounts[0]
    })
    .then((auth: AuthenticationResult) => {
      MockConfigApi.getMockResources(auth.idToken, 50, page)
      .then((response) => {
        if (isErrorResponse(response)) {
            const problemJson = response as ProblemJson;
            if (problemJson.status === 500) {
              this.toastError("An error occurred while reading mock resource list...");
            }
        } else {
          this.setState({ mockResources: response.resources });   
          this.setState({ pageInfo: response.page_info });       
        }
      })
      .catch(() => {
        this.toastError("An error occurred while reading mock resource list...");
      })
      .finally(() => {
        this.setState({ isContentLoading: false });
      })
    });
  };

  readFilteredPaginatedMockResourceList = (filters: any) => {
    this.setState({ filters });
    this.readPaginatedMockResourceList(0);
  };

  changeMockResourceListPage = (requestedPage: number) => {
    this.readPaginatedMockResourceList(requestedPage);
  }

  redirectToCreateMockResource() {
    this.props.history.push("/configuration/mock-resources/create");
  }

  componentDidMount(): void {
    this.readPaginatedMockResourceList(0);
  }

  render(): React.ReactNode {
    return (
      <div className="container-fluid mock-resources">
        <div className="row">
          <h1>Mock Resources</h1>
        </div>
        <div className="row my-2">
          <div className="col-md-10">
          {
            <Filters configuration={this.filter} onFilter={this.readFilteredPaginatedMockResourceList}/>
          }
          </div>
          <div className="col-md-2 text-right">
            <Button onClick={() => this.redirectToCreateMockResource()}>New <FaPlus/></Button>
          </div>
        </div>

        { this.state.isContentLoading && (<FaSpinner className="spinner"/>)}
        {
          !this.state.isContentLoading && (
            <>
              <Table striped hover responsive size="sm">
                <thead>
                  <tr>
                    <th className="fixed-td-width">Name</th>
                    <th className="fixed-td-width">URL</th>
                    <th className="fixed-td-width">Method</th>
                    <th className="fixed-td-width text-center">SOAP Action</th>
                    <th className="fixed-td-width">Active</th>
                    <th className="fixed-td-width text-center">Tags</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.mockResources.map((item: any) => {
                    return <MockResourceListItem key={item.id} item={item} history={this.props.history} />;
                  })}
                </tbody>
              </Table>
              <Paginator pageInfo={ this.state.pageInfo } onPageChanged={ this.changeMockResourceListPage }/>
            </>
          )
        }
      </div>
    );
  }
}
