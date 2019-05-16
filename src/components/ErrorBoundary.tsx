import * as React from 'react';
import {IErrorState} from '../InterfacePool'

class ErrorBoundary extends React.Component<any,IErrorState> {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    componentDidCatch(error, info) {
        // Display fallback UI
        this.setState({ hasError: true, error })
    }

    render() {
        let {hasError, error} = this.state

        if (hasError) {
            // You can render any custom fallback UI
            return (
                <div>
                    <h1>Something went wrong.</h1>
                    <h2>{error}</h2>
                </div>
            )
        }

        return this.props.children;
    }
}

export default ErrorBoundary
