import React from "react";
import { Link } from "react-router-dom";
// eslint-disable-next-line
// @ts-ignore
import { Accordion } from "react-bootstrap";
import { FaCompress, FaExpand, FaHome } from "react-icons/fa";
import packageJson from "../../../package.json";
import { ENV as env } from "../../util/env";
import menuItems from "../../config/menu-items.json";
import SidebarItems from "./SidebarItems";

interface IProps {
  readonly history: {
    readonly location: {
      readonly pathname: string;
    };
    readonly push: (url: string) => void;
  };
}

interface IState {
  readonly domains: {
    readonly authorizer: boolean;
    readonly mocker: boolean;
  };
}

interface MenuItem {
  readonly id: number;
  readonly title: string;
  readonly description: string;
  readonly href: string;
}

export default class Sidebar extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      domains: {
        authorizer: false,
        mocker: true,
      },
    };
  }

  componentDidMount(): void {
    // workaround for react according gap
    SidebarItems.forEach((item) => {
      if (
        this.props.history.location.pathname.split("/")[1] ===
        item.route.substring(1)
      ) {
        const headings: ReadonlyArray<Element> = Array.from(
          document.getElementsByClassName("navbar-heading")
        );
        headings.forEach((heading: Element) => {
          const textContent = heading.textContent;
          if (
            textContent !== null &&
            textContent.toLowerCase().indexOf(item.domain) !== -1
          ) {
            const parent = heading.parentElement;
            if (parent !== null) {
              const sibling = parent.nextElementSibling;
              if (sibling !== null) {
                sibling.classList.add("show");
                this.setDomainState(item.domain);
              }
            }
          }
        });
      }
    });
  }

  // accept any event key from Accordion (could be string | number | null)
  private handleAccordion(activeIndex: any): void {
    // workaround for react according gap
    const listGroupList: ReadonlyArray<Element> = Array.from(
      document.getElementsByClassName("list-group")
    );
    listGroupList.forEach((listGroup: Element, index: number) => {
      if (String(activeIndex) !== index.toString()) {
        const collapse = listGroup.closest(".collapse");
        if (collapse !== null) {
          collapse.classList.remove("show");
        }
      }
    });
  }

  private setDomainState(domain: string): void {
    const domains = { ...this.state.domains };
    const newDomains = Object.keys(domains).reduce(
      (acc, key) => ({
        ...acc,
        [key]: key === domain,
      }),
      {} as typeof domains
    );
    this.setState({ domains: newDomains });
  }

  public render(): React.ReactNode {
    const location = this.props.history.location;

    const domains = this.state.domains;

    const getPath = (path: string): string =>
      path.charAt(0) !== "/" ? "/" + path : path;

    const getClass = (route: string): string =>
      getPath(location.pathname).split("/")[1] === route.substring(1) &&
      getPath(location.pathname).includes(getPath(route))
        ? "active"
        : "";

    const getCompressionClass = (domain: string, expand: boolean): string =>
      domains[domain as keyof typeof domains] === expand
        ? "d-inline"
        : "d-none";

    return (
      <>
        <Link to={"/"} key={"home"} className={`list-group-item-action `}>
          <div className="ml-1">
            <FaHome></FaHome> <span className="ml-1">Home</span>
          </div>
        </Link>
        <Accordion
          onSelect={(activeIndex): void => this.handleAccordion(activeIndex)}
        >
          {env.FEATURES.MOCKER && (
            <span>
              <Accordion.Item eventKey="0">
                <Accordion.Header>
                  <span
                    className="navbar-heading"
                    onClick={(): void => this.setDomainState("mocker")}
                  >
                    <FaExpand
                      className={`ml-2 mr-2 ${getCompressionClass(
                        "mocker",
                        true
                      )}`}
                    />
                    <FaCompress
                      className={`ml-2 mr-2 ${getCompressionClass(
                        "mocker",
                        false
                      )}`}
                    />
                    Mocker
                  </span>
                </Accordion.Header>
                <Accordion.Body>
                  <div className="list-group">
                    {env.FEATURES.MOCKER_ARCHETYPES && (
                      <Link
                        to={"/mocker/archetypes"}
                        key={"Archetypes and schema"}
                        className={`list-group-item-action ${getClass(
                          "/mocker/archetypes"
                        )}`}
                      >
                        <span>{"Archetypes and schema"}</span>
                      </Link>
                    )}
                    <Link
                      to={"/mocker/mock-resources"}
                      key={"Resources"}
                      className={`list-group-item-action ${getClass(
                        "/mocker/mock-resources"
                      )}`}
                    >
                      <span>{"Resources"}</span>
                    </Link>
                    {env.FEATURES.MOCKER_SIMULATOR && (
                      <Link
                        to={"/mocker/simulation"}
                        key={"Simulation"}
                        className={`list-group-item-action ${getClass(
                          "/mocker/simulation"
                        )}`}
                      >
                        <span>{"Simulation"}</span>
                      </Link>
                    )}
                  </div>
                </Accordion.Body>
              </Accordion.Item>
            </span>
          )}
          {env.FEATURES.AUTHORIZER && (
            <span>
              <Accordion.Item eventKey="1">
                <Accordion.Header>
                  <span
                    className="navbar-heading"
                    onClick={(): void => this.setDomainState("authorizer")}
                  >
                    <FaExpand
                      className={`ml-2 mr-2 ${getCompressionClass(
                        "authorizer",
                        true
                      )}`}
                    />
                    <FaCompress
                      className={`ml-2 mr-2 ${getCompressionClass(
                        "authorizer",
                        false
                      )}`}
                    />
                    Authorizer
                  </span>
                </Accordion.Header>
                <Accordion.Body>
                  <div className="list-group">
                    <Link
                      to={"/authorizer/operation"}
                      key={"Operations"}
                      className={`list-group-item-action ${getClass(
                        "/authorizer/operation"
                      )}`}
                    >
                      <span>{"Operations"}</span>
                    </Link>
                  </div>
                </Accordion.Body>
              </Accordion.Item>
            </span>
          )}
        </Accordion>
        {(menuItems as ReadonlyArray<MenuItem>)?.length > 0 && (
          <div className="external-links mt-3">
            <div className="list-group">
              {(menuItems as ReadonlyArray<MenuItem>).map((item: MenuItem) => (
                <a
                  key={item.id}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`list-group-item-action`}
                >
                  <span>{item.title}</span>
                </a>
              ))}
            </div>
          </div>
        )}
        <div className={"info-box"}>
          <div>Portal version: {packageJson.version} </div>
          Made with ❤️ by PagoPA S.p.A.
        </div>
      </>
    );
  }
}
