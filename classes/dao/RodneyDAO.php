<?
    require_once 'classes/dao/Connection.php';
    
    class RodneyDAO extends Connection{
        public static $dao;
        public static function getInstance(){
            if (!RodneyDAO::$dao)
                RodneyDAO::$dao = new RodneyDAO();
            
            return RodneyDAO::$dao;
        }
        
        public function saveScore($c, $sessionInfo){
            $info = json_encode($sessionInfo);
            $sql = "INSERT INTO rod_session (sessionInfo) VALUES ('".$info."')";
            
            $this->updateShot($c, $sql);
        }
    }
?>