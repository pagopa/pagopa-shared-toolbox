import React from "react";
// import { Accordion, Alert, Breadcrumb, Button, Card, Form, OverlayTrigger, Tooltip } from "react-bootstrap";
// import { FaPen, FaPlay, FaPlus, FaSpinner, FaTrash } from "react-icons/fa";
// import { toast } from "react-toastify";
// import base64 from 'react-native-base64'
// import { v4 as uuid } from "uuid";
// import MockRuleListItem from "../../components/mockresource/MockRuleListItem";
// import MockConditionListItem from "../../components/mockresource/MockConditionListItem";
// import { MsalContext } from "@azure/msal-react";
// import { loginRequest } from "../../util/authconfig";
// import { AuthenticationResult } from "@azure/msal-browser";
// import { MockConfigApi } from "../../util/apiclient";
// import { isErrorResponse } from "../../util/client-utils";
// import { ProblemJson } from "../../api/generated/ProblemJson";
// import { ENV as env } from "../../util/env";

interface IProps {
//   mockResourceId?: string;
//   action: string;
//   history: {
//     push(url: string): void;
//     goBack(): void;
//   };
}
  
interface IState {
//   isError: boolean;
//   isLoading: boolean;
//   ruleManagement: {
//     create: boolean;
//     edit: boolean;
//     mockRule: any;
//     mockCondition: any;
//     mockHeaders: any,
//     updatingRuleId: string,
//   }
//   mockResource: any,
}

export default class MockResourceView extends React.Component<IProps, IState> {

//   static contextType = MsalContext;
//   context!: React.ContextType<typeof MsalContext>

//   constructor(props: IProps) {
//     super(props);
//     this.state = {
//       isError: false,
//       isLoading: false,
//       ruleManagement: {
//         create: false,
//         edit: false,
//         mockRule: {
//           isActive: false,
//           tag: [],
//           conditions: [],
//           response: {
//             body: "",
//             headers: {},
//           }
//         },
//         mockCondition: {},
//         mockHeaders: {},  
//         updatingRuleId: "",
//       },
//       mockResource: {},
//     }
//     this.removeMockRuleCondition = this.removeMockRuleCondition.bind(this);
//   }

//   toastError(message: string) {
//     toast.error(() => <div className={"toast-width"}>{message}</div>, {
//       theme: "colored",
//     });
//   }

//   toastOK(message: string) {
//     toast.success(() => <div className={"toast-width"}>{message}</div>, {
//       theme: "colored",
//     });
//   }



//   handleChange(event: any, obj: string) {
    
//     const key = event.target.name as string;
//     const value = event.target.type === "checkbox" ? event.target.checked : event.target.value;
//     /* Mock resource fields analysis */
//     if (obj === "mockResource") {
//       // let mockResource: MockResource = this.state.mockResource;
//       let mockResource: MockResource = this.state.mockResource;
//       mockResource = {...mockResource, [key]: value};
//       this.setState({mockResource});
//     } 
//     /* Mock rule fields analysis */
//     else if (obj === "mockRule") {
//       let ruleManagement = this.state.ruleManagement;
//       ruleManagement.mockRule = {...ruleManagement.mockRule, [key]: value};
//       console.log(ruleManagement.mockRule);
//       this.setState({ruleManagement});
//     } 
//     /* Mock resource tags fields analysis */
//     else if (obj === "mockResourceTags") {
//       let mockResource: MockResource = this.state.mockResource;
//       let tags = value.split(",");
//       if (tags?.[0] === undefined || tags?.[0] === "") {
//         tags = [];
//       }
//       mockResource = {...mockResource, tag: tags};
//       this.setState({mockResource});
//     } 
//     /* Mock rule tags fields analysis */
//     else if (obj === "mockRuleTags") {
//       let ruleManagement = this.state.ruleManagement;
//       let tags = value.split(",");
//       if (tags?.[0] === undefined || tags?.[0] === "") {
//         tags = [];
//       } 
//       ruleManagement.mockRule = {...ruleManagement.mockRule, tag: tags};
//       this.setState({ruleManagement});
//     }     
//     /* Mock resource condition analysis */
//     else if (obj === "mockRuleCondition") {
//       let ruleManagement = this.state.ruleManagement;
//       if (key === "contentPosition") {
//         const contentPositionFields = value.split("_");
//         ruleManagement.mockCondition = {...ruleManagement.mockCondition, "contentPosition": value, "fieldPosition": contentPositionFields[0], "analyzedContentType": contentPositionFields[1]};
//       } else {
//         ruleManagement.mockCondition = {...ruleManagement.mockCondition, [key]: value};
//       }      
//       this.setState({ruleManagement});
//     }
//     /* Mock resource rule headers analysis */
//     else if (obj === "mockRuleHeader") {
//       let ruleManagement = this.state.ruleManagement;
//       if (key === "headerKey") {
//         ruleManagement.mockHeaders[0] = value;
//       } else if (key === "headerValue") {
//         ruleManagement.mockHeaders[1] = value;
//       }
//       this.setState({ruleManagement});
//     }
//     /* Mock resource rule response analysis */
//     else if (obj === "mockRuleResponse") {
//       let ruleManagement = this.state.ruleManagement;
//       if (ruleManagement.mockRule.response === undefined) {
//         ruleManagement.mockRule.response = {};
//       }
//       if (key === "body") {
//         ruleManagement.mockRule.response.body = base64.encode(value);
//       } else if (key === "parameters") {
//         let parameters = value.split(",");
//         if (parameters?.[0] === undefined || parameters?.[0] === "") {
//           parameters = [];
//         }
//         ruleManagement.mockRule.response = {...ruleManagement.mockRule.response, parameters};
//       } else {
//         ruleManagement.mockRule.response.status = value as number;
//       }
//       this.setState({ruleManagement});
//     }
//   }

//   isNullUndefinedOrEmpty(value: string): boolean {
//     return value === undefined || value === null || value === "";
//   }



//   validateResourceFields(): boolean {
//     let mockResource = this.state.mockResource;
//     return (
//       (!this.isNullUndefinedOrEmpty(mockResource.name)) &&
//       (!this.isNullUndefinedOrEmpty(mockResource.resourceUrl)) &&
//       (!this.isNullUndefinedOrEmpty(mockResource.mockType)) &&
//       (!this.isNullUndefinedOrEmpty(mockResource.httpMethod)) &&
//       (mockResource.rules !== undefined && mockResource.rules.length > 0)
//     );
//   }

//   validateRuleFields(): boolean {
//     let mockRule = this.state.ruleManagement.mockRule;
//     return (
//       (!this.isNullUndefinedOrEmpty(mockRule.name)) &&
//       (mockRule.isActive !== undefined) &&
//       (mockRule.response !== undefined) &&
//       (mockRule.response.status !== undefined && mockRule.response.status >= 200)
//     );
//   }

  

//   generateCompleteUrl(): string {
    
//     return `${env.MOCKER.URL}${this.state.mockResource?.mockType === undefined ? "" : this.state.mockResource?.mockType}${this.state.mockResource?.resourceUrl === undefined ? "" : this.state.mockResource?.resourceUrl}`;
//   }

//   createEmptyMockRule(): void {
//     const ruleManagement = {
//       create: true,
//       edit: false,
//       mockRule: {
//         isActive: false,
//         tag: [],
//         conditions: [],
//         response: {
//           body: "",
//           headers: {},
//         }
//       },
//       mockCondition: {
//         id: 0,
//         fieldName: "",
//         conditionType: "",
//         conditionValue: "",
//         fieldPosition: "",
//         analyzedContentType: "",
//         contentPosition: ""
//       },
//       mockHeaders: {},
//       updatingRuleId: "",
//     };
//     this.setState({ ruleManagement });
//   }

//   addMockRule(): void {
//     let mockResource = this.state.mockResource;
//     if (mockResource.rules === undefined) {
//       mockResource.rules = [];
//     }
//     const mockRuleId = this.isNullUndefinedOrEmpty(this.state.ruleManagement.mockRule.id) ? mockResource.rules.length : this.state.ruleManagement.mockRule.id - 1;
//     mockResource.rules.splice(mockRuleId, 0, {
//       id: uuid(),
//       name: this.state.ruleManagement.mockRule.name,
//       isActive: this.state.ruleManagement.mockRule.isActive,
//       conditions: this.state.ruleManagement.mockRule.conditions,
//       response: this.state.ruleManagement.mockRule.response,
//       tag: this.state.ruleManagement.mockRule.tag,
//     });
//     const ruleManagement = {
//       create: false,
//       edit: false,
//       mockRule: {},
//       mockCondition: {},
//       mockHeaders: {},
//       updatingRuleId: "",
//     };
//     this.setState({ ruleManagement });
//     this.setState({ mockResource });
//   }

//   startUpdateMockRule(idx: any) {
//     let mockRule = this.state.mockResource.rules[idx];
//     mockRule.id = idx + 1;
//     const ruleManagement = {
//       create: false,
//       edit: true,
//       mockRule: mockRule,
//       mockCondition: {},
//       mockHeaders: {},
//       updatingRuleId: idx,
//     };
//     this.setState({ ruleManagement });
//   }

//   endUpdateMockRule() {
//     let mockResource = this.state.mockResource;
//     mockResource.rules[this.state.ruleManagement.updatingRuleId] = this.state.ruleManagement.mockRule;
//     const ruleManagement = {
//       create: false,
//       edit: false,
//       mockRule: {},
//       mockCondition: {},
//       mockHeaders: {},
//       updatingRuleId: "",
//     };
//     this.setState({ mockResource });
//     this.setState({ ruleManagement });
//   }

//   removeMockRule(idx: any) {
//     let mockResource = this.state.mockResource;
//     let rules = mockResource.rules;
//     rules.splice(idx, 1);
//     mockResource.rules = rules;
//     this.setState({mockResource});
//   }

//   discardMockRule() : void {
//     const ruleManagement = {
//       create: false,
//       edit: false,
//       mockRule: {},
//       mockCondition: {},
//       mockHeaders: {},
//       updatingRuleId: "",
//     };
//     this.setState({ ruleManagement });
//   }



//   addMockRuleCondition() : void {
//     let ruleManagement = this.state.ruleManagement;
//     if (ruleManagement.mockRule.conditions === undefined) {
//       ruleManagement.mockRule.conditions = [];
//     }
//     const mockCondition = ruleManagement.mockCondition;
//     const mockConditionId = this.isNullUndefinedOrEmpty(ruleManagement.mockCondition.id) ? ruleManagement.mockRule.conditions.length : ruleManagement.mockCondition.id - 1;

//     let isConditionValueValid = true;
//     if (mockCondition.conditionType === "ANY" || mockCondition.conditionType === "NULL") {
//       mockCondition.conditionValue = "";
//     } else if (mockCondition.conditionValue === "") {
//       isConditionValueValid = false;
//     }

//     if (this.isNullUndefinedOrEmpty(mockCondition.fieldPosition) || this.isNullUndefinedOrEmpty(mockCondition.fieldName) || this.isNullUndefinedOrEmpty(mockCondition.conditionType) || !isConditionValueValid) {
//       this.toastError("Insert all fields for mock condition!");
//     } else {
//       delete mockCondition.id;
//       delete mockCondition.contentPosition;
//       ruleManagement.mockRule.conditions.splice(mockConditionId, 0, mockCondition);
//       ruleManagement.mockCondition = {
//         id: "",
//         fieldName: "",
//         conditionType: "",
//         conditionValue: "",
//         fieldPosition: "",
//         analyzedContentType: "",
//         contentPosition: ""
//       };
//       this.setState({ ruleManagement });
//     }    
//   }

//   removeMockRuleCondition(idx: any) : void {
//     let ruleManagement = this.state.ruleManagement;
//     let mockConditions = ruleManagement.mockRule.conditions;
//     mockConditions.splice(idx, 1);
//     ruleManagement.mockRule.conditions = mockConditions;
//     this.setState({ ruleManagement });
//   }



//   addMockRuleHeader() : void {
//     let ruleManagement = this.state.ruleManagement;
//     if (ruleManagement.mockRule.response === undefined) {
//       ruleManagement.mockRule.response = {};
//     }
//     if (ruleManagement.mockRule.response.headers === undefined) {
//       ruleManagement.mockRule.response.headers = {};
//     }
//     const mockHeader = ruleManagement.mockHeaders;
//     ruleManagement.mockRule.response.headers[mockHeader[0]] = mockHeader[1];
//     console.log(ruleManagement.mockHeaders);
//     ruleManagement.mockHeaders = ["", ""];
//     console.log(ruleManagement.mockHeaders);
//     this.setState({ ruleManagement });
//   }

//   removeMockRuleHeader(field: any) : void {
//     let ruleManagement = this.state.ruleManagement;
//     let mockHeaders = ruleManagement.mockRule.response.headers;
//     delete mockHeaders[field];
//     ruleManagement.mockRule.response.headers = mockHeaders;
//     this.setState({ ruleManagement });
//   }



//   redirectToPreviousPage() {
//     this.props.history.goBack();
//   }

//   redirectToEditMockResourceDetail() {
//     this.props.history.push("/mocker/mock-resources/" + this.props.mockResourceId + "?edit");
//   }

//   redirectToSimulation() {
//     this.props.history.push("/mocker/simulation/?url=" + base64.encode(this.generateCompleteUrl()));
//   }




//   readMockResource(mockResourceId: string): void {
//     this.setState({isLoading: true});

//     this.context.instance.acquireTokenSilent({
//       ...loginRequest,
//       account: this.context.accounts[0]
//     })
//     .then((auth: AuthenticationResult) => {
//       MockConfigApi.getMockResource(auth.idToken, mockResourceId)
//       .then((response) => {
//         if (isErrorResponse(response)) {
//             const problemJson = response as ProblemJson;
//             if (problemJson.status === 404) {
//               this.toastError(`No mock resource found with id ${mockResourceId}...`);
//             } else if (problemJson.status === 500) {
//               this.toastError("An error occurred while reading mock resource list...");
//             }
//             this.setState({isError: true});
//         } else {
//           this.setState({ mockResource: response });          
//         }
//       })
//       .catch(() => {
//         this.toastError("An error occurred while reading mock resource list...");
//         this.setState({isError: true});
//       })
//       .finally(() => {
//         this.setState({ isLoading: false });
//       })
//     });
//   }

//   createMockResource() {
//     this.setState({isLoading: true});
//     //let isOk = false;
//     /*
//     axios.post(`${getMockerURL()}config/resources`, this.state.mockResource)
//       .then((res) => {
//         if (res.status === 200) {
//           this.toastOK("Resource created successfully!");
//           this.setState({ mockResource: res.data as MockResource});
//           isOk = true;
//         }
//       })
//       .catch(() => {
//         this.toastError("An error occurred while saving a new mock resource...");
//         this.setState({isError: true});
//       })
//       .finally(() => {
//         this.setState({isLoading: false});
//       });
//     if (isOk) {
//       this.props.history.goBack();
//     }
//     */
//   }

//   updateMockResource() {
//     this.setState({isLoading: true});
//     //let isOk = false;
//     /*
//     axios.put(`${getMockerURL()}config/resources/${this.props.mockResourceId}`, this.state.mockResource)
//       .then((res) => {
//         if (res.status === 200) {
//           this.toastOK("Resource updated successfully!");
//           this.setState({ mockResource: res.data as MockResource});
//           isOk = true;
//         }
//       })
//       .catch(() => {
//         this.toastError("An error occurred while updating the mock resource...");
//         this.setState({isError: true});
//       })
//       .finally(() => {
//         this.setState({isLoading: false});
//       });
//     if (isOk) {
//       this.props.history.goBack();
//     }
//     */
//   }

//   componentDidMount(): void {
//     this.setState({isError: false});
//     if (this.props.mockResourceId !== undefined) {
//       this.readMockResource(this.props.mockResourceId);
//     }
//   }



//   render(): React.ReactNode {
//     let mockResource = this.state.mockResource as MockResource;
//     let readOnly = this.props.action === "show";
//     return (
//       <div className="container-fluid mock-resource">
//         <div className="row">
//           <div className="col-md-12 mb-5">
//             <Breadcrumb>
//               <label onClick={() => this.redirectToPreviousPage()}>
//                 <Breadcrumb.Item href="">Mock Resources</Breadcrumb.Item>
//               </label>
//               <Breadcrumb.Item></Breadcrumb.Item>
//               <Breadcrumb.Item active>{mockResource.id || "-"}</Breadcrumb.Item>
//             </Breadcrumb>
//           </div>
//           <div className="col-md-12">
//             { 
//               this.state.isError && this.props.action === "create" && 
//               (<Alert className={'col-md-12'} variant={'danger'}>Cannot insert the new mock resource!</Alert>) 
//             }
//             { 
//               this.state.isError && this.props.action === "edit" && 
//               (<Alert className={'col-md-12'} variant={'danger'}>Cannot update the mock resource detail!</Alert>) 
//             }
//             { 
//               this.state.isError && this.props.action === "show" && 
//               (<Alert className={'col-md-12'} variant={'danger'}>Cannot show the mock resource detail!</Alert>) 
//             }
//             { this.state.isLoading && (<div className="text-center"><FaSpinner className="spinner" size={28}/></div>)}
//             {
//               !this.state.isLoading && (
                
//                 <>
//                     {
//                       this.props.action === "create" && 
//                       (
//                         <div className="row">
//                           <div className="col-md-10">
//                             <h2>New mock resource</h2>
//                           </div>
//                         </div>
//                       ) 
//                     }
//                     {
//                       this.props.action === "edit" &&
//                       (
//                         <div className="row">
//                         <div className="col-md-10">
//                           <h2>Edit mock resource</h2>
//                         </div>
//                         </div>
//                       )
//                     }
//                     {
//                       this.props.action === "show" &&
//                       (
//                         <div className="row">
//                         <div className="col-md-10">
//                           <h2>Mock resource detail: {`${mockResource.name}`}</h2>
//                         </div>
//                         <div className="col-md-2 text-right">
//                           <button className={"btn btn-primary"} onClick={() => this.redirectToEditMockResourceDetail()}>Edit <FaPen/></button>
//                         </div>
//                         </div>
//                       )                        
//                     }
//                   <div className="row mt-3">
//                     <div className="col-md-12">
//                       <Card>
//                         <Card.Header><h5>Reachable resource URL</h5></Card.Header>
//                         <Card.Body>
//                           <div className="row">
//                             <Form.Group className="col-md-1">
//                               <Form.Control value={mockResource.httpMethod} readOnly />
//                             </Form.Group>
//                             {
//                               this.props.action !== "show" &&
//                               <Form.Group className="col-md-11">
//                                 <Form.Control value={this.generateCompleteUrl()} readOnly />
//                               </Form.Group>
//                             }
//                             {
//                               this.props.action === "show" &&
//                               <>
//                                 <Form.Group className="col-md-10">
//                                   <Form.Control value={this.generateCompleteUrl()} readOnly />
//                                 </Form.Group>
//                                 <Form.Group className="col-md-1">
//                                   <OverlayTrigger placement="top" overlay={<Tooltip id="button-tooltip">Simulate behavior</Tooltip>}>
//                                     <Button className="float-md-right"	onClick={() => this.redirectToSimulation()}><FaPlay/></Button>            
//                                   </OverlayTrigger>                                
//                                 </Form.Group>
//                               </>
//                             }
//                           </div>
//                         </Card.Body>
//                       </Card>
//                     </div>
//                   </div>

//                   <div className="row mt-3">
//                     <div className="col-md-12">
//                       <Card>
//                         <Card.Header>
//                           <h5>Main information</h5>
//                         </Card.Header>
//                         <Card.Body>
//                           <div className="row">
//                             <Form.Group controlId="name" className="col-md-10">
//                               <Form.Label>Name<span className="text-danger">*</span></Form.Label>
//                               <Form.Control name="name" placeholder="Simple mock resource summary" value={mockResource.name} onChange={(e) => this.handleChange(e, "mockResource")} readOnly={readOnly}/>
//                             </Form.Group>
//                           </div>
//                           <div className="row">
//                             <Form.Group controlId="mockType" className="col-md-3">
//                               <Form.Label>Subsystem<span className="text-danger">*</span></Form.Label>
//                               <Form.Control name="mockType" placeholder="Root for the resource URL" value={mockResource.mockType} onChange={(e) => this.handleChange(e, "mockResource")} readOnly={readOnly || this.props.action === "edit"}/>
//                             </Form.Group>
//                             <Form.Group controlId="resourceURL" className="col-md-6">
//                               <Form.Label>Resource URL<span className="text-danger">*</span></Form.Label>
//                               <Form.Control name="resourceUrl" placeholder="Mock resource unique location" value={mockResource.resourceUrl} onChange={(e) => this.handleChange(e, "mockResource")} readOnly={readOnly || this.props.action === "edit"}/>
//                             </Form.Group>
//                             <Form.Group controlId="httpMethod" className="col-md-3">
//                               <Form.Label>HTTP Method<span className="text-danger">*</span></Form.Label>
//                               <Form.Control as="select" name="httpMethod" defaultValue="" value={mockResource.httpMethod} onChange={(e) => this.handleChange(e, "mockResource")} readOnly={readOnly || this.props.action === "edit"}>
//                                 <option value=""></option>
//                                 <option value="GET">GET</option>
//                                 <option value="POST">POST</option>
//                                 <option value="PUT">PUT</option>
//                                 <option value="DELETE">DELETE</option>
//                                 <option value="HEAD">HEAD</option>
//                                 <option value="OPTIONS">OPTIONS</option>
//                               </Form.Control>
//                             </Form.Group>
//                           </div>
//                         </Card.Body>
//                       </Card>
//                     </div>     
//                   </div> 

//                   <div className="row mt-3">              
//                     <div className="col-md-12">
//                       <Card>
//                         <Card.Header>
//                           <h5>Tags</h5>
//                         </Card.Header>
//                         <Card.Body>
//                           {
//                             (this.props.action === "create" || this.props.action === "edit") && 
//                             (
//                               <div className="row">
//                                 <Form.Group controlId="tag" className="col-md-6">
//                                   <Form.Label>Tags to be added (separated with a comma)</Form.Label>
//                                   <Form.Control name="tag" placeholder="No tag" value={mockResource.tag?.toString()}  onChange={(e) => this.handleChange(e, "mockResourceTags")} readOnly={readOnly}/>
//                                 </Form.Group>
//                                 <Form.Group controlId="tag" className="col-md-6">
//                                   <Form.Label>Added tags</Form.Label>
//                                   <div>
//                                     { 
//                                       (mockResource.tag === undefined || mockResource.tag.length === 0) && 
//                                       <span>No added tag</span> 
//                                     }
//                                     {
//                                       mockResource.tag !== undefined &&
//                                       Object.keys(mockResource.tag).map((tag: any, index: number) => (
//                                         <span key={index} className="mr-1 badge badge-primary">
//                                           {mockResource.tag[tag]}
//                                         </span>
//                                       ))
//                                     }
//                                   </div>
//                                 </Form.Group>
//                               </div>
//                             )
//                           }
//                           {
//                             this.props.action === "show" && 
//                             (
//                               <div className="row">
//                                 <Form.Group controlId="tag" className="col-md-12">
//                                   <Form.Label>Resource tags</Form.Label>
//                                   <div>
//                                     { 
//                                       (mockResource.tag === undefined || mockResource.tag.length === 0) && 
//                                       <span>No added tag</span> 
//                                     }                                    {
//                                       mockResource.tag !== undefined &&
//                                       Object.keys(mockResource.tag).map((tag: any, index: number) => (
//                                         <span key={index} className="mr-1 badge badge-primary">
//                                           {mockResource.tag[tag]}
//                                         </span>
//                                       ))
//                                     }
//                                   </div>
//                                 </Form.Group>
//                               </div>
//                             )
//                           }
//                         </Card.Body>
//                       </Card>
//                     </div>                    
//                   </div>          

//                   <div className="row mt-3">
//                     <div className="col-md-12">
//                       <Card>
//                         <Card.Header>
//                           <h5>Mock Rules</h5>
//                         </Card.Header>
//                         <Card.Body>
//                           <Accordion>
//                             {
//                               (this.state.ruleManagement.create || this.state.ruleManagement.edit) &&
//                               <Card>
//                                 <Accordion.Item as={Card.Header} eventKey={"addNewMockRuleAccordionToggle"}>
//                                   <Accordion.Header>
//                                     {
//                                       (this.state.ruleManagement.create) &&
//                                       <h6>Add a new mock Rule</h6>
//                                     }
//                                     {
//                                       (this.state.ruleManagement.edit) &&
//                                       <h6>Update mock Rule</h6>
//                                     }
//                                   </Accordion.Header>
//                                   <Accordion.Body>
//                                     <Card.Body>
//                                       <div className="row">
//                                         <Form.Group controlId="name" className="col-md-8">
//                                           <Form.Label>Name<span className="text-danger">*</span></Form.Label>
//                                           <Form.Control name="name" placeholder="Mock resource rule description" value={this.state.ruleManagement.mockRule?.name} onChange={(e) => this.handleChange(e, "mockRule")}/>
//                                         </Form.Group>
//                                         <Form.Group controlId="id" className="col-md-2">
//                                           <Form.Label>Rule check order<span className="text-danger">*</span></Form.Label>
//                                           <Form.Control name="id" type="number" min={1} value={this.state.ruleManagement.mockRule?.id} onChange={(e) => this.handleChange(e, "mockRule")}/>
//                                         </Form.Group>
//                                         <Form.Group controlId="isRuleActive" className="col-md-2">
//                                           <Form.Label>Active<span className="text-danger">*</span></Form.Label>
//                                           <Form.Switch name="isActive" checked={this.state.ruleManagement.mockRule?.isActive} onChange={(e) => this.handleChange(e, "mockRule")}/>
//                                         </Form.Group>
//                                       </div>

//                                       <div className="row">
//                                         <Form.Group controlId="tag" className="col-md-6">
//                                           <Form.Label>Tags to be added (separated with a comma)</Form.Label>
//                                           <Form.Control name="tag" placeholder="No tag" value={this.state.ruleManagement.mockRule?.tag.toString()} onChange={(e) => this.handleChange(e, "mockRuleTags")}/>
//                                         </Form.Group>
//                                         <Form.Group controlId="tag" className="col-md-6">
//                                           <Form.Label>Added tags</Form.Label>
//                                           <div>
//                                             { 
//                                               (this.state.ruleManagement.mockRule.tag === undefined || this.state.ruleManagement.mockRule.tag.length === 0) && 
//                                               <span>No added tag</span> 
//                                             }
//                                             {
//                                               this.state.ruleManagement.mockRule.tag !== undefined &&
//                                               Object.keys(this.state.ruleManagement.mockRule.tag).map((tag: any, index: number) => (
//                                                 <span key={index} className="mr-1 badge badge-primary">
//                                                   {this.state.ruleManagement.mockRule.tag[tag]}
//                                                 </span>
//                                               ))
//                                             }
//                                           </div>
//                                         </Form.Group>
//                                       </div>

//                                       <div className="row">
//                                         <Form.Group controlId="conditions" className="col-md-12">
//                                           <Form.Label>Conditions (evaluated in AND):</Form.Label>
//                                           <div className="row">
//                                             <div className="col-md-1">  
//                                               <Form.Control name="id" placeholder="Order" type="number" min={1} value={this.state.ruleManagement.mockCondition.id} onChange={(e) => this.handleChange(e, "mockRuleCondition")}/>
//                                             </div>
//                                             <div className="col-md-3">
//                                               <Form.Control name="fieldName" placeholder="Field Name" value={this.state.ruleManagement.mockCondition.fieldName} onChange={(e) => this.handleChange(e, "mockRuleCondition")}/>  
//                                             </div>
//                                             <div className="col-md-2">
//                                               <Form.Control as="select" name="conditionType" value={this.state.ruleManagement.mockCondition.conditionType} defaultValue={""} onChange={(e) => this.handleChange(e, "mockRuleCondition")}>  
//                                                 <option value=""></option>
//                                                 <option value="ANY">IS NOT NULL</option>
//                                                 <option value="NULL">IS NULL</option>
//                                                 <option value="EQ">EQUALS</option>
//                                                 <option value="NEQ">NOT EQUALS</option>
//                                                 <option value="REGEX">MEETS REGEX</option>
//                                                 <option value="LT">LOWER THAN</option>
//                                                 <option value="GT">GREATER THAN</option>
//                                                 <option value="LE">LOWER EQUALS THAN</option>
//                                                 <option value="GE">GREATER EQUALS THAN</option>
//                                               </Form.Control>
//                                             </div>
//                                             <div className="col-md-2">
//                                             {
//                                               (this.state.ruleManagement.mockCondition.conditionType === undefined || this.state.ruleManagement.mockCondition.conditionType === "NULL" || this.state.ruleManagement.mockCondition.conditionType === "ANY") &&
//                                               <Form.Control name="conditionValue" placeholder="" value={""} readOnly/>  
//                                             }
//                                             {
//                                               (this.state.ruleManagement.mockCondition.conditionType !== undefined && this.state.ruleManagement.mockCondition.conditionType !== "NULL" && this.state.ruleManagement.mockCondition.conditionType !== "ANY") &&
//                                               <Form.Control name="conditionValue" placeholder="Condition Value" value={this.state.ruleManagement.mockCondition.conditionValue} onChange={(e) => this.handleChange(e, "mockRuleCondition")}/>  
//                                             }
//                                             </div>
//                                             <div className="col-md-3">
//                                               <Form.Control as="select" name="contentPosition" defaultValue={""} value={this.state.ruleManagement.mockCondition.contentPosition} onChange={(e) => this.handleChange(e, "mockRuleCondition")}>
//                                                 <option value=""></option>
//                                                 <option value="BODY_JSON">In request body as JSON</option>
//                                                 <option value="BODY_XML">In request body as XML</option>
//                                                 <option value="URL_STRING">In request URL as query parameter</option>
//                                                 <option value="HEADER_STRING">In request headers</option>
//                                               </Form.Control>
//                                             </div>                                        
//                                             <div>
//                                               <Button className="float-md-right"	onClick={() => this.addMockRuleCondition()}><FaPlus/></Button>
//                                             </div>
//                                           </div>
//                                         </Form.Group>
//                                       </div>
//                                       <div className="row">
//                                         <Form.Group controlId="addedConditions" className="col-md-12">
//                                           <Form.Label>Added conditions</Form.Label>
//                                           <div>
//                                             { 
//                                               (this.state.ruleManagement.mockRule.conditions === undefined || this.state.ruleManagement.mockRule.conditions.length === 0) && 
//                                               <span>No added conditions, always verified</span> 
//                                             }
//                                             { 
//                                               (this.state.ruleManagement.mockRule.conditions !== undefined && this.state.ruleManagement.mockRule.conditions.length > 0) &&
//                                               (
//                                                 this.state.ruleManagement.mockRule.conditions?.map((condition: any, key: any) => { 
//                                                   return (
//                                                     <MockConditionListItem 
//                                                       removeMockCondition={this.removeMockRuleCondition}
//                                                       item={condition} 
//                                                       itemKey={key} 
//                                                       history={this.props.history} 
//                                                     />
//                                                   );                           
//                                                 })
//                                               )                                    
//                                             }
//                                           </div>
//                                         </Form.Group>
//                                       </div>                                  

//                                       <div className="row">
//                                         <Form.Group controlId="headers" className="col-md-12">
//                                           <Form.Label>Response headers:</Form.Label>
//                                           <div className="row">
//                                             <div className="col-md-5">
//                                               <Form.Control name="headerKey" placeholder="Header Key" value={this.state.ruleManagement.mockHeaders?.[0]} onChange={(e) => this.handleChange(e, "mockRuleHeader")}/>  
//                                             </div>
//                                             <div className="col-md-5">
//                                               <Form.Control name="headerValue" placeholder="Header Value" value={this.state.ruleManagement.mockHeaders?.[1]} onChange={(e) => this.handleChange(e, "mockRuleHeader")}/>  
//                                             </div>
//                                             <div>
//                                               <Button className="float-md-right"	onClick={() => this.addMockRuleHeader()} disabled={this.isNullUndefinedOrEmpty(this.state.ruleManagement.mockHeaders[0])}><FaPlus/></Button>
//                                             </div>
//                                           </div>
//                                         </Form.Group>
//                                       </div>
//                                       <div className="row">
//                                         <Form.Group controlId="addedHeaders" className="col-md-12">
//                                           <Form.Label>Added headers:</Form.Label>
//                                           <div>
//                                             { 
//                                               (this.state.ruleManagement.mockRule.response?.headers === undefined) && 
//                                               <span>No added headers</span> 
//                                             }
//                                             { 
//                                               (this.state.ruleManagement.mockRule.response?.headers !== undefined) &&
//                                               (
//                                                 Object.keys(this.state.ruleManagement.mockRule.response.headers).map((header: any, key: any) => {
//                                                   return (
//                                                     <Card key={key}>
//                                                         <Card.Body>
//                                                           <div className="col-md-12">
//                                                             {header}: {this.state.ruleManagement.mockRule.response.headers[header]}
//                                                             <Button className="float-md-right"	onClick={() => this.removeMockRuleHeader(header)}>
//                                                               <FaTrash/>
//                                                             </Button>
//                                                           </div>
//                                                         </Card.Body>
//                                                       </Card>
//                                                   );
//                                                 })
//                                               )                   
//                                             }
//                                           </div>
//                                         </Form.Group>
//                                       </div> 

//                                       <div className="row">
//                                         <Form.Group controlId="body" className="col-md-6">
//                                           <Form.Label>Response body</Form.Label>
//                                           <Form.Control as="textarea" name="body" rows={10} value={base64.decode(this.state.ruleManagement.mockRule?.response?.body)} onChange={(e) => this.handleChange(e, "mockRuleResponse")}/>
//                                         </Form.Group>
//                                         <Form.Group controlId="body" className="col-md-6">
//                                           <Form.Label>Response status<span className="text-danger">*</span></Form.Label>
//                                           <Form.Control name="status" value={this.state.ruleManagement.mockRule?.response?.status} onChange={(e) => this.handleChange(e, "mockRuleResponse")}/>
//                                         </Form.Group>
//                                       </div>

//                                       <div className="row">
//                                         <Form.Group controlId="injectedParameters" className="col-md-6">
//                                           <Form.Label>Injected parameters</Form.Label>
//                                           <Form.Control name="parameters" value={this.state.ruleManagement.mockRule?.response?.parameters?.toString()} onChange={(e) => this.handleChange(e, "mockRuleResponse")}/>
//                                         </Form.Group>
//                                         <Form.Group controlId="tag" className="col-md-6">
//                                           <Form.Label>Added parameters</Form.Label>
//                                           <div>
//                                             { 
//                                               (this.state.ruleManagement.mockRule.response?.parameters === undefined || this.state.ruleManagement.mockRule.response?.parameters.length === 0) && 
//                                               <span>No added parameters to be injected</span> 
//                                             }
//                                             {
//                                               (this.state.ruleManagement.mockRule.response?.parameters !== undefined && this.state.ruleManagement.mockRule.response?.parameters.length !== 0) &&
//                                               Object.keys(this.state.ruleManagement.mockRule.response.parameters).map((parameter: any, index: number) => (
//                                                 <span key={index} className="mr-1 badge badge-success">
//                                                   {this.state.ruleManagement.mockRule.response.parameters[parameter]}
//                                                 </span>
//                                               ))
//                                             }
//                                           </div>
//                                         </Form.Group>
//                                       </div>
//                                     </Card.Body>
//                                   </Accordion.Body>
//                                 </Accordion.Item>
//                               </Card>
//                             }
//                             { (!this.state.ruleManagement.create && (mockResource.rules === undefined || mockResource.rules.length === 0)) && 
//                               <span>No rule inserted yet. Insert at least one rule to continue.</span> 
//                             }
//                             { 
//                               (mockResource.rules !== undefined && mockResource.rules.length > 0) &&
//                               mockResource.rules?.map((rule: any, key: any) => { 
//                                 let ruleKey = `insertedrule_${key}`;
//                                   return  (
//                                     <Card key={ruleKey}>
//                                       <Accordion.Item as={Card.Header} eventKey={ruleKey}>
//                                         <Accordion.Header>
//                                           {rule.name}
//                                           {
//                                             (this.props.action !== "show") && 
//                                             (
//                                               <>
//                                                 <Button className="float-md-right"	onClick={() => this.removeMockRule(key)}>
//                                                   <FaTrash/>
//                                                 </Button>
//                                                 <Button className="float-md-right"	onClick={() => this.startUpdateMockRule(key)}>
//                                                   <FaPen/>
//                                                 </Button>
//                                               </>
//                                             )
//                                           }
//                                         </Accordion.Header>
//                                         <Accordion.Body>
//                                           <Card.Body>
//                                             <MockRuleListItem key={ruleKey} item={rule} history={this.props.history} />
//                                           </Card.Body>
//                                         </Accordion.Body>
//                                       </Accordion.Item>
//                                     </Card>
//                                   );                              
//                               })
//                             }
//                             </Accordion>  
//                         </Card.Body>
//                         {
//                           this.props.action !== "show" &&
//                           (
//                             <Card.Footer>
//                               {
//                                 (!this.state.ruleManagement.create && !this.state.ruleManagement.edit) &&
//                                 <Button className="float-md-right"	onClick={() => this.createEmptyMockRule()}>New <FaPlus/></Button>
//                               }
//                               {
//                                 (this.state.ruleManagement.create || this.state.ruleManagement.edit) &&
//                                 <Button className="ml-2 float-md-right" variant="secondary" onClick={() => this.discardMockRule()}>Discard</Button>
//                               }
//                               {
//                                 this.state.ruleManagement.create && 
//                                 <Button className="float-md-right" disabled={!this.validateRuleFields()} onClick={(event) => {
//                                     (event.currentTarget as HTMLButtonElement).disabled = true;
//                                     this.addMockRule();
//                                   }
//                                 }>Save</Button>
//                               }
//                               {
//                                 this.state.ruleManagement.edit && 
//                                 <Button className="float-md-right" disabled={!this.validateRuleFields()} onClick={(event) => {
//                                     (event.currentTarget as HTMLButtonElement).disabled = true;
//                                     this.endUpdateMockRule();
//                                   }
//                                 }>Update</Button>
//                               }
//                             </Card.Footer>
//                           ) 
//                         }
//                       </Card>
//                     </div>
//                   </div>
//                   {
//                     (this.props.action === "edit" || this.props.action === "create") && 
//                     (
//                       <div>
//                         <div className="row mt-3"></div>
//                         {
//                           this.props.action === "create" &&
//                           <Button className="float-md-right" onClick={() => this.createMockResource()} disabled={!this.validateResourceFields()}>Save</Button>                 
//                         }
//                         {
//                           this.props.action === "edit" &&
//                           <Button className="float-md-right" onClick={() => this.updateMockResource()} disabled={!this.validateResourceFields()}>Save</Button>                 
//                         }
//                         <Button className="ml-2 float-md-right" variant="secondary" onClick={() => this.redirectToPreviousPage()}>Cancel</Button> 
//                       </div>
//                     )
//                   }              
//                 </>
//               )
//             }
//           </div>
//         </div>
        
//       </div>
//     );
//   }
}