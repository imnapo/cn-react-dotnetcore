import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import { forgotPassword } from "../../actions/AuthActions";

class ForgetPassword extends Component {
  constructor(props) {
    super(props);
  }

  async handleFormSubmit(data) {
    this.props.forgotPassword(data.email, ()=> {
        
      alert('forgot password sent successfully. you will receive an notification for reset your password.')
  });
 }


 onBackToLoginClicked = () => {
  this.props.history.push("/signin");
 }


  render() {
    const { handleSubmit } = this.props
    return (
      <form onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
        <h1>Forgot your password?</h1>
        <br/>
        <div>
          <label>Email</label>
          <div>
            <Field
              name="email"
              component="input"
              type="email"
              placeholder="Email"
            />
          </div>
        </div>
       
        <div>
          <span style={{color: 'red'}}>
            {this.props.auth.login_error}
          </span>
        </div>
        <div>
          <button type="submit">
            Send
          </button>
          <button type="button" onClick={this.onBackToLoginClicked}>
            Back to Login
          </button>
        </div>
      </form>
    )
  }
}

ForgetPassword = reduxForm({
  form: 'ForgetPassword' // a unique identifier for this form
})(ForgetPassword);

function mapStateToProp(state) {
  return {
    auth: state.auth
  };
}

ForgetPassword = connect(mapStateToProp, { forgotPassword })(withRouter(ForgetPassword));


export default ForgetPassword;