import React, {Component} from 'react';

class NoMatch extends Component {
    render() {
        return <React.Fragment>
            <section className="container d-flex flex-row flex-grow-1 align-items-center justify-content-center">
                <h1>404 Not Found</h1>
            </section>
        </React.Fragment>;
    }
}

export default NoMatch;
