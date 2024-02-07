import { MsalContext } from "@azure/msal-react";
import React from "react";
import { loginRequest } from "../../util/authconfig";
import { AuthenticationResult } from "@azure/msal-browser";
import { MockConfigApi } from "../../util/apiclient";
import { isErrorResponse } from "../../util/client-utils";
import { ProblemJson } from "../../api/generated/ProblemJson";
import { toastError } from "../../util/utilities";
import { MockResource } from "../../api/generated/MockResource";
import { Breadcrumbs, Grid, Stack, Typography } from '@mui/material';
import { ButtonNaked } from '@pagopa/mui-italia';
import { ArrowBack } from '@mui/icons-material';

interface IProps {
    match: {
        params: Record<string, unknown>;
    };
    history: {
      push(url: string): void;
      goBack(): void;
    };
  }
  
  interface IState {
    isContentLoading: boolean;
    mockResource: MockResource | undefined
  }

export default class ShowMockResourceDetail extends React.Component<IProps, IState> {

  static contextType = MsalContext;
  context!: React.ContextType<typeof MsalContext>
  
  
  constructor(props: IProps) {
    super(props);
    this.state = {
      isContentLoading: false,
      mockResource: undefined,
    };

    this.readMockResource.bind(this);
  }

  readMockResource = (resourceId: string): void => {
    this.setState({ isContentLoading: true });
    this.context.instance.acquireTokenSilent({
      ...loginRequest,
      account: this.context.accounts[0]
    })
    .then((auth: AuthenticationResult) => {
      MockConfigApi.getMockResource(auth.idToken, resourceId)
      .then((response) => {
        if (isErrorResponse(response)) {
            const problemJson = response as ProblemJson;
            if (problemJson.status === 404) {
              toastError(`No mock resource found with id ${resourceId}.`);
            } else if (problemJson.status === 500) {
              toastError(`An error occurred while retrieving mock resource with id ${resourceId}.`);
            }
        } else {
          this.setState({ mockResource: response });    
        }
      })
      .catch(() => {
        toastError(`An error occurred while retrieving mock resource with id ${resourceId}.`);
      })
      .finally(() => {
        this.setState({ isContentLoading: false });
      })
    });
  }

  redirectToPreviousPage() {
    this.props.history.goBack();
  }

  componentDidMount(): void {
    this.readMockResource(this.props.match.params['id'] as string);
  }

  render(): React.ReactNode {
    let mockResource = this.state.mockResource;

    return (
      <Grid container justifyContent={'center'} mb={5}>
        <Grid item p={3} xs={8}>
          <Stack direction="row" mt={2}>
          <ButtonNaked size="small" component="button" onClick={() => this.redirectToPreviousPage()} startIcon={<ArrowBack/>} sx={{color: 'primary.main', mr: '20px'}} weight="default">
            Back
          </ButtonNaked>
          <Breadcrumbs>
            <Typography>Mock Resource</Typography>
            <Typography variant="body2" color={'#17324D'} sx={{fontWeight: 'fontWeightMedium'}}>
              { mockResource?.id }
            </Typography>
          </Breadcrumbs>
          </Stack>
        </Grid>
      </Grid>
    );
  }
}