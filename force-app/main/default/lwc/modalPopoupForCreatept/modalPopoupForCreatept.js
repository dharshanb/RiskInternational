import { LightningElement , api} from 'lwc';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
import createPTRec from '@salesforce/apex/OverallStatusController.createPTRec';
import PROJECT_TEAM_OBJECT from '@salesforce/schema/Project_Team__c';
import PT_NAME_FIELD from '@salesforce/schema/Project_Team__c.Name';
import PT_PROJECT_FIELD from '@salesforce/schema/Project_Team__c.Project__c';
import PT_USER_FIELD from '@salesforce/schema/Project_Team__c.User__c';
import PT_CONTACT_FIELD from '@salesforce/schema/Project_Team__c.Contact__c';

export default class PopupForPojectteamRecCreate extends LightningElement {

@api projectidtocreatept;
@api accountidtocreatept;
@api userlist;

// objectApiName = PROJECT_TEAM_OBJECT;
// fields = [PT_USER_FIELD,PT_CONTACT_FIELD];

showModalPTRecCreate = false;

@api showPtRecCreate(){
this.showModalPTRecCreate = true;
}


get optionsUsers(){
    return this.userlist;
}


handlePtRecCreateClose(){
this.showModalPTRecCreate = false;
}

handleChangeForUser(Event) {
    this.userId = Event.detail.value;
}


handleSubmit(){
    // event.preventDefault(); // stop the form from submitting
    // const fields = event.detail.fields;
    // fields.Project__c = this.projectidtocreatept; // modify a field
    // this.template.querySelector('lightning-record-form').submit(fields);

    // console.log('this.accountidtocreatept>>'+this.accountidtocreatept);
    // console.log('this.userId>>'+this.userId);
    // console.log('this.projectidtocreatept>>'+this.projectidtocreatept);

    //SUBMIT THE RECORDS TO CREATE PROJECT TEAM STARTS
    createPTRec({
        AccountId : this.accountidtocreatept,
        UserId : this.userId,
        ProjectId : this.projectidtocreatept
    })
    .then(resust=>{
        console.log('resust>>'+resust);
        if(resust == 'success'){
            this.dispatchEvent(new ShowToastEvent({
            title: "Success",
            message: "Project Team created Successfully",
            variant: "success"
            }));
        } else{
            this.dispatchEvent(new ShowToastEvent({
            title: "error",
            message: "Project Team Creation Failed",
            variant: "error"
            }));
        }
        this.showModalPTRecCreate = false;
    })
    .catch(error=>{
        this.repError = error;
    });
    //SUBMIT THE RECORDS TO CREATE PROJECT TEAM ENDS

    this.dispatchEvent(new CustomEvent('update'));
    }

}