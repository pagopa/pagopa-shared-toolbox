import React from "react";

interface IProps {
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IState {}

export default class Topbar extends React.Component<IProps, IState> {
  render() {
    return (
      <nav className="navbar navbar-light sticky-top bg-white flex-md-nowrap p-0 shadow">
        
        <button
          className="navbar-toggler position-absolute d-md-none collapsed"
          type="button"
          data-toggle="collapse"
          data-target="#sidebarMenu"
          aria-controls="sidebarMenu"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
      </nav>
    );
  }
}
