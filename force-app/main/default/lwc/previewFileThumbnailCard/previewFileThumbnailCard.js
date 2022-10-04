import { LightningElement , api , track} from 'lwc';
//import deleteFile from "@salesforce/apex/OverallStatusController.deleteFile";

export default class PreviewFileThumbnailCard extends LightningElement {
    @api file;
    @api recordId;
    @api thumbnail;

    get iconName() {
      if (this.file.Extension) {
        if (this.file.Extension === "pdf") {
          return "doctype:pdf";
        }
        if (this.file.Extension === "ppt") {
          return "doctype:ppt";
        }
        if (this.file.Extension === "xls") {
          return "doctype:excel";
        }
        if (this.file.Extension === "csv") {
          return "doctype:csv";
        }
        if (this.file.Extension === "txt") {
          return "doctype:txt";
        }
        if (this.file.Extension === "xml") {
          return "doctype:xml";
        }
        if (this.file.Extension === "doc") {
          return "doctype:word";
        }
        if (this.file.Extension === "zip") {
          return "doctype:zip";
        }
        if (this.file.Extension === "rtf") {
          return "doctype:rtf";
        }
        if (this.file.Extension === "psd") {
          return "doctype:psd";
        }
        if (this.file.Extension === "html") {
          return "doctype:html";
        }
        if (this.file.Extension === "gdoc") {
          return "doctype:gdoc";
        }
      }
      return "doctype:image";
    }
  
    filePreview() {
      const showPreview = this.template.querySelector("c-preview-file-modal");
      showPreview.show();
    }

    // fileDownload(event) {
    // //    alert('Download>>'+event.target.value);
    // //    var file = event.target.value;
    //    //window.open('https://riskinternational-dev-ed.lightning.force.com/sfc/servlet.shepherd/document/download/', file);
    // }


    //DELETE THE FILE STARTS
    fileDelete(event) {
        alert('FileDeleteId>>'+event.target.value);
        // fileDeletedId = event.detail.value;
        // refreshApex(this.wiredActivities);
        // this.dispatchEvent(
        // new ShowToastEvent({
        //     title: "Success!",
        //     message: fileDeletedId + " Files Deleted Successfully.",
        //     variant: "success"
        // })
        // );
    }

    // @track fileDeletedId;
    // @wire(deleteFile, { fileDeletedId : "$fileRecordId" })
    // fileResponse(value) {
    //     this.wiredActivities = value;
    //     const { data, error } = value;
    //     this.fileList = "";
    //     this.files = [];
    //     if (data) {
    //     this.fileList = data;
    //     for (let i = 0; i < this.fileList.length; i++) {
    //         let file = {
    //         Id: this.fileList[i].Id,
    //         Title: this.fileList[i].Title,
    //         Extension: this.fileList[i].FileExtension,
    //         ContentDocumentId: this.fileList[i].ContentDocumentId,
    //         ContentDocument: this.fileList[i].ContentDocument,
    //         CreatedDate: this.fileList[i].CreatedDate,
    //         thumbnailFileCard:
    //             "/sfc/servlet.shepherd/version/renditionDownload?rendition=THUMB720BY480&versionId=" +
    //             this.fileList[i].Id +
    //             "&operationContext=CHATTER&contentId=" +
    //             this.fileList[i].ContentDocumentId,
    //         downloadUrl:
    //             "/sfc/servlet.shepherd/document/download/" +
    //             this.fileList[i].ContentDocumentId
    //         };
    //         this.files.push(file);
    //     }
    //     this.loaded = true;
    //     } else if (error) {
    //     this.dispatchEvent(
    //         new ShowToastEvent({
    //         title: "Error loading Files",
    //         message: error.body.message,
    //         variant: "error"
    //         })
    //     );
    //     }
    // }
    //DELETE THE FILE ENDS
}