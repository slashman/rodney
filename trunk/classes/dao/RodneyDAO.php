<?php
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
            $sql = "INSERT INTO rod_session (sessionInfo, sessionDate, score) VALUES ('".$info."', NOW(), ".$sessionInfo->{"score"}.")";
            
            $this->updateShot($c, $sql);
        }
        
        public function getTopScores($c, $limit){
            $sql = "SELECT sessionInfo, sessionDate FROM rod_session ORDER BY score DESC LIMIT $limit";
            $scores = $this->megaShot($c, $sql);
            
            return $scores;
        }
    }
?>