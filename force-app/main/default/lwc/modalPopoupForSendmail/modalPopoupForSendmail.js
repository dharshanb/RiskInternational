import { LightningElement , api} from 'lwc';
import sendEmailController from "@salesforce/apex/OverallStatusController.sendEmailController";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
export default class ModalPopoupForSendmail extends LightningElement {

@api toaddress;
// @api fromaddress;
// fromAddress = [];
toAddress = [];
ccAddress = [];
subject = "";
body = "";
files = [];

wantToUploadFile = false;
noEmailError = false;
invalidEmails = false;

showModalMail = false;

@api showSendEmail(){
this.showModalMail = true;
}

handleSendMailClose(){
this.showModalMail = false;
}


toggleFileUpload() {
    this.wantToUploadFile = !this.wantToUploadFile;
}

handleUploadFinished(event) {
    const uploadedFiles = event.detail.files;
    this.files = [...this.files, ...uploadedFiles];
    this.wantToUploadFile = false;
}

handleRemove(event) {
    const index = event.target.dataset.index;
    this.files.splice(index, 1);
}

handleFromAddressChange(event) {
    this.fromAddress = event.detail.selectedValues;
}

handleToAddressChange(event) {
    this.toAddress = event.detail.selectedValues;
}

handleCcAddressChange(event) {
    this.ccAddress = event.detail.selectedValues;
}

handleSubjectChange(event) {
    this.subject = event.target.value;
}

handleBodyChange(event) {
    this.body = event.target.value;
}

validateEmails(emailAddressList) {
    let areEmailsValid;
    if(emailAddressList.length > 1) {
        areEmailsValid = emailAddressList.reduce((accumulator, next) => {
            const isValid = this.validateEmail(next);
            return accumulator && isValid;
        });
    }
    else if(emailAddressList.length > 0) {
        areEmailsValid = this.validateEmail(emailAddressList[0]);
    }
    return areEmailsValid;
}

validateEmail(email) {
    console.log("In VE");
    const res = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()s[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    console.log("res", res);
    return res.test(String(email).toLowerCase());
}

handleReset() {
    // this.toAddress = [];
    this.ccAddress = [];
    this.subject = "";
    this.body = "";
    this.files = [];
    this.template.querySelectorAll("c-email-input").forEach((input) => input.reset());
}

handleSendEmail() {
    // this.noEmailError = false;
    // this.invalidEmails = false;
    // if (![...this.toAddress, ...this.ccAddress].length > 0) {
    //     this.noEmailError = true;
    //     return;
    // }

    // if (!this.validateEmails([...this.toAddress, ...this.ccAddress])) {
    //     this.invalidEmails = true;
    //     return;
    // }

    this.toAddress.push(this.toaddress);

    let emailDetails = {
        toAddress: this.toAddress,
        ccAddress: this.ccAddress,
        subject: this.subject,
        body: this.body
    };

    sendEmailController({ emailDetailStr: JSON.stringify(emailDetails) })
        .then(() => {
            this.dispatchEvent(new ShowToastEvent({
                    title: "Success!",
                    message: "Email Sent Successfully.",
                    variant: "success"
                })
                );
                this.showModalMail = false;
        })
        .catch((error) => {
            console.error("Error in sendEmailController:", error);
        });
}

}