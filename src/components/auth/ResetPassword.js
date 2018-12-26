import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import { resetPassword } from "../../actions/AuthActions";

class ResetPassword extends Component {
  constructor(props) {
    super(props);
    state = {
      email:'******',
      code:'',
      password: '',
      confirm: ''
    }
  }

  componentDidMount() {
    let email = this.props.match.params.email;
    let code = this.props.match.params.code;

    this.setState({
      email, code
    })
  }

  handleFormSubmit(data) {
     this.props.registerUser(data, this.onSubmitComplete.bind(this));
  }
 
  onSubmitComplete() {
    console.log('register succeed');
    this.props.history.push("/signin");
  }

  renderHidden = ({input}) => {
    return (
          <input
              type="hidden"
              {...input}       
          />
    );
}
  

  render() {
    const { handleSubmit } = this.props;
    console.log(this.props.auth.isLoading);
    
    return (
      <form onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>

        <h1>Reset Pasword</h1>
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
            <Field
              name="code"
              component="input"
              type="hidden"
              
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

ResetPassword = reduxForm({
  form: 'resetPassword', // a unique identifier for this form,
  enableReinitialize: true,
  keepDirtyOnReinitialize: true
})(ResetPassword);

function mapStateToProp(state) {
  return {
    initialValues: state,
  };
}

ResetPassword = connect(mapStateToProp, { resetPassword })(withRouter(ResetPassword));


export default ResetPassword;