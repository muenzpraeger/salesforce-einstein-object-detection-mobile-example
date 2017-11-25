public class ShelfScanner {
    
    @AuraEnabled
    public static Einstein_PredictionResult detectShelfObjects(String modelId, String base64){
        Einstein_PredictionService service = new Einstein_PredictionService(Einstein_PredictionService.Types.IMAGE_DETECTION);
        Einstein_PredictionResult result = service.detectImageBase64(modelId, base64, 0, '');
        return result;
    }
    
    @AuraEnabled
    public static void storeScanResults(String jsonString) {
        List<Object> scanResults = (List<Object>)JSON.deserializeUntyped(jsonString);
        System.debug(scanResults);
        Shelf_Scan__c scan = new Shelf_Scan__c();
        insert scan;
        List<Scan_Result__c> storeResults = new List<Scan_Result__c>();
        for (Object obj : scanResults) {
            Map<String, Object> result = (Map<String, Object>)obj;
            Scan_Result__c storeResult = new Scan_Result__c(Name=result.get('label').toString(), Count__c=(Decimal)result.get('count'), Shelf_Scan__c=scan.Id);
            storeResults.add(storeResult);
        }
        insert storeResults;
    }
    
}