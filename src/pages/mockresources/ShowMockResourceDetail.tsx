import React from "react";
import MockResourceView from "./MockResourceView";

interface IProps {
    match: {
        params: Record<string, unknown>;
    };
    history: {
      push(url: string): void;
      goBack(): void;
    };
  }
  
  interface IState {}

export default class ShowMockResourceDetail extends React.Component<IProps, IState> {

  constructor(props: IProps) {
    super(props);
    this.state = {};
  }

  render(): React.ReactNode {
    return (
        <MockResourceView
          action="show"
          mockResourceId={this.props.match.params.id as string}
          history={this.props.history} 
        />
    );
  }
}