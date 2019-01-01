import React, {Component} from 'react';

import './Welcome.css';

class Welcome extends Component {
    render() {
        return <React.Fragment>
            <header className="intro">
                <div className="container">
                    <div className="intro-text">
                        <h2 className="intro-lead-in">Welcome,</h2>
                        <h1 className="intro-heading text-uppercase">The React - Loopback <span
                            className="highlight">Playground</span></h1>
                        <a className="btn btn-primary btn-xl text-uppercase js-scroll-trigger" href="#about">Tell Me
                            More</a>
                    </div>
                </div>
            </header>
            <section id="about" className="container">
                <div className="row justify-content-center">
                    <div className="col-md-4">
                    </div>
                    <div className="col-md-8">
                        <h2 className="section-heading">ABOUT</h2>
                        <h3 className="section-subheading text-muted">This is a default static page and no need
                            authentication.</h3>
                        <p>Hi, I'm Goker and I'm developing the project for experience a full-stack React application
                            with LoopBack - Node.js framework. If you want to contribute you can reach me freely via <a
                                href="https://goker.me"
                                rel="noopener noreferrer"
                                target="_blank">goker.me</a></p>
                    </div>
                </div>
            </section>
        </React.Fragment>;
    }
}

export default Welcome;
