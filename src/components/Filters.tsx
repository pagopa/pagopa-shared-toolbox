import React from "react";
import { Form } from "react-bootstrap";
import debounce from "lodash.debounce";
import { FaFilter } from "react-icons/fa";

interface IProps {
  configuration: any;
  // eslint-disable-next-line @typescript-eslint/ban-types
  onFilter: (...args: any) => any;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IState {
  type: string;
  resource: string;
}

export default class Filters extends React.Component<IProps, IState> {
  render(): React.ReactNode {
    return (
      <div className={"row mb-5"}>
        <div className="d-flex ml-3 align-items-center">
          <FaFilter />
        </div>
        {this.props.configuration.type?.visible && (
          <div className="col-md-4 align-items-center">
            <Form.Control name="filter_type" placeholder={this.props.configuration.type.placeholder} onChange={(event) => {
                this.onFilter({
                  ...this.state,
                  type: event.target.value,
                })
            }}
            />
          </div>
        )}

        {this.props.configuration.resource?.visible && (
          <div className="col-md-4 align-items-center">
            <Form.Control name="filter_resource" placeholder={this.props.configuration.resource.placeholder} onChange={(event) => {
                this.onFilter({
                  ...this.state,
                  resource: event.target.value,
                })
              }}
            />
          </div>
        )}
      </div>
    );
  }

  private onFilter = debounce((filter) => {
    this.setState(filter);
    this.props.onFilter(filter);
  }, 500);
}
