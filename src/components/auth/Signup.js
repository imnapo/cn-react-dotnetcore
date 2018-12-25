import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import { registerUser } from "../../actions/AuthActions";

class Signup extends Component {
  constructor(props) {
    super(props);
    
  }


  handleFormSubmit(data) {
     this.props.registerUser(data, this.onSubmitComplete.bind(this));
  }
 
  onSubmitComplete() {
    console.log('register succeed');
    this.props.history.push("/signin");
  }
  

  render() {
    const { handleSubmit } = this.props;
    console.log(this.props.auth.isLoading);
    
    return (
      <form onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>

        <h1>Sign up</h1>
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
          <label>Confirm Password</label>
          <div>
            <Field
              name="confirmPassword"
              component="input"
              type="password"
              placeholder="Confirm Password"
            />
          </div>
        </div>
        <div>
          <span style={{color: 'red'}}>
            {this.props.auth.register_error}
          </span>
        </div>
        <div>
          <button type="submit" disabled={this.props.auth.isLoading ? 'disabled' : ''}>
            Signup
          </button>
        </div>
      </form>
    )
  }
}

Signup = reduxForm({
  form: 'signup' // a unique identifier for this form
})(Signup);

function mapStateToProp(state) {
  return {
    auth: state.auth
  };
}

Signup = connect(mapStateToProp, { registerUser })(withRouter(Signup));


export default Signup;