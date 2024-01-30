import getClient from '../helpers/getClient';
import ReactGA from 'react-ga'

const IncidentsExportResultsCSV = (analytics_key, user) => {
    initialize(analytics_key);
    //console.log(analytics_key,user,getClient(),"FireEvents");
    fireEvent({
        category: 'Incidents',
        action: `Export Results to csv for Client Id:- ${getClient()}`,
        label: `Export Results to csv performed by User:- ${user} for Client Id:-${getClient()}  `
    })
}

const IncidentsExportResultsPDF = (analytics_key, user) => {
    initialize(analytics_key);
    //console.log(analytics_key,user,getClient(),"FireEventsPDF");
    fireEvent({
        category: 'Incidents',
        action: `Export Results to PDF for Client Id:- ${getClient()}`,
        label: `Export Results to PDF performed by User:- ${user} for Client Id:-${getClient()}  `
    })
}

const MergeIncidents = (analytics_key, user) => {
    initialize(analytics_key);
   // console.log(analytics_key,user,getClient(),"FireEvents");
    fireEvent({
        category: 'Edit Incident',
        action: `Merging Incident for Client Id:- ${getClient()}`,
        label: `Merging Incident performed by User:- ${user} for Client Id:-${getClient()}  `
    })
}

const PdfExport = (analytics_key, user) => {
    initialize(analytics_key);
  //  console.log(analytics_key,user,getClient(),"FireEvents");
    fireEvent({
        category: 'Edit Incident',
        action: `PDF Export by Client Id:- ${getClient()}`,
        label: `PDF Export performed by User:- ${user} for Client Id:-${getClient()}  `
    })
}

const PreviewEmail = (analytics_key) => {
    initialize(analytics_key);
    //console.log(analytics_key,getClient(),"FireEvents");
    fireEvent({
        category: 'Edit Incident',
        action: `Preview Training Mail by Client Id:- ${getClient()}`,
        label: `Preview  Training  Mail by Client Id:- ${getClient()} `
    })
}


const SaveCompanyInfo = (analytics_key,user) => {
    initialize(analytics_key);
   // console.log(analytics_key,user,getClient(),"FireEvents");
    fireEvent({
        category: 'Company Info',
        action: `Edit Company Info Client Id:- ${getClient()}`,
        label: `Edit Company Info performed by User:- ${user} for Client Id:-${getClient()} `
    })
}

const SaveEmailSignature = (analytics_key,user,method) => {
    initialize(analytics_key);
   // console.log(analytics_key,user,getClient(),method,"FireEvents");
    if(method=="put"){
        fireEvent({
            category: 'Email Signature',
            action: `Edit Email Signature for Client Id:- ${getClient()}`,
            label: `Edit Email Signature by User:- ${user} for Client Id:-${getClient()} `
        })
    }
    else{
        fireEvent({
            category: 'Email Signature',
            action: `Create Email Signature for Client Id:- ${getClient()}`,
            label: `Create Email Signature by User:- ${user} for Client Id:-${getClient()} `
        })
    }
    
}

const PreviewEmailSignature = (analytics_key,user) => {
    initialize(analytics_key);
   // console.log(analytics_key,user,getClient(),"FireEvents");
        fireEvent({
            category: 'Email Signature',
            action: `Preview Email Signature for Client Id:- ${getClient()}`,
            label: `Preview Email Signature by User:- ${user} for Client Id:-${getClient()} `
        }) 
}


const SaveTerritory = (analytics_key,user,method) => {
    initialize(analytics_key);
   // console.log(analytics_key,user,getClient(),"FireEvents");
        fireEvent({
            category: 'Territory',
            action: method=="put"?`Edit Territory for Client Id:- ${getClient()}`:`Create Territory for Client Id:- ${getClient()}`,
            label: method=="put"?`Edit  Territory by User:- ${user} for Client Id:- ${getClient()} `:`Create Territory by User:- ${user} for Client Id:- ${getClient()} `
        }) 
}

const actions =(section,analytics_key,user,method)=>{
    initialize(analytics_key);
    //console.log(analytics_key,user,getClient(),"FireEvents");
    if(!!method && method.includes("Email")){
        fireEvent({
            category: `${section}`,
            action:`Send  ${method} for Client Id:- ${getClient()}`,
            label: `Send ${method}  by User:- ${user} for Client Id:- ${getClient()}` 
        })
    }
    else if(method=="download"){
        fireEvent({
            category: `${section}`,
            action:`Download ${section} for Client Id:- ${getClient()}`,
            label: `Download ${section}  by User:- ${user} for Client Id:- ${getClient()}` 
        })
    }
    else if(method=="delete"){
        fireEvent({
            category: `${section}`,
            action:`Delete ${section} for Client Id:- ${getClient()}`,
            label: `Delete ${section}  by User:- ${user} for Client Id:- ${getClient()}` 
        })
    }
    else{
        fireEvent({
            category: `${section}`,
            action:`${method=="put"?'Edit ':'Create '} ${section} for Client Id:- ${getClient()}`,
            label: `${method=="put"?'Edit ':'Create '} ${section}  by User:- ${user} for Client Id:- ${getClient()}` 
        })
    }
}

const initialize = (analytics_key) => {
    ReactGA.initialize(analytics_key);
}

const fireEvent = (evt) => {
    //console.log(evt,"event to GA");
    ReactGA.event(evt);
}
const commonFormSubmit=(analytics_key,url,method,user)=>{
    //console.log(analytics_key,url,method,user,"commonFormData");
    if(url=='/case_management/clients'){
        SaveCompanyInfo(analytics_key,user)
    }
   else if(url.endsWith("/territories")){
        SaveTerritory(analytics_key,user,method)
    }
   else if(url.endsWith("/languages")){
        actions("Language",analytics_key,user,method)
    }
    else if(!!user){
      var section = url.split("/")[url.split("/").length-1];
      actions(section,analytics_key,user,method)
    }
}
const commonDelete=(analytics_key,url,user)=>{
    initialize(analytics_key);
  //  console.log(analytics_key,url,getClient(),user,"deleteparams");
    if(url.includes('/territories/')){
        fireEvent({
            category: 'Territory',
            action: `Delete Territory for Client Id:- ${getClient()}`,
            label: `Delete Territory by User:- ${user} for Client Id:- ${getClient()}` 
        })
    }
    else{
       let section= url.split("/")[url.split("/").length-2];
       actions(section,analytics_key,user,"delete");
    }
}
export default {
    IncidentsExportResultsCSV,
    IncidentsExportResultsPDF,
    MergeIncidents,
    PdfExport,
    PreviewEmail,
    commonFormSubmit,
    SaveEmailSignature,
    PreviewEmailSignature,
    commonDelete,
    actions
}