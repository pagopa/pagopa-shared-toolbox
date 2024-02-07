import React from "react";

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
        /*<MockResourceView
          action="create"
          history={this.props.history} 
        />*/
        <></>
    );
  }
}