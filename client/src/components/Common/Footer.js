import React, {PureComponent} from 'react';
import {Link} from 'react-router-dom';

class Footer extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {}
    }

    render() {
        return (
            <footer id="footer" className="small">
                <div className="container py-3 border-top">
                    <div className="row">
                        <div className="col-sm-4  text-center text-sm-left text-uppercase">
                            React Loopback Playground.
                        </div>
                        <div className="col-sm-4 text-center">
                            The project under the <a href="https://opensource.org/licenses/MIT"
                                                     rel="noopener noreferrer"
                                                     target="_blank">MIT license</a>.
                        </div>
                        <div className="col-sm-4 text-center text-sm-right">
                            <ul className="nav justify-content-center justify-content-sm-end">
                                <li className="nav-item" key="about">
                                    <Link className="nav-link py-0" to="/about">About</Link>
                                </li>
                                <li className="nav-item" key="tos">
                                    <Link className="nav-link py-0" to="/tos">Terms of Service</Link>
                                </li>
                                <li className="nav-item" key="privacy">
                                    <Link className="nav-link py-0" to="/privacy">Privacy Policy</Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </footer>
        );
    }
}

export default Footer;
