import React from "react";
// import { Button, Card } from "react-bootstrap";
// import { FaTrash } from "react-icons/fa";

interface IProps {
//   item: {
//     id: string,
//     fieldPosition: string,
//     analyzedContentType: string,
//     fieldName: string,
//     conditionType: string,
//     conditionValue: string,
//   };
//   itemKey: any;
//   removeMockCondition?: (idx: any) => void;
//   history: {
//       push(url: string): void;
//   };
}

interface IState {
}


export default class MockConditionListItem extends React.Component<IProps, IState> {
   
//     render() {
//         let condition = this.props.item;
//         return (
//             <Card key={this.props.itemKey}>
//                 <Card.Body>
//                     <div className="row">
//                         <div className="col-md-1">
//                             <span key={this.props.itemKey + 1} className="mr-1 badge badge-primary">{this.props.itemKey + 1}</span>
//                         </div>
//                         <div className="col-md-11">
//                             {condition.fieldName} {condition.conditionType} {condition.conditionValue} (in request {condition.fieldPosition})
//                             {
//                                 this.props.removeMockCondition &&
//                                 <Button className="float-md-right"	onClick={() => this.props.removeMockCondition && this.props.removeMockCondition(this.props.itemKey)}>
//                                     <FaTrash/>
//                                 </Button>
//                             }
//                         </div>
//                     </div>
//                 </Card.Body>
//             </Card>
//         );
//     }
}