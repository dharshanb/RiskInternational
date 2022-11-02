import { LightningElement,api,track,wire} from 'lwc';
import getDefaultProject from "@salesforce/apex/OverallStatusController.getDefaultProject";
// import getAccCountForLoginUser from "@salesforce/apex/OverallStatusController.getAccCountForLoginUser";
import getDefaultProNameByProFilter from "@salesforce/apex/OverallStatusController.getDefaultProNameByProFilter";
import getReports from '@salesforce/apex/OverallStatusController.getReports';
import getCensus from '@salesforce/apex/OverallStatusController.getCensus';
import getCensusByProject from '@salesforce/apex/OverallStatusController.getCensusByProject';
import getUniqueEmpName from '@salesforce/apex/OverallStatusController.getUniqueEmpName';
import getUniqueMedicalPlan from '@salesforce/apex/OverallStatusController.getUniqueMedicalPlan';
import getCensusForPopup from '@salesforce/apex/OverallStatusController.getCensusForPopup';
import getCensusList from '@salesforce/apex/OverallStatusController.getCensusList';
import getContact from '@salesforce/apex/OverallStatusController.getContact';
import getContactForPopup from '@salesforce/apex/OverallStatusController.getContactForPopup';
import getContactListByProject from '@salesforce/apex/OverallStatusController.getContactListByProject';
import getContactForPopupListByProject from '@salesforce/apex/OverallStatusController.getContactForPopupListByProject';
// import getAccount from '@salesforce/apex/OverallStatusController.getAccount';
import getAccountByProFilter from '@salesforce/apex/OverallStatusController.getAccountByProFilter';
import getProListByDefaultPro from '@salesforce/apex/OverallStatusController.getProListByDefaultPro';
import fetchFilterReports from '@salesforce/apex/OverallStatusController.fetchFilterReports';
import getCensusEmpCount from '@salesforce/apex/OverallStatusController.getCensusEmpCount';
import getCensusEmpCountByProject from '@salesforce/apex/OverallStatusController.getCensusEmpCountByProject';
import getCensusEmpFamCount from '@salesforce/apex/OverallStatusController.getCensusEmpFamCount';
import getCensusEmpFamCountByProject from '@salesforce/apex/OverallStatusController.getCensusEmpFamCountByProject';
import getCensusLivesCount from '@salesforce/apex/OverallStatusController.getCensusLivesCount';
import getCensusLivesCountByProject from '@salesforce/apex/OverallStatusController.getCensusLivesCountByProject';
import { NavigationMixin } from 'lightning/navigation';
//FILES STARTS
import { refreshApex } from "@salesforce/apex";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import getVersionFiles from "@salesforce/apex/OverallStatusController.getVersionFiles";
import getVersionFilesByProject from "@salesforce/apex/OverallStatusController.getVersionFilesByProject";
//FILES ENDS
import ContactIconPicture from "@salesforce/resourceUrl/ContactIconPicture";
import Id from '@salesforce/user/Id';
import getProjectList from "@salesforce/apex/OverallStatusController.getProjectList";
import getProjectListByAccount from "@salesforce/apex/OverallStatusController.getProjectListByAccount";
import getAccountList from "@salesforce/apex/OverallStatusController.getAccountList";
import getCensusGeoDataList from "@salesforce/apex/OverallStatusController.getCensusGeoDataList";
import getMapData from '@salesforce/apex/OverallStatusController.getMapData';
import getMapDataByProFilter from '@salesforce/apex/OverallStatusController.getMapDataByProFilter';

import getIntUsers from '@salesforce/apex/OverallStatusController.getIntUsers';

const actions = [
    { label: 'Show details', name: 'show_details' },
    { label: 'Delete', name: 'delete' },
];
const columns = [
    { label: 'Employee Name', fieldName: 'Employee_Name__c'},
    { label: 'Medical', fieldName: 'Medical_Plan__c' },
    { label: 'Dental', fieldName: 'Dental_Plan__c' },
    { label: 'Vision', fieldName: 'Vision_Plan__c' },
    { label: 'Dependant', fieldName: 'Dep_FSA__c' },
    { label: 'Medical Coverage', fieldName: 'Medical_Coverage__c' },
];
const censusGeoColumn = [
    { label: 'Metric', fieldName: 'metric'},
    { label: 'Total', fieldName: 'total' },
];

//OVERALL CLAIM COST TABLE STARTS
const diognosisColumn = [
    { label: 'Relation', fieldName: ''},
    { label: 'Diognosis & Condition', fieldName: '' },
    { label: 'Ongoing Status', fieldName: '' },
    { label: 'YTD', fieldName: '' },
];
//OVERALL CLAIM COST TABLE ENDS


export default class OverallStatus extends NavigationMixin(LightningElement) {

    @track defaultProjectName;
    @track defaultProjectId;
    @track repList;
    @track conListLimit;
    @track repError;
    @track conError;
    @track columns = columns;
    @track censusGeoColumn = censusGeoColumn;
    @track diognosisColumn = diognosisColumn;
    @track record = {};
    @track repNameList;
    @track repDevNameList;
    @track filterByName;
    @track filterByDevName;
    @track getEmpCount;
    @track getEmpFamCount;
    @api getLivesCount;
    @track accName;
    @track accNameForConPopup;
    @track isDisabled = false;
    @track defaultAccount;
    @track defaultName;
    @track placeholderAccount;
    @track placeholderProName;
    @track medPlanList;
    @track placeholderLives;
    @track placeholderMedPlan;
    @track censusGeoData = [];
    tabLoaded1 = true;
    tabLoaded2 = false;
    tabLoaded3 = false;

    // //PUT DATA TO CENSUS DATATABLE(DEMOGRAPHICS AND GEOGRAPHIES) STARTS
    // get optionsForCensusGeoDta(){
    //     return this.censusGeoData;
    // }
    // //PUT DATA TO CENSUS DATATABLE(DEMOGRAPHICS AND GEOGRAPHIES) STARTS


//FILTER THE PROJECT RECORDS BY SELECTING THE ACCOUNT STARTS
    @track accountList = [];
    filterByAccount
    get optionsAccount(){
        return this.accountList;
    }

    handleChangeForAccount(Event) {
        this.filterByAccount = Event.detail.value;

        //GET PROJECT LIST FOR ASSIGNING TO PROJECT DROPDOWN BY SELECTING THE ACCOUNT STARTS
        //GET THE PROJECT RECORDS BY ACCOUNT AND USER STARTS
        //this.isDisabled = false;
        getProjectListByAccount({
            AccountId : this.filterByAccount
        })
        .then(result=> {
        let arr = [];
        for(var i = 0; i< result.length; i++){
        arr.push({ label: result[i].Project_Title__c, value: result[i].Id});
        }
        this.pprojectList = arr;
        this.placeholderProName = 'Select Project';
        })
        //GET THE PROJECT RECORDS BY ACCOUNT AND USER ENDS
        //GET PROJECT LIST FOR ASSIGNING TO PROJECT DROPDOWN BY SELECTING THE ACCOUNT ENDS
    }
//FILTER THE PROJECT RECORDS BY SELECTING THE ACCOUNT ENDS


//FILTER THE PROJECT RECORDS BY USER STARTS
    @track pprojectList = [];
    @track filterByProject;

    get optionsProject(){
        return this.pprojectList;
    }

    handleChangeForProject(Event) {
        this.filterByProject = Event.detail.value;
        this.projectIdToCreatePt = Event.detail.value;
        this.placeholderLives = '';
        this.placeholderMedPlan = '';

        //GET CENSUS DATA(DEMOGRAPHICS AND GEOGRAPHIES) BY SELECTING THE PROJECT STARTS
        getCensusGeoDataList({
            ProjectId : this.filterByProject
        })
        .then(resust=>{
            var metric0 = resust[0];
            var metric1 = resust[1];
            var metric2 = resust[2];
            var metric3 = resust[3];
            var metric4 = resust[4];
            var metric5 = resust[5];
            var metric6 = resust[6];
            var metric7 = resust[7];
            this.censusGeoData = [
                { id: 1, metric: 'Benefits Eligible Employees', total: metric0},
                { id: 2, metric: 'Medical Enrollment', total: metric1},
                { id: 3, metric: 'Medical Participation %', total: metric2},
                { id: 4, metric: 'Single Coverage Election', total: metric3},
                { id: 5, metric: 'Gender (% Male)', total: metric4},
                { id: 6, metric: 'Average Age', total: metric5},
                { id: 5, metric: 'Average Tenure', total: metric6},
                { id: 6, metric: 'Average Family Size', total: metric7},
            ];
        })
        .catch(error=>{
            this.repError = error;
        });
        //GET CENSUS DATA(DEMOGRAPHICS AND GEOGRAPHIES) BY SELECTING THE PROJECT ENDS


        //LOAD LIST OF VALUES TO UNIQUE MEDICAL PLAN DROUPDOWN BY SELECTING THE PROJECT STARTS
        getUniqueMedicalPlan({
            ProjectId : this.filterByProject
        })
        .then(resust=>{
            //IF CONDITION STARTS
            let arr = [];
            //ADD "ALL PLANS" TO ARRAY STARTS
            var arr1 = {label: "All Plans",value: "All"};
            this.placeholderMedPlan = 'All Plans';
            arr.push(arr1);
            //ADD "ALL PLANS" TO ARRAY ENDS
            for (let i = 0; i < resust.length; i++) {
            var plan = resust[i];
            var arr1 = {label: plan,value: plan};
            arr.push(arr1);
            }
            this.medPlanList = arr;
            //IF CONDITION ENDS
        })
        .catch(error=>{
            this.repError = error;
        });
        //LOAD LIST OF VALUES TO UNIQUE MEDICAL PLAN DROUPDOWN BY SELECTING THE PROJECT ENDS


        //GET DOCUMENT FILES BY SELECTING THE PROJECT STARTS
        this.loaded = false;
        this.myRecordId = this.filterByProject;
        getVersionFilesByProject({
            ProjectId : this.filterByProject
        })
        .then(resust=>{
                this.wiredActivities = resust;
                const { data1, error1 } = resust;
                this.fileList = "";
                this.files = [];
                //DATA STARTS
                if (resust) {
                this.fileList = resust;
                for (let i = 0; i < this.fileList.length; i++) {
                    let file = {
                    Id: this.fileList[i].Id,
                    Title: this.fileList[i].Title,
                    Extension: this.fileList[i].FileExtension,
                    ContentDocumentId: this.fileList[i].ContentDocumentId,
                    ContentDocument: this.fileList[i].ContentDocument,
                    CreatedDate: this.fileList[i].CreatedDate,
                    thumbnailFileCard:
                        "/sfc/servlet.shepherd/version/renditionDownload?rendition=THUMB720BY480&versionId=" +
                        this.fileList[i].Id +
                        "&operationContext=CHATTER&contentId=" +
                        this.fileList[i].ContentDocumentId,
                    downloadUrl:
                        "/sfc/servlet.shepherd/document/download/" +
                        this.fileList[i].ContentDocumentId
                    };
                    this.files.push(file);
                }
                this.loaded = true;
                }
                //DATA ENDS
                //ERROR STARTS
                else if (error1) {
                this.dispatchEvent(
                    new ShowToastEvent({
                    title: "Error loading Files",
                    message: error1.body.message,
                    variant: "error1"
                    })
                );
                }
                //ERROR ENDS
        })
        .catch(error=>{
            this.repError = error;
        });
        //GET DOCUMENT FILES BY SELECTING THE PROJECT STARTS


        //GET ACCOUNT NAME BY SELECTING THE PROJECT STARTS
        getAccountByProFilter({
            ProjectId : this.filterByProject
        })
        .then(resust=>{
            this.accName = resust.Account__r.Name;
            this.placeholderAccount = resust.Account__r.Name;
            this.accNameForConPopup = resust.Account__r.Name;
            this.accountIdToCreatePt = data.Account__r.Id;
        })
        .catch(error=>{
            this.repError = error;
        });
        //GET ACCOUNT NAME BY SELECTING THE PROJECT ENDS


        //GOOGLE MAP MARKER BY SELECTING THE PROJECT STARTS
        getMapDataByProFilter({
            ProjectId : this.filterByProject
        })
        .then(resust=>{

            let arrray = [];
            var res = resust;
            for(var key in res){
                var stt = key;
                var noEmp = res[key].empEnrolledInMed;
                var col = "red";
                // //COLOR STARTS
                // if(1 < noEmp <= 4){
                //     var col = "gold";
                // }
                // if(4 < noEmp <= 6){
                // var col = "blue";
                // }
                // if(6 < noEmp <= 8){
                // var col = "pink";
                // }
                // if(8 < noEmp <= 48){
                //     var col = "green";
                // }
                // if(noEmp > 48){
                //     var col = "red";
                // }
                // //COLOR ENDS
                var arrPro =
                        {
                        location: {
                        Country: "United State Of America",
                        State: stt
                        },
                        title : 'Number of Employees Enrolled in Medical '+noEmp+'('+stt+')',
                        mapIcon: {
                            path: "M 125,5 155,90 245,90 175,145 200,230 125,180 50,230 75,145 5,90 95,90 z",
                            fillColor: col,
                            fillOpacity: .8,
                            strokeWeight: 0,
                            scale: .10,
                            anchor: {x: 122.5, y: 115}
                            },
                        };
                    arrray.push(arrPro);
                    this.mapMarkers = arrray;
            }
            if(arrray.length > 0){
                console.log('mapMarkers If'+JSON.stringify(this.mapMarkers));
                this.mapMarkers = arrray;
            }
            else{
                console.log('mapMarkers Else');
                this.mapMarkers = [
                    {
                        location: {
                            Latitude: '39.0119',
                            Longitude: '-98.4842',
                        },
                        mapIcon: {
                            path: 'Mn 129,5 155,90 245,90 175,145 200,230 125,180 50,230 75,145 5,90 95,90 z',
                            fillOpacity: .8,
                            strokeWeight: 0,
                            scale: .10,
                            anchor: {x: 122.5, y: 115}
                            },
                    },
                ];
                this.zoomLevel = 4;
            }
        })
        .catch(error=>{
            this.repError = error;
        });
        //GOOGLE MAP MARKER BY SELECTING THE PROJECT ENDS


        //HANDLE CHANGES IN DEFAULT PROJECT BY SELECTING THE PROJECT DROPDOWN STARTS
        getDefaultProNameByProFilter({
            ProjectId : this.filterByProject
        })
        .then(resust=>{
            // this.defaultProjectName = resust[0].Name;
            // this.placeholderProName = resust[0].Name;
        })
        .catch(error=>{
            this.repError = error;
        });
        //HANDLE CHANGES IN DEFAULT PROJECT BY SELECTING THE PROJECT DROPDOWN ENDS


        //HANDLE CHANGES IN CONTACT BY SELECTING THE PROJECT DROPDOWN STARTS
        getContactListByProject({
            ProjectId : this.filterByProject
        })
        .then(resust=>{
            this.wiredActForPtCreate = resust;
            this.conList = resust;
        })
        .catch(error=>{
            this.repError = error;
        });
        //HANDLE CHANGES IN CONTACT BY SELECTING THE PROJECT DROPDOWN ENDS


        //HANDLE CHANGES IN CONTACT POPUP BY SELECTING THE PROJECT DROPDOWN STARTS
        getContactForPopupListByProject({
            ProjectId : this.filterByProject
        })
        .then(resust=>{
            this.wiredPtCretaeForConCount = resust;
            this.myPopupContactDataList = resust;
            this.conCountPopup = this.myPopupContactDataList.length;
            this.conCount = this.myPopupContactDataList.length;
        })
        .catch(error=>{
            this.repError = error;
        });
        //HANDLE CHANGES IN CONTACT POPUP BY SELECTING THE PROJECT DROPDOWN ENDS


        //GET CENSUS(EMPLOYEE COUNT) RECORDS COUNT BY SELECTING THE PROJECT STARTS
        getCensusEmpCountByProject({
            ProjectId : this.filterByProject
        })
        .then(resust=>{
            this.getEmpCount = resust;
        })
        .catch(error=>{
            this.repError = error;
        });
        //GET CENSUS(EMPLOYEE COUNT) RECORDS COUNT BY SELECTING THE PROJECT ENDS

        //GET CENSUS(EMPLOYEE + FAMILY COUNT) RECORDS COUNT BY SELECTING THE PROJECT STARTS
        getCensusEmpFamCountByProject({
            ProjectId : this.filterByProject
        })
        .then(resust=>{
            this.getEmpFamCount = resust;
        })
        .catch(error=>{
            this.repError = error;
        });
        //GET CENSUS(EMPLOYEE + FAMILY COUNT) RECORDS COUNT BY SELECTING THE PROJECT ENDS


        //GET CENSUS(LIVES COUNT) RECORDS COUNT BY SELECTING THE PROJECT STARTS
        getCensusLivesCountByProject({
            ProjectId : this.filterByProject
        })
        .then(resust=>{
            this.getLivesCount = resust;
            this.placeholderLives = 'All lives ('+this.getLivesCount+')';
        })
        .catch(error=>{
            this.repError = error;
        });
        //GET CENSUS(LIVES COUNT) RECORDS COUNT BY SELECTING THE PROJECT ENDS


        //GET CENSUS RECORDS BY SELECTING THE PROJECT STARTS
        getCensusByProject({
            ProjectId : this.filterByProject
        })
        .then(resust=>{
            this.censusData = resust;
        })
        .catch(error=>{
            this.repError = error;
        });
        //GET CENSUS RECORDS BY SELECTING THE PROJECT ENDS


    }
//FILTER THE PROJECT RECORDS BY USER ENDS

handleAction1(event){
    this.tabLoaded1 = true;
    this.tabLoaded2 = false;
    this.tabLoaded3 = false;
}

handleAction2(event){
    this.tabLoaded1 = false;
    this.tabLoaded2 = true;
    this.tabLoaded3 = false;
}

handleAction3(event){
    this.tabLoaded1 = false;
    this.tabLoaded2 = false;
    this.tabLoaded3 = true;
}

handleSidebarAction1(event){
    this.tabLoaded1 = true;
    this.tabLoaded2 = false;
    this.tabLoaded3 = false;

    this.template.querySelector('[data-tab-id="tab1"]').classList.add("active-tab");
    this.template.querySelector('[data-tab-id="tab2"]').classList.remove("active-tab");
    this.template.querySelector('[data-tab-id="tab3"]').classList.remove("active-tab");

    this.template.querySelector('[data-id="tab1"]').classList.add("slds-visible");
    this.template.querySelector('[data-id="tab2"]').classList.add("slds-hidden");
    this.template.querySelector('[data-id="tab3"]').classList.add("slds-hidden");

    this.template.querySelector('[data-id="tab1"]').classList.remove("slds-hidden");
    this.template.querySelector('[data-id="tab2"]').classList.remove("slds-visible");
    this.template.querySelector('[data-id="tab3"]').classList.remove("slds-visible");
}

handleSidebarAction2(event){
    //NAVIGATION TOPBAR STARTS
        this.template.querySelector('[data-id="tab1"]').classList.add("slds-hidden");
        this.template.querySelector('[data-id="tab2"]').classList.add("slds-hidden");
        this.template.querySelector('[data-id="tab3"]').classList.add("slds-hidden");
    //NAVIGATION TOPBAR ENDS
}

handleSidebarAction3(event){

    //NAVIGATION TOPBAR STARTS
        this.template.querySelector('[data-id="tab1"]').classList.add("slds-hidden");
        this.template.querySelector('[data-id="tab2"]').classList.add("slds-hidden");
        this.template.querySelector('[data-id="tab3"]').classList.add("slds-hidden");
    //NAVIGATION TOPBAR ENDS

}

handleSidebarAction4(event){

    //NAVIGATION TOPBAR STARTS
        this.template.querySelector('[data-id="tab1"]').classList.add("slds-hidden");
        this.template.querySelector('[data-id="tab2"]').classList.add("slds-hidden");
        this.template.querySelector('[data-id="tab3"]').classList.add("slds-hidden");
    //NAVIGATION TOPBAR ENDS

}

    //MAIN TABS STARTS
    renderedCallback(){
        //NAVIGATION SIDEBAR STARTS
        this.template.querySelectorAll("div.actionSidebar").forEach((element) => {
            element.addEventListener("click", (event)=>{
            let target = event.currentTarget.dataset.tabId;
                console.log('target sidebar>>'+target);

            this.template.querySelectorAll("div.actionSidebar").forEach((tabel) => {
                console.log('tabel>>'+tabel);
            if(tabel === element){
            tabel.classList.add("active-sidebar-tab");
            }
            else{
            tabel.classList.remove("active-sidebar-tab");
            }
            });

            this.template.querySelectorAll(".sidebartab").forEach(tabdata=>{
            tabdata.classList.add("slds-hidden");
            });

            this.template.querySelector('[data-id="'+target+'"]').classList.remove("slds-hidden");
            this.template.querySelector('[data-id="'+target+'"]').classList.add("slds-visible");
            });
            });
            //NAVIGATION SIDEBAR ENDS

            //NAVIGATION TOPBAR STARTS
            this.template.querySelectorAll("div.action11").forEach((element) => {
            element.addEventListener("click", (event)=>{
            let target = event.currentTarget.dataset.tabId;
            console.log('target topbar>>'+target);
            this.template.querySelectorAll("div.action11").forEach((tabel) => {
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
            //NAVIGATION TOPBAR ENDS

        }
    //MAIN TABS ENDS

    @wire (getReports) newLocalMethodForRep({error,data}){
        if(data){
            this.repList = data;
        }
        if(error){
            console.log(error);
            this.repError = error;
        }
    }

    @track censusData = [];
    myPopupCensusData
    @api myProjectIdForGetCensus

    //GET CENSUS RECORDS STARTS
    @wire (getCensus,{ ProjectId: "$myProjectIdForGetCensus"})
    newLocalMethodForRep(value) {
        const { data, error } = value;
        if (data) {
            this.censusData = data;
        }
        else if (error) {
        this.dispatchEvent(
            new ShowToastEvent({
            title: "Error loading getCensus",
            message: error.body.message,
            variant: "error"
            })
        );
        }
    }
    //GET CENSUS RECORDS ENDS


    //FILTER THE CENSUS RECORDS BY NAME STARTS--------------HANDLE----CHANGE---FOR---NAME---STARTS
    myProjectIdForGetCensusForHandle
    handleChangeForName(Event) {
        this.filterByName = Event.detail.value;

        //PASS "this.filterByProject", IF PROJECT IS FILTERED STARTS
        if(this.filterByProject){
            getCensusList({
                Name : this.filterByName,
                plan : this.filterByPlan,
                ProjectId: this.filterByProject
            })
            .then(resust=>{
                this.censusData = resust;
            })
            .catch(error=>{
                this.repError = error;
            });
        }
        //PASS "this.filterByProject", IF PROJECT IS FILTERED ENDS

        //PASS DEFAULT PROJECT ID, IF PROJECT IS NOT FILTERED STARTS
        else{
            getCensusList({
                Name : this.filterByName,
                plan : this.filterByPlan,
                ProjectId: this.myProjectIdForGetCensusForHandle
            })
            .then(resust=>{
                this.censusData = resust;
            })
            .catch(error=>{
                this.repError = error;
            });
        }
        //PASS DEFAULT PROJECT ID, IF PROJECT IS NOT FILTERED ENDS
    }
    //FILTER THE CENSUS RECORDS BY NAME ENDS---------------HANDLE----CHANGE---FOR---NAME---ENDS

    //FILTER THE CENSUS RECORDS BY PLAN STARTS------------HANDLE----CHANGE---FOR---PLAN---STARTS
    handleChangeForPlan(Event) {
        this.filterByPlan = Event.detail.value;

        //PASS "this.filterByProject", IF PROJECT IS FILTERED STARTS
        if(this.filterByProject){
            getCensusList({
                Name : this.filterByName,
                plan : this.filterByPlan,
                ProjectId: this.filterByProject
            })
            .then(resust=>{
                this.censusData = resust;
            })
            .catch(error=>{
                this.repError = error;
            });
        }
        //PASS "this.filterByProject", IF PROJECT IS FILTERED ENDS

        //PASS DEFAULT PROJECT ID, IF PROJECT IS NOT FILTERED STARTS
        else{
            getCensusList({
                Name : this.filterByName,
                plan : this.filterByPlan,
                ProjectId: this.myProjectIdForGetCensusForHandle
            })
            .then(resust=>{
                this.censusData = resust;
            })
            .catch(error=>{
                this.repError = error;
            });
        }
        //PASS DEFAULT PROJECT ID, IF PROJECT IS NOT FILTERED ENDS
    }
    //FILTER THE CENSUS RECORDS BY PLAN ENDS----------------------HANDLE----CHANGE---FOR---PLAN---ENDS

    //POP UP WINDOW OF CENSUS RECORD LIST------------------POPUP------FOR-------CENSUS-----RECORD----STARTS
    handlePUPForCensusData(){

        //PASS "this.filterByProject", IF PROJECT IS FILTERED STARTS
        if(this.filterByProject){
            getCensusForPopup({
                Name : this.filterByName,
                plan : this.filterByPlan,
                ProjectId: this.filterByProject
            })
            .then(resust=>{
                this.myPopupCensusData = resust;
            })
            .catch(error=>{
                this.repError = error;
            });
        }
        //PASS "this.filterByProject", IF PROJECT IS FILTERED ENDS

        //PASS DEFAULT PROJECT ID, IF PROJECT IS NOT FILTERED STARTS
        else{
            getCensusForPopup({
                Name : this.filterByName,
                plan : this.filterByPlan,
                ProjectId: this.myProjectIdForGetCensusForHandle
            })
            .then(resust=>{
                this.myPopupCensusData = resust;
            })
            .catch(error=>{
                this.repError = error;
            });
        }
        //PASS DEFAULT PROJECT ID, IF PROJECT IS NOT FILTERED ENDS

        const modal = this.template.querySelector("c-modal-Popup-For-Census-Records");
        modal.show();
    }
    //POP UP WINDOW OF CENSUS RECORD LIST ----------------POPUP------FOR-------CENSUS-----RECORD----ENDS

    //GET CENSUS(EMPLOYEE COUNT) RECORDS COUNT STARTS
    @api myProjectIdForGetCount;
    @wire(getCensusEmpCount, { ProjectId: "$myProjectIdForGetCount" })
    getEmployeeCount(value) {
        const { data, error } = value;
        if (data) {
            this.getEmpCount = data;
        }
        else if (error) {
        this.dispatchEvent(
            new ShowToastEvent({
            title: "Error loading Employee Count",
            message: error.body.message,
            variant: "error"
            })
        );
        }
    }
    //GET CENSUS(EMPLOYEE COUNT) RECORDS COUNT ENDS

    //GET CENSUS(EMPLOYEE + FAMILY COUNT) RECORDS COUNT STARTS
    @wire (getCensusEmpFamCount,{ ProjectId: "$myProjectIdForGetCount" })
        censusFamCountResponse(value) {
        const { data, error } = value;
        if (data) {
            this.getEmpFamCount = data;
        }
        else if (error) {
        this.dispatchEvent(
            new ShowToastEvent({
            title: "Error loading getCensusEmpFamCount",
            message: error.body.message,
            variant: "error"
            })
        );
        }
    }
    //GET CENSUS(EMPLOYEE + FAMILY COUNT) RECORDS COUNT ENDS

    //GET CENSUS(LIVES COUNT) RECORDS COUNT STARTS
    @wire (getCensusLivesCount,{ ProjectId: "$myProjectIdForGetCount" })
    newLivesCountResponse(value) {
        const { data, error } = value;
        if (data) {
            this.getLivesCount = data;
            this.placeholderLives = 'All lives ('+this.getLivesCount+')';
        }
        else if (error) {
        this.dispatchEvent(
            new ShowToastEvent({
            title: "Error loading getCensusLivesCount",
            message: error.body.message,
            variant: "error"
            })
        );
        }
    }
    //GET CENSUS(LIVES COUNT) RECORDS COUNT ENDS



    //LOAD AND HANDLE LIST OF VALUES TO DROUPDOWN STARTS

    //LOAD AND HANDLE LIST OF VALUES TO EMPLOYEE DROUPDOWN STARTS
    get optionsName(){
        // return this.empNameList;
        return [
            { label: 'All lives ('+this.getLivesCount+')' , value: 'All' },
            { label: 'Employee(Only) ('+this.getEmpCount+')' , value: 'Employee (Only)' },
            { label: 'Employee + Family ('+this.getEmpFamCount+')' , value: 'Employee + Family' }
        ];
    }
    //LOAD AND HANDLE LIST OF VALUES TO EMPLOYEE DROUPDOWN ENDS

    //LOAD AND HANDLE LIST OF VALUES TO EMPLOYEE DROUPDOWN STARTS
    get optionsForOngoingStatus(){
        // return this.empNameList;
        return [
            { label: 'Employee' , value: 'Employee' },
            { label: 'Spouse' , value: 'Spouse' },
            { label: 'Dependant' , value: 'Dependant' }
        ];
    }
    //LOAD AND HANDLE LIST OF VALUES TO EMPLOYEE DROUPDOWN ENDS

    //LOAD AND HANDLE LIST OF VALUES TO MEDICAL PLAN DROUPDOWN STARTS
    @api myProjectIdForLoadPlan;
    @wire (getUniqueMedicalPlan,{ ProjectId: "$myProjectIdForLoadPlan"})
    newLocalMethodForUniqueMedPlan(value) {
        const { data, error } = value;
        if (data) {
                //IF CONDITION STARTS
                    let arr = [];
                    //ADD "ALL PLANS" TO ARRAY STARTS
                    var arr1 = {label: "All Plans",value: "All"};
                    this.placeholderMedPlan = 'All Plans';
                    arr.push(arr1);
                    //ADD "ALL PLANS" TO ARRAY ENDS
                    for (let i = 0; i < data.length; i++) {
                    var plan = data[i];
                    var arr1 = {label: plan,value: plan};
                    arr.push(arr1);
                    }
                    this.medPlanList = arr;
                //IF CONDITION ENDS
        }
        else if (error) {
        this.dispatchEvent(
            new ShowToastEvent({
            title: "Error loading getUniqueMedicalPlan",
            message: error.body.message,
            variant: "error"
            })
        );
        }
    }

    get optionsPlan(){
        return this.medPlanList;
    }
    //LOAD AND HANDLE LIST OF VALUES TO MEDICAL PLAN DROUPDOWN ENDS

    //LOAD AND HANDLE LIST OF VALUES TO DROUPDOWN ENDS

    // NAVIGATE TO CONTACT RECORD PAGE STARTS
    handleChange(Event) {
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                "recordId": Event.target.value,
                "objectApiName": "User",
                "actionName": "view"
            },
        });
    }
    // NAVIGATE TO CONTACT RECORD PAGE ENDS


    // NAVIGATE TO FILES RECORD PAGE STARTS
    navToFiles(Event) {
        // this[NavigationMixin.Navigate]({
        //     type: 'standard__objectPage',
        //     attributes: {
        //         "objectApiName": 'Report',
        //         "actionName": 'home'
        //     },
        //     state:{
        //         queryScope : 'everything'
        //     }
        // });
    }
    // NAVIGATE TO FILES RECORD PAGE ENDS


    //GET CONTACT RECORDS FROM OverallStatusController.getContact STARTS
    @track conList;
    @track conCount;
    riskInt
    thCharImg
    thCharImgForConPopup
    @api myProjectIdForGetCon;
    @wire(getContact, { ProjectId: "$myProjectIdForGetCon" })
    contactResponse(value) {
        this.wiredActForPtCreate = value;
        const { data, error } = value;
        if (data) {
            this.conList = data;
            this.thCharImg = `${ContactIconPicture}/appy.png`;
            this.thCharImgForConPopup = `${ContactIconPicture}/appy.png`;
            this.riskInt = `${ContactIconPicture}/riskInt.png`;
        }
        else if (error) {
        this.dispatchEvent(
            new ShowToastEvent({
            title: "Error loading Contacts",
            message: error.body.message,
            variant: "error"
            })
        );
        }
    }

    //GET CONTACT RECORDS FROM OverallStatusController.getContactForPopup STARTS
    myPopupContactDataList
    conCountPopup;
    @wire(getContactForPopup, { ProjectId: "$myProjectIdForGetCon" })
    conResponse(value) {
        this.wiredPtCretaeForConCount = value;
        const { data, error } = value;
        if (data) {
            this.myPopupContactDataList = data;
            this.conCountPopup = this.myPopupContactDataList.length;
            this.conCount = this.myPopupContactDataList.length;
        }
        else if (error) {
        this.dispatchEvent(
            new ShowToastEvent({
            title: "Error loading Files",
            message: error.body.message,
            variant: "error"
            })
        );
        }
    }

    constructor() {
        super();
        this.classList.add('new-class');
    }

    //GET ACCOUNT NAME FOR ASSIGN TO THE DROUP DOWN STARTS
    @api myProjectIdForGetAcc;

    @wire(getAccountByProFilter, { ProjectId: "$myProjectIdForGetAcc" })
    accResponse(value) {
        const { data, error } = value;
        if (data) {
            this.accName = data.Account__r.Name;
            this.placeholderAccount = data.Account__r.Name;
            this.placeholderProName = data.Project_Title__c;
            this.accNameForConPopup = data.Account__r.Name;
            this.accountIdToCreatePt = data.Account__r.Id;
        }
        else if (error) {
        this.dispatchEvent(
            new ShowToastEvent({
            title: "Error loading Files",
            message: error.body.message,
            variant: "error"
            })
        );
        }
    }
    //GET ACCOUNT NAME FOR ASSIGN TO THE DROUP DOWN ENDS

    //POP UP WINDOW OF CONTACTS STARTS
    handlePUPForContact(){
        const modal = this.template.querySelector("c-modal-Popup-For-Contact");
        modal.showContact();
    }
    //POP UP WINDOW OF CONTACTS ENDS


    // POP UP TO SEND EMAIL STARTS
    fromAddress
    toAddress
    handleSendMail(Event) {
        var questionName = Event.currentTarget.id;
        this.toAddress = questionName.substring(0,questionName.indexOf("-"));

        // //LOAD TO & FROM ADDRESS STARTS
        // getIntUsers({
        //     AccountId : this.accountidtocreatept
        // })
        // .then(resust=>{
        //     this.fromAddress = 'dharshanbk100@gmail.com';
        // })
        // .catch(error=>{
        //     this.repError = error;
        // });
        // //LOAD TO & FROM ADDRESS ENDS

        const modal1 = this.template.querySelector("c-modal-Popoup-For-Sendmail");
        modal1.showSendEmail();
    }
    // POP UP TO SEND EMAIL ENDS


    //POP UP WINDOW OF PROJECT TEAM REOCORD CREATION STARTS
    projectIdToCreatePt
    accountIdToCreatePt
    userList
    newProjectTeam(){

        //LOAD LIST OF VALUES TO USERS DROUPDOWN FOR CREATE PROJECT USERS STARTS
        getIntUsers({
            AccountId : this.accountidtocreatept
        })
        .then(resust=>{
            //IF CONDITION STARTS
            let arr = [];
            for (let i = 0; i < resust.length; i++) {
            var user = resust[i];
            var arr1 = {label: user.Name,value: user.Id};
            arr.push(arr1);
            }
            this.userList = arr;
            //IF CONDITION ENDS
        })
        .catch(error=>{
            this.repError = error;
        });
        //LOAD LIST OF VALUES TO USERS DROUPDOWN FOR CREATE PROJECT USERS ENDS

        const modal1 = this.template.querySelector("c-modal-Popoup-For-Creatept");
        modal1.showPtRecCreate();
    }
    //POP UP WINDOW OF PROJECT TEAM REOCORD CREATION ENDS

    //UPDATE THE CONTACT RECORDS WHEN POP UP OF PROJECT TEAM REOCORD CLOSED ENDS
    wiredActForPtCreate
    wiredPtCretaeForConCount
    handleUpdate(){
        console.log('refreshApex after creating Project Team Record starts');
        refreshApex(this.wiredActForPtCreate);
        refreshApex(this.wiredPtCretaeForConCount);
        console.log('refreshApex after creating Project Team Record ends');
    }
    //UPDATE THE CONTACT RECORDS WHEN POP UP OF PROJECT TEAM REOCORD CLOSED  ENDS


    //GETTING FILES STARTS
    loaded = false;
    @track fileList;
    @api myRecordId;
    @track files = [];
    get acceptedFormats() {
        return [".pdf", ".png", ".jpg", ".jpeg"];
    }

    @wire(getVersionFiles, { recordId: "$myRecordId" })
    fileResponse(value) {
        this.wiredActivities = value;
        const { data, error } = value;
        this.fileList = "";
        this.files = [];
        if (data) {
        this.fileList = data;
        for (let i = 0; i < this.fileList.length; i++) {
            let file = {
            Id: this.fileList[i].Id,
            Title: this.fileList[i].Title,
            Extension: this.fileList[i].FileExtension,
            ContentDocumentId: this.fileList[i].ContentDocumentId,
            ContentDocument: this.fileList[i].ContentDocument,
            CreatedDate: this.fileList[i].CreatedDate,
            thumbnailFileCard:
                "/sfc/servlet.shepherd/version/renditionDownload?rendition=THUMB720BY480&versionId=" +
                this.fileList[i].Id +
                "&operationContext=CHATTER&contentId=" +
                this.fileList[i].ContentDocumentId,
            downloadUrl:
                "/sfc/servlet.shepherd/document/download/" +
                this.fileList[i].ContentDocumentId
            };
            this.files.push(file);
        }
        this.loaded = true;
        } else if (error) {
        this.dispatchEvent(
            new ShowToastEvent({
            title: "Error loading Files",
            message: error.body.message,
            variant: "error"
            })
        );
        }
    }

    handleUploadFinished(event) {
        const uploadedFiles = event.detail.files;
        refreshApex(this.wiredActivities);
        this.dispatchEvent(
        new ShowToastEvent({
            title: "Success!",
            message: uploadedFiles.length + " Files Uploaded Successfully.",
            variant: "success"
        })
        );
    }
    //GETTING FILES ENDS

    //GOOGLE MAP MARKER STARTS
    mapMarkers
    zoomLevel
    listView
    @api myProjectIdForGetMapData;

    @wire(getMapData, { ProjectId: "$myProjectIdForGetMapData" })
    mapResponse(value) {
        const { data, error } = value;
        if (data) {
                //MAP IF CONDITION STARTS
                let arr = [];
                var res = data;
                for(var key in res){
                    var stt = key;
                    var noEmp = res[key].empEnrolledInMed;
                    var col = "red";
                    // //COLOR STARTS
                    // if(1 < noEmp <= 4){
                    //     var col = "gold";
                    // }
                    // if(4 < noEmp <= 6){
                    // var col = "blue";
                    // }
                    // if(6 < noEmp <= 8){
                    // var col = "pink";
                    // }
                    // if(8 < noEmp <= 48){
                    //     var col = "green";
                    // }
                    // if(noEmp > 48){
                    //     var col = "red";
                    // }
                    // //COLOR ENDS
                    var arr1 =
                        {
                        location: {
                        Country: "United State Of America",
                        State: stt
                        },
                        title : 'Number of Employees Enrolled in Medical '+noEmp+'('+stt+')',
                        mapIcon: {
                            path: "M 125,5 155,90 245,90 175,145 200,230 125,180 50,230 75,145 5,90 95,90 z",
                            fillColor: col,
                            fillOpacity: .8,
                            strokeWeight: 0,
                            scale: .10,
                            anchor: {x: 122.5, y: 115}
                            },
                        };
                        arr.push(arr1);
                }
                    //CHECKING DATA TO DISPALY IN THE MAP STARTS
                    if(arr.length > 0){
                        this.mapMarkers = arr;
                    }
                    else{
                        this.mapMarkers = [
                            {
                                location: {
                                    Latitude: '39.0119',
                                    Longitude: '-98.4842',
                                },
                                mapIcon: {
                                    path: 'Mn 129,5 155,90 245,90 175,145 200,230 125,180 50,230 75,145 5,90 95,90 z',
                                    fillOpacity: .8,
                                    strokeWeight: 0,
                                    scale: .10,
                                    anchor: {x: 122.5, y: 115}
                                    },
                            },
                        ];
                        this.zoomLevel = 4;
                    }
                    //CHECKING DATA TO DISPALY IN THE MAP ENDS
                //Google Maps API supports zoom levels from 1 to 22 in desktop browsers, and from 1 to 20 on mobile.
                this.zoomLevel = 5;
                this.listView = "hidden"; //visible
                //MAP IF CONDITION ENDS
        }
        else if (error) {
        this.dispatchEvent(
            new ShowToastEvent({
            title: "Error loading Files",
            message: error.body.message,
            variant: "error"
            })
        );
        }
    }

    //GET CENSUS DATA(DEMOGRAPHICS AND GEOGRAPHIES) STARTS
    @api myProjectIdForGetCensusDeo;

    @wire(getCensusGeoDataList, { ProjectId: "$myProjectIdForGetCensusDeo" })
    censusGeoDataResponse(value) {
        const { data, error } = value;
        if (data) {
            var metric0 = data[0];
            var metric1 = data[1];
            var metric2 = data[2];
            var metric3 = data[3];
            var metric4 = data[4];
            var metric5 = data[5];
            var metric6 = data[6];
            var metric7 = data[7];
            this.censusGeoData = [
                { id: 1, metric: 'Benefits Eligible Employees', total: metric0},
                { id: 2, metric: 'Medical Enrollment', total: metric1},
                { id: 3, metric: 'Medical Participation %', total: metric2},
                { id: 4, metric: 'Single Coverage Election', total: metric3},
                { id: 5, metric: 'Gender (% Male)', total: metric4},
                { id: 6, metric: 'Average Age', total: metric5},
                { id: 5, metric: 'Average Tenure', total: metric6},
                { id: 6, metric: 'Average Family Size', total: metric7},
            ];
        }
        else if (error) {
        this.dispatchEvent(
            new ShowToastEvent({
            title: "Error loading getCensusGeoDataList",
            message: error.body.message,
            variant: "error"
            })
        );
        }
    }
    //GET CENSUS DATA(DEMOGRAPHICS AND GEOGRAPHIES) ENDS


    connectedCallback() {

    //GET THE DEFAULT PROJECT RECORDS BY USER STARTS
    getDefaultProject()
    .then(result=> {
        this.myRecordId = result[0].Project__c;
        this.myProjectIdForGetAcc = result[0].Project__c;
        this.myProjectIdForGetProList = result[0].Project__c;
        this.myProjectIdForGetCon = result[0].Project__c;
        this.defaultProjectId = result[0].Project__c;
        this.myProjectIdForGetCount = result[0].Project__c;
        this.myProjectIdForGetCensus = result[0].Project__c;
        this.myProjectIdForGetCensusForHandle = result[0].Project__c;
        this.myProjectIdForGetMapData = result[0].Project__c;
        this.myProjectIdForLoadPlan = result[0].Project__c;
        this.myProjectIdForGetCensusDeo = result[0].Project__c;
        this.projectIdToCreatePt = result[0].Project__c;
    })
    //GET THE DEFAULT PROJECT RECORDS BY USER ENDS


    //FILTER THE ACCOUNT RECORDS BY USER STARTS
    getAccountList()
    .then(result=> {
    let arr = [];
    for(var i = 0; i< result.length; i++){
    arr.push({ label: result[i].Name, value: result[i].Id})
    }
    this.accountList = arr;
    })
    //FILTER THE ACCOUNT RECORDS BY USER ENDS


    //GET PROJECT LIST BY DEFAULT PROJECT NAME(DEFAULT ACCOUNT NAME) FOR ASSIGN TO THE PROJECT DROUP DOWN STARTS
    getProListByDefaultPro()
    .then(result=> {
    let proArr = [];
    for(var i = 0; i< result.length; i++){
        proArr.push({ label: result[i].Project_Title__c, value: result[i].Id})
    }
    this.pprojectList = proArr;
    })
    //GET PROJECT LIST BY DEFAULT PROJECT NAME(DEFAULT ACCOUNT NAME) FOR ASSIGN TO THE PROJECT DROUP DOWN ENDS

    }

}