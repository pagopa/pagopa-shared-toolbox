
import { Grid, Stack } from "@mui/material";
import { ButtonNaked } from "@pagopa/mui-italia";
import React from "react";
import Title from "../../../components/pages/Title";
import { ArrowBack } from "@mui/icons-material";
import { MockResourceHandlingForm } from "../forms/MockResourceHandlingForm";
import GenericModal from "../../../components/generic/GenericModal";
import { MsalContext } from "@azure/msal-react";
import { loginRequest } from "../../../util/authconfig";
import { AuthenticationResult } from "@azure/msal-browser";
import { MockerConfigApi } from "../../../util/apiclient";
import { isErrorResponse } from "../../../util/client-utils";
import { ProblemJson } from "../../../api/generated/mocker-config/ProblemJson";
import { toastError } from "../../../util/utilities";
import { MockResource } from "../../../api/generated/mocker-config/MockResource";

interface IProps {
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
}


export default class CreateMockResource extends React.Component<IProps, IState> {

  static contextType = MsalContext;
  context!: React.ContextType<typeof MsalContext>

  constructor(props: IProps) {
    super(props);
    this.state = {
      isContentLoading: false,
      showConfirmationModal: false,
      isOperationSuccessful: false,
      mockResource: undefined,    };

    this.createResource.bind(this);
    this.setMockResource.bind(this);
  }

  createResource = (): void => {
    this.setState({ isContentLoading: true });
    this.context.instance.acquireTokenSilent({
      ...loginRequest,
      account: this.context.accounts[0]
    })
    .then((auth: AuthenticationResult) => {
      MockerConfigApi.createMockResource(auth.idToken, this.state.mockResource!)
      .then((response) => {
        if (isErrorResponse(response)) {
            const problemJson = response as ProblemJson;
            if (problemJson.status === 409) {
              toastError(`A mock resource already exists with same data.`);
            } else if (problemJson.status === 500) {
              toastError(`An error occurred while creating a new mock resource.`);
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
 


  setMockResource = (mockResourceFromForm: MockResource) => {
    this.setState({ mockResource: mockResourceFromForm });
  }



  onSubmitShowModal = () => {
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



  render(): React.ReactNode {
    this.redirectOnSuccess();
    return (
      <Grid container mb={11}>
        <Grid item p={3} xs={11}>
          <Stack direction="row" mt={2}>
            <ButtonNaked size="small" component="button" onClick={() => this.redirectToPreviousPage()} startIcon={<ArrowBack/>} sx={{color: 'primary.main', mr: '20px'}} weight="default">
              Back
            </ButtonNaked>
          </Stack>

          <Grid container mt={3}>
            <Grid item xs={11} mb={5}>
              <Title title='Create new mock resource' mbTitle={1} variantTitle="h4"/>
            </Grid>            
          </Grid>

          <MockResourceHandlingForm 
            redirectToPreviousPage={this.redirectToPreviousPage}
            onSubmitShowModal={this.onSubmitShowModal}
            setMockResource={this.setMockResource}
            operation="CREATE"
          />
        </Grid>

        <GenericModal
          title="Comfirmation"
          message="Are you sure you want to create this mock resource?"
          openModal={this.state.showConfirmationModal}
          onConfirmLabel="Confirm"
          onCloseLabel="Dismiss"
          handleCloseModal={() => this.setState({ showConfirmationModal: false })}
          handleConfirm={this.createResource}
        />
      </Grid>    
    );
  }
}