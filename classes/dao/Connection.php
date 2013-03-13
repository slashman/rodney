<?php 
    class Connection{
        private $connection;
        
        private function connect(){
            require('classes/config.php');

            $this->connection = mysql_connect($mysqlHost,$mysqlUser,$mysqlPass)or die(exit('Error connectado al servidor'));
            mysql_select_db($mysqlData,$this->connection)or die(exit('Error seleccionando la base de datos'));
        }
        
        public function getConnection(){
            if (!$this->connection){
                $this->connect();
            }
            
            return $this->connection;
        }
        
        public function closeConnection($c){
            if ($c){
                mysql_close($c);
            }
        }
        
        public function superShot($c, $query){
            if (!$c){ $c = $this->getConnection(); }
            
            $result = mysql_query($query,$c)or die(error_log(mysql_error($c)));
            if (!$result){ return null; }
            
            $response;
            while ($lista = mysql_fetch_array($result)){
                $response = $lista;
                break;
            }
            
            return $response;
        }
        
        public function verticalShot($c, $query){
            if (!$c){ $c = $this->getConnection(); }
            
            $result = mysql_query($query,$c)or die(error_log(mysql_error($c)));
            if (!$result){ return null; }
            
            $response = array();
            $s = 0;
            while ($lista = mysql_fetch_array($result)){
                $response[$s] = $lista[0];
                $s++; 
            }
            
            return $response;
        }
    
        public function megaShot($c, $query){
            if (!$c){ $c = $this->getConnection(); }
            
            $result = mysql_query($query,$c)or die(error_log("Error: ".mysql_error($c).", ".$query));
            if (!$result){ return null; }
            
            $response = array();
            $s = 0;
            while ($lista = mysql_fetch_array($result)){
                $response[$s] = $lista;
                $s++; 
            }
            
            return $response;
        }
        
        public function singleShot($c, $query){
            if (!$c){ $c = $this->getConnection(); }
            
            $result = mysql_query($query,$c)or die(error_log(mysql_error($c)));
            if (!$result){ return null; }
            
            $response = mysql_fetch_row($result);
            $response = $response[0];
            
            return $response;
        }
        
        public function singleShotReal($c, $query){
            $response = $this->singleShot($c, $query);
            $response = (real)$response;
            
            return $response;
        }
        
        public function updateShot($c, $query){
            if (!$c){ $c = $this->getConnection(); }
            
            $result = mysql_query($query,$c)or die(error_log(mysql_error($c)."Query: ".$query));
            if ($result){
                return true;
            }else{
                return false;
            }
        }
    }
?>