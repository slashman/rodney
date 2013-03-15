<?php
    require_once 'classes/dao/RodneyDAO.php';
    require_once 'classes/dao/Connection.php';
    
    class RodneyManager{
        public static function saveScore($sessionInfo){
            $con = new Connection();
            $c = $con->getConnection();
            
            RodneyDAO::getInstance()->saveScore($c, $sessionInfo);
            
            $con->closeConnection($c);
        }
        
        public static function getTopScores($limit){
            $con = new Connection();
            $c = $con->getConnection();
            
            $scores = RodneyDAO::getInstance()->getTopScores($c, $limit);
            $con->closeConnection($c);
            
            return $scores;
        }
    }
?>