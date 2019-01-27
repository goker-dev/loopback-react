import React, {Component} from 'react';

class Features extends Component {
    render() {
        return <section id="features">
            <div className="container">
                <h1 className="h3">Features</h1>

                <table className="table table-bordered">
                    <tr>
                        <th width="50%">Feature</th>
                        <th className="text-center" width="25%">DONE</th>
                        <th className="text-center" width="25%">IN PROGRESS</th>
                    </tr>
                    <tr>
                        <td>Backend</td>
                        <td className="text-center"><i className="fas fa-check"/></td>
                        <td className="text-center"></td>
                    </tr>
                </table>
            </div>
        </section>;
    }
}

export default Features;
