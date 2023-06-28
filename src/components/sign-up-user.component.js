import React, { Component } from 'react';

export default class SignUpUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
          email: '',
          password: '',
          confirmPassword: '',
          error: ''
        };
      }
    
      handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
      }
    
      handleSubmit = (e) => {
        e.preventDefault();
    
        const { email, password, confirmPassword } = this.state;
    
        // Perform validation here (e.g., check for valid email format, password strength)
    
        // Reset error message
        this.setState({ error: '' });
    
        // Make API call to sign up user
        // Replace the following code with your actual sign up logic
        if (password === confirmPassword) {
          // Successful sign up
          console.log('User signed up:', email, password);
        } else {
          // Passwords don't match
          this.setState({ error: 'Passwords do not match.' });
        }
      }
}
