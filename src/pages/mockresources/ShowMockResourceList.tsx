import React, { ChangeEvent } from "react";
import { Box, Grid, Pagination, Typography } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { MockConfigApi } from "../../util/apiclient";
import { MsalContext } from "@azure/msal-react";
import { loginRequest } from "../../util/authconfig";
import { isErrorResponse } from "../../util/client-utils";
import { ProblemJson } from "../../api/generated/ProblemJson";
import { AuthenticationResult } from "@azure/msal-browser";
import { PageInfo } from "../../api/generated/PageInfo";
import { toastError } from "../../util/utilities";
import { buildColumnDefs } from "./table/MockResourceTableColumns";
import GenericModal from "../../components/generic/GenericModal";
import { StyledDataGrid } from "../../components/table/StyledDataGrid";
import { Add } from "@mui/icons-material";
import { ButtonNaked } from "@pagopa/mui-italia";

interface IProps {
  history: {
    push(url: string): void;
  };
}

interface IState {
  isContentLoading: boolean,
  page: number,
  pagePaginator: number,
  rowCountState: number,
  showDeleteModal: boolean,
  targetResource: string | undefined,
  pageInfo: PageInfo,
  mockResources: any;
}

export default class ShowMockResourceList extends React.Component<IProps, IState> {

  static contextType = MsalContext;
  context!: React.ContextType<typeof MsalContext>

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
        limit: 50,
        items_found: 0,
        total_pages: 1,
      },
      mockResources: []
    };

    this.readPaginatedMockResourceList.bind(this);
    this.changeMockResourceListPage.bind(this);
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
              toastError("An error occurred while reading mock resource list.");
            }
        } else {
          this.setState({ mockResources: response.resources, pageInfo: response.page_info });       
        }
      })
      .catch(() => {
        toastError("An error occurred while reading mock resource list.");
      })
      .finally(() => {
        this.setState({ isContentLoading: false });
      })
    });
  };
  
  deleteMockResource = (): void => {
    let resourceId = this.state.targetResource;
    if (resourceId !== undefined) {
      this.setState({ isContentLoading: true });
      this.context.instance.acquireTokenSilent({
        ...loginRequest,
        account: this.context.accounts[0]
      })
      .then((auth: AuthenticationResult) => {
        MockConfigApi.deleteMockResource(auth.idToken, resourceId!)
        .then((response) => {

          if (response !== undefined && isErrorResponse(response)) {
            console.log("res: ", response);
            const problemJson = response as ProblemJson;
            if (problemJson.status === 404) {
              toastError(`No mock resource found with id ${this.state.targetResource}.`);
            } else if (problemJson.status === 500) {
              toastError(`An error occurred while deleting mock resource with id ${this.state.targetResource}.`);
            }
          } else {
            this.readPaginatedMockResourceList(0);
            this.forceUpdate();
          }
        })
        .catch(() => {
          toastError(`An error occurred while deleting mock resource with id ${this.state.targetResource}.`);
        })
        .finally(() => {
          this.setState({ showDeleteModal: false, targetResource: undefined });
        })
      });
    }
  }

  changeMockResourceListPage = (requestedPage: number) => {
    this.readPaginatedMockResourceList(requestedPage);
  }

  redirectToCreateMockResource() {
    this.props.history.push("/mocker/mock-resources/create");
  }

  onClickDetail = (row: any) => {
    this.props.history.push("/mocker/mock-resources/" + row.id);
  };

  onClickDelete = (row: any) => {
    this.setState({ showDeleteModal: true, targetResource: row.id });
  };

  componentDidMount(): void {
    this.readPaginatedMockResourceList(0);
  }
  
  columns: Array<GridColDef> = buildColumnDefs(this.onClickDetail, this.onClickDelete);
  
  render(): React.ReactNode {

    const rowHeight = 40;
    const headerHeight = 60;

    return (
      <Grid container item xs={12}>
        <Grid item xs={12} display="flex" flexDirection="column" pb={8} px={3}>
          <Grid container alignItems={'center'} spacing={0}>
            <Grid item xs={11} alignItems={'center'} >
              <Typography variant="h3" sx={{fontWeight: 'bold'}}>Mock Resources</Typography>
            </Grid>
            <Grid item xs={1}>
              <ButtonNaked size="large" component="button" onClick={() => this.redirectToCreateMockResource()} startIcon={<Add/>} sx={{ fontSize: '18px', color: 'primary.main'}} weight="default">
                Add
              </ButtonNaked>
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
                columnBuffer={6}
                columns={this.columns}
                components={{
                  Pagination: () =>
                    this.state.pageInfo.total_pages && this.state.pageInfo.total_pages > 1 ? (
                      <Pagination
                        color="primary"
                        count={this.state.pageInfo.total_pages ?? 0}
                        page={this.state.pagePaginator + 1}
                        onChange={(_event: ChangeEvent<unknown>, value: number) => {
                          this.changeMockResourceListPage(value - 1);
                          this.setState({ page: value - 1, pagePaginator: value - 1 })
                        }}
                      />
                    ) : (
                      <></>
                    ),
                  Toolbar: () => <></>,
                  NoRowsOverlay: () => (
                    <>
                      <Box p={2} sx={{ textAlign: 'center', backgroundColor: '#FFFFFF' }}>
                        <Typography variant="body2">
                          { this.state.isContentLoading ?  "Loading..." : "No result" }
                        </Typography>
                      </Box>
                    </>
                  ),
                  NoResultsOverlay: () => (
                    <>
                      <Box p={2} sx={{ textAlign: 'center', backgroundColor: '#FFFFFF' }}>
                        <Typography variant="body2">
                          { this.state.isContentLoading ?  "Loading..." : "No result" }
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
                rowsPerPageOptions={[50]}
                onPageChange={(newPage) => this.changeMockResourceListPage(newPage)}
                pageSize={50}
                pagination
                rowHeight={rowHeight}
                rows={ this.state.mockResources ?? []}
                rowCount={ this.state.rowCountState }
                sortingMode="server"
              />
              <GenericModal
                title="Warning"
                message="Are you sure you want to delete this mock resource?"
                openModal={this.state.showDeleteModal}
                onConfirmLabel="Confirm"
                onCloseLabel="Dismiss"
                handleCloseModal={() => this.setState({ showDeleteModal: false, targetResource: undefined })}
                handleConfirm={this.deleteMockResource}
              />
            </Box>
          </Box>
        </Grid>

      </Grid>
    );
  }
}
