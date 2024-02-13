import React from "react";
// import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
// import base64 from "react-native-base64"
// import MockConditionListItem from "./MockConditionListItem";
// import { MockCondition } from "../../api/generated/MockCondition";
// import { MockResponse } from "../../api/generated/MockResponse";

interface IProps {
//   item: {
//     id: string,
//     name: string;
//     tag: string[];
//     isActive: boolean;
//     conditions: MockCondition[];
//     response: MockResponse;
//   };
//   history: {
//       push(url: string): void;
//   };
}

interface IState {
//   showDeleteModal: boolean;
//   mockResourceTarget: string
}

export default class MockRuleListItem extends React.Component<IProps, IState> {

//   render() {
//     return (
//       <div>
//         <div className="row mt-3">
//           <div className="col-md-2"><h5>Rule</h5></div>
//         </div>
//         <div className="row mt-3">
//           <div className="col-md-8"><h6>Name:</h6> {this.props.item.name}</div>
//           <div className="col-md-2"><h6>Active:</h6> 
//             {this.props.item.isActive && <FaCheckCircle className="text-success"/>}
//             {!this.props.item.isActive && <FaTimesCircle className="text-danger"/>}
//           </div>
//         </div>
//         <div className="row mt-3">
//           <div className="col-md-8"><h6>Tags: </h6> 
//             {
//               Object.keys(this.props.item.tag).map((tag: any, index: number) => (
//                 <span key={index} className="mr-1 badge badge-primary">
//                   {this.props.item.tag[tag]}
//                 </span>
//               ))
//             }
//           </div>
//         </div>
//         <div className="row mt-3">
//           <div className="col-md-12">
//             <h6>Conditions (evaluated in AND):</h6>
//           </div>
//         </div>
//         <div className="row mt-3">
//           <div className="col-md-12">           
//             { this.props.item.conditions?.length === 0 && <li>No condition to be evaluated. This rule will be always executed</li> }
//             {
//               this.props.item.conditions?.length > 0 &&
//               this.props.item.conditions?.map((condition, key: any) => {
//                 return (
//                   <MockConditionListItem 
//                     item={condition} 
//                     itemKey={key} 
//                     history={this.props.history} 
//                   />
//                 );     
//               })
//             }
//           </div>
//         </div>        
//         <div className="row mt-3">
//           <div className="col-md-2"><h5>Response</h5></div>
//         </div>
//         <div className="row mt-3">
//           <div className="col-md-12">
//             <h6>Headers:</h6>
//             <ul>
//               { (this.props.item.response.headers === undefined) && <li>No response header.</li> }
//               {
//                 this.props.item.response.headers !== undefined &&
//                 Object.keys(this.props.item.response.headers).map((header: any, key: any) => {
//                   return (
//                     <li key={key}>{header}: {this.props.item.response.headers[header]}</li>
//                   );
//                 })
//               } 
//             </ul> 
//           </div>
//         </div>
//         <div className="row mt-3">
//           <div className="col-md-2">
//             <h6>Status code:</h6>
//             { this.props.item.response.status }
//           </div>
//           <div className="col-md-10">
//             <h6>Body:</h6>
//             { 
//               (this.props.item.response.body === undefined || this.props.item.response.body === "") &&
//               <span>Empty body</span>
//             }
//             { 
//               (this.props.item.response.body !== undefined && this.props.item.response.body !== "") &&
//               base64.decode(this.props.item.response.body) 
//             }
//           </div>
//         </div>
//         <div className="row mt-3">
//           <div className="col-md-12">
//             <h6>Injected parameters:</h6>
//             <ul>
//               { (this.props.item.response.injected_parameters?.length === 0 || this.props.item.response.injected_parameters === undefined) && <li>No parameter to be injected.</li> }
//               {
//                 this.props.item.response.injected_parameters?.length > 0 &&
//                 this.props.item.response.injected_parameters?.map((parameter, key: any) => {
//                   return (
//                     <li key={key}>{parameter}</li>
//                   );
//                 })
//               } 
//             </ul> 
//           </div>
//         </div>
//       </div> 
//     );
//   }
}
