import { LightningElement , api} from 'lwc';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
import PROJECT_TEAM_OBJECT from '@salesforce/schema/Project_Team__c';
import PT_NAME_FIELD from '@salesforce/schema/Project_Team__c.Name';
import PT_PROJECT_FIELD from '@salesforce/schema/Project_Team__c.Project__c';
import PT_USER_FIELD from '@salesforce/schema/Project_Team__c.User__c';
import PT_CONTACT_FIELD from '@salesforce/schema/Project_Team__c.Contact__c';

export default class PopupForPojectteamRecCreate extends LightningElement {

@api projectidtocreatept;

showModalPTRecCreate = false;
@api showPtRecCreate(){
this.showModalPTRecCreate = true;
}

handlePtRecCreateClose(){
this.showModalPTRecCreate = false;
this.dispatchEvent(new CustomEvent('update'));
}

objectApiName = PROJECT_TEAM_OBJECT;
fields = [PT_USER_FIELD,PT_CONTACT_FIELD];

handleSubmit(event){
    event.preventDefault(); // stop the form from submitting
    const fields = event.detail.fields;
    fields.Project__c = this.projectidtocreatept; // modify a field
    this.template.querySelector('lightning-record-form').submit(fields);

    const toastEvent=new ShowToastEvent({
        title:"Project Team has been created successfully !",
        message: "Project Team Created ",
        variant: "success"
    });
    this.dispatchEvent(toastEvent);
}

}