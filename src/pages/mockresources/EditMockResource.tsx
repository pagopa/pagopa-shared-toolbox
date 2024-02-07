import React from "react";

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
}

export default class EditMockResource extends React.Component<IProps, IState> {

  constructor(props: IProps) {
    super(props);
    this.state = {}
  }

  render(): React.ReactNode {
    return (
      /*
        <MockResourceView
          action="edit"
          mockResourceId={this.props.match.params.id as string}
          history={this.props.history} 
        />
        */
       <></>
    );
}
}