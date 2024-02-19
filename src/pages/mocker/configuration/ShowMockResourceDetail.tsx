import { MsalContext } from "@azure/msal-react";
import React from "react";
import { loginRequest } from "../../../util/authconfig";
import { AuthenticationResult } from "@azure/msal-browser";
import { MockerConfigApi } from "../../../util/apiclient";
import { isErrorResponse } from "../../../util/client-utils";
import { ProblemJson } from "../../../api/generated/mocker-config/ProblemJson";
import { generateCURLRequest, getFormattedCondition, stringfyList, toastError } from "../../../util/utilities";
import { MockResource } from "../../../api/generated/mocker-config/MockResource";
import { Accordion, AccordionDetails, AccordionSummary, Box, Chip, Divider, Grid, Paper, Stack, TextField, Tooltip, Typography } from '@mui/material';
import { ButtonNaked } from '@pagopa/mui-italia';
import { Add, ArrowBack, CheckCircleOutline, Delete, Edit, ExpandMore, Help, HighlightOff, PlayCircle, Save, SwapVert } from '@mui/icons-material';
import Title from "../../../components/pages/Title";
import xmlFormat from "xml-formatter";
import { MockResponse } from "../../../api/generated/mocker-config/MockResponse";
import GenericModal from "../../../components/generic/GenericModal";
import { SpecialRequestHeader } from "../../../api/generated/mocker-config/SpecialRequestHeader";
import { ENV as env } from "../../../util/env";

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
    isContentLoading: boolean,
    expandedRule: string,
    mockResource: MockResource | undefined,
    showDeleteRuleModal: boolean,
    showDeleteConditionModal: boolean,
    targetRule: string,
    targetCondition: string,
    swappingOrder: boolean,
  }

export default class ShowMockResourceDetail extends React.Component<IProps, IState> {

  static contextType = MsalContext;
  context!: React.ContextType<typeof MsalContext>
  
  
  constructor(props: IProps) {
    super(props);
    this.state = {
      isContentLoading: false,
      expandedRule: '',
      mockResource: undefined,
      showDeleteRuleModal: false,
      showDeleteConditionModal: false,
      targetRule: '',
      targetCondition: '',
      swappingOrder: false
    };

    this.readMockResource.bind(this);
    this.deleteRule.bind(this);
  }

  readMockResource = (resourceId: string): void => {
    this.setState({ isContentLoading: true });
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
      MockerConfigApi.updateMockResource(auth.idToken, this.state.mockResource?.id!, this.state.mockResource!)
      .then((response) => {
        if (isErrorResponse(response)) {
            const problemJson = response as ProblemJson;
            if (problemJson.status === 404) {
              toastError(`No mock resource found with id ${this.state.mockResource?.id!}.`);
            } else if (problemJson.status === 500) {
              toastError(`An error occurred while updating general info for mock resource.`);
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
      })
    });
  }

  deleteRule = (): void => {
    let mockResource = this.state.mockResource;
    let ruleId = this.state.targetRule;
    let resourceId = this.state.mockResource?.id!;
    if (mockResource !== undefined && resourceId !== undefined && ruleId !== undefined) {
      let rules = mockResource?.rules.filter(rule => rule.id !== ruleId);
      mockResource.rules = rules;
      this.setState({ isContentLoading: true });
      this.context.instance.acquireTokenSilent({
        ...loginRequest,
        account: this.context.accounts[0]
      })
      .then((auth: AuthenticationResult) => {
        MockerConfigApi.updateMockResource(auth.idToken, resourceId, mockResource!)
        .then((response) => {
          if (isErrorResponse(response)) {
              const problemJson = response as ProblemJson;
              if (problemJson.status === 404) {
                toastError(`No mock resource found with id ${resourceId}.`);
              } else if (problemJson.status === 500) {
                toastError(`An error occurred while updating mock resource with id ${resourceId}.`);
              }
          } else {
            this.setState({ mockResource: response });    
          }
        })
        .catch(() => {
          toastError(`An error occurred while updating mock resource with id ${resourceId}.`);
        })
        .finally(() => {
          this.setState({ isContentLoading: false, showDeleteRuleModal: false, targetRule: '' });
        })
      });
    }
  }

  deleteCondition = (): void => {
    let mockResource = this.state.mockResource;
    let ruleId = this.state.targetRule;
    let conditionId = this.state.targetCondition;
    let resourceId = this.state.mockResource?.id!;
    if (mockResource !== undefined && resourceId !== undefined && ruleId !== undefined && conditionId !== undefined) {
      mockResource?.rules.forEach(rule => {
        if (rule.id !== ruleId) {
          let conditions = rule.conditions.filter(condition => condition.id !== conditionId);
          rule.conditions = conditions;
        }
      });
      this.setState({ isContentLoading: true });
      this.context.instance.acquireTokenSilent({
        ...loginRequest,
        account: this.context.accounts[0]
      })
      .then((auth: AuthenticationResult) => {
        MockerConfigApi.updateMockResource(auth.idToken, resourceId, mockResource!)
        .then((response) => {
          if (isErrorResponse(response)) {
              const problemJson = response as ProblemJson;
              if (problemJson.status === 404) {
                toastError(`No mock resource found with id ${resourceId}.`);
              } else if (problemJson.status === 500) {
                toastError(`An error occurred while updating mock resource with id ${resourceId}.`);
              }
          } else {
            this.setState({ mockResource: response });    
          }
        })
        .catch(() => {
          toastError(`An error occurred while updating mock resource with id ${resourceId}.`);
        })
        .finally(() => {
          this.setState({ isContentLoading: false, showDeleteRuleModal: false, targetRule: '' });
        })
      });
    }
  }



  getFormattedTags(tags: readonly string[]) {
    if (tags.length == 0) {
      return <Chip id={`no-chip`} sx={{color: "transparent"}}></Chip>
    }
    return tags.map(tag => <Chip label={tag} id={`${tag}-chip`} sx={{
      fontWeight: 'fontWeightMedium', 
      color: "white", 
      backgroundColor: 
      "blueviolet", 
      fontSize: '14px', 
      paddingBottom: '1px', 
      height: '24px' 
    }}></Chip>)
  }

  getFormattedSpecialHeaders(specialHeaders: readonly SpecialRequestHeader[]) {
    if (specialHeaders.length == 0) {
      return <Chip id={`no-chip`} sx={{color: "transparent"}}></Chip>
    }
    return specialHeaders.map(header => <Chip label={`${header.name}: ${header.value}`} id={`${header}-chip`} sx={{
      fontWeight: 'fontWeightMedium', 
      color: "white", 
      backgroundColor: 
      "green", 
      fontSize: '14px', 
      paddingBottom: '1px', 
      height: '24px' 
    }}></Chip>)
  }

  getFormattedResponseInfo(response: MockResponse) {
    let headers = response.headers.map(header => 
      <Typography variant="body2" sx={{ fontSize: '14px'}}>
        <b>{header.name}:</b> <Typography variant="caption" sx={{ fontSize: '14px'}}>{header.value}</Typography>
      </Typography>
    );
    let injected_parameters = response.injected_parameters && response.injected_parameters.length > 0 ? stringfyList(response.injected_parameters) : 'none'
    return (
      <Box>
        <Typography variant="body2" sx={{ fontSize: '14px'}}>
          <b>Status:</b> <Typography variant="caption" sx={{ fontSize: '14px'}}>{response.status}</Typography>
        </Typography>
        <Typography variant="body2" sx={{ fontSize: '14px', marginBottom: 1 }}>
          <b>Injectable parameters:</b> <Typography variant="caption" sx={{ fontSize: '14px'}}>{injected_parameters}</Typography>
        </Typography>
        <Divider/>
        {headers}
      </Box>
    );
  }

  getFormattedBody(body: string | undefined) {
    if (body === undefined) {
      return 'No body';
    }
    let decodedBody = atob(body);
    if (decodedBody.startsWith("{")) {
      return JSON.stringify(JSON.parse(decodedBody), null, 2);
    } else if (decodedBody.startsWith("<")) {
      return xmlFormat(decodedBody, {collapseContent: true});
    }
    return decodedBody;
  }

  activateSwapOrder() {
    this.setState({ swappingOrder: true });
  }

  saveSwapOrder() {
    this.updateResource();
    this.setState({ swappingOrder: false });
  }



  redirectToEditGeneralInfoPage(): void {
    this.props.history.push(`/mocker/mock-resources/${this.state.mockResource?.id}/edit`);
  }
  redirectToAddRulePage(): void {
    this.props.history.push(`/mocker/mock-resources/${this.state.mockResource?.id}/rules/create`);
  }
  redirectOnEditRulePage(ruleId: string): void {
    this.props.history.push(`/mocker/mock-resources/${this.state.mockResource?.id}/rules/${ruleId}/edit`);
  }
  redirectToSimulatorPage(): void {
    this.props.history.push(`/mocker/simulation`);
  }
  redirectToPreviousPage() {
    this.props.history.goBack();
  }



  onClickExpandRuleDetail = (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
    this.setState({ expandedRule: isExpanded ? panel : '' });
  }

  onClickDeleteRule = (ruleId: string) => {
    this.setState({ showDeleteRuleModal: true, targetRule: ruleId });
  };

  onClickDeleteCondition = (ruleId: string, conditionId: string) => {
    this.setState({ showDeleteConditionModal: true, targetRule: ruleId, targetCondition: conditionId });
  };



  componentDidMount(): void {
    this.readMockResource(this.props.match.params['id'] as string);
  }


  
  render(): React.ReactNode {
    let mockResource = this.state.mockResource;

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
              <Title
                title={ mockResource?.name || ''}
                subTitle={ `ID: ${mockResource?.id}` }
                mbTitle={1}
                variantTitle="h4"
                variantSubTitle="subtitle1"
                titleFontColor="#1976d2"
                subTitleFontSize='14px'
                subTitleFontColor="#757575"
              />
            </Grid>            
          </Grid>

          <Paper elevation={8} sx={{ marginBottom: 2, borderRadius: 4, p: 4 }}>
            <Grid container alignItems={'center'} spacing={0} mb={2}>
              <Grid item xs={11}>
                <Typography variant="h5">
                  General info
                </Typography>
              </Grid>
              <Grid item xs={1}>
                <ButtonNaked size="small" component="button" onClick={() => this.redirectToEditGeneralInfoPage()} startIcon={<Edit/>} sx={{color: 'primary.main', mr: '20px'}} weight="default">
                  Edit
                </ButtonNaked>
              </Grid>
            </Grid>
            <Divider style={{marginBottom: 20}}/>
            <Grid container alignItems={'center'} spacing={0} mb={2}>
              <Grid item xs={4}>
                <Typography variant="subtitle1" sx={{fontWeight: 'bold'}}>Subsystem</Typography>
                <Typography variant="body2">{mockResource?.subsystem}</Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography variant="subtitle1" sx={{fontWeight: 'bold'}}>Resource URL</Typography>
                <Typography variant="body2">{mockResource?.resource_url && mockResource?.resource_url.length !== 0 ? mockResource?.resource_url : '-'}</Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography variant="subtitle1" sx={{fontWeight: 'bold'}}>Method</Typography>
                <Typography variant="body2">{mockResource?.http_method}</Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography variant="subtitle1" sx={{fontWeight: 'bold'}}>
                  Status
                  <Tooltip sx={{ paddingLeft: '5px'}} title={
                    <div>
                      This field represents the activation status of the mock resource.<br/>
                      If the mock resource is in "active" state, Mocker can evaluate its rules if the request is compliant with this resource. <br/>
                      If the mock resource is in "inactive" state, Mocker does not evaluate the rules that make it up and returns a generic error message.
                    </div>
                  }>
                    <Help sx={{ color: "#61affe" }}></Help>
                  </Tooltip>
                </Typography>
                { mockResource?.is_active && <CheckCircleOutline color="success" /> }
                { !mockResource?.is_active && <HighlightOff color="error"/> }
              </Grid>
            </Grid>
            <Grid container alignItems={'center'} spacing={0} mb={2}>
              <Grid item xs={9}>
                <Typography variant="subtitle1" sx={{fontWeight: 'bold'}}>
                  Special headers
                  <Tooltip sx={{ paddingLeft: '5px'}} title={
                      <div>
                        This field represents the set of special headers to be tightly bound to the mock resource.<br/>
                        If a request is compliant with the mock resource and contains these headers with the defined values, Mocker may evaluate the mock rules and return a response.<br/>
                        If a request does not have all the headers defined with the same set values, Mocker does not consider the request to be compliant with this mock resource.
                      </div>
                    }>
                    <Help sx={{ color: "#61affe" }}></Help>
                  </Tooltip>
                </Typography>
                <>{this.getFormattedSpecialHeaders(mockResource?.special_headers || [])}</>
              </Grid>
            </Grid>
            <Grid container alignItems={'center'} spacing={0} mb={2}>
              <Grid item xs={9}>
                <Typography variant="subtitle1" sx={{fontWeight: 'bold'}}>Tags</Typography>
                <>{this.getFormattedTags(mockResource?.tags || [])}</>
              </Grid>
            </Grid>
            <Grid container alignItems={'center'} spacing={0} mb={2}>
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{fontWeight: 'bold'}}>
                  Resource cURL
                </Typography>
                <Box sx={{ width: '100%', marginBottom: 2, borderRadius: 4, p: 1, backgroundColor: '#f6f6f6', typography: 'caption' }}>
                  <ButtonNaked component="button" onClick={() => this.redirectToSimulatorPage()} startIcon={<PlayCircle/>} sx={{ color: 'green' }}>
                    Test it!
                  </ButtonNaked>
                  <Box sx={{ marginBottom: 1, marginTop: 1, borderRadius: 4, p: 1, backgroundColor: 'white', fontSize: '8px', typography: 'caption', whiteSpace: 'pre-wrap' }}>
                    {
                      generateCURLRequest(
                        `${env.MOCKER.HOST}` + `${env.MOCKER.BASEPATH}${mockResource?.subsystem}/${mockResource?.resource_url ? mockResource.resource_url : ''}`.replace(/\/\//gm, ""),
                        mockResource
                      )            
                    }                
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Paper>

          <Paper elevation={8} sx={{ borderRadius: 4, p: 4 }}>
            <Grid container alignItems={'center'} spacing={0} mb={2}>
              <Grid item xs={10}>
                <Typography variant="h5" mb={1}>
                  Rules
                </Typography>
              </Grid>
              <Grid item xs={1}>
                {
                  this.state.swappingOrder === false &&
                  <ButtonNaked size="small" component="button" onClick={() => this.activateSwapOrder()} startIcon={<SwapVert/>} sx={{color: 'primary.main', mr: '20px'}} weight="default">
                    Swap
                  </ButtonNaked>
                }
                {
                  this.state.swappingOrder === true &&
                  <ButtonNaked size="small" component="button" onClick={() => this.saveSwapOrder()} startIcon={<Save/>} sx={{color: 'green', mr: '20px'}} weight="default">
                    Save
                  </ButtonNaked>
                }
              </Grid>
              <Grid item xs={1}>
                <ButtonNaked size="small" component="button" onClick={() => this.redirectToAddRulePage()} startIcon={<Add/>} sx={{color: 'primary.main', mr: '20px'}} weight="default">
                  Add
                </ButtonNaked>
              </Grid>
            </Grid>
            <Divider style={{marginBottom: 20}}/>
            <>
              {
                mockResource?.rules.map(rule => 
                  <Accordion id={`${rule.id}-accordion`} expanded={this.state.expandedRule === rule.id && this.state.swappingOrder === false} onChange={this.onClickExpandRuleDetail(rule.id || '')}>
                    <AccordionSummary id={`${rule.id}-header`} expandIcon={<ExpandMore />}>
                      <Grid item xs={1}>
                        {
                          this.state.swappingOrder === true && !rule.tags.includes('Parachute') &&
                          <TextField id="order" label=" " type="number" value={rule.order} onChange={(event) => rule.order = event.target.value as unknown as number} sx={{ width: '70%' }} size="small" inputProps={{ max: 9999, min: 1, style: { fontSize: 13, padding: 0, paddingLeft: 10 } }} InputLabelProps={{ shrink: false }}/>
                        }
                        {
                          (this.state.swappingOrder === false || rule.tags.includes('Parachute')) &&
                          <TextField id="order" label=" " type="number" value={rule.order} disabled={true} sx={{ width: '70%' }} size="small" inputProps={{ style: { fontSize: 13, padding: 0, paddingLeft: 10 } }} InputLabelProps={{ shrink: false }}/>
                        }
                      </Grid>
                      <Grid item xs={9}>
                        <Typography sx={{ width: '90%', flexShrink: 0, fontStyle: this.state.expandedRule === rule.id ? "italic" : "normal", fontSize: this.state.expandedRule === rule.id ? "15px" : "13px" }}>
                          {rule.name}
                        </Typography>
                      </Grid>

                      <Grid item xs={2}>
                        <ButtonNaked id={`${rule.id}-edit-btn`} size="small" component="button" onClick={() => this.redirectOnEditRulePage(rule.id!)} startIcon={<Edit/>} sx={{ color: 'primary.main' }} weight="default" />
                        <ButtonNaked id={`${rule.id}-delete-btn`} size="small" component="button" disabled={rule.tags.find(tag => tag === 'Parachute') !== undefined} onClick={() => {this.onClickDeleteRule(rule.id!)}} startIcon={<Delete/>} sx={{ color: 'error.main' }} weight="default" />
                      </Grid>

                    </AccordionSummary>
                    <AccordionDetails id={`${rule.id}-summary`} >
                      <Divider style={{marginBottom: 20}}/>
                      <Grid container alignItems={'center'} spacing={0} mb={2}>
                        <Grid item xs={2}>
                          <Typography variant="subtitle1" sx={{fontWeight: 'bold'}}>Order</Typography>
                          <Typography variant="body2" sx={{fontSize: 15}}>{rule.order}</Typography>
                        </Grid>
                        <Grid item xs={2}>
                          <Typography variant="subtitle1" sx={{fontWeight: 'bold'}}>Is active?</Typography>
                          { rule.is_active && <CheckCircleOutline  sx={{fontSize: 18}} color="success" /> }
                          { !rule.is_active && <HighlightOff sx={{fontSize: 15}} color="error"/> }
                        </Grid>
                        <Grid item xs={8}>
                          <Typography variant="subtitle1" sx={{fontWeight: 'bold'}}>Tags</Typography>
                          <>{this.getFormattedTags(rule.tags || [])}</>
                        </Grid>
                      </Grid>
                      
                      <Grid container alignItems={'center'} spacing={0} mb={2}>
                        <Typography variant="subtitle1" sx={{fontWeight: 'bold'}}>Conditions</Typography>
                        <Grid container alignItems={'center'} spacing={0}>
                          { rule.conditions && rule.conditions.length > 0 && 
                            <ol>
                              {
                                rule.conditions.map(condition => 
                                  <Grid item id={`${condition.id}-condition`} xs={12}>
                                    <Typography variant="body2">
                                      <li>{getFormattedCondition(condition)}</li>
                                    </Typography>
                                  </Grid>
                                )
                              }
                            </ol>
                          }
                          { rule.conditions && rule.conditions.length === 0 && 
                            <Typography variant="body2" sx={{fontSize: 15}}>Always verified, if request is not compliant to any previous rules.</Typography>
                          }
                        </Grid>
                      </Grid>

                      <Grid container alignItems={'center'} spacing={0} mb={2}>
                        <Grid item sx={{ width: '100%' }}>
                          <Typography variant="subtitle1" sx={{fontWeight: 'bold'}}>Response</Typography>
                          <Box sx={{ width: '100%', marginBottom: 2, borderRadius: 4, p: 1, backgroundColor: '#f6f6f6', typography: 'caption' }}>
                            {this.getFormattedResponseInfo(rule.response)}
                            <Box sx={{ marginBottom: 1, marginTop: 1, borderRadius: 4, p: 1, backgroundColor: 'white', fontSize: '8px', typography: 'caption', whiteSpace: 'pre-wrap' }}>
                              {this.getFormattedBody(rule.response.body)}
                            </Box>
                          </Box>
                        </Grid>
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                )
              }
            </>
          </Paper>
        </Grid>

        <GenericModal
          title="Warning"
          message="Are you sure you want to delete this mock rule?"
          openModal={this.state.showDeleteRuleModal}
          onConfirmLabel="Confirm"
          onCloseLabel="Dismiss"
          handleCloseModal={() => this.setState({ showDeleteRuleModal: false, targetRule: '' })}
          handleConfirm={this.deleteRule}
        />
        <GenericModal
          title="Warning"
          message="Are you sure you want to delete this mock condition?"
          openModal={this.state.showDeleteConditionModal}
          onConfirmLabel="Confirm"
          onCloseLabel="Dismiss"
          handleCloseModal={() => this.setState({ showDeleteConditionModal: false, targetRule: '', targetCondition: '' })}
          handleConfirm={this.deleteCondition}
        />
      </Grid>
    );
  }
  
}
