import { LightningElement,api,track } from 'lwc';

export default class ModalPopupForContact extends LightningElement {
@api mypopupcensusdata;
@api columns;

showModal = false;
@api show(){
this.showModal = true;
}

handleDialogClose(){
this.showModal = false;
}

}