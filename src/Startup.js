import React, { Component } from 'react';
import { connect } from 'react-redux';
import { loadThings } from './actions/AuthActions';
import { withRouter } from "react-router-dom";

function mapStateToProps(state) {
    return {
        
    };
}

class Startup extends Component {

    componentDidMount() {        
        this.props.loadThings();
    }

    render() {
    
        return (
            <div>
                {this.props.children}
            </div>
        );
    }
}

export default withRouter(connect(
    mapStateToProps, {loadThings}
)(Startup));