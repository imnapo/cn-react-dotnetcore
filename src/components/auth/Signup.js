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
    const { handleSubmit } = this.props
    return (
      <form onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
        <div>
          <label>Full Name</label>
          <div>
            <Field
              name="fullName"
              component="input"
              type="text"
              placeholder="Full Name"
            />
          </div>
        </div>
   
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
            {this.props.auth.register_error}
          </span>
        </div>
        <div>
          <button type="submit">
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