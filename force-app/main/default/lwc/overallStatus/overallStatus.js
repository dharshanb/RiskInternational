import { LightningElement,api,track,wire} from 'lwc';
/*import getDefaultProject from "@salesforce/apex/OverallStatusController.getDefaultProject";*/
import getOverallBudget from "@salesforce/apex/OverallStatusController.getOverallBudget";
import getOverallBudgetMap from "@salesforce/apex/OverallStatusController.getOverallBudgetMap";
import getOverallStatusDataTable from "@salesforce/apex/OverallStatusController.getOverallStatusDataTable";
import getOverallStatusDataTableAll from '@salesforce/apex/OverallStatusController.getOverallStatusDataTableAll';
import getOverallBudgetMapByProject from "@salesforce/apex/OverallStatusController.getOverallBudgetMapByProject";
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
import IMAGES from "@salesforce/resourceUrl/testUserImage";
//import IMAGES from "@salesforce/resourceUrl/static_images";
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
import getMedicalCost from '@salesforce/apex/OverallStatusController.getMedicalCost';
import method1 from '@salesforce/apex/OverallStatusController.thirdTableCtrl';

import getMonthlyCencesCount from '@salesforce/apex/OverallStatusController.getMonthlyCencesCount';

const thirdTableColumns = [
    {label : 'Relation', fieldName : 'Relation__c'},
    {label : 'Diagnosis Condition' , fieldName : 'Diagnosis_Condition__c' },
    {label : 'Ongoing Status' , fieldName : 'Ongoing_Status__c', 
        cellAttributes:{
            class:{fieldName:'tdColor'}
        }
    },
    {label : 'YTD', fieldName : 'YTD_Last_12_months__c' , type : 'Currency'}
];

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
    @api Quarter = 3;
    isPositive;
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
    @api getLivesMonthlyCount;
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
    overallBudget = '';
    overallSurplus = '';
    tabLoaded1 = true;
    tabLoaded2 = false;
    tabLoaded3 = false;
    progressBarLoaded = false;
    @api progressPercent;
    //teamMemberImage = IMAGES + '/static_images/images/Screenshot 2022-10-19 at 12.39.59 AM (1).png';
    @track totalMedicalClaims=0.00;
    @track  totalRxRebates =0.00;
    @track totalRxRebatesNew=0.00;
    surplusArrow = false;
    deficitArrow = false;
    neutralArrow = false;
    teamMemberImage = IMAGES + '/image_test/img.png';

    // //PUT DATA TO CENSUS DATATABLE(DEMOGRAPHICS AND GEOGRAPHIES) STARTS
    // get optionsForCensusGeoDta(){
    //     return this.censusGeoData;
    // }
    // //PUT DATA TO CENSUS DATATABLE(DEMOGRAPHICS AND GEOGRAPHIES) STARTS

    @track ppemData;
    @track ppemDataArray = [];
    @track ppemDataAll;
    @track ppemDataArrayAll= [];

   /* ppemDataColumns = [
        { label: 'Month', fieldName: 'Month_Text__c' },
    { label: 'Medical', fieldName: 'PEPM_Total_Medical_Claims__c'},
    { label: 'Medical Change %', fieldName: ''},
    { label: 'Rx', fieldName: 'PEPM_Total_Rx_Claims__c'},
    { label: 'Rx Change %', fieldName: ''},
    ];*/

    ppemDataColumns = [
        { label: 'Month', fieldName: 'Month' },
    { label: 'Medical', fieldName: 'Medical'},
    { label: 'Medical Change %', fieldName: 'MedicalChange'},
    { label: 'Rx', fieldName: 'Rx'},
    { label: 'Rx Change %', fieldName: 'RxChange'},
    ];

     @track recordsLst ;
     @track thirdTableColumns = thirdTableColumns;
     
    @track isModalOpen = false;
    currentColor='';


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
            console.log('@@==>',result);
        arr.push({ label: result[i].Project_Title__c, value: result[i].Id});
        }
        this.pprojectList = arr;
        
        this.placeholderProName = 'Select Project';
        
            /*if(arr.length>0){
                getMedicalCost({
                    ProjectId : this.filterByProject
                })
                .then(result=>{
                console.log('BBBB==>result===>>',result);
                for (let i = 0; i < result.length; i++) {
                    this.totalMedicalClaims = this.totalMedicalClaims + result[i]['Total_Medical_Claims__c'];
                }
                console.log('@BB@@@@totalMedicalClaims:==>',this.totalMedicalClaims);

                })
                .catch(error=>{
                    this.repError = error;
                });
            }*/
        })
        //GET THE PROJECT RECORDS BY ACCOUNT AND USER ENDS
        //GET PROJECT LIST FOR ASSIGNING TO PROJECT DROPDOWN BY SELECTING THE ACCOUNT ENDS
    }
    //FILTER THE PROJECT RECORDS BY SELECTING THE ACCOUNT ENDS


    //FILTER THE PROJECT RECORDS BY USER STARTS
    @track pprojectList = [];
    @track filterByProject;
    @track arraydataMedical = [];
    @track arraydataRx = [];

    get optionsProject(){
        return this.pprojectList;
    }

    handleChangeForProject(Event) {
        this.filterByProject = Event.detail.value;
        this.projectIdToCreatePt = Event.detail.value;
        this.placeholderLives = '';
        this.placeholderMedPlan = '';

        getOverallBudgetMapByProject({
            ProjectId : this.filterByProject
        })
        .then(result=> {
            this.overallSurplus = result['Surplus'];
            this.overallBudget = result['Budget'];
            this.progressPercent = (Math.abs(this.overallSurplus) / this.overallBudget)*100;
            console.log('@@@ line 1124 overallSurplus -- '+ this.overallSurplus); 
            console.log('@@@ line 1140 overallBudget -- '+ this.overallBudget);  
            console.log('@@@ line 1141 progressPercent -- '+ this.progressPercent); 
            if(this.overallSurplus < 0){
                this.surplusArrow = false;
                this.deficitArrow = true;
                this.neutralArrow = false;
            }else if(this.overallSurplus > 0){
                this.surplusArrow = true;
                this.deficitArrow = false;
                this.neutralArrow = false;
            }else{
                this.surplusArrow = false;
                this.deficitArrow = false;
                this.neutralArrow = true;
            }
        })

        getOverallStatusDataTable({
          ProjectId : this.filterByProject
        })
        .then((result)=> {
            console.log('result 231 -- ' + result);
            

            this.ppemData = result;

            ///////////////
            let k = 0;
            result.forEach((record) => {

                let tempRec = Object.assign({}, record);
                this.arraydataMedical[k] = tempRec?.PEPM_Total_Medical_Claims__c;
                this.arraydataRx[k] = tempRec?.PEPM_Total_Rx_Claims__c;
                //this.arraydataMedical.push[tempRec?.PEPM_Total_Medical_Claims__c];
                //this.arraydataRx.push[tempRec?.PEPM_Total_Rx_Claims__c];
                console.log('result this.arraydataMedical[i] -- ' + this.arraydataMedical[k]); 
            console.log('result this.arraydataRx[i] -- ' + this.arraydataRx[k]); 
            k++;
            });

            console.log('result this.arraydataMedical[i] -- ' + this.arraydataMedical); 
            console.log('result this.arraydataRx[i] -- ' + this.arraydataRx); 

            let i = 0;
            result.forEach((record) => {
                let tempRec = Object.assign({}, record);
                tempRec.Month = tempRec?.Month_Text__c;
                tempRec.Medical = tempRec?.PEPM_Total_Medical_Claims__c;
                console.log('result this.arraydataMedical[i] -- ' + this.arraydataMedical[i]); 
                if(i<11){
                    tempRec.MedicalChange = Math.round(((this.arraydataMedical[i+1] - this.arraydataMedical[i])/ this.arraydataMedical[i+1])*100);
                }
            // tempRec.MedicalChange = 12;
                tempRec.Rx = tempRec?.PEPM_Total_Rx_Claims__c; 
                console.log('result this.arraydataRx[i] -- ' + this.arraydataRx[i]);
                if(i<11){
                    tempRec.RxChange = Math.round(((this.arraydataRx[i+1] - this.arraydataRx[i])/ this.arraydataRx[i+1])*100);
                }
                console.log('result 253 -- ' + tempRec);
            // tempRec.RxChange = 10;
                i++;
                this.ppemDataArray.push(tempRec);
            });
            console.log('result 255 -- ' + result);
            // this.productsData = tempProductsList;
            ///////////////
            /*for (let i = 0; i < result.length; i++) {
                this.ppemDataArray
                console.log('result 236 -- ' + result[i]);
                console.log('result 237 -- ' + result[i]);
            }*/
        })


        getMedicalCost({
            ProjectId : this.filterByProject
        })
        .then(result=>{
           console.log('AAA===>result===>>',result);
           let totalForMedClaim=0.00;
           let totalForRXClaimRebates = 0.00;
           let totalForRXClaims = 0.00;
           let totalForRebates = 0.00;
           for (let i = 0; i < result.length; i++) {
            if(result[i]['Month__c']=== 12 || result[i]['Month__c']=== 9 || result[i]['Month__c']=== 10 ||result[i]['Month__c']=== 11){
                this.totalRxRebatesNew += result[i]['Total_Rx_Rebates__c'];
            }
            totalForMedClaim += result[i]['Total_Medical_Claims__c'];
            //Total_Rx_Claims__c
            totalForRXClaims += result[i]['Total_Rx_Claims__c'];
            totalForRebates += result[i]['Total_Rx_Rebates__c'];
            //Total_Rx_Rebates__c

            }
            totalForRXClaimRebates = totalForRXClaims - totalForRebates;
            this.totalRxRebates = totalForRXClaimRebates.toFixed(2);
            this.totalMedicalClaims = totalForMedClaim.toFixed(2);
        })
        .catch(error=>{
            this.repError = error;
        });


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
            //this.wiredActForPtCreate = resust;
            this.conList = resust;
            this.conCount = resust[0].Project_Teams__r.length;
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
           // this.conCount = this.myPopupContactDataList.length;
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
            console.log(' Riba Live count'+this.getLivesCount);
            this.placeholderLives = 'All lives ('+this.getLivesCount+')';
        })
        .catch(error=>{
            this.repError = error;
        });
        //GET CENSUS(LIVES COUNT) RECORDS COUNT BY SELECTING THE PROJECT ENDS


        getMonthlyCencesCount({
            ProjectId : this.filterByProject
        })
        .then(resust=>{
            this.isPositive= resust>0 ? true : false;
            console.log('isPositive====> '+this.isPositive);

            /*this.getLivesMonthlyCount = json.parse(JSON.stringify(resust)) ;
            this.getLivesMonthlyCount.styleColor= isPositive ? 'text-Color: green' : 'text-Color: red';*/

            this.getLivesMonthlyCount =resust;
            //console.log('getLivesMonthlyCount====> '+getLivesMonthlyCount);
        })
        .catch(error=>{
            this.repError = error;
        });

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
        this.progressBarLoaded = true;
        this.tabLoaded2 = false;
        this.tabLoaded3 = false;
    }

    handleAction2(event){
        this.tabLoaded1 = false;
        this.progressBarLoaded = false;
        this.tabLoaded2 = true;
        this.tabLoaded3 = false;
    }

    handleAction3(event){
        this.tabLoaded1 = false;
        this.progressBarLoaded = false;
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

        this.template.querySelectorAll("div.action11").forEach((element) => {
            element.addEventListener("click", (event)=>{
            let target = event.currentTarget.dataset.tabId;
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

    handlePopupForPEPMData(){
        if(this.filterByProject){
            getOverallStatusDataTableAll({
                ProjectId: this.filterByProject
            })
            .then(result=>{
                var pepmData= result;
                console.log('pepmData===> '+JSON.stringify(pepmData));
                console.log('pepmData[0].Month_Text__c===> '+pepmData[0].Month_Text__c);
                console.log('pepmData.length===> '+pepmData.length);
                for (let index = 0; index < pepmData.length; index++) {
                    //console.log('pepmRec1===> '+index+' ');//+pepmRec[i]);
                    let pepmRec= {};
                   // console.log('pepmRec1===> '+index+' '+pepmRec);
                    pepmRec.Month= pepmData[index].Month_Text__c;
                    pepmRec.Medical= pepmData[index].PEPM_Total_Medical_Claims__c;
                    //console.log('pepmRec2===> '+index+' '+pepmRec);
                    if(index<12){
                        pepmRec.MedicalChange= ((pepmData[index].PEPM_Total_Medical_Claims__c - pepmData[index+1].PEPM_Total_Medical_Claims__c)/pepmData[index].PEPM_Total_Medical_Claims__c )*100;
                    }else{
                        pepmRec.MedicalChange=0;
                    }
                    //console.log('pepmRec3===> '+index+' '+pepmRec);
                    pepmRec.Rx = pepmData[index].PEPM_Total_Rx_Claims__c; 
                    if(index<12){
                        pepmRec.RxChange= ((pepmData[index].PEPM_Total_Rx_Claims__c - pepmData[index+1].PEPM_Total_Rx_Claims__c)/pepmData[index].PEPM_Total_Rx_Claims__c )*100;
                    }else{
                        pepmRec.RxChange=0;
                    }
                    //console.log('pepmRec4===> '+index+' '+pepmRec);
                    this.ppemDataArrayAll.push(pepmRec);
                    console.log('pepmRec===> '+index+' '+JSON.stringify(pepmRec));
                }
                //console.log('this.ppemDataArrayAll===> '+this.ppemDataArrayAll);
            })
            /*.then(resust=>{
                debugger;
                console.log('PEPM Result resust===> '+JSON.stringify(resust));
                this.ppemDataAll = result;
                let k = 0;
                result.forEach((record) => {
                    let tempRec = Object.assign({}, record);
                    this.arraydataMedical[k] = tempRec?.PEPM_Total_Medical_Claims__c;
                    this.arraydataRx[k] = tempRec?.PEPM_Total_Rx_Claims__c;; 
                    k++;
                }); 

                console.log('arraydataMedical===> '+this.arraydataMedical);
                console.log('arraydataMedical===> '+this.arraydataRx);

                let i = 0;
                result.forEach((record) => {
                    let tempRec = Object.assign({}, record);
                    tempRec.Month = tempRec?.Month_Text__c;
                    tempRec.Medical = tempRec?.PEPM_Total_Medical_Claims__c; 
                    if(i<11){
                        tempRec.MedicalChange = Math.round(((this.arraydataMedical[i+1] - this.arraydataMedical[i])/ this.arraydataMedical[i+1])*100);
                    }
                    tempRec.Rx = tempRec?.PEPM_Total_Rx_Claims__c; 
                    if(i<11){
                        tempRec.RxChange = Math.round(((this.arraydataRx[i+1] - this.arraydataRx[i])/ this.arraydataRx[i+1])*100);
                    }
                    i++;
                    this.ppemDataArrayAll.push(tempRec);
                    console.log('tempRec Result resust===> '+JSON.stringify(tempRec));
                });
            })*/
            .catch(error=>{
                this.repError = error;
            });
            const modal = this.template.querySelector("c-model-Popup-For-Pepm-Data");
            modal.show1();
        }
    }

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
        //console.log('get optionsPlan() this.medPlanList>>'+this.medPlanList);
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

    //POP UP WINDOW OF PROJECT TEAM REOCORD CREATION STARTS
    projectIdToCreatePt
    newProjectTeam(){
        const modal1 = this.template.querySelector("c-modal-Popoup-For-Creatept");
        modal1.showPtRecCreate();
    }
    //POP UP WINDOW OF PROJECT TEAM REOCORD CREATION ENDS

    //UPDATE THE CONTACT RECORDS WHEN POP UP OF PROJECT TEAM REOCORD CLOSED ENDS
    wiredActForPtCreate
    wiredPtCretaeForConCount
    handleUpdate(){
        refreshApex(this.wiredActForPtCreate);
        refreshApex(this.wiredPtCretaeForConCount);
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
 //Get the current date/time in UTC
       // QuarterValue();
        //this.getQuarterValue();
    getAccountList();
    //GET THE DEFAULT PROJECT RECORDS BY USER STARTS
    /*getDefaultProject()
    .then(result=> {
        this.myRecordId = result[0].projects__c;
        this.myProjectIdForGetAcc = result[0].projects__c;
        this.myProjectIdForGetProList = result[0].projects__c;
        this.myProjectIdForGetCon = result[0].projects__c;
        this.defaultProjectId = result[0].projects__c;
        this.myProjectIdForGetCount = result[0].projects__c;
        this.myProjectIdForGetCensus = result[0].projects__c;
        this.myProjectIdForGetCensusForHandle = result[0].projects__c;
        this.myProjectIdForGetMapData = result[0].projects__c;
        this.myProjectIdForLoadPlan = result[0].projects__c;
        this.myProjectIdForGetCensusDeo = result[0].projects__c;
        this.projectIdToCreatePt = result[0].projects__c;
    })*/


   /* getOverallBudget()
    .then(result=> {
            this.overallBudget = result;
            console.log('@@@ line 1124 overallBudget -- '+ this.overallBudget);  
    })*/
 
    getOverallBudgetMap()
    .then(result=> {
        //this.overallSurplus = result['Surplus'];
        this.overallBudget = result['Budget'];
        this.progressPercent = (Math.abs(this.overallSurplus) / this.overallBudget)*100;
        console.log('@@@ line 1124 overallSurplus -- '+ this.overallSurplus); 
        console.log('@@@ line 1140 overallBudget -- '+ this.overallBudget);  
        console.log('@@@ line 1141 progressPercent -- '+ this.progressPercent); 
        if(this.overallSurplus < 0){
            this.surplusArrow = false;
            this.deficitArrow = true;
            this.neutralArrow = false;
        }else if(this.overallSurplus > 0){
            this.surplusArrow = true;
            this.deficitArrow = false;
            this.neutralArrow = false;
        }else{
            this.surplusArrow = false;
            this.deficitArrow = false;
            this.neutralArrow = true;
        }
})


    
    //GET THE DEFAULT PROJECT RECORDS BY USER ENDS


    //FILTER THE ACCOUNT RECORDS BY USER STARTS
    getAccountList()
    .then(result=> {
        console.log('All account==>:', result)
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

    get QuarterValue()
    {
let rightNow = new Date();
// Adjust for the user's time zone
rightNow.setMinutes(
    new Date().getMinutes() - new Date().getTimezoneOffset()
);
// Return the date in "YYYY-MM-DD" format
let date = rightNow.toISOString().slice(0,10);
let month = date.split('-');
console.log('Today Date is '+date);  
console.log(month);  
let monthNum = month[1]/3;  
console.log('Month Number is '+monthNum);  
        let QuarterNum = Math.floor(monthNum + 1);
        console.log(QuarterNum);

//Quarter =  QuarterNum.toString();  
return QuarterNum;
}
// CSS for progress bar
get progressStyle() {
    console.log('@@@ line 1141 this.progressPercent -- '+ this.progressPercent);   
    return `width: ${this.progressPercent}%;`;
    }

    get progressToolTipStyle() {
        var tooltipProgress = 0;
        if(this.progressPercent < 16){
            tooltipProgress = 84;
        }else{
            tooltipProgress = 100 - this.progressPercent;
        }
        //var tooltipProgress = 85 - this.progressPercent;
        var toolTipColor = "";
        if(this.overallSurplus < 0){
            toolTipColor = "rgb(162, 13, 13)";
        }else{
            toolTipColor = "rgb(63, 237, 63)";
        }
       
            return `position:absolute;top:-46px;right:${tooltipProgress}%; background-color:${toolTipColor}`;
       
        console.log('@@@ line 1141 this.progressPercent -- '+ this.progressPercent);   
        //return `position:absolute;top:-46px;right:22%; background-color:rgb(63, 237, 63)`;
        }

          /*@wire (method1) 
    wireRecord({data,error}){
    if (data) {
        
        this.recordsLst= data.map(item=>{
                let divColor='';
                if(item.Ongoing_Status__c.includes('Yellow')){
                    divColor= '#fff03f'; // yellow color;
                }else if(item.Ongoing_Status__c.includes('Green')){
                    divColor= 'slds-text-color_success';
                }else{
                    divColor= 'slds-text-color_error';
                }
                console.log('@@@ div color ',divColor);
                return {...item, 
                    "tdColor":divColor
                }
            })
            console.log(this.recordsLst)

    }else if(error){
        console.log("error occured")
    }
   }*/

   @wire (method1,{ ProjectId: "$filterByProject" }) 
    wireRecord({data,error}){
    if (data) {
        
        this.recordsLst= data.map(item=>{
                let divColor='';
                if(item.Ongoing_Status__c.includes('Yellow')){
                    divColor= '#fff03f'; // yellow color;
                }else if(item.Ongoing_Status__c.includes('Green')){
                    divColor= 'slds-text-color_success';
                }else{
                    divColor= 'slds-text-color_error';
                }
                console.log('@@@ div color ',divColor);
                return {...item, 
                    "tdColor":divColor
                }
            })
            console.log(this.recordsLst)

    }else if(error){
        console.log("error occured")
    }
   }

   openModal(){
       console.log('inside handle click ');
       this.isModalOpen = true;
   }


    closeModal() {
        // to close modal set isModalOpen tarck value as false
        this.isModalOpen = false;
    }


    pos = 0;
    str = '';
    color = '';
    get getColor(){
        console.log('method call');
        console.log('Check POS '+this.pos);
        this.str =  '--bg: red';
        console.log('Record List ',this.recordsLst);
        if(this.recordsLst.length>0){
            if(this.recordsLst[this.pos].Ongoing_Status__c.includes('Red')){
                this.color = 'red';
            }
            else if(this.recordsLst[this.pos].Ongoing_Status__c.includes('Green')){
                this.color = 'green ';
            }else if(this.recordsLst[this.pos].Ongoing_Status__c.includes('Yellow')){
                this.color = 'yellow';
            }
            this.str =  '--bg: '+this.color+';';
            this.pos++;
        }
        
        console.log(this.str);
        return this.str;
    }

}