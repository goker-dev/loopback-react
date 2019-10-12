import React from 'react';

class ToggleButton extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            textActive: props.textActive,
            textPassive: props.textPassive,
            classActive: props.classActive || 'btn btn-default text-primary',
            classPassive: props.classPassive || 'btn btn-default',
            iconActive: props.iconActive || 'fa fa-check',
            iconPassive: props.iconPassive || 'fa fa-times',
            iconLoading: props.iconLoading || 'fa fa-circle-notch fa-spin',
            status: props.status,
            loading: props.loading
        }
    }

    onClick = (e) => {
        e.preventDefault();
        this.setState({
            loading: true
        });
        this.props.toggleFunction()
            // .then(response => {
            //     console.log('toggleFunction', this.state.textActive);
            //     // this.setState({
            //     //     status: typeof response === 'boolean' ? response : this.state.status,
            //     //     loading: false
            //     // });
            // })
    };

    componentDidUpdate = (props) => {
        this.setState({
            status: props.status,
            loading: false
        });
    };

    render() {
        //console.log('status', this.state.status, this.props.toggleFunction);
        const text = this.state.status ? this.state.textActive : this.state.textPassive;
        const className = this.state.status ? this.state.classActive : this.state.classPassive;
        const icon = this.state.loading ? this.state.iconLoading
            : this.state.status ? this.state.iconActive : this.state.iconPassive;
        return (
            <button style={{...this.props.style}}
                    ref={this.props.forwardref ? this.props.forwardref : null}
                    className={className + ' ' + this.props.className} onClick={this.onClick}>
                <i className={icon}/> {text}
            </button>
        );
    }
}


export default React.forwardRef((props, ref) =>
    (
        <ToggleButton {...props} forwardref={ref}/>
    )
)

