import { LightningElement , api } from 'lwc';

const CSS_CLASS = "modal-hidden";

export default class ModalPopupForContact extends LightningElement {
@api thcharimgforconpopup;
@api mypopupcontactdatalist;
@api concountpopup;
@api accnameforconpopup;

showModalContact = false;
@api showContact(){
this.showModalContact = true;
}

handleContactClose(){
this.showModalContact = false;
}

// NAVIGATE TO CONTACT RECORD PAGE FROM POPUP STARTS
// handleChangeInPopup(Event) {
//     this[NavigationMixin.Navigate]({
//         type: 'standard__recordPage', 
//         attributes: {
//             "recordId": Event.target.value,
//             "objectApiName": "Contact",
//             "actionName": "view"
//         },
//     });
// }
// NAVIGATE TO CONTACT RECORD PAGE FROM POPUP ENDS

}