import * as React from 'react';
import {IErrorState} from '../InterfacePool'

class ErrorBoundary extends React.Component<any,IErrorState> {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    componentDidCatch(error, info) {
        // Display fallback UI
        this.setState({ hasError: true, error:error.message })
    }

    render() {

        let {hasError, error} = this.state

        if (hasError) {
            // You can render any custom fallback UI
            return (
                <div className="alert alert-danger" role="alert">
                    <h4 className="alert-heading">Something went wrong!</h4>
                    <p>{error}</p>
                    <hr />
                    <p className="mb-0">Kindly refresh the page and try again</p>
                </div>
            )
        }

        return this.props.children;
    }
}

export default ErrorBoundary
