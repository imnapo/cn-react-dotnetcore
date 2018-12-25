import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import { loginUser } from "../../actions/AuthActions";

class Signin extends Component {
  constructor(props) {
    super(props);
  }

  async handleFormSubmit(data) {
    await this.props.loginUser(data, this.onSigninComplete.bind(this));
 }

 onSigninComplete() {
   console.log('sign-in succeed');
   this.props.history.push("/");
 }


  render() {
    const { handleSubmit } = this.props
    return (
      <form onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
        <h1>Sign in</h1>
        <br/>
        <div>
          <label>email</label>
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
          <label>Password</label>
          <div>
            <Field
              name="password"
              component="input"
              type="password"
              placeholder="Password"
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
            Signin
          </button>
        </div>
      </form>
    )
  }
}

Signin = reduxForm({
  form: 'Signin' // a unique identifier for this form
})(Signin);

function mapStateToProp(state) {
  return {
    auth: state.auth
  };
}

Signin = connect(mapStateToProp, { loginUser })(withRouter(Signin));


export default Signin;