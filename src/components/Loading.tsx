import * as React from "react";

function LoadingMarkup(){
    return (
        <div className="text-center">
            <div className="spinner-grow text-primary" role="status">
                <span className="sr-only">Loading...</span>
            </div>
            <div className="spinner-grow text-primary" role="status">
                <span className="sr-only">Loading...</span>
            </div>
            <div className="spinner-grow text-primary" role="status">
                <span className="sr-only">Loading...</span>
            </div>
        </div>
    )
}

const Loading = WrappedComponent => {
  return class LoadingHOC extends React.Component<any,null> {
      
    render() {
        let { isLoading } = this.props
      

      return isLoading ? (
        <LoadingMarkup />
      ) : (
        <WrappedComponent {...this.props} />
      );
    }
  };
};

export default Loading;