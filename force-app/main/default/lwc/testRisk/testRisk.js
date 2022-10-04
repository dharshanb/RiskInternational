import { LightningElement , wire , track} from 'lwc';
import getMapData from '@salesforce/apex/OverallStatusController.getMapData';
//import getProjectList from "@salesforce/apex/OverallStatusController.getProjectList";
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
import PROJECT_TEAM_OBJECT from '@salesforce/schema/Project_Team__c';
import PT_NAME_FIELD from '@salesforce/schema/Project_Team__c.Name';
import PT_PROJECT_FIELD from '@salesforce/schema/Project_Team__c.Project__c';
import PT_USER_FIELD from '@salesforce/schema/Project_Team__c.User__c';
import PT_CONTACT_FIELD from '@salesforce/schema/Project_Team__c.Contact__c';

export default class TestingOverallStatus extends LightningElement {
    objectApiName = PROJECT_TEAM_OBJECT;
    fields = [PT_NAME_FIELD,PT_PROJECT_FIELD,PT_USER_FIELD,PT_CONTACT_FIELD];

    handleAction(event){
        alert('1');
    }

    handleAction(event){
        alert('2');
    }

    handleAction(event){
        alert('3');
    }

    renderedCallback(){
        this.template.querySelectorAll("div.action11").forEach((element) => {
        element.addEventListener("click", (event)=>{
        let target = event.currentTarget.dataset.tabId;
            console.log('target>>'+target);

        this.template.querySelectorAll("div.action11").forEach((tabel) => {
            console.log('tabel>>'+tabel);
        if(tabel === element){
        tabel.classList.add("active-tab");
        }
        else{
        tabel.classList.remove("active-tab");
        }
        });

        this.template.querySelectorAll(".tab").forEach(tabdata=>{
        tabdata.classList.add("slds-hidden");
        });

        this.template.querySelector('[data-id="'+target+'"]').classList.remove("slds-hidden");
        this.template.querySelector('[data-id="'+target+'"]').classList.add("slds-visible");
        });
        });
        }
}
