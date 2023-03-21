import React from "react";
import axios from "axios";
import { Button, Table } from "react-bootstrap";
import { FaPlus, FaSpinner } from "react-icons/fa";
import { toast } from "react-toastify";
import MockResourceListItem from "../../components/mockresource/MockResourceListItem";
import Paginator from "../../components/Paginator";

interface IProps {
  history: {
    push(url: string): void;
  };
}

interface IState {
  pageInfo: {
    page: 0;
    limit: 50;
    itemsFound: 0;
    totalPages: 1;
  };
  filters: {
    type: string;
    resource: string;
  };
  isContentLoading: boolean;
  showDeleteModal: boolean;
  mockResources: any;
  mockResourceTarget: string;
}

export default class ShowMockResourceList extends React.Component<IProps, IState> {

  // private filter: { [item: string]: any };

  constructor(props: IProps) {
    super(props);
    this.state = {
      pageInfo: {
        page: 0,
        limit: 50,
        itemsFound: 0,
        totalPages: 1,
      },
      filters: {
        type: "",
        resource: "",
      },
      isContentLoading: false,
      showDeleteModal: false,
      mockResources: [],
      mockResourceTarget: "",
    };

    /*
    this.filter = {
      type: {
          visible: true,
          placeholder: "Subsystem"
      },
      resource: {
          visible: true,
          placeholder: "Resource"
      }
    };
    */
  }

  toastError(message: string) {
    toast.error(() => <div className={"toast-width"}>{message}</div>, {
      theme: "colored",
    });
  }

  generateFilters(): string {
    let filterString = "?";
    if (this.state.filters.resource !== "") {
      filterString += `resource=${this.state.filters.resource}&`;
    }
    if (this.state.filters.type !== "") {
      filterString += `type=${this.state.filters.type}`;
    }
    return filterString;
  }

  readPaginatedMockResourceList(_page: number): void {
    this.setState({ isContentLoading: true });
    let filterFields = this.generateFilters();
    axios
      .get(`https://wt1wacwpzh.execute-api.eu-south-1.amazonaws.com/mocker/config/resources${filterFields}`)
      .then((res) => {
        if (res.status === 200) {
          this.setState({ mockResources: res.data });
        }
      })
      .catch(() => {
        this.toastError(
          "An error occurred while reading mock resource list..."
        );
      })
      .finally(() => {
        this.setState({ isContentLoading: false });
      });
  };

  readFilteredPaginatedMockResourceList = (filters: any) => {
    this.setState({ filters });
    this.readPaginatedMockResourceList(0);
  };

  changeMockResourceListPage(requestedPage: number) {
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
            /* TODO to be activated when paginated search-all will be updated 
            <Filters configuration={this.filter} onFilter={this.readFilteredPaginatedMockResourceList}/>
            */
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
                    <th className="fixed-td-width">Subsystem</th>
                    <th className="fixed-td-width">URL</th>
                    <th className="fixed-td-width">Method</th>
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
