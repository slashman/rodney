<?
    set_include_path("/var/www/rodney/:./");
    require 'classes/service/RodneyRestfullService.php';
    require 'classes/manager/RodneyManager.php';
    
    function doRequest(){
        $rodney = new RodneyService();
        $rodney->validateParameter("operation", "Operation");
        
        $operation = $_REQUEST["operation"];
        try{
            switch ($operation){
                case "saveScore": $rodney->saveScore(); break;
                default:
                    $response = $rodney->createResponse(false, "No valid operation given");
                    $rodney->writeResponse($response); 
                break;
            }
        }catch (Exception $e){
            $response = $rodney->createResponse(false, $e->getMessage());
            $rodney->writeResponse($response);
        }
    }
    
    class RodneyService extends RodneyRestfullService{
        public function saveScore(){
            $this->validateParameter("sessionInfo", "Session info");
            $this->validateParameter("name", "Name");
            $this->validateParameter("score", "Score");
            $this->validateParameter("skillPath", "Skill path");
            
            $session = json_decode("{}");
            $session->{"sessionInfo"} = $_REQUEST["sessionInfo"];
            $session->{"name"} = $_REQUEST["name"];
            $session->{"score"} = $_REQUEST["score"];
            $session->{"skillPath"} = $_REQUEST["skillPath"];
            
            RodneyManager::saveScore($session);
            
            $response = $this->createResponse(true, "Session info saved!");
            $this->writeResponse($response);
        }
    }
    
    doRequest();
?>