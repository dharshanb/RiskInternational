public class OverallStatusController {

    public static String conProjectID {get;set;}
    public OverallStatusController(){
        List<Project_Team__c> projectTeam = [SELECT Id,User__c,Project__r.Name,Project__r.Id FROM Project_Team__c WHERE User__c =: UserInfo.getUserId() LIMIT 1];
        if(projectTeam.size() > 0){
            conProjectID = projectTeam[0].Project__r.Id;
        }
    }

    @AuraEnabled(cacheable=true)
    public static List<Report> getReports() {
        List<Report> reportList = [SELECT Id,Name,DeveloperName,Description FROM Report];
        return reportList;
    }

    @AuraEnabled(cacheable=true)
    public static String getCensusEmpCount(String ProjectId) {
        try {
            List<Census__c> censusEmpCount = [SELECT Id, Employee_Name__c FROM Census__c WHERE Medical_Coverage__c =: 'Employee (Only)' AND Project__r.Id =: ProjectId];
            return String.valueOf(censusEmpCount.size());
        }
        catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled(cacheable=true)
    public static String getCensusEmpCountByProject(String ProjectId) {
        try {
            List<Census__c> censusEmpCount = [SELECT Id, Employee_Name__c FROM Census__c WHERE Medical_Coverage__c =: 'Employee (Only)' AND Project__r.Id =: ProjectId];
            return String.valueOf(censusEmpCount.size());
        }
        catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled(cacheable=true)
    public static String getCensusEmpFamCount(String ProjectId) {
        try {
            List<Census__c> censusEmpFamCount = [SELECT Id, Employee_Name__c FROM Census__c WHERE Medical_Coverage__c =: 'Employee + Family' AND Project__r.Id =: ProjectId];
            return String.valueOf(censusEmpFamCount.size());
        }
        catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled(cacheable=true)
    public static String getCensusEmpFamCountByProject(String ProjectId) {
        try {
            List<Census__c> censusEmpFamCount = [SELECT Id, Employee_Name__c FROM Census__c WHERE Medical_Coverage__c =: 'Employee + Family' AND Project__r.Id =: ProjectId];
            return String.valueOf(censusEmpFamCount.size());
        }
        catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled(cacheable=true)
    public static String getCensusLivesCount(String ProjectId) {
        try {
            List<Census__c> censusLivesCount = [SELECT Id, Employee_Name__c FROM Census__c WHERE Project__r.Id =: ProjectId];
            return String.valueOf(censusLivesCount.size());
        }
        catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled(cacheable=true)
    public static String getCensusLivesCountByProject(String ProjectId) {
        try {
            List<Census__c> censusLivesCount = [SELECT Id, Employee_Name__c FROM Census__c WHERE Project__r.Id =: ProjectId];
            return String.valueOf(censusLivesCount.size());
        }
        catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }


    @AuraEnabled(cacheable=true)
    public static List<Census__c> getCensus(String ProjectId) {
        List<Census__c> censusList = [SELECT Id, Employee_Name__c, Job__c, Annual_Salary__c, Job_Title__c, Medical_Plan__c, Vision_Plan__c, Dep_FSA__c, Med_FSA__c, Dental_Plan__c, Covered__c,Medical_Coverage__c FROM Census__c WHERE Project__r.Id =: ProjectId LIMIT 6];
        return censusList;
    }

    @AuraEnabled(cacheable=true)
    public static List<Census__c> getCensusByProject(String ProjectId) {
        List<Census__c> censusList = [SELECT Id, Employee_Name__c, Job__c, Annual_Salary__c, Job_Title__c, Medical_Plan__c, Vision_Plan__c, Dep_FSA__c, Med_FSA__c, Dental_Plan__c, Covered__c,Medical_Coverage__c FROM Census__c WHERE Project__r.Id =: ProjectId LIMIT 6];
        return censusList;
    }

    //GET UNIQUE EMPLOYEE NAME STARTS
    @AuraEnabled(cacheable=true)
    public static List<String> getUniqueEmpName() {
        List<String> nameList = new List<String>();
        Map<Id,AggregateResult> empNameMap = new Map<Id,AggregateResult>([SELECT Employee_Name__c Id, COUNT(Id) empName FROM Census__c WHERE Employee_Name__c != NULL GROUP BY Employee_Name__c LIMIT 20]);
        for(String name:empNameMap.keySet()){
            nameList.add(name);
        }
        return nameList;
    }
    //GET UNIQUE EMPLOYEE NAME ENDS

    //GET UNIQUE MEDICAL PLAN STARTS
    @AuraEnabled(cacheable=true)
    public static List<String> getUniqueMedicalPlan(String ProjectId) {
        System.debug('ProjectId>>'+ProjectId);
        Set<String> planSet = new Set<String>();
        List<String> planList = new List<String>();
        List<Census__c> censusList = [SELECT Id,Medical_Plan__c FROM Census__c WHERE Project__c =: ProjectId];
        for(Census__c plan : censusList){
            planSet.add(plan.Medical_Plan__c);
        }
        for(String planCen : planSet){
            planList.add(planCen);
        }
        System.debug('planList>>'+planList);
        return planList;
    }
    //GET UNIQUE MEDICAL PLAN ENDS

    //GET MAP DATA STARTS
    @AuraEnabled(cacheable=true)
    public static Map<Id,AggregateResult> getMapData(String ProjectId) {
        try {
        Map<Id,AggregateResult> stateCountMap = new Map<Id,AggregateResult>([SELECT Home_Address_State__c Id, COUNT(Id) empEnrolledInMed FROM Census__c WHERE Project__r.Id =: ProjectId AND Medical_Plan__c != NULL GROUP BY Home_Address_State__c]);
        System.debug(stateCountMap);
        return stateCountMap;
        }
        catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled(cacheable=true)
    public static Map<Id,AggregateResult> getMapDataByProFilter(String ProjectId) {
        try {
        Map<Id,AggregateResult> stateCountMap = new Map<Id,AggregateResult>([SELECT Home_Address_State__c Id, COUNT(Id) empEnrolledInMed FROM Census__c WHERE Project__r.Id =: ProjectId AND Medical_Plan__c != NULL GROUP BY Home_Address_State__c]);
        System.debug(stateCountMap);
        return stateCountMap;
        }
        catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    //GET MAP DATA ENDS

    @AuraEnabled(cacheable=true)
    public static List<Census__c> getCensusForPopup(String Name,String plan,String ProjectId) {
        // List<Census__c> censusList = [SELECT Id, Employee_Name__c, Job__c, Annual_Salary__c, Job_Title__c, Medical_Plan__c, Vision_Plan__c, Dep_FSA__c, Med_FSA__c, Dental_Plan__c, Covered__c FROM Census__c];
        // return censusList;
        System.debug('Name>>'+Name+'<<<plan>>>'+plan+'ProjectId>>'+ProjectId);
        try {
            String query = 'SELECT Id, Employee_Name__c, Job__c, Annual_Salary__c, Job_Title__c, Medical_Plan__c, Vision_Plan__c, Dep_FSA__c, Med_FSA__c, Dental_Plan__c, Covered__c,Medical_Coverage__c  FROM Census__c WHERE Project__r.Id =\''+ProjectId+'\'';
            if(Name <> null && plan <> null){
                if(Name <> 'All' && plan <> 'All'){
                    query += ' AND Medical_Coverage__c =\''+Name+'\' AND Medical_Plan__c =\''+plan+'\'';
                }
                else{
                    if(Name == 'All' && plan == 'All'){
                        //NO CONCATINATION
                    }
                    else{
                        if(Name == 'All'){
                        query += ' AND Medical_Plan__c =\''+plan+'\'';
                        }
                        if(plan == 'All'){
                        query += ' AND Medical_Coverage__c =\''+Name+'\'';
                        }
                    }
                }
            }
            else{
                if(Name <> null){
                    if(Name <> 'All'){
                    query += ' AND';
                    query += ' Medical_Coverage__c =\''+Name+'\'';
                    }
                }
                if(plan <> null){
                    if(Name <> 'All'){
                    query += ' AND';
                    query += ' Medical_Plan__c =\''+plan+'\'';
                    }
                }
            }
            System.debug('query>>'+query);
            List<Census__c> censusList = (Database.query(query));
            return censusList;
        }
        catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled(cacheable=true)
    public static List<Census__c> getCensusList(String Name,String plan,String ProjectId) {
        System.debug('Name>>'+Name+'<<<plan>>>'+plan+'ProjectId>>'+ProjectId);
        try {
        String query = 'SELECT Id, Employee_Name__c, Job__c, Annual_Salary__c, Job_Title__c, Medical_Plan__c, Vision_Plan__c, Dep_FSA__c, Med_FSA__c, Dental_Plan__c, Covered__c,Medical_Coverage__c FROM Census__c WHERE Project__r.Id =\''+ProjectId+'\'';
        if(Name <> null && plan <> null){
            if(Name <> 'All' && plan <> 'All'){
                query += ' AND Medical_Coverage__c =\''+Name+'\' AND Medical_Plan__c =\''+plan+'\'';
                query += ' LIMIT 6';
            }
            else{
                if(Name == 'All' && plan == 'All'){
                    query += ' LIMIT 6';
                }
                else{
                if(Name == 'All'){
                query += ' AND Medical_Plan__c =\''+plan+'\'';
                query += ' LIMIT 6';
                }
                if(plan == 'All'){
                query += ' AND Medical_Coverage__c =\''+Name+'\'';
                query += ' LIMIT 6';
                }
                }
            }
        }
        else{
            if(Name <> null){
                if(Name <> 'All'){
                query += ' AND';
                query += ' Medical_Coverage__c =\''+Name+'\'';
                query += ' LIMIT 6';
                }
                else{
                query += ' LIMIT 6';
                }
            }
            if(plan <> null){
                if(plan <> 'All'){
                query += ' AND';
                query += ' Medical_Plan__c =\''+plan+'\'';
                query += ' LIMIT 6';
                }
                else{
                    query += ' LIMIT 6';
                }
            }
        }
        System.debug('query>>'+query);
        List<Census__c> censusList = (Database.query(query));
        return censusList;
        }
        catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled(cacheable=true)
    public static void fetchFilterReports(String name) {
        System.debug('name>>>'+name);
        if(name <> null){
        // List<Report> reportList = [SELECT Id,Name,DeveloperName,Description FROM Report WHERE Name =: name ];
        }
        // return reportList;
    }

    @AuraEnabled(cacheable=true)
    public static List<Project_Team__c> getContact(String ProjectId) {
        try {
            List<Project_Team__c> ProTEams= [Select Id,User__c,User__r.Email,User__r.Name,User__r.Phone from Project_Team__c where project__c=: ProjectId LIMIT 3];
            return ProTEams;
        }
        catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled(cacheable=true)
    public static List<Project_Team__c> getContactListByProject(String ProjectId) {
        try {
            List<Project_Team__c> ProTEams= [Select Id,User__c,User__r.Email,User__r.Name,User__r.Phone from Project_Team__c where project__c=: ProjectId LIMIT 3];
            return ProTEams;
        }
        catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled(cacheable=true)
    public static List<Project_Team__c> getContactForPopup(String ProjectId) {
        try {
            List<Project_Team__c> ProTEams= [Select Id,User__c,User__r.Email,User__r.Name,User__r.Phone from Project_Team__c where project__c=: ProjectId];
            return ProTEams;
        }
        catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled(cacheable=true)
    public static List<Project_Team__c> getContactForPopupListByProject(String ProjectId) {
        try {
            List<Project_Team__c> ProTEams= [Select Id,User__c,User__r.Email,User__r.Name,User__r.Phone from Project_Team__c where project__c=: ProjectId];
            return ProTEams;
        }
        catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled(cacheable=true)
    public static Project__c getAccountByProFilter(String ProjectId) {
        try {
            Project__c accNameFromProject = [SELECT Id,Name,Project_Title__c,Account__r.Name FROM Project__c WHERE Id =: ProjectId];
            return accNameFromProject;
        }
        catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    //GET PROJECT LIST BY DEFAULT PROJECT NAME(DEFAULT ACCOUNT NAME) FOR ASSIGN TO THE PROJECT DROUP DOWN STARTS
    @AuraEnabled(cacheable=true)
    public static List<Project__c> getProListByDefaultPro(){
        List<Project_Team__c> ptList = [SELECT Id,Project__r.Name,Project__r.Account__c FROM Project_Team__c WHERE User__c =: UserInfo.getUserId() ORDER BY Project__r.LastModifiedDate DESC LIMIT 1];
        List<Project__c> proList = [SELECT Id,Project_Title__c FROM Project__c WHERE Account__c =: ptList[0].Project__r.Account__c ORDER BY LastModifiedDate DESC];
        return proList;
    }
    //GET PROJECT LIST BY DEFAULT PROJECT NAME(DEFAULT ACCOUNT NAME) FOR ASSIGN TO THE PROJECT DROUP DOWN ENDS

    @AuraEnabled(cacheable=true)
    public static string runReport() {
        Report reportList = [SELECT Id,Name,DeveloperName,Description FROM Report WHERE DeveloperName = 'Accounts Report' LIMIT 1];
        return JSON.serialize(Reports.ReportManager.runReport(reportList.Id,true));
    }

    @AuraEnabled(cacheable=true)
    public static List<ContentVersion> getVersionFiles(String recordId){
        try {
            return [
		SELECT Id,Title,ContentDocumentId,FileType,ContentSize,FileExtension,VersionNumber,CreatedDate,VersionData,FirstPublishLocationId FROM ContentVersion WHERE FirstPublishLocationId =:recordId ORDER BY CreatedDate DESC];
        }
        catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled(cacheable=true)
    public static List<ContentVersion> getVersionFilesByProject(String ProjectId){
        try {
        return [
		SELECT Id,Title,ContentDocumentId,FileType,ContentSize,FileExtension,VersionNumber,CreatedDate,VersionData,FirstPublishLocationId FROM ContentVersion WHERE FirstPublishLocationId =:ProjectId ORDER BY CreatedDate DESC];
        }
        catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled(cacheable=true)
    public static List<Account> getAccountList(){
        Set<Id> accIdSet = new Set<Id>();
        for(Project_Team__c proTeamObj : [SELECT Id,AccountId__c FROM Project_Team__c WHERE User__c =: UserInfo.getUserId() AND Project__r.Active__c = true]){
            accIdSet.add(proTeamObj.AccountId__c);
        }
        List<Account> accList = [SELECT Id,Name FROM Account where Id IN : accIdSet];
        return accList;
    }

    @AuraEnabled(cacheable=true)
    public static List<Project__c> getProjectListByAccount(String AccountId){
        // system.debug('getProjectListByAccount>UserInfo.getUserId()>>'+UserInfo.getUserId());
        System.debug('AccountId>>'+AccountId);
         return [SELECT Id,Name,Project_Title__c FROM Project__c WHERE Account__c =: AccountId];
    }

    @AuraEnabled(cacheable=true)
    public static List<Project_Team__c> getDefaultProject(){
        system.debug('UserInfo.getUserId()>>'+UserInfo.getUserId());
        return [SELECT Id,Project__c FROM Project_Team__c WHERE User__c =: UserInfo.getUserId() ORDER BY Project__r.LastModifiedDate DESC LIMIT 1];
    }




//---------------------------getCensusGeoDataList-----------------------------STARTS---------------------------getCensusGeoDataList-------------
    @AuraEnabled(cacheable=true)
    public static List<String> getCensusGeoDataList(String ProjectId){
        try {
        List<String> nameList = new List<String>();
        Integer abc1;
        Integer abc2;

        //Benefits Eligible Employees STARTS
        List<Census__c> censusLivesCount = [SELECT Id FROM Census__c WHERE Project__r.Id =: ProjectId];
        if(censusLivesCount.size() > 0){
            abc1 = censusLivesCount.size();
            String str1 = String.valueOf(abc1);
            nameList.add(str1);
        }
        else{
            nameList.add('0');
            abc1 = 0;
        }
        //Benefits Eligible Employees ENDS

        //Medical Enrollment STARTS
        List<Census__c> censusMedEnrollCount = [SELECT Id FROM Census__c WHERE Project__r.Id =: ProjectId AND Medical_Plan__c <> 'Waive Medical Coverage'];
        if(censusMedEnrollCount.size() > 0){
            abc2 = censusMedEnrollCount.size();
            String str2 = String.valueOf(abc2);
            nameList.add(str2);
        }
        else{
            nameList.add('0');
            abc2 = 0;
        }
        //Medical Enrollment ENDS

        //Medical Participation % STARTS
        Integer perWon;
        if(abc1 > 0){
            if(abc2 > 0){
                perWon = (abc2 * 100 / abc1);
                String str2 = String.valueOf(abc2);
            }
            else{
                perWon = 0;
            }
        }
        else{
            perWon = 0;
        }
        nameList.add(String.valueOf(perWon)+'%');
        //Integer perWon = (341 * 100 / 399);
        //Medical Participation % ENDS

        //Single Coverage Election STARTS
        List<Census__c> censusSigleCovCount = [SELECT Id FROM Census__c WHERE Project__r.Id =: ProjectId AND Medical_Plan__c <> 'Waive Medical Coverage' AND Medical_Coverage__c =: 'Employee (Only)'];
        if(censusSigleCovCount.size() > 0){
            Integer perWonSing = (censusSigleCovCount.size() * 100 / abc2);
            nameList.add(String.valueOf(perWonSing)+'%');
        }
        else{
            nameList.add('0%');
        }
        //Single Coverage Election ENDS

        //Gender (% Male) STARTS
        List<Census__c> censusGenCount = [SELECT Id FROM Census__c WHERE Project__r.Id =: ProjectId AND Medical_Plan__c != 'Waive Medical Coverage' and Gender__c = 'Male'];
        if(censusGenCount.size() > 0){
            Integer perWonGen = (censusGenCount.size() * 100 / abc2);
            nameList.add(String.valueOf(perWonGen)+'%');
        }
        else{
            nameList.add('0%');
        }
        //Gender (% Male) ENDS

        nameList.add('-');
        nameList.add('-');
        nameList.add('-');
        nameList.add('-');
        return nameList;

        }
        catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

//---------------------------getCensusGeoDataList-----------------------------ENDS---------------------------getCensusGeoDataList-------------

    @AuraEnabled(cacheable=true)
    public static List<Project_Team__c> getProjectList(){
        system.debug('UserInfo.getUserId()>>'+UserInfo.getUserId());
        return [SELECT Id,User__c,Project__r.Name,Project__r.Id FROM Project_Team__c WHERE User__c =: UserInfo.getUserId()];
    }


    @AuraEnabled(cacheable=true)
    public static List<Project__c> getDefaultProNameByProFilter(String ProjectId){
        return [SELECT Id, Name FROM Project__c where Id =: ProjectId];
    }

    @AuraEnabled(cacheable=true)
    public static List<Project_Team__c> getteamsListByProject(String ProjectId) {
        try {
            List<Project_Team__c> ProTEams= [Select Id,User__c,User__r.Email,User__r.Name,User__r.Phone from Project_Team__c where project__c=: ProjectId];
            return ProTEams;
        }
        catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

}