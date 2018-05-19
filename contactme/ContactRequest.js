module.exports = class ContactRequest {
    constructor(replyTo, subject, message) {
        this.replyTo = replyTo;
        this.subject = subject;
        this.message = message;
    }

    static fromString(json) {
        const jsValue = JSON.parse(json);
        if(jsValue.replyTo && jsValue.subject && jsValue.message) {
            return Object.assign(new ContactRequest, JSON.parse(json));
        } else {
            throw new Error('Invalid JSON');
        }
    }
};