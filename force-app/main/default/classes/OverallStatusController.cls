public class OverallStatusController {

    public static String conProjectID {get;set;}
    public OverallStatusController(){
        List<Project_Team__c> projectTeam = [SELECT Id,User__c,projects__r.Name,projects__r.Id FROM Project_Team__c WHERE User__c =: UserInfo.getUserId() LIMIT 1];
        if(projectTeam.size() > 0){
            conProjectID = projectTeam[0].projects__r.Id;
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
            List<Census__c> censusEmpCount = [SELECT Id, Employee_Name__c FROM Census__c WHERE Medical_Coverage__c =: 'Employee (Only)' AND projects__r.Id =: ProjectId];
            return String.valueOf(censusEmpCount.size());
        }
        catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled(cacheable=true)
    public static String getCensusEmpCountByProject(String ProjectId) {
        try {
            List<Census__c> censusEmpCount = [SELECT Id, Employee_Name__c FROM Census__c WHERE Medical_Coverage__c =: 'Employee (Only)' AND projects__r.Id =: ProjectId];
            return String.valueOf(censusEmpCount.size());
        }
        catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled(cacheable=true)
    public static String getCensusEmpFamCount(String ProjectId) {
        try {
            List<Census__c> censusEmpFamCount = [SELECT Id, Employee_Name__c FROM Census__c WHERE Medical_Coverage__c =: 'Employee + Family' AND projects__r.Id =: ProjectId];
            return String.valueOf(censusEmpFamCount.size());
        }
        catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled(cacheable=true)
    public static String getCensusEmpFamCountByProject(String ProjectId) {
        try {
            List<Census__c> censusEmpFamCount = [SELECT Id, Employee_Name__c FROM Census__c WHERE Medical_Coverage__c =: 'Employee + Family' AND projects__r.Id =: ProjectId];
            return String.valueOf(censusEmpFamCount.size());
        }
        catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled(cacheable=true)
    public static String getCensusLivesCount(String ProjectId) {
        try {
            List<Census__c> censusLivesCount = [SELECT Id, Employee_Name__c FROM Census__c WHERE projects__r.Id =: ProjectId];
            return String.valueOf(censusLivesCount.size());
        }
        catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled(cacheable=true)
    public static String getCensusLivesCountByProject(String ProjectId) {
        try {
            List<Census__c> censusLivesCount = [SELECT Id, Employee_Name__c FROM Census__c WHERE projects__r.Id =: ProjectId];
            return String.valueOf(censusLivesCount.size());
        }
        catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }


    @AuraEnabled(cacheable=true)
    public static List<Census__c> getCensus(String ProjectId) {
        List<Census__c> censusList = [SELECT Id, Employee_Name__c, Job__c, Annual_Salary__c, Job_Title__c, Medical_Plan__c, Vision_Plan__c, Dep_FSA__c, Med_FSA__c, Dental_Plan__c, Covered__c,Medical_Coverage__c FROM Census__c WHERE projects__r.Id =: ProjectId LIMIT 6];
        return censusList;
    }

    @AuraEnabled(cacheable=true)
    public static List<Census__c> getCensusByProject(String ProjectId) {
        List<Census__c> censusList = [SELECT Id, Employee_Name__c, Job__c, Annual_Salary__c, Job_Title__c, Medical_Plan__c, Vision_Plan__c, Dep_FSA__c, Med_FSA__c, Dental_Plan__c, Covered__c,Medical_Coverage__c FROM Census__c WHERE projects__r.Id =: ProjectId LIMIT 6];
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
        List<Census__c> censusList = [SELECT Id,Medical_Plan__c FROM Census__c WHERE projects__c =: ProjectId];
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
        Map<Id,AggregateResult> stateCountMap = new Map<Id,AggregateResult>([SELECT Home_Address_State__c Id, COUNT(Id) empEnrolledInMed FROM Census__c WHERE projects__r.Id =: ProjectId AND Medical_Plan__c != NULL GROUP BY Home_Address_State__c]);
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
        Map<Id,AggregateResult> stateCountMap = new Map<Id,AggregateResult>([SELECT Home_Address_State__c Id, COUNT(Id) empEnrolledInMed FROM Census__c WHERE projects__r.Id =: ProjectId AND Medical_Plan__c != NULL GROUP BY Home_Address_State__c]);
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
            String query = 'SELECT Id, Employee_Name__c, Job__c, Annual_Salary__c, Job_Title__c, Medical_Plan__c, Vision_Plan__c, Dep_FSA__c, Med_FSA__c, Dental_Plan__c, Covered__c,Medical_Coverage__c  FROM Census__c WHERE projects__r.Id =\''+ProjectId+'\'';
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
        String query = 'SELECT Id, Employee_Name__c, Job__c, Annual_Salary__c, Job_Title__c, Medical_Plan__c, Vision_Plan__c, Dep_FSA__c, Med_FSA__c, Dental_Plan__c, Covered__c,Medical_Coverage__c FROM Census__c WHERE projects__r.Id =\''+ProjectId+'\'';
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
            List<Project_Team__c> ProTEams= [Select Id,User__c,User__r.Email,User__r.Name,User__r.Phone from Project_Team__c where projects__c=: ProjectId LIMIT 3];
            return ProTEams;
        }
        catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    /*@AuraEnabled(cacheable=true)
    public static List<Project_Team__c> getContactListByProject(String ProjectId) {
        try {
            List<Project_Team__c> ProTEams= [Select Id,User__c,User__r.Email,User__r.Name,User__r.Phone from Project_Team__c where projects__c=: ProjectId LIMIT 3];
            return ProTEams;
        }
        catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }*/

    @AuraEnabled(cacheable=true)
    public static List<Projects__c> getContactListByProject(String ProjectId) {
        try {
            List<Projects__c> Project= [Select Id, (SELECT Id,User__c,User__r.Email,User__r.Name,User__r.Phone,Sample_Test__c,User__r.IsPortalEnabled FROM Project_Teams__r LIMIt 3) from Projects__c where Id =: ProjectId];
            return Project;
        }
        catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }


    @AuraEnabled(cacheable=true)
    public static List<Project_Team__c> getContactForPopup(String ProjectId) {
        try {
            List<Project_Team__c> ProTEams= [Select Id,User__c,User__r.Email,User__r.Name,User__r.Phone from Project_Team__c where projects__c=: ProjectId];
            return ProTEams;
        }
        catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled(cacheable=true)
    public static List<Project_Team__c> getContactForPopupListByProject(String ProjectId) {
        try {
            List<Project_Team__c> ProTEams= [Select Id,User__c,User__r.Email,User__r.Name,User__r.Phone from Project_Team__c where projects__c=: ProjectId];
            return ProTEams;
        }
        catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled(cacheable=true)
    public static projects__c getAccountByProFilter(String ProjectId) {
        try {
            projects__c accNameFromProject = [SELECT Id,Name,Project_Title__c,Account__r.Name FROM projects__c WHERE Id =: ProjectId];
            return accNameFromProject;
        }
        catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    //GET PROJECT LIST BY DEFAULT PROJECT NAME(DEFAULT ACCOUNT NAME) FOR ASSIGN TO THE PROJECT DROUP DOWN STARTS
    @AuraEnabled(cacheable=true)
    public static List<projects__c> getProListByDefaultPro(){
        List<Project_Team__c> ptList = [SELECT Id,projects__r.Name,projects__r.Account__c FROM Project_Team__c WHERE User__c =: UserInfo.getUserId() ORDER BY projects__r.LastModifiedDate DESC LIMIT 1];
        List<projects__c> proList = [SELECT Id,Project_Title__c FROM projects__c WHERE Account__c =: ptList[0].projects__r.Account__c ORDER BY LastModifiedDate DESC];
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
        for(Project_Team__c proTeamObj : [SELECT Id,AccountId__c FROM Project_Team__c WHERE User__c =: UserInfo.getUserId() AND projects__r.Active__c = true]){
            accIdSet.add(proTeamObj.AccountId__c);
        }
        List<Account> accList = [SELECT Id,Name FROM Account where Id IN : accIdSet];
        return accList;
    }

    @AuraEnabled(cacheable=true)
    public static List<projects__c> getProjectListByAccount(String AccountId){
        // system.debug('getProjectListByAccount>UserInfo.getUserId()>>'+UserInfo.getUserId());
        System.debug('AccountId>>'+AccountId);
         return [SELECT Id,Name,Project_Title__c FROM projects__c WHERE Account__c =: AccountId];
    }

    /*@AuraEnabled(cacheable=true)
    public static List<Project_Team__c> getDefaultProject(){
        system.debug('UserInfo.getUserId()>>'+UserInfo.getUserId());
        return [SELECT Id,projects__c FROM Project_Team__c WHERE User__c =: UserInfo.getUserId() ORDER BY projects__r.LastModifiedDate DESC LIMIT 1];
    }*/

//----------------------GET OVER ALL COST DETAILS -------------------------------- STARTS

@AuraEnabled(cacheable=true)
    public static List<Monthly_Medical_Rx_Report__c> getMedicalCost(String ProjectId){
        // system.debug('getProjectListByAccount>UserInfo.getUserId()>>'+UserInfo.getUserId());
        Integer currentYear = System.Today().year();
        Integer prevYear = currentYear - 1;
        Integer currentMonth = Date.Today().Month();
        Integer prevMonth = currentMonth-1;
        if(currentMonth==1 || currentMonth==01){
            prevMonth = 12;
        }

        System.debug('@prevMonth"=='+prevMonth);
        System.debug('@prevYear"=='+prevYear);

        System.debug('ProjectId>>'+ProjectId);
        List<projects__c> project = [SELECT Id,Name,Project_Title__c FROM projects__c WHERE Id =: ProjectId];

        System.debug('project:==>>'+ project);
        List<Monthly_Medical_Rx_Report__c> monthlyMedRxReports = [SELECT Id,Name,Month__c,Year_Text__c,Total_Medical_Claims__c,Total_Rx_Claims__c,Total_Rx_Rebates__c FROM Monthly_Medical_Rx_Report__c WHERE Projects__c =: ProjectId ]; 
        List<Monthly_Medical_Rx_Report__c> resultData = new List<Monthly_Medical_Rx_Report__c>();
        for ( Monthly_Medical_Rx_Report__c mmrexRepot: monthlyMedRxReports ){
           if(currentYear == Integer.valueOf(mmrexRepot.Year_Text__c) && (mmrexRepot.Month__c>=1 && mmrexRepot.Month__c <= prevMonth ) ){
                resultData.add(mmrexRepot);
                System.debug('@medical record to add:'+mmrexRepot.Name);
            }
        }
        return resultData;
    }

//----------------------GET OVER ALL COST DETAILS--------------------------------- ENDS


//---------------------------getCensusGeoDataList-----------------------------STARTS---------------------------getCensusGeoDataList-------------
    @AuraEnabled(cacheable=true)
    public static List<String> getCensusGeoDataList(String ProjectId){
        try {
        List<String> nameList = new List<String>();
        Integer abc1;
        Integer abc2;

        //Benefits Eligible Employees STARTS
        List<Census__c> censusLivesCount = [SELECT Id FROM Census__c WHERE projects__r.Id =: ProjectId];
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
        List<Census__c> censusMedEnrollCount = [SELECT Id FROM Census__c WHERE projects__r.Id =: ProjectId AND Medical_Plan__c <> 'Waive Medical Coverage'];
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
        List<Census__c> censusSigleCovCount = [SELECT Id FROM Census__c WHERE projects__r.Id =: ProjectId AND Medical_Plan__c <> 'Waive Medical Coverage' AND Medical_Coverage__c =: 'Employee (Only)'];
        if(censusSigleCovCount.size() > 0){
            Integer perWonSing = (censusSigleCovCount.size() * 100 / abc2);
            nameList.add(String.valueOf(perWonSing)+'%');
        }
        else{
            nameList.add('0%');
        }
        //Single Coverage Election ENDS

        //Gender (% Male) STARTS
        List<Census__c> censusGenCount = [SELECT Id FROM Census__c WHERE projects__r.Id =: ProjectId AND Medical_Plan__c != 'Waive Medical Coverage' and Gender__c = 'Male'];
        if(censusGenCount.size() > 0){
            Integer perWonGen = (censusGenCount.size() * 100 / abc2);
            nameList.add(String.valueOf(perWonGen)+'%');
        }
        else{
            nameList.add('0%');
        }
        //Gender (% Male) ENDS

        List<Census__c> allCensusData = [SELECT Id,Date_Of_Birth__c,Tenure__c,Age__c  FROM Census__c WHERE projects__r.Id =: ProjectId];
        Decimal  avgAge=0.00;
        Decimal  avgTenure=0.00;
        if(allCensusData.size()>0){
            for(Census__c cen: allCensusData){     
                if(cen.Age__c!= null)
                    avgAge= avgAge+ cen.Age__c;
                if(cen.Tenure__c!= null)
                    avgTenure= avgTenure+cen.Tenure__c;
            }
            avgAge= avgAge/ allCensusData.size();
            avgTenure= avgTenure/ allCensusData.size();
            avgAge= avgAge.setScale(2);
            avgTenure= avgTenure.setScale(2);

        }
        


        nameList.add(String.valueOf(avgAge));
        nameList.add(String.valueOf(avgTenure));
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
        return [SELECT Id,User__c,projects__r.Name,projects__r.Id FROM Project_Team__c WHERE User__c =: UserInfo.getUserId()];
    }


    @AuraEnabled(cacheable=true)
    public static List<projects__c> getDefaultProNameByProFilter(String ProjectId){
        return [SELECT Id, Name FROM projects__c where Id =: ProjectId];
    }

    @AuraEnabled(cacheable=true)
    public static List<Project_Team__c> getteamsListByProject(String ProjectId) {
        try {
            List<Project_Team__c> ProTEams= [Select Id,User__c,User__r.Email,User__r.Name,User__r.Phone from Project_Team__c where projects__c=: ProjectId];
            return ProTEams;
        }
        catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static Integer getOverallBudget(){
       // Integer Month = Date.Today().Month() - 1;
        Integer Month = Date.Today().Month();
        //commenting for now
       // AggregateResult[] SumOfMonths = [select SUM(Surplus_Deficit__c), SUM(Net_Medical_Rx_Budget__c) from Monthly_Medical_Rx_Report__c WHERE Month__c =: Month];
        //return Integer.valueof(SumOfMonths[0].get('expr0'));
        return null;
    }

    @AuraEnabled
    public static Map<String,Integer> getOverallBudgetMap(){

        String Year = String.valueOf(Date.Today().Year());
        //String Year = '2021';
        Integer Month = Date.Today().Month() - 1;
        //Integer Month = Date.Today().Month();
        Map<String,Integer> OBmap = new Map<String,Integer>();
        //commenting down for now
        AggregateResult[] SumOfMonths = [select SUM(Surplus_Deficit__c), SUM(Total_Net_Medical_Rx_Budget__c) from Monthly_Medical_Rx_Report__c WHERE Month__c =: Month AND Year_Text__c =: Year];
        if(SumOfMonths==null && SumOfMonths.isEmpty()) {
            Month = Date.Today().Month() - 2;
            SumOfMonths = [select SUM(Surplus_Deficit__c), SUM(Total_Net_Medical_Rx_Budget__c) from Monthly_Medical_Rx_Report__c WHERE Month__c =: Month AND Year_Text__c =: Year];
        }
        OBmap.put('Surplus', Integer.valueof(SumOfMonths[0].get('expr0')));
        OBmap.put('Budget', Integer.valueof(SumOfMonths[0].get('expr1')));
        return OBmap;
    }

    @AuraEnabled
    public static Map<String,Integer> getOverallBudgetMapByProject(String ProjectId){

        String Year = String.valueOf(Date.Today().Year());
        Integer Month = Date.Today().Month() - 1;
        Map<String,Integer> OBmap = new Map<String,Integer>();
        AggregateResult[] SumOfMonths = [select SUM(Surplus_Deficit__c), SUM(Total_Net_Medical_Rx_Budget__c) from Monthly_Medical_Rx_Report__c WHERE Projects__c =: ProjectId AND Month__c =: Month AND Year_Text__c =: Year];
        if(SumOfMonths==null && SumOfMonths.isEmpty()) {
            Month = Date.Today().Month() - 2;
            SumOfMonths = [select SUM(Surplus_Deficit__c), SUM(Total_Net_Medical_Rx_Budget__c) from Monthly_Medical_Rx_Report__c WHERE Projects__c =: ProjectId AND Month__c =: Month AND Year_Text__c =: Year];
        }
        OBmap.put('Surplus', Integer.valueof(SumOfMonths[0].get('expr0')));
        OBmap.put('Budget', Integer.valueof(SumOfMonths[0].get('expr1')));
        return OBmap;
    }


  @AuraEnabled
    public static List<Monthly_Medical_Rx_Report__c> getOverallStatusDataTableAll(String ProjectId){
        return [Select Id, Month_Text__c,Year_Text__c,Year__c,   PEPM_Total_Rx_Claims__c, PEPM_Total_Medical_Claims__c, Projects__c, Month__c FROM Monthly_Medical_Rx_Report__c WHERE Projects__c =: ProjectId AND Year__c= THIS_YEAR ORDER BY Year_Text__c Desc ,Month__c Desc LIMIT 12];
    }

    @AuraEnabled
    public static List<Monthly_Medical_Rx_Report__c> getOverallStatusDataTable(String ProjectId){
        return [Select Id, Month_Text__c,Year_Text__c,Year__c,   PEPM_Total_Rx_Claims__c, PEPM_Total_Medical_Claims__c, Projects__c, Month__c FROM Monthly_Medical_Rx_Report__c WHERE Projects__c =: ProjectId AND Month_Text__c != null ORDER BY Year_Text__c Desc ,Month__c Desc LIMIT 5];
    }

    /* @AuraEnabled(cacheable=true)
    public static list<HCC_Output__c> thirdTableCtrl(){
        list<HCC_Output__c> dlist = [select Id, Relation__c, Diagnosis_Condition__c, Ongoing_Status__c, YTD_Last_12_months__c	from HCC_Output__c LIMIT 20];
        return dlist;
    }*/

    @AuraEnabled(cacheable=true)
    public static list<HCC_Output__c> thirdTableCtrl(Id ProjectId){
        list<HCC_Output__c> dlist = [select Id, Relation__c, Diagnosis_Condition__c, Ongoing_Status__c, YTD_Last_12_months__c	from HCC_Output__c where Projects__c=: ProjectId];
        return dlist;
    }

    @AuraEnabled(cacheable=true)
    public static Integer getMonthlyCencesCount(Id ProjectId){
        Integer returnValue=0;
        List<Census__c> cencusRecList= [Select Id,Last_Hire_Date__c from Census__c where Projects__c=: ProjectId AND Last_Hire_Date__c= THIS_YEAR Order By Last_Hire_Date__c DESC];

        map<Integer,List<Census__c>> monthlyCencusMap= new map<Integer,List<Census__c>>();

        for(Census__c cen: cencusRecList){
            if(monthlyCencusMap.containskey(cen.Last_Hire_Date__c.month())){
                monthlyCencusMap.get(cen.Last_Hire_Date__c.month()).add(cen);
            }else{
                monthlyCencusMap.put(cen.Last_Hire_Date__c.month(), new List<Census__c>{cen});
            }
        }

        if(monthlyCencusMap.size()>0){
            set<Integer> monthset = new set<Integer>();
            monthset.addAll(monthlyCencusMap.keySet());
            List<Integer> monthList= new List<Integer>();
            monthList.addAll(monthset);
            monthList.sort();

            Integer latestMonthCount=0;
            Integer previousLatestMontnCount=0;

            latestMonthCount= monthlyCencusMap.get(monthList.get(monthList.size()-1)).size();
            if(monthList.size()>= 2)
                previousLatestMontnCount= monthlyCencusMap.get(monthList.get(monthList.size()-2)).size();

                returnValue= latestMonthCount - previousLatestMontnCount;
        }
        return returnValue;
    }

}