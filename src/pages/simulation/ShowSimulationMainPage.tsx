import React from "react";
import { Container, Row } from "react-bootstrap";
import { toast } from "react-toastify";

interface IProps {
    history: {
      push(url: string): void;
    };
  }
  
  interface IState {
    isContentLoading: boolean;
    
  }

export default class ShowSimulationMainPage extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            isContentLoading: false
        }
    }

    toastError(message: string) {
        toast.error(() => <div className={"toast-width"}>{message}</div>, {
          theme: "colored",
        });
      }

      componentDidMount(): void {
      }
    
      render(): React.ReactNode {
        return (
            <Container>
                <Row>
                    <h1>Simulation</h1>
                </Row>
            </Container>
        );
      }
}