import { MsalContext } from "@azure/msal-react";
import React from "react";
import { AuthenticationResult } from "@azure/msal-browser";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Chip,
  Divider,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { ButtonNaked } from "@pagopa/mui-italia";
import {
  Add,
  ArrowBack,
  CheckCircleOutline,
  ContentCopy,
  Delete,
  Edit,
  ExpandMore,
  FileCopy,
  HighlightOff,
  PlayCircle,
  Save,
  SwapVert,
} from "@mui/icons-material";
import { loginRequest } from "../../../util/authconfig";
import { MockerConfigApi } from "../../../util/apiclient";
import { isErrorResponse } from "../../../util/client-utils";
import { ProblemJson } from "../../../api/generated/mocker-config/ProblemJson";
import {
  appendInList,
  generateCURLRequest,
  getFirstAvailableOrder,
  getFormattedBody,
  getFormattedCondition,
  getFormattedResponseInfo,
  toastError,
  toastOK,
} from "../../../util/utilities";
import { MockResource } from "../../../api/generated/mocker-config/MockResource";
import Title from "../../../components/pages/Title";
import GenericModal from "../../../components/generic/GenericModal";
import { SpecialRequestHeader } from "../../../api/generated/mocker-config/SpecialRequestHeader";
import { ENV as env } from "../../../util/env";
import {
  getActivationStatusTooltip,
  getResourceCURLTooltip,
  getRuleConditionTooltip,
  getScriptInputParameterTooltip,
  getScriptOutputParameterTooltip,
  getSpecialHeadersTooltip,
} from "../../../util/tooltips";

interface IProps {
  readonly match: {
    readonly params: Record<string, unknown>;
  };
  readonly history: {
    push(url: string): void;
    goBack(): void;
  };
}

interface IState {
  readonly isContentLoading: boolean;
  readonly expandedRule: string;
  readonly mockResource: MockResource | undefined;
  readonly showDeleteRuleModal: boolean;
  readonly showDeleteConditionModal: boolean;
  readonly targetRule: string;
  readonly targetCondition: string;
  readonly resourceCURL: string;
  readonly swappingOrder: boolean;
  readonly swappedRules: ReadonlyArray<{
    readonly ruleId: string;
    readonly prevOrder: number;
    readonly nextOrder: number;
  }>;
}

export default class ShowMockResourceDetail extends React.Component<
  IProps,
  IState
> {
  static readonly contextType = MsalContext;
  readonly context!: React.ContextType<typeof MsalContext>;

  constructor(props: IProps) {
    super(props);
    this.state = {
      isContentLoading: false,
      expandedRule: "",
      mockResource: undefined,
      showDeleteRuleModal: false,
      showDeleteConditionModal: false,
      targetRule: "",
      targetCondition: "",
      resourceCURL: "",
      swappingOrder: false,
      swappedRules: [],
    };

    this.readMockResource.bind(this);
    this.deleteRule.bind(this);
  }

  readonly readMockResource = (resourceId: string): void => {
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
              const cURL = generateCURLRequest(
                `${env.MOCKER.HOST}` +
                  `${env.MOCKER.BASEPATH}${response?.subsystem}/${
                    response?.resource_url ? response.resource_url : ""
                  }`.replace(/\/\//gm, ""),
                response,
                false
              );
              this.setState({ mockResource: response, resourceCURL: cURL });
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

  readonly updateResource = (): void => {
    this.setState({ isContentLoading: true });
    this.updateSwappedRules();
    this.context.instance
      .acquireTokenSilent({
        ...loginRequest,
        account: this.context.accounts[0],
      })
      .then((auth: AuthenticationResult) => {
        MockerConfigApi.updateMockResource(
          auth.idToken,
          this.state.mockResource?.id!,
          this.state.mockResource!
        )
          .then((response) => {
            if (isErrorResponse(response)) {
              const problemJson = response as ProblemJson;
              if (problemJson.status === 404) {
                toastError(
                  `No mock resource found with id ${this.state.mockResource
                    ?.id!}.`
                );
              } else if (problemJson.status === 400) {
                toastError(
                  `There are three or more rules with same order, the swap is not possible.`
                );
              } else if (problemJson.status === 500) {
                toastError(
                  `An error occurred while updating general info for mock resource.`
                );
              }
            } else {
              this.setState({ mockResource: response });
            }
          })
          .catch(() => {
            toastError(`An error occurred while creating a new mock resource.`);
          })
          .finally(() => {
            this.setState({ isContentLoading: false });
          });
      });
  };

  readonly deleteRule = (): void => {
    const mockResource = this.state.mockResource;
    const ruleId = this.state.targetRule;
    const resourceId = this.state.mockResource?.id!;
    if (
      mockResource !== undefined &&
      resourceId !== undefined &&
      ruleId !== undefined
    ) {
      const rules = mockResource?.rules.filter((rule) => rule.id !== ruleId);
      mockResource.rules = rules;
      this.setState({ isContentLoading: true });
      this.context.instance
        .acquireTokenSilent({
          ...loginRequest,
          account: this.context.accounts[0],
        })
        .then((auth: AuthenticationResult) => {
          MockerConfigApi.updateMockResource(
            auth.idToken,
            resourceId,
            mockResource
          )
            .then((response) => {
              if (isErrorResponse(response)) {
                const problemJson = response as ProblemJson;
                if (problemJson.status === 404) {
                  toastError(`No mock resource found with id ${resourceId}.`);
                } else if (problemJson.status === 500) {
                  toastError(
                    `An error occurred while updating mock resource with id ${resourceId}.`
                  );
                }
              } else {
                this.setState({ mockResource: response });
              }
            })
            .catch(() => {
              toastError(
                `An error occurred while updating mock resource with id ${resourceId}.`
              );
            })
            .finally(() => {
              this.setState({
                isContentLoading: false,
                showDeleteRuleModal: false,
                targetRule: "",
              });
            });
        });
    }
  };

  readonly deleteCondition = (): void => {
    const mockResource = this.state.mockResource;
    const ruleId = this.state.targetRule;
    const conditionId = this.state.targetCondition;
    const resourceId = this.state.mockResource?.id!;
    if (
      mockResource !== undefined &&
      resourceId !== undefined &&
      ruleId !== undefined &&
      conditionId !== undefined
    ) {
      const mutableMockResource = { ...mockResource } as any;
      mutableMockResource.rules = Array.from(mutableMockResource.rules);
      mutableMockResource.rules.forEach((rule: any) => {
        if (rule.id !== ruleId) {
          const conditions = Array.from(rule.conditions).filter(
            (condition: any) => condition.id !== conditionId
          );
          rule.conditions = conditions;
        }
      });
      this.setState({ isContentLoading: true });
      this.context.instance
        .acquireTokenSilent({
          ...loginRequest,
          account: this.context.accounts[0],
        })
        .then((auth: AuthenticationResult) => {
          MockerConfigApi.updateMockResource(
            auth.idToken,
            resourceId,
            mutableMockResource
          )
            .then((response) => {
              if (isErrorResponse(response)) {
                const problemJson = response as ProblemJson;
                if (problemJson.status === 404) {
                  toastError(`No mock resource found with id ${resourceId}.`);
                } else if (problemJson.status === 500) {
                  toastError(
                    `An error occurred while updating mock resource with id ${resourceId}.`
                  );
                }
              } else {
                this.setState({ mockResource: response });
              }
            })
            .catch(() => {
              toastError(
                `An error occurred while updating mock resource with id ${resourceId}.`
              );
            })
            .finally(() => {
              this.setState({
                isContentLoading: false,
                showDeleteRuleModal: false,
                targetRule: "",
              });
            });
        });
    }
  };

  getFormattedTags(tags: ReadonlyArray<string>) {
    if (tags.length == 0) {
      return <Chip id={`no-chip`} sx={{ color: "transparent" }}></Chip>;
    }
    return tags.map((tag) => (
      <Chip
        label={tag}
        id={`${tag}-chip`}
        sx={{
          fontWeight: "fontWeightMedium",
          color: "white",
          backgroundColor: "blueviolet",
          fontSize: "14px",
          paddingBottom: "1px",
          height: "24px",
        }}
      ></Chip>
    ));
  }

  getFormattedSpecialHeaders(
    specialHeaders: ReadonlyArray<SpecialRequestHeader>
  ) {
    if (specialHeaders.length == 0) {
      return <Chip id={`no-chip`} sx={{ color: "transparent" }}></Chip>;
    }
    return specialHeaders.map((header) => (
      <Chip
        label={`${header.name}: ${header.value}`}
        id={`${header}-chip`}
        sx={{
          fontWeight: "fontWeightMedium",
          color: "white",
          backgroundColor: "green",
          fontSize: "14px",
          paddingBottom: "1px",
          height: "24px",
        }}
      ></Chip>
    ));
  }

  copyCURL() {
    navigator.clipboard.writeText(this.state.resourceCURL);
    toastOK("Resource cURL copied to clipboard!");
  }

  swapRuleOrder(ruleId: string, order: number): any {
    // create mutable copies because generated types use readonly
    const swappedRules = Array.from(this.state.swappedRules);
    let analyzedSwappedRule = swappedRules.find(
      (rule) => rule.ruleId === ruleId
    );
    if (analyzedSwappedRule !== undefined) {
      analyzedSwappedRule = { ...analyzedSwappedRule, nextOrder: order };
    } else {
      analyzedSwappedRule = {
        ruleId,
        prevOrder: this.state.mockResource!.rules.find(
          (rule) => rule.id === ruleId
        )?.order!,
        nextOrder: order,
      };
      swappedRules.push(analyzedSwappedRule);
    }
    const mockResource = { ...this.state.mockResource } as any;
    mockResource.rules = Array.from(mockResource.rules);
    const rule = mockResource.rules.find((rule: any) => rule.id === ruleId);
    rule.order = order;
    this.setState({ mockResource, swappedRules });
  }

  duplicateRule(ruleId: string): void {
    const mockResource = this.state.mockResource!;
    const ruleToBeDuplicated = mockResource.rules.find(
      (rule) => rule.id === ruleId
    );
    if (ruleToBeDuplicated) {
      const duplicated = {
        ...ruleToBeDuplicated,
        id: undefined,
        name: ruleToBeDuplicated.name.concat(" [duplicated]"),
        order: getFirstAvailableOrder(this.state.mockResource),
      };
      mockResource.rules = appendInList(mockResource.rules, duplicated);
      this.setState({ mockResource });
      this.updateResource();
    }
  }

  updateSwappedRules() {
    // make mutable copies
    const swappedRules = Array.from(this.state.swappedRules);
    const mockResource = { ...this.state.mockResource } as any;
    mockResource.rules = Array.from(mockResource.rules);
    const alreadySwapped: string[] = [];
    swappedRules.forEach((swappedRule) => {
      const ruleToBeSwapped = mockResource.rules.find(
        (rule: any) =>
          rule.order === swappedRule.nextOrder && rule.id !== swappedRule.ruleId
      );
      if (
        ruleToBeSwapped !== undefined &&
        !alreadySwapped.includes(ruleToBeSwapped.id)
      ) {
        ruleToBeSwapped.order = swappedRule.prevOrder;
        alreadySwapped.push(ruleToBeSwapped.id);
      }
    });
    this.setState({ mockResource, swappedRules: [] });
  }

  activateSwapOrder() {
    this.setState({ swappingOrder: true });
  }

  saveSwapOrder() {
    this.updateResource();
    this.setState({ swappingOrder: false });
  }

  serializeCURL(): string {
    const curl = generateCURLRequest(
      `${env.MOCKER.HOST}` +
        `${env.MOCKER.BASEPATH}${this.state.mockResource?.subsystem}/${
          this.state.mockResource?.resource_url
            ? this.state.mockResource.resource_url
            : ""
        }`.replace(/\/\//gm, ""),
      this.state.mockResource,
      true
    );
    return btoa(curl);
  }

  redirectToEditGeneralInfoPage(): void {
    this.props.history.push(
      `/mocker/mock-resources/${this.state.mockResource?.id}/edit`
    );
  }
  redirectToAddRulePage(): void {
    this.props.history.push(
      `/mocker/mock-resources/${this.state.mockResource?.id}/rules/create`
    );
  }
  redirectOnEditRulePage(ruleId: string): void {
    this.props.history.push(
      `/mocker/mock-resources/${this.state.mockResource?.id}/rules/${ruleId}/edit`
    );
  }
  redirectToSimulatorPage(): void {
    this.props.history.push(`/mocker/simulation?curl=${this.serializeCURL()}`);
  }
  redirectToPreviousPage() {
    this.props.history.goBack();
  }

  readonly onClickExpandRuleDetail = (panel: string) => (
    _event: React.SyntheticEvent,
    isExpanded: boolean
  ) => {
    this.setState({ expandedRule: isExpanded ? panel : "" });
  };

  readonly onClickDeleteRule = (ruleId: string) => {
    this.setState({ showDeleteRuleModal: true, targetRule: ruleId });
  };

  readonly onClickDeleteCondition = (ruleId: string, conditionId: string) => {
    this.setState({
      showDeleteConditionModal: true,
      targetRule: ruleId,
      targetCondition: conditionId,
    });
  };

  componentDidMount(): void {
    this.readMockResource(this.props.match.params.id as string);
  }

  render(): React.ReactNode {
    const mockResource = this.state.mockResource;

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
                title={mockResource?.name || ""}
                subTitle={`ID: ${mockResource?.id}`}
                mbTitle={1}
                variantTitle="h4"
                variantSubTitle="subtitle1"
                subTitleFontSize="14px"
                subTitleFontColor="#757575"
              />
            </Grid>
          </Grid>

          <Paper elevation={8} sx={{ marginBottom: 2, borderRadius: 4, p: 4 }}>
            <Grid container alignItems={"center"} spacing={0} mb={2}>
              <Grid item xs={11}>
                <Typography variant="h5">General info</Typography>
              </Grid>
              <Grid item xs={1}>
                <ButtonNaked
                  size="small"
                  component="button"
                  onClick={() => this.redirectToEditGeneralInfoPage()}
                  startIcon={<Edit />}
                  sx={{ color: "primary.main", mr: "20px" }}
                  weight="default"
                >
                  Edit
                </ButtonNaked>
              </Grid>
            </Grid>
            <Divider style={{ marginBottom: 20 }} />
            <Grid container alignItems={"center"} spacing={0} mb={2}>
              <Grid item xs={4}>
                <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                  Subsystem
                </Typography>
                <Typography variant="body2">
                  {mockResource?.subsystem}
                </Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                  Resource URL
                </Typography>
                <Typography variant="body2">
                  {mockResource?.resource_url &&
                  mockResource?.resource_url.length !== 0
                    ? mockResource?.resource_url
                    : "-"}
                </Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                  Method
                </Typography>
                <Typography variant="body2">
                  {mockResource?.http_method}
                </Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                  Status
                  {getActivationStatusTooltip()}
                </Typography>
                {mockResource?.is_active && (
                  <CheckCircleOutline color="success" />
                )}
                {!mockResource?.is_active && <HighlightOff color="error" />}
              </Grid>
            </Grid>
            <Grid container alignItems={"center"} spacing={0} mb={2}>
              <Grid item xs={9}>
                <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                  Special headers
                  {getSpecialHeadersTooltip()}
                </Typography>
                <>
                  {this.getFormattedSpecialHeaders(
                    mockResource?.special_headers || []
                  )}
                </>
              </Grid>
            </Grid>
            <Grid container alignItems={"center"} spacing={0} mb={2}>
              <Grid item xs={9}>
                <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                  Tags
                </Typography>
                <>{this.getFormattedTags(mockResource?.tags || [])}</>
              </Grid>
            </Grid>
            <Grid container alignItems={"center"} spacing={0} mb={2}>
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                  Resource cURL
                  {getResourceCURLTooltip()}
                </Typography>
                <Box
                  sx={{
                    width: "100%",
                    marginBottom: 2,
                    borderRadius: 4,
                    p: 1,
                    backgroundColor: "#f6f6f6",
                    typography: "caption",
                  }}
                >
                  <ButtonNaked
                    component="button"
                    onClick={() => this.copyCURL()}
                    startIcon={<ContentCopy />}
                    sx={{ color: "primary.main" }}
                  >
                    Copy
                  </ButtonNaked>
                  <ButtonNaked
                    component="button"
                    onClick={() => this.redirectToSimulatorPage()}
                    startIcon={<PlayCircle />}
                    sx={{ color: "green" }}
                  >
                    Test it!
                  </ButtonNaked>
                  <Box
                    sx={{
                      marginBottom: 1,
                      marginTop: 1,
                      borderRadius: 4,
                      p: 1,
                      backgroundColor: "white",
                      fontSize: "8px",
                      typography: "caption",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {this.state.resourceCURL}
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Paper>

          <Paper elevation={8} sx={{ borderRadius: 4, p: 4 }}>
            <Grid container alignItems={"center"} spacing={0} mb={2}>
              <Grid item xs={10}>
                <Typography variant="h5" mb={1}>
                  Rules
                </Typography>
              </Grid>
              <Grid item xs={1}>
                {this.state.swappingOrder === false && (
                  <ButtonNaked
                    size="small"
                    component="button"
                    onClick={() => this.activateSwapOrder()}
                    startIcon={<SwapVert />}
                    sx={{ color: "primary.main", mr: "20px" }}
                    weight="default"
                  >
                    Swap
                  </ButtonNaked>
                )}
                {this.state.swappingOrder === true && (
                  <ButtonNaked
                    size="small"
                    component="button"
                    onClick={() => this.saveSwapOrder()}
                    startIcon={<Save />}
                    sx={{ color: "green", mr: "20px" }}
                    weight="default"
                  >
                    Save
                  </ButtonNaked>
                )}
              </Grid>
              <Grid item xs={1}>
                <ButtonNaked
                  size="small"
                  component="button"
                  onClick={() => this.redirectToAddRulePage()}
                  startIcon={<Add />}
                  sx={{ color: "primary.main", mr: "20px" }}
                  weight="default"
                >
                  Add
                </ButtonNaked>
              </Grid>
            </Grid>
            <Divider style={{ marginBottom: 20 }} />
            <>
              {mockResource?.rules.map((rule) => (
                <Accordion
                  id={`${rule.id}-accordion`}
                  expanded={
                    this.state.expandedRule === rule.id &&
                    this.state.swappingOrder === false
                  }
                  onChange={this.onClickExpandRuleDetail(rule.id || "")}
                >
                  <AccordionSummary
                    id={`${rule.id}-header`}
                    expandIcon={<ExpandMore />}
                  >
                    <Grid item xs={1}>
                      {this.state.swappingOrder === true &&
                        !rule.tags.includes("Default") && (
                          <TextField
                            id="order"
                            label=" "
                            type="number"
                            value={rule.order}
                            onChange={(event) =>
                              this.swapRuleOrder(
                                rule.id!,
                                Number(event.target.value)
                              )
                            }
                            sx={{ width: "70%" }}
                            size="small"
                            inputProps={{
                              max: 9999,
                              min: 1,
                              style: {
                                fontSize: 13,
                                padding: 0,
                                paddingLeft: 10,
                              },
                            }}
                            InputLabelProps={{ shrink: false }}
                          />
                        )}
                      {(this.state.swappingOrder === false ||
                        rule.tags.includes("Default")) && (
                        <TextField
                          id="order"
                          label=" "
                          type="number"
                          value={rule.order}
                          disabled={true}
                          sx={{ width: "70%" }}
                          size="small"
                          inputProps={{
                            style: {
                              fontSize: 13,
                              padding: 0,
                              paddingLeft: 10,
                            },
                          }}
                          InputLabelProps={{ shrink: false }}
                        />
                      )}
                    </Grid>
                    <Grid item xs={8}>
                      <Typography
                        sx={{
                          width: "90%",
                          flexShrink: 0,
                          fontStyle:
                            this.state.expandedRule === rule.id
                              ? "italic"
                              : "normal",
                          fontSize:
                            this.state.expandedRule === rule.id
                              ? "15px"
                              : "13px",
                        }}
                      >
                        {rule.name}
                      </Typography>
                    </Grid>

                    <Grid item xs={3}>
                      <ButtonNaked
                        id={`${rule.id}-duplicate-btn`}
                        size="small"
                        component="button"
                        disabled={
                          rule.tags.find((tag) => tag === "Default") !==
                          undefined
                        }
                        onClick={() => this.duplicateRule(rule.id!)}
                        startIcon={<FileCopy />}
                        sx={{ color: "primary.main" }}
                        weight="default"
                      />
                      <ButtonNaked
                        id={`${rule.id}-edit-btn`}
                        size="small"
                        component="button"
                        onClick={() => this.redirectOnEditRulePage(rule.id!)}
                        startIcon={<Edit />}
                        sx={{ color: "primary.main" }}
                        weight="default"
                      />
                      <ButtonNaked
                        id={`${rule.id}-delete-btn`}
                        size="small"
                        component="button"
                        disabled={
                          rule.tags.find((tag) => tag === "Default") !==
                          undefined
                        }
                        onClick={() => {
                          this.onClickDeleteRule(rule.id!);
                        }}
                        startIcon={<Delete />}
                        sx={{ color: "error.main" }}
                        weight="default"
                      />
                    </Grid>
                  </AccordionSummary>
                  <AccordionDetails id={`${rule.id}-summary`}>
                    <Divider style={{ marginBottom: 20 }} />
                    <Grid container alignItems={"center"} spacing={0} mb={2}>
                      <Grid item xs={2}>
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: "bold" }}
                        >
                          Order
                        </Typography>
                        <Typography variant="body2" sx={{ fontSize: 15 }}>
                          {rule.order}
                        </Typography>
                      </Grid>
                      <Grid item xs={2}>
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: "bold" }}
                        >
                          Is active?
                        </Typography>
                        {rule.is_active && (
                          <CheckCircleOutline
                            sx={{ fontSize: 18 }}
                            color="success"
                          />
                        )}
                        {!rule.is_active && (
                          <HighlightOff sx={{ fontSize: 15 }} color="error" />
                        )}
                      </Grid>
                      <Grid item xs={8}>
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: "bold" }}
                        >
                          Tags
                        </Typography>
                        <>{this.getFormattedTags(rule.tags || [])}</>
                      </Grid>
                    </Grid>

                    <Grid container alignItems={"center"} spacing={0} mb={2}>
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: "bold" }}
                      >
                        Conditions
                        {getRuleConditionTooltip()}
                      </Typography>
                      <Grid container alignItems={"center"} spacing={0}>
                        {rule.conditions && rule.conditions.length > 0 && (
                          <ol>
                            {rule.conditions.map((condition) => (
                              <Grid
                                item
                                id={`${condition.id}-condition`}
                                xs={12}
                              >
                                <Typography variant="body2">
                                  <li>{getFormattedCondition(condition)}</li>
                                </Typography>
                              </Grid>
                            ))}
                          </ol>
                        )}
                        {rule.conditions && rule.conditions.length === 0 && (
                          <Typography variant="body2" sx={{ fontSize: 15 }}>
                            Always verified, if request is not compliant to any
                            previous rules.
                          </Typography>
                        )}
                      </Grid>
                    </Grid>

                    {rule.scripting && (
                      <Grid container alignItems={"center"} spacing={0} mb={2}>
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: "bold" }}
                        >
                          Scripting
                        </Typography>
                        <Grid container alignItems={"center"} spacing={0}>
                          <Box
                            sx={{
                              width: "100%",
                              marginBottom: 2,
                              borderRadius: 4,
                              p: 1,
                              backgroundColor: "#f6f6f6",
                              typography: "caption",
                            }}
                          >
                            <Typography
                              variant="body2"
                              sx={{ fontSize: "14px" }}
                            >
                              <b>Name:</b>{" "}
                              <Typography
                                variant="caption"
                                sx={{ fontSize: "14px" }}
                              >
                                {rule.scripting.script_name}
                              </Typography>
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ fontSize: "14px" }}
                            >
                              <b>Description:</b>{" "}
                              <Typography
                                variant="caption"
                                sx={{ fontSize: "14px" }}
                              >
                                {rule.scripting.description}
                              </Typography>
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ fontSize: "14px" }}
                            >
                              <b>Execution:</b>{" "}
                              <Typography
                                variant="caption"
                                sx={{ fontSize: "14px" }}
                              >
                                {rule.scripting.is_active
                                  ? "Enabled"
                                  : "Disabled"}
                              </Typography>
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ fontSize: "14px" }}
                            >
                              <b>Input parameters:</b>
                              {getScriptInputParameterTooltip()}
                              <Typography
                                variant="caption"
                                sx={{ fontSize: "14px" }}
                              >
                                {rule.scripting.input_parameters
                                  .map(
                                    (param) => `${param.name}: ${param.value}`
                                  )
                                  .join(", ")}
                              </Typography>
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ fontSize: "14px" }}
                            >
                              <b>Output parameters:</b>
                              {getScriptOutputParameterTooltip()}
                              <Typography
                                variant="caption"
                                sx={{ fontSize: "14px" }}
                              >
                                {rule.scripting.output_parameters?.join(", ")}
                              </Typography>
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                    )}

                    <Grid container alignItems={"center"} spacing={0} mb={2}>
                      <Grid item sx={{ width: "100%" }}>
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: "bold" }}
                        >
                          Response
                        </Typography>
                        <Box
                          sx={{
                            width: "100%",
                            marginBottom: 2,
                            borderRadius: 4,
                            p: 1,
                            backgroundColor: "#f6f6f6",
                            typography: "caption",
                          }}
                        >
                          {getFormattedResponseInfo(rule.response)}
                          <Box
                            sx={{
                              marginBottom: 1,
                              marginTop: 1,
                              borderRadius: 4,
                              p: 1,
                              backgroundColor: "white",
                              fontSize: "8px",
                              typography: "caption",
                              whiteSpace: "pre-wrap",
                            }}
                          >
                            {getFormattedBody(rule.response.body, true)}
                          </Box>
                        </Box>
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              ))}
            </>
          </Paper>
        </Grid>

        <GenericModal
          title="Warning"
          message="Are you sure you want to delete this mock rule?"
          openModal={this.state.showDeleteRuleModal}
          onConfirmLabel="Confirm"
          onCloseLabel="Dismiss"
          handleCloseModal={() =>
            this.setState({ showDeleteRuleModal: false, targetRule: "" })
          }
          handleConfirm={this.deleteRule}
        />
        <GenericModal
          title="Warning"
          message="Are you sure you want to delete this mock condition?"
          openModal={this.state.showDeleteConditionModal}
          onConfirmLabel="Confirm"
          onCloseLabel="Dismiss"
          handleCloseModal={() =>
            this.setState({
              showDeleteConditionModal: false,
              targetRule: "",
              targetCondition: "",
            })
          }
          handleConfirm={this.deleteCondition}
        />
      </Grid>
    );
  }
}
