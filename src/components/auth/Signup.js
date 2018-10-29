import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';

class Signup extends Component {
  constructor(props) {
    super(props);
    
  }


  handleFormSubmit(data) {
      console.log(data);
      
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
          <button type="submit">
            Signup
          </button>
        </div>
      </form>
    )
  }
}

export default reduxForm({
  form: 'signup' // a unique identifier for this form
})(Signup);