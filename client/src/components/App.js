import React, {PureComponent} from 'react';
import Header from './Common/Header'

class App extends PureComponent {
  render() {
    return (
      <React.Fragment>
        <Header/>
        <div className="container" style={{marginTop: '50px'}}>
          <div className="row">
            <div className="col-md-12">
              {this.props.children}
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default App;
