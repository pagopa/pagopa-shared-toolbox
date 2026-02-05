import { Grid, Stack } from "@mui/material";
import { ButtonNaked } from "@pagopa/mui-italia";
import React from "react";
import { ArrowBack } from "@mui/icons-material";
import { MsalContext } from "@azure/msal-react";
import { AuthenticationResult } from "@azure/msal-browser";
import Title from "../../../components/pages/Title";
import GenericModal from "../../../components/generic/GenericModal";
import { loginRequest } from "../../../util/authconfig";
import { MockerConfigApi } from "../../../util/apiclient";
import { isErrorResponse } from "../../../util/client-utils";
import { ProblemJson } from "../../../api/generated/mocker-config/ProblemJson";
import { toastError } from "../../../util/utilities";
import { MockResource } from "../../../api/generated/mocker-config/MockResource";
import { MockRule } from "../../../api/generated/mocker-config/MockRule";
import { MockRuleHandlingForm } from "../forms/MockRuleHandlingForm";
import { ScriptMetadataList } from "../../../api/generated/mocker-config/ScriptMetadataList";

interface IProps {
  readonly match: {
    readonly params: Record<string, unknown>;
  };
  readonly history: {
    push(url: string): void;
    goBack(): void;
    replace(url: string): void;
  };
}

interface IState {
  readonly isContentLoading: boolean;
  readonly showConfirmationModal: boolean;
  readonly isOperationSuccessful: boolean;
  readonly triggered: number;
  readonly mockResource?: MockResource;
  readonly mockRule?: MockRule;
  readonly scripts?: ScriptMetadataList;
}

export default class CreateMockRule extends React.Component<IProps, IState> {
  static readonly contextType = MsalContext;
  readonly context!: React.ContextType<typeof MsalContext>;

  constructor(props: IProps) {
    super(props);
    this.state = {
      isContentLoading: false,
      showConfirmationModal: false,
      isOperationSuccessful: false,
      triggered: 0,
      mockRule: undefined,
    };
  }

  readonly readMockResource = (): void => {
    const resourceId = this.props.match.params.id as string;
    this.setState({ isContentLoading: true });
    this.context.instance
      .acquireTokenSilent({
        ...loginRequest,
        account: this.context.accounts[0],
      })
      .then((auth: AuthenticationResult) => {
        MockerConfigApi.getMockResource(auth.idToken, resourceId)
          .then((response) => {
            if (isErrorResponse(response)) {
              const problemJson = response as ProblemJson;
              if (problemJson.status === 404) {
                toastError(`No mock resource found with id ${resourceId}.`);
              } else if (problemJson.status === 500) {
                toastError(
                  `An error occurred while retrieving mock resource with id ${resourceId}.`
                );
              }
            } else {
              this.setState({ mockResource: response });
            }
          })
          .catch(() => {
            toastError(
              `An error occurred while retrieving mock resource with id ${resourceId}.`
            );
          })
          .finally(() => {
            this.setState({ isContentLoading: false });
          });
      });
  };

  readonly readScripts = (): void => {
    this.setState({ isContentLoading: true });
    this.context.instance
      .acquireTokenSilent({
        ...loginRequest,
        account: this.context.accounts[0],
      })
      .then((auth: AuthenticationResult) => {
        MockerConfigApi.getScripts(auth.idToken)
          .then((response) => {
            if (isErrorResponse(response)) {
              const problemJson = response as ProblemJson;
              if (problemJson.status === 500) {
                toastError(
                  `An error occurred while retrieving all scripts information.`
                );
              }
            } else {
              this.setState({ scripts: response });
            }
          })
          .catch(() => {
            toastError(
              `An error occurred while retrieving all scripts information.`
            );
          })
          .finally(() => {
            this.setState({ isContentLoading: false });
          });
      });
  };

  readonly createRule = (): void => {
    this.setState({ isContentLoading: true });
    this.context.instance
      .acquireTokenSilent({
        ...loginRequest,
        account: this.context.accounts[0],
      })
      .then((auth: AuthenticationResult) => {
        MockerConfigApi.createMockRule(
          auth.idToken,
          this.state.mockResource!.id!,
          this.state.mockRule!
        )
          .then((response) => {
            if (isErrorResponse(response)) {
              const problemJson = response as ProblemJson;
              if (problemJson.status === 409) {
                toastError(`A mock rule already exists with same data.`);
              } else if (problemJson.status === 500) {
                toastError(`An error occurred while creating a new mock rule.`);
              }
            } else {
              this.setState({
                mockResource: response,
                isOperationSuccessful: true,
              });
            }
          })
          .catch(() => {
            toastError(`An error occurred while creating a new mock rule.`);
          })
          .finally(() => {
            this.setState({
              isContentLoading: false,
              showConfirmationModal: false,
            });
          });
      });
  };

  readonly setMockRule = (mockRuleFromForm: MockRule) => {
    this.setState({ mockRule: mockRuleFromForm });
  };

  readonly onSubmitShowModal = () => {
    this.setState({ showConfirmationModal: true });
  };

  readonly onSubmitNewRuleShowRecord = () => {
    this.setState({ triggered: this.state.triggered + 1 });
  };

  readonly redirectToPreviousPage = () => {
    this.props.history.goBack();
  };

  readonly redirectOnSuccess = () => {
    if (this.state.isOperationSuccessful) {
      setTimeout(() => {
        this.props.history.replace(
          "/mocker/mock-resources/" + this.state.mockResource?.id
        );
      }, 500);
    }
  };

  componentDidMount(): void {
    this.readMockResource();
    this.readScripts();
  }

  render(): React.ReactNode {
    this.redirectOnSuccess();
    return (
      <Grid container mb={12}>
        <Grid item xs={12}>
          <Stack direction="row">
            <ButtonNaked
              size="small"
              component="button"
              onClick={() => this.redirectToPreviousPage()}
              startIcon={<ArrowBack />}
              sx={{ color: "primary.main", mr: "20px" }}
              weight="default"
            >
              Back
            </ButtonNaked>
          </Stack>

          <Grid container mt={3}>
            <Grid item xs={11} mb={5}>
              <Title
                title="Create new mock rule"
                mbTitle={1}
                variantTitle="h4"
              />
            </Grid>
          </Grid>

          <MockRuleHandlingForm
            redirectToPreviousPage={this.redirectToPreviousPage}
            onSubmitShowModal={this.onSubmitShowModal}
            onSubmitNewRuleShowRecord={this.onSubmitNewRuleShowRecord}
            mockResource={this.state.mockResource}
            setMockRule={this.setMockRule}
            scriptsMetadata={this.state.scripts}
            operation="CREATE"
          />
        </Grid>

        <GenericModal
          title="Comfirmation"
          message="Are you sure you want to create this mock rule?"
          openModal={this.state.showConfirmationModal}
          onConfirmLabel="Confirm"
          onCloseLabel="Dismiss"
          handleCloseModal={() =>
            this.setState({ showConfirmationModal: false })
          }
          handleConfirm={this.createRule}
        />
      </Grid>
    );
  }
}
