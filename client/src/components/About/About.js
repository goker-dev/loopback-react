import React, {PureComponent} from 'react';

class About extends PureComponent {
  render() {
    return <React.Fragment>
      <h1 className="h2">About</h1>
      <p>This is a static page and no need authentication.</p>
    </React.Fragment>;
  }
}

export default About;
