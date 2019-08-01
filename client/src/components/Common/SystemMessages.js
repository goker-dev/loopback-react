import React from 'react';
import {connect} from 'react-redux'

class SystemMessages extends React.Component {
    destroyer = false;

    constructor(props) {
        super(props);
        this.state = {
            messages: []
        }
    }

    onClick = (index) => {
        let messages = this.state.messages;
        messages.splice(index, 1);
        if (!messages.length) {
            clearTimeout(this.destroyer);
            this.destroyer = false;
        }
        this.setState({
            messages: messages
        });
    };

    delayedRemove = () => {
        if (!this.destroyer)
            this.destroyer = setTimeout(() => {
                let messages = this.state.messages;
                messages.pop();
                this.setState({
                    messages: messages
                });
                clearTimeout(this.destroyer);
                this.destroyer = false;
                if (messages.length)
                    this.delayedRemove();
            }, 4000)
    };

    componentWillReceiveProps = (props) => {
        const error = props.system && props.system.error && props.system.error.data && props.system.error.data.error;
        const success = props.system && props.system.message;
        if (error || success) {
            let messages = this.state.messages || [];
            const message = error ? {type: 'error', ...error} : {type: 'success', ...success};
            messages.push(message);
            this.setState({
                messages: messages
            });
        }
    };

    render() {
        return (
            <div id="systemMessages">{
                this.state.messages.map((message, key) => {
                    const className = message.type === 'error' ? 'alert-danger' : 'alert-success';
                    return <div key={key}
                                className={"system-messages col-sm-12 col-md-6 col-lg-5 mx-auto alert alert-dismissible show "
                                + className}>
                        <i className="fa fa-exclamation-triangle mr-2"/>
                        <strong>{message.name}:</strong> {message.message}
                        <button type="button" className="close" data-dismiss="alert" aria-label="Close"
                                onClick={() => {
                                    this.onClick(key)
                                }}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                        {this.delayedRemove(key)}
                    </div>
                })}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {system: state.system}
};

export default connect(mapStateToProps, null)(SystemMessages);
