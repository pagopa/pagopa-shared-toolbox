import React from "react";
import axios, { Method } from "axios";
import base64 from 'react-native-base64'
import { Accordion, Button, Card, Form } from "react-bootstrap";
import { FaCopy, FaPlus, FaSpinner, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import getMockerURL from "../../util/envreader";

interface IProps {
    history: {
      push(url: string): void;
    };
    location: any
  }
  
  interface IState {
    isLoading: boolean;
    simulationManagement: {
      httpMethod: string,
      root: string,
      resourceUrl: string,
      headers: any,
      body: string,
      headerKey: string,
      headerValue: string,
    },
    response: {
      body: string,
      status: number,
      headers: any,
      time: number
    }
  }

export default class ShowSimulationMainPage extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            isLoading: false,
            simulationManagement: {
              httpMethod: "GET",
              root: getMockerURL(),
              resourceUrl: "",
              headers: {},
              body: "",
              headerKey: "",
              headerValue: "",
            },
            response: {
              body: "",
              status: -1,
              headers: {},
              time: -1
            }
        }
        let queryParam = new URLSearchParams(props.location.search).get("url");
        if (queryParam !== null) {
          this.state.simulationManagement.resourceUrl = base64.decode(queryParam).replace(/^.*\/mocker\//g, "");
        }
    }

      toastError(message: string) {
        toast.error(() => <div className={"toast-width"}>{message}</div>, {
          theme: "colored",
        });
      }

      toastOK(message: string) {
        toast.success(() => <div className={"toast-width"}>{message}</div>, {
          theme: "colored",
        });
      }

      validateRequestFields(): boolean {
        let simulation = this.state.simulationManagement;
        return (
          (simulation.httpMethod !== "") &&
          (simulation.resourceUrl.trim() !== "")
        );
      }
    
      generateAndCopyCURL(): string {
        let request = this.state.simulationManagement;
        console.log("headers: " + JSON.stringify(request.headers));
        let curl = `curl -X ${request.httpMethod} --location '${request.root}${request.resourceUrl}'`;
        Object.keys(request.headers).forEach((key) => {
          curl += ` \\\n--header '${key}: ${request.headers[key]}'`;
        });
        if (request.body !== "") {
          curl += ` \\\n--data '${request.body}'`;
        }
        navigator.clipboard.writeText(curl);
        this.toastOK("Generated cURL copied to clipboard!");
        return curl;
      }

      handleChange(event: any): void {
        const key = event.target.name as string;
        const value = event.target.value;
        let simulationManagement = this.state.simulationManagement;
        simulationManagement = {...simulationManagement, [key]: value};
        this.setState({simulationManagement});         
      }

      addHeader(): void {
        let simulationManagement = this.state.simulationManagement;
        simulationManagement.headers[simulationManagement.headerKey] = simulationManagement.headerValue;
        simulationManagement.headerKey = "";
        simulationManagement.headerValue = "";
        this.setState({simulationManagement}); 
      }

      removeHeader(header: any): void {
        let simulationManagement = this.state.simulationManagement;
        delete simulationManagement.headers[header];
        this.setState({simulationManagement}); 
      }

      sendRequest(): void {
        this.setState({isLoading: true});
        let request = this.state.simulationManagement;
        // defining time counting in interceptor
        axios.interceptors.request.use(function (config) {
          if (config.headers !== undefined) {
            config.headers['request-startTime'] = new Date().getTime().toString();
          }
          return config;
        }, function (error) {
          return Promise.reject(error);
        });
        axios.interceptors.response.use(function (response) {
          const currentTime = new Date().getTime();
          if (response.config.headers !== undefined) {
            const startTime = Number.parseInt(response.config.headers['request-startTime']);
            response.headers['request-duration'] = (currentTime - startTime).toString();
          }              
          return response;
        }, function (error) {
          return Promise.reject(error);
        });
        // executing request to Mocker
        axios.request({
          method: request.httpMethod.toLowerCase() as Method,
          url: request.resourceUrl,
          baseURL: request.root,
          data: request.body,
          headers: request.headers
        }).then((res) => {
          let body = res.data;
          const time = Number.parseInt(res.headers['request-duration']);
          let headers = res.headers;
          delete headers['request-duration'];          
          if (res.headers["content-type"] === "application/json") {
            body = JSON.stringify(body);
          } else if (res.headers["content-type"] === "application/xml" || res.headers["content-type"] === "text/xml") {
            body = (body as string).replace(/\\"/g, '"').replace(/\n/g, '\n');
          }          
          let response = {
            body: body,
            status: res.status,
            headers: headers,
            time: time
          };
          this.setState({ response });
        })
        .catch(() => {
          this.toastError("An error occurred while executing the simulation...");
        })
        .finally(() => {
          this.setState({isLoading: false});
        });
      }

      componentDidMount(): void {
      }
    
      render(): React.ReactNode {
        let simulation = this.state.simulationManagement;
        return (
          <div className="container-fluid mock-resources">
            <div className="row">
              <h1>Simulate Mocker behavior</h1>
            </div>
            <Accordion>
              <Card>
                <Card.Header>
                  <h5>Request</h5>
                </Card.Header>
                
                  <Card.Body>
                    <div className="row">
                      <Form.Group controlId="httpMethod" className="col-md-1">
                        <Form.Label>Method<span className="text-danger">*</span>:</Form.Label>
                        <Form.Control as="select" name="httpMethod" defaultValue="" value={simulation.httpMethod} onChange={(e) => this.handleChange(e)} >
                          <option value="GET">GET</option>
                          <option value="POST">POST</option>
                          <option value="PUT">PUT</option>
                          <option value="DELETE">DELETE</option>
                          <option value="HEAD">HEAD</option>
                          <option value="OPTIONS">OPTIONS</option>
                        </Form.Control>
                      </Form.Group>
                      <Form.Group className="col-md-5">
                        <Form.Label>URL root path:</Form.Label>
                        <Form.Control name="root" value={simulation.root} readOnly/>
                      </Form.Group>
                      <Form.Group className="col-md-6">
                        <Form.Label>Resource URL<span className="text-danger">*</span>:</Form.Label>
                        <Form.Control name="resourceUrl" value={simulation.resourceUrl} placeholder="path/to/resource" onChange={(e) => this.handleChange(e)} />
                      </Form.Group>
                    </div>
                    <div className="row">
                      <Form.Group controlId="headers" className="col-md-12">
                        <Form.Label>Request headers:</Form.Label>
                        <div className="row">
                          <div className="col-md-3">
                            <Form.Control name="headerKey" value={simulation.headerKey} placeholder="Header Key" onChange={(e) => this.handleChange(e)} />  
                          </div>
                          <div className="col-md-3">
                            <Form.Control name="headerValue" value={simulation.headerValue} placeholder="Header Value" onChange={(e) => this.handleChange(e)} />  
                          </div>
                          <div>
                            <Button className="float-md-right"	onClick={() => this.addHeader()} disabled={ simulation.headerKey.trim() === "" }><FaPlus/></Button>
                          </div>
                        </div>
                      </Form.Group>
                    </div>
                    <div className="row">
                      <Form.Group controlId="addedHeaders" className="col-md-12">
                        <Form.Label>Added headers:</Form.Label>
                        <div>
                          { 
                            (Object.keys(simulation.headers).length === 0) && 
                            <span>No added headers</span> 
                          }
                          { 
                            (Object.keys(simulation.headers).length !== 0) &&
                            (
                              Object.keys(simulation.headers).map((header: any, key: any) => {
                                return (
                                  <Card key={key}>
                                    <Card.Body>
                                      <div className="col-md-12">
                                        {header}: {simulation.headers[header]}
                                        <Button className="float-md-right"	onClick={() => this.removeHeader(header)}>
                                          <FaTrash/>
                                        </Button>
                                      </div>
                                    </Card.Body>
                                  </Card>
                                );
                              })
                            )                   
                          }
                        </div>
                      </Form.Group>
                    </div> 
                    <div className="row">
                      <Form.Group controlId="body" className="col-md-12">
                        <Form.Label>Request body:</Form.Label>
                        <Form.Control as="textarea" name="body" rows={15} value={simulation.body} onChange={(e) => this.handleChange(e)} />
                      </Form.Group>
                    </div>
                    <div className="row mt-3">
                      <Button className="ml-2 float-md-right" variant="primary" onClick={() => this.sendRequest()} disabled={!this.validateRequestFields()}>Send Request</Button> 
                      <Button className="ml-2 float-md-right" variant="primary" onClick={() => this.generateAndCopyCURL()} disabled={!this.validateRequestFields()}>Copy cURL <FaCopy /></Button> 
                    </div>
                  </Card.Body>
              </Card>
              <Card>
                <Accordion.Toggle as={Card.Header} eventKey={"simulationResponse"}>
                  <h5>Response</h5>
                </Accordion.Toggle>
                <Accordion.Collapse eventKey={"simulationResponse"}>
                  <>
                    { this.state.isLoading && (<div className="text-center"><FaSpinner className="spinner" size={28}/></div>)}
                    {
                      !this.state.isLoading &&
                      <Card.Body>
                        <div className="row">
                          <Form.Group controlId="responseBody" className="col-md-6">
                            {
                              (Object.keys(this.state.response?.headers).length > 0) &&
                              <Form.Label>Headers:</Form.Label>
                            }
                            { 
                              (Object.keys(this.state.response?.headers).length > 0) &&
                              (
                                Object.keys(this.state.response.headers).map((header: any, _key: any) => {
                                  return (
                                    
                                        <div className="col-md-12">
                                          {header}: {this.state.response.headers[header]}
                                        </div>
                                  );
                                })
                              )                   
                            }
                          </Form.Group>
                        </div>
                        <div className="row">
                          <Form.Group controlId="responseBody" className="col-md-12">
                            { this.state.response.status !== -1 &&
                              <Form.Label>Status: {this.state.response.status} [Executed in {this.state.response.time} ms]</Form.Label>
                            }                            
                            <Form.Control as="textarea" name="body" rows={15} value={this.state.response.body} readOnly />
                          </Form.Group>
                        </div>
                      </Card.Body>
                    }
                  </>
                </Accordion.Collapse>
              </Card>
            </Accordion>
          </div>
        );
      }

}