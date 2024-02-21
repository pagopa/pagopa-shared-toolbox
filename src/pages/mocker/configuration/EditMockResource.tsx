import { Grid, Stack } from "@mui/material";
import { ButtonNaked } from "@pagopa/mui-italia";
import React from "react";
import Title from "../../../components/pages/Title";
import { MockResourceHandlingForm } from "../forms/MockResourceHandlingForm";
import GenericModal from "../../../components/generic/GenericModal";
import { MockResource } from "../../../api/generated/mocker-config/MockResource";
import { loginRequest } from "../../../util/authconfig";
import { AuthenticationResult } from "@azure/msal-browser";
import { MockerConfigApi } from "../../../util/apiclient";
import { isErrorResponse } from "../../../util/client-utils";
import { ProblemJson } from "../../../api/generated/mocker-config/ProblemJson";
import { toastError } from "../../../util/utilities";
import { MsalContext } from "@azure/msal-react";
import { ArrowBack } from "@mui/icons-material";

interface IProps {
  match: {
      params: Record<string, unknown>;
  };
  history: {
      push(url: string): void;
      goBack(): void;
      replace(url: string): void;
    };
}

interface IState {
  isContentLoading: boolean,
  showConfirmationModal: boolean,
  isOperationSuccessful: boolean,
  mockResource?: MockResource,
  mockResourceId: string,
}

export default class EditMockResource extends React.Component<IProps, IState> {

  static contextType = MsalContext;
  context!: React.ContextType<typeof MsalContext>
  
  constructor(props: IProps) {
    super(props);
    this.state = {
      isContentLoading: false,
      showConfirmationModal: false,
      isOperationSuccessful: false,
      mockResourceId: '',
    }

    this.readMockResource.bind(this);
    this.updateResource.bind(this);
    this.setMockResource.bind(this);
    this.getMockResource.bind(this);
  }

  readMockResource = (): void => {
    let resourceId = this.props.match.params['id'] as string;
    this.setState({ mockResourceId: resourceId, isContentLoading: true });
    this.context.instance.acquireTokenSilent({
      ...loginRequest,
      account: this.context.accounts[0]
    })
    .then((auth: AuthenticationResult) => {
      MockerConfigApi.getMockResource(auth.idToken, resourceId)
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

  updateResource = (): void => {
    this.setState({ isContentLoading: true });
    this.context.instance.acquireTokenSilent({
      ...loginRequest,
      account: this.context.accounts[0]
    })
    .then((auth: AuthenticationResult) => {
      MockerConfigApi.updateMockResourceGeneralInfo(auth.idToken, this.state.mockResourceId, this.state.mockResource!)
      .then((response) => {
        if (isErrorResponse(response)) {
            const problemJson = response as ProblemJson;
            if (problemJson.status === 404) {
              toastError(`No mock resource found with id ${this.state.mockResourceId}.`);
            } else if (problemJson.status === 500) {
              toastError(`An error occurred while updating general info for mock resource.`);
            }
        } else {
          this.setState({ mockResource: response, isOperationSuccessful: true });
        }
      })
      .catch(() => {
        toastError(`An error occurred while creating a new mock resource.`);
      })
      .finally(() => {
        this.setState({ isContentLoading: false, showConfirmationModal: false });
      })
    });
  }
 
 


  getMockResource = () : any => {
    this.readMockResource();
    return this.state.mockResource;
  }

  setMockResource = (mockResource: MockResource): void => {
    this.setState({ mockResource });
  }



  onSubmitShowModal = (): void => {
    this.setState({ showConfirmationModal: true });
  }



  redirectToPreviousPage = () => {
    this.props.history.goBack();
  }

  redirectOnSuccess = () => {
    if (this.state.isOperationSuccessful) {
      setTimeout(() => {
        this.props.history.replace("/mocker/mock-resources/" + this.state.mockResource?.id);
     }, 500);
    }
  }



  componentDidMount(): void {
    this.readMockResource();
  }

  render(): React.ReactNode {
    this.redirectOnSuccess();
    return (
      <Grid container mb={12}>
        <Grid item xs={12}>
          <Stack direction="row">
            <ButtonNaked size="small" component="button" onClick={() => this.redirectToPreviousPage()} startIcon={<ArrowBack/>} sx={{color: 'primary.main', mr: '20px'}} weight="default">
              Back
            </ButtonNaked>
          </Stack>

          <Grid container mt={3}>
            <Grid item xs={11} mb={5}>
              <Title title='Update mock resource generic info' mbTitle={1} variantTitle="h4"/>
            </Grid>            
          </Grid>

          <MockResourceHandlingForm 
            redirectToPreviousPage={this.redirectToPreviousPage}
            onSubmitShowModal={this.onSubmitShowModal}
            setMockResource={this.setMockResource}
            mockResource={this.state.mockResource}
            operation="EDIT"
          />
        </Grid>

        <GenericModal
          title="Comfirmation"
          message="Are you sure you want to update this mock resource?"
          openModal={this.state.showConfirmationModal}
          onConfirmLabel="Confirm"
          onCloseLabel="Dismiss"
          handleCloseModal={() => this.setState({ showConfirmationModal: false })}
          handleConfirm={this.updateResource}
        />
      </Grid>    
    );
  }
}