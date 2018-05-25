import React, {Component} from 'react';
import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://api.mattfowler.io',
    timeout: 5000
});

class Contact extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            emailValid: true,
            subject: '',
            subjectValid: true,
            message: '',
            messageValid: true,
            loading: false,
            showSuccess: false,
            showFailure: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.emailSuccessHandler = this.emailSuccessHandler.bind(this);
        this.emailFailureHandler = this.emailFailureHandler.bind(this);
    }

    validateEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    handleChange(event) {
        this.setState({[event.target.name]: event.target.value});
    }

    emailSuccessHandler(response) {
        this.setState({loading: false, showSuccess: true});
    }

    emailFailureHandler(error) {
        this.setState({loading: false, showFailure: true});
    }

    handleSubmit(event) {
        event.preventDefault();
        const emailValid = this.validateEmail(this.state.email);
        const subjectValid = this.state.subject.trim() !== '';
        const messageValid = this.state.message.trim() !== '';
        this.setState({emailValid: emailValid, subjectValid: subjectValid, messageValid: messageValid});

        if (emailValid && subjectValid && messageValid) {
            this.setState({loading: true});
            instance.post('/contactme', {
                replyTo: this.state.email,
                subject: this.state.subject,
                message: this.state.message
            }).then(this.emailSuccessHandler)
                .catch(this.emailFailureHandler);
        }
    }

    render() {
        return (
            <div className="container">
                {this.state.loading &&
                <div className="loading">
                    <i className="fas fa-spinner fa-spin fa-5x"/>
                </div>}
                {!this.state.showSuccess && !this.state.showFailure &&
                <form onSubmit={this.handleSubmit}>
                    <label>Your Email</label>
                    {!this.state.emailValid && <span className="error">Please enter a valid email.</span>}
                    <input type="text" id="email" name="email" placeholder="Your email" value={this.state.email}
                           onChange={this.handleChange}/>

                    <label>Subject</label>
                    {!this.state.subjectValid && <span className="error">Please enter a subject.</span>}
                    <input type="text" id="subject" name="subject" placeholder="Subject" value={this.state.subject}
                           onChange={this.handleChange}/>

                    <label>Message</label>
                    {!this.state.messageValid && <span className="error">Please enter a message.</span>}
                    <textarea id="message" name="message" placeholder="What can we help you with?"
                              value={this.state.message} onChange={this.handleChange}/>

                    <div className="centered">
                        <input type="submit" value="Submit"/>
                    </div>
                </form>}
                {this.state.showSuccess && <p>Thanks! We'll be in touch.</p>}
                {this.state.showFailure && <p>An error occurred sending your message.  Please try again later.</p>}
            </div>
        );
    }
}

export default Contact;
