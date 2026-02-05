import React, { ChangeEvent } from "react";
import {
  Box,
  Grid,
  Pagination,
  TextField,
  Typography,
  debounce,
} from "@mui/material";
import { MsalContext } from "@azure/msal-react";
import { AuthenticationResult } from "@azure/msal-browser";
import { Add } from "@mui/icons-material";
import { ButtonNaked } from "@pagopa/mui-italia";
import { MockerConfigApi } from "../../../util/apiclient";
import { loginRequest } from "../../../util/authconfig";
import { isErrorResponse } from "../../../util/client-utils";
import { ProblemJson } from "../../../api/generated/mocker-config/ProblemJson";
import { PageInfo } from "../../../api/generated/mocker-config/PageInfo";
import { toastError } from "../../../util/utilities";
import { buildColumnDefs } from "../table/MockResourceTableColumns";
import GenericModal from "../../../components/generic/GenericModal";
import { StyledDataGrid } from "../../../components/table/StyledDataGrid";

interface IProps {
  readonly history: {
    push(url: string): void;
  };
}

interface IState {
  readonly isContentLoading: boolean;
  readonly page: number;
  readonly pagePaginator: number;
  readonly rowCountState: number;
  readonly showDeleteModal: boolean;
  readonly targetResource: string | undefined;
  readonly pageInfo: PageInfo;
  readonly mockResources: any;
  readonly search: ISearch;
}

interface ISearch {
  readonly resourceName?: string;
  readonly resourceTag?: string;
}

export default class ShowMockResourceList extends React.Component<
  IProps,
  IState
> {
  static readonly contextType = MsalContext;
  readonly context!: React.ContextType<typeof MsalContext>;

  constructor(props: IProps) {
    super(props);
    this.state = {
      isContentLoading: false,
      page: 0,
      pagePaginator: 0,
      rowCountState: 0,
      showDeleteModal: false,
      targetResource: undefined,
      pageInfo: {
        page: 0,
        limit: 10,
        items_found: 0,
        total_pages: 1,
        total_items: 0,
      },
      mockResources: [],
      search: {},
    };

    this.readPaginatedMockResourceList.bind(this);
    this.changeMockResourceListPage.bind(this);
  }

  readonly readPaginatedMockResourceList = (page: number): void => {
    this.setState({ isContentLoading: true });
    const search = this.state.search;
    console.log("Search:", search);
    this.context.instance
      .acquireTokenSilent({
        ...loginRequest,
        account: this.context.accounts[0],
      })
      .then((auth: AuthenticationResult) => {
        MockerConfigApi.getMockResources(
          auth.idToken,
          10,
          page,
          search.resourceName,
          search.resourceTag
        )
          .then((response) => {
            if (isErrorResponse(response)) {
              const problemJson = response as ProblemJson;
              if (problemJson.status === 500) {
                toastError(
                  "An error occurred while reading mock resource list."
                );
              }
            } else {
              this.setState({
                mockResources: response.resources,
                pageInfo: response.page_info,
              });
            }
          })
          .catch(() => {
            toastError("An error occurred while reading mock resource list.");
          })
          .finally(() => {
            this.setState({ isContentLoading: false });
          });
      });
  };

  readonly deleteMockResource = (): void => {
    const resourceId = this.state.targetResource;
    if (resourceId !== undefined) {
      this.setState({ isContentLoading: true });
      this.context.instance
        .acquireTokenSilent({
          ...loginRequest,
          account: this.context.accounts[0],
        })
        .then((auth: AuthenticationResult) => {
          MockerConfigApi.deleteMockResource(auth.idToken, resourceId)
            .then((response) => {
              if (response !== undefined && isErrorResponse(response)) {
                const problemJson = response as ProblemJson;
                if (problemJson.status === 404) {
                  toastError(
                    `No mock resource found with id ${this.state.targetResource}.`
                  );
                } else if (problemJson.status === 500) {
                  toastError(
                    `An error occurred while deleting mock resource with id ${this.state.targetResource}.`
                  );
                }
              } else {
                this.readPaginatedMockResourceList(0);
                this.forceUpdate();
              }
            })
            .catch(() => {
              toastError(
                `An error occurred while deleting mock resource with id ${this.state.targetResource}.`
              );
            })
            .finally(() => {
              this.setState({
                showDeleteModal: false,
                targetResource: undefined,
              });
            });
        });
    }
  };

  readonly setResourceNameFilter = debounce((_data: any) => {
    const search = { ...this.state.search } as any;
    console.log("Search:", search);
    this.context.instance
      .acquireTokenSilent({
        ...loginRequest,
        account: this.context.accounts[0],
      })
      .then((auth: AuthenticationResult) => {
        MockerConfigApi.getMockResources(
          auth.idToken,
          10,
          0,
          search.resourceName,
          search.resourceTag
        )
          .then((response) => {
            if (isErrorResponse(response)) {
              const problemJson = response as ProblemJson;
              if (problemJson.status === 500) {
                toastError(
                  "An error occurred while reading mock resource list."
                );
              }
            } else {
              this.setState({
                mockResources: response.resources,
                pageInfo: response.page_info,
              });
            }
          })
          .catch(() => {
            toastError("An error occurred while reading mock resource list.");
          })
          .finally(() => {
            this.setState({ isContentLoading: false });
          });
      });
  }, 500);

  readonly setResourceTagFilter = debounce((data: any) => {
    const search = { ...this.state.search } as any;
    search.resourceTag = data.target.value;
    this.setState({ search });
    this.readPaginatedMockResourceList(0);
  }, 500);

  readonly changeMockResourceListPage = (requestedPage: number) => {
    this.readPaginatedMockResourceList(requestedPage);
  };
  redirectToCreateMockResource() {
    this.props.history.push("/mocker/mock-resources/create");
  }
  readonly onClickDetail = (row: any) => {
    this.props.history.push("/mocker/mock-resources/" + row.id);
  };
  readonly onClickDelete = (row: any) => {
    this.setState({ showDeleteModal: true, targetResource: row.id });
  };

  componentDidMount(): void {
    this.readPaginatedMockResourceList(0);
  }

  // buildColumnDefs returns GridColDef[]; cast to any to satisfy GridColumns expected by DataGrid
  readonly columns = buildColumnDefs(
    this.onClickDetail,
    this.onClickDelete
  ) as any;

  render(): React.ReactNode {
    const rowHeight = 50;
    const headerHeight = 60;

    return (
      <Grid container item xs={12}>
        <Grid item xs={12} display="flex" flexDirection="column" pb={8} px={3}>
          <Grid container alignItems={"center"} spacing={0}>
            <Grid item xs={11} alignItems={"center"}>
              <Typography variant="h4">Mock Resources</Typography>
            </Grid>
          </Grid>
          <Grid container alignItems={"center"} pt={3} pb={3} spacing={5}>
            <Grid item xs={6} alignItems={"center"}>
              <TextField
                id="resource_name"
                label="Search by resource name"
                onChange={(data) => this.setResourceNameFilter(data)}
                sx={{ width: "100%" }}
              />
            </Grid>
            <Grid item xs={5} alignItems={"center"}>
              <TextField
                id="resource_tag"
                label="Search by resource tag"
                onChange={(data) => this.setResourceTagFilter(data)}
                sx={{ width: "100%" }}
              />
            </Grid>
            <Grid item xs={1}>
              <ButtonNaked
                size="large"
                component="button"
                onClick={() => this.redirectToCreateMockResource()}
                startIcon={<Add />}
                sx={{ fontSize: "18px", color: "primary.main" }}
                weight="default"
              >
                Add
              </ButtonNaked>
            </Grid>
          </Grid>
          <Grid container alignItems={"right"}>
            <Grid item xs={1} alignItems={"center"}>
              <Typography
                variant="subtitle1"
                sx={{ fontSize: "11px", color: "#757575" }}
              >
                Found {this.state.pageInfo.total_items} elements
              </Typography>
            </Grid>
          </Grid>
          <Box display="flex" width="100%">
            <Box display="flex" width="100%">
              <StyledDataGrid
                disableColumnFilter
                disableColumnSelector
                disableDensitySelector
                disableSelectionOnClick
                autoHeight={true}
                className="CustomDataGrid"
                columnBuffer={2}
                columns={this.columns}
                components={{
                  Pagination: () =>
                    this.state.pageInfo.total_pages &&
                    this.state.pageInfo.total_pages > 1 ? (
                      <Pagination
                        color="primary"
                        count={this.state.pageInfo.total_pages ?? 0}
                        page={this.state.pagePaginator + 1}
                        onChange={(
                          _event: ChangeEvent<unknown>,
                          value: number
                        ) => {
                          this.changeMockResourceListPage(value - 1);
                          this.setState({
                            page: value - 1,
                            pagePaginator: value - 1,
                          });
                        }}
                      />
                    ) : (
                      <></>
                    ),
                  Toolbar: () => <></>,
                  NoRowsOverlay: () => (
                    <>
                      <Box
                        p={2}
                        sx={{ textAlign: "center", backgroundColor: "#FFFFFF" }}
                      >
                        <Typography variant="body2">
                          {this.state.isContentLoading
                            ? "Loading..."
                            : "No result"}
                        </Typography>
                      </Box>
                    </>
                  ),
                  NoResultsOverlay: () => (
                    <>
                      <Box
                        p={2}
                        sx={{ textAlign: "center", backgroundColor: "#FFFFFF" }}
                      >
                        <Typography variant="body2">
                          {this.state.isContentLoading
                            ? "Loading..."
                            : "No result"}
                        </Typography>
                      </Box>
                    </>
                  ),
                }}
                componentsProps={{
                  toolbar: {
                    quickFilterProps: { debounceMs: 500 },
                  },
                }}
                getRowId={(data) => data.id}
                headerHeight={headerHeight}
                hideFooterSelectedRowCount={true}
                paginationMode="server"
                rowsPerPageOptions={[10]}
                onPageChange={(newPage) =>
                  this.changeMockResourceListPage(newPage)
                }
                pageSize={10}
                pagination
                rowHeight={rowHeight}
                rows={this.state.mockResources ?? []}
                rowCount={this.state.rowCountState}
                sortingMode="server"
              />
              <GenericModal
                title="Warning"
                message="Are you sure you want to delete this mock resource?"
                openModal={this.state.showDeleteModal}
                onConfirmLabel="Confirm"
                onCloseLabel="Dismiss"
                handleCloseModal={() =>
                  this.setState({
                    showDeleteModal: false,
                    targetResource: undefined,
                  })
                }
                handleConfirm={this.deleteMockResource}
              />
            </Box>
          </Box>
        </Grid>
      </Grid>
    );
  }
}
