import { LightningElement , wire , track} from 'lwc';
import getMapData from '@salesforce/apex/OverallStatusController.getMapData';
//import getProjectList from "@salesforce/apex/OverallStatusController.getProjectList";

export default class TestingOverallStatus extends LightningElement {
zoomLevel
listView
mapMarkers


// @track mapMarkers = [];

// @wire (getMapData) newLocalMethodForRep({error,data}){
//     if(data){
//         let arr = [];
//         for(var i = 0; i< data.length; i++){
//         arr.push({ location : {
//             Country: "United State Of America",
//             State: data[i]
//             },
//             title : 'The Landmark Building'
//         })
//         }

//         console.log('arr>>'+JSON.stringify(arr));
//         this.mapMarkers = arr;
//         console.log('this.mapMarkers>>'+JSON.stringify(this.mapMarkers));

//         //Google Maps API supports zoom levels from 1 to 22 in desktop browsers, and from 1 to 20 on mobile.
//         this.zoomLevel = 5;
//         this.listView = "visible";
//     }
//     if(error){
//         console.log(error);
//         this.repError = error;
//     }
// }


connectedCallback(){
    //GOOGLE MAP MARKER STARTS
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
    this.zoomLevel = 3;

}
}

//for(var key in result){