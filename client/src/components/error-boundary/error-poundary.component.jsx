import React from 'react';

import './error-boundary.styles.css';

class ErrorBoundary extends React.Component {
  constructor() {
    super();

    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
    };
  }

  componentDidCatch(error, info) {
    console.log(error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className='ErrorImageOverlay'>
          <div className='ErrorImageContainer' />
          <h2 className='ErrorImageText'>Sorry this page is broken</h2>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
