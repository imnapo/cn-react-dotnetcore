import React, { Component } from 'react';
import { connect } from 'react-redux';

import PropTypes from 'prop-types';
import { withRouter } from "react-router-dom";

export default function(ComposedComponent) {
  class Authentication extends Component {
    static contextTypes = {
      router: PropTypes.object
    }

    componentWillMount() {
      const {isLogin} = this.props.auth;

      
      if (isLogin != null && !isLogin) {
        this.props.history.push('/signin');
      }
    }

    componentWillReceiveProps(nextProps) {

      if (nextProps.auth.isLogin === false) {

        this.props.history.push('/signin');

      }
    }

    render() {
      const {isLogin} = this.props.auth;
      return isLogin != null ? (<ComposedComponent {...this.props} />)
      : (<div style={{
        display: 'flex',
        flex: 1,
        height: '100%',
        flexDirection:'column',
        alignItems:'center',
        justifyContent:'center'
      }}>
      
      <h3 style={{color:'rgba(0, 0, 0, 0.54)', marginTop:20}}>Authorizing...</h3>
 
      </div>)
    }
  }

  function mapStateToProps(state) {
    return { auth: state.auth };
  }

  return withRouter(connect(mapStateToProps)(Authentication));
}