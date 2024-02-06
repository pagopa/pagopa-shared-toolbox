import React from "react";
import { Form } from "react-bootstrap";
import debounce from "lodash.debounce";
import { FaFilter } from "react-icons/fa";

interface IProps {
  configuration: any;
  onFilter: (...args: any) => any;
}

interface IState {
  soapaction: string;
  tag: string;
}

export default class Filters extends React.Component<IProps, IState> {
  render(): React.ReactNode {
    return (
      <div className={"row mb-5"}>
        <div className="d-flex ml-3 align-items-center">
          <FaFilter />
        </div>
        {this.props.configuration.soapaction?.visible && (
          <div className="col-md-4 align-items-center">
            <Form.Control name="filter_soapaction" placeholder={this.props.configuration.soapaction.placeholder} onChange={(event) => {
                this.onFilter({
                  ...this.state,
                  soapaction: event.target.value,
                })
            }}
            />
          </div>
        )}

        {this.props.configuration.tag?.visible && (
          <div className="col-md-4 align-items-center">
            <Form.Control name="filter_tag" placeholder={this.props.configuration.tag.placeholder} onChange={(event) => {
                this.onFilter({
                  ...this.state,
                  tag: event.target.value,
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
