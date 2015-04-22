import React, { PropTypes } from "react";

class ErrorPage extends React.Component {

  static propTypes = {
    err: PropTypes.object
  }

  render() {
    const { err } = this.props;
    return (
      <div>
        <h1>Error displaying this page</h1>

        { process.env.NODE_ENV === "development" && err &&
          <pre>
            { err.message }
            { err.stack}
          </pre>
        }

      </div>
    );
  }

}

export default ErrorPage;
