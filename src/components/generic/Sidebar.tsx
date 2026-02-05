import React from "react";
import {Link} from "react-router-dom";
import SidebarItems from "./SidebarItems";
// eslint-disable-next-line 
// @ts-ignore
import packageJson from "../../../package.json";
import { ENV as env } from "../../util/env";
import { Accordion } from "react-bootstrap";
import menuItems from '../../config/menu-items.json';
import { FaCompress, FaExpand, FaHome, FaExternalLinkAlt } from "react-icons/fa";

interface IProps {
    history: {
        location: {
            pathname: string;
        };
        push(url: string): void;
    };
}

interface IState {
    domains: {
        mocker: boolean;
        authorizer: boolean;
    };
}



export default class Sidebar extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            domains: {
                mocker: true,
                authorizer: false
            }
        };
    }

    componentDidMount(): void {

        // workaround for react according gap
        SidebarItems.forEach(item => {
            if (this.props.history.location.pathname.split("/")[1] === item.route.substring(1)) {
                const headings: Array<Element> = Array.from(document.getElementsByClassName("navbar-heading"));
                headings.forEach((heading: Element) => {
                    const textContent = heading.textContent;
                    if (textContent !== null && textContent.toLowerCase().indexOf(item.domain) !== -1) {
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

    handleAccordion(activeIndex: any) {
        // workaround for react according gap
        const listGroupList: Array<Element> = Array.from(document.getElementsByClassName("list-group"));
        listGroupList.forEach((listGroup: Element, index: number) => {
            if (activeIndex !== index) {
                const collapse = listGroup.closest(".collapse");
                if (collapse !== null) {
                    collapse.classList.remove("show");
                }
            }
        });
    }

    setDomainState(domain: string) {
        Object.keys(this.state.domains).forEach((key: string) => {
            const domains: any = this.state.domains;
            domains[key] = key === domain;
            this.setState({domains});
        });
    }


    render(): React.ReactNode {
        const location = this.props.history.location;

        const domains: any = this.state.domains;

        function getClass(route: any) {
            return getPath(location.pathname).split("/")[1] === route.substring(1) && getPath(location.pathname).includes(getPath(route)) ? "active" : "";
        }

        function getPath(path: string) {
            return path.charAt(0) !== "/" ? "/" + path : path;
        }

        function getCompressionClass(domain: string, expand: boolean) {
            return domains[domain] === expand ? "d-inline" : "d-none";
        }

        return (
            <>
                <Link to={"/"} key={"home"} className={`list-group-item-action `}>
                    <div className="ml-1">
                        <FaHome></FaHome> <span className="ml-1">Home</span>
                    </div>
                </Link>
                <Accordion onSelect={(activeIndex) => this.handleAccordion(activeIndex)}>
                    {
                        env.FEATURES.MOCKER &&
                        <span>
                            <Accordion.Item eventKey="0">
                                <Accordion.Header>
                                    <span className="navbar-heading" onClick={() => this.setDomainState("mocker")}>
                                        <FaExpand className={`ml-2 mr-2 ${getCompressionClass("mocker", true)}`}/>
                                        <FaCompress className={`ml-2 mr-2 ${getCompressionClass("mocker", false)}`}/>
                                        Mocker
                                    </span>
                                </Accordion.Header>
                                <Accordion.Body>
                                    <div className="list-group">     
                                        {
                                            env.FEATURES.MOCKER_ARCHETYPES &&                       
                                            <Link to={"/mocker/archetypes"} key={"Archetypes and schema"} className={`list-group-item-action ${getClass("/mocker/archetypes")}`}>
                                                <span>{"Archetypes and schema"}</span>
                                            </Link>
                                        }
                                        <Link to={"/mocker/mock-resources"} key={"Resources"} className={`list-group-item-action ${getClass("/mocker/mock-resources")}`}>
                                            <span>{"Resources"}</span>
                                        </Link>
                                        {
                                            env.FEATURES.MOCKER_SIMULATOR &&  
                                            <Link to={"/mocker/simulation"} key={"Simulation"} className={`list-group-item-action ${getClass("/mocker/simulation")}`}>
                                                <span>{"Simulation"}</span>
                                            </Link>
                                        }
                                    </div>
                                </Accordion.Body>
                            </Accordion.Item>
                        </span>
                    }
                    {
                        env.FEATURES.AUTHORIZER &&
                        <span>
                            <Accordion.Item eventKey="1">
                                <Accordion.Header>
                                    <span className="navbar-heading" onClick={() => this.setDomainState("authorizer")}>
                                        <FaExpand className={`ml-2 mr-2 ${getCompressionClass("authorizer", true)}`}/>
                                        <FaCompress className={`ml-2 mr-2 ${getCompressionClass("authorizer", false)}`}/>
                                        Authorizer
                                    </span>
                                </Accordion.Header>
                                <Accordion.Body>
                                    <div className="list-group">   
                                        <Link to={"/authorizer/operation"} key={"Operations"} className={`list-group-item-action ${getClass("/authorizer/operation")}`}>
                                            <span>{"Operations"}</span>
                                        </Link>
                                    </div>
                                </Accordion.Body>
                            </Accordion.Item>
                        </span>
                    }
                </Accordion>
                {(menuItems as any)?.length > 0 && (
                    <div className="external-links mt-3">
                        <div className="list-group">
                            {(menuItems as any).map((item: any) => (
                                <a
                                    key={item.id}
                                    href={item.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`list-group-item-action`}
                                    title={item.description}
                                    aria-label={item.description}
                                >
                                    <FaExternalLinkAlt /><span>{item.title}</span>
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
