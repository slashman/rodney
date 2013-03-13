<?php
    class RodneyRestfullService{
    public $fm;

        public function createResponse($status, $message){
            $response = json_decode("{}");
            $response->{"status"} = $status;
            $response->{"message"} = $message;
            
            return $response;
        }
        
        public function writeResponse($response){
            exit(json_encode($response));
        }
        
        public function validateParameter($key, $name){
            if (!isset($_REQUEST[$key])){
                $fail = $this->createResponse(false, $name." is required!");
                $this->writeResponse($fail);
            }else{
                return true;
            }
        }
    }
?>
