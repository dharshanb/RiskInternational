import { LightningElement , api} from 'lwc';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
import PROJECT_TEAM_OBJECT from '@salesforce/schema/Project_Team__c';
import PT_NAME_FIELD from '@salesforce/schema/Project_Team__c.Name';
import PT_PROJECT_FIELD from '@salesforce/schema/Project_Team__c.Project__c';
import PT_USER_FIELD from '@salesforce/schema/Project_Team__c.User__c';
import PT_CONTACT_FIELD from '@salesforce/schema/Project_Team__c.Contact__c';

export default class PopupForPojectteamRecCreate extends LightningElement {

// @api thcharimgforconpopup;
@api mypopupcontactdatalist;
// @api concountpopup;
// @api accnameforconpopup;

showModalPTRecCreate = false;
@api showPtRecCreate(){
this.showModalPTRecCreate = true;
}

handleContactClose(){
this.showModalPTRecCreate = false;
}

objectApiName = PROJECT_TEAM_OBJECT;
fields = [PT_PROJECT_FIELD,PT_USER_FIELD,PT_CONTACT_FIELD];

    handleSuccess(event){
        const toastEvent=new ShowToastEvent({
            title:"Project Team has been created successfully !",
            message: "Project Team Created ",
            variant: "success"
        });
        this.dispatchEvent(toastEvent);
    }

}