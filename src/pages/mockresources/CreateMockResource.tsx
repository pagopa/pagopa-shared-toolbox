import React from "react";
import MockResourceView from "./MockResourceView";

interface IProps {
  history: {
    push(url: string): void;
    goBack(): void;
  };
}
  
interface IState {
}

export default class CreateMockResource extends React.Component<IProps, IState> {

  constructor(props: IProps) {
    super(props);
    this.state = {};
  }

  render(): React.ReactNode {
    return (
        <MockResourceView
          action="create"
          history={this.props.history} 
        />
    );
  }
}