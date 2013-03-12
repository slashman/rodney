#!/php -q
<?
    require_once("../phpws/websocket.server.php");
    
    class RodneyEchoHandler extends WebSocketUriHandler {
        public function onMessage(IWebSocketConnection $user, IWebSocketMessage $msg){
            $this->say("[ECHO] {$msg->getData()}");
            $user->sendMessage($msg);
        }
        
        public function onAdminMessage(IWebSocketConnection $user, IWebSocketMessage $obj){
            $this->say("[DEMO] Admin TEST received!");
            
            $frame = WebSocketFrame::create(WebSocketOpcode::PongFrame);
            $user->sendFrame();
        }
    }
    
    class RodneySocketServer implements IWebSocketServerObserver{
        protected $debug = true;
        protected $server;
        private $users;
        private $handler;
        
        public function __construct(){
            $this->server = new WebSocketServer("tcp://0.0.0.0:12345", "superdupersecretkey");
            $this->server->addObserver($this);
            
            $this->handler = new RodneyEchoHandler();
            $this->server->addUriHandler("echo", $this->handler);
            
            $this->users = array();
        }

        public function getUsersConnected(){
            $n = 0;
            for ($i=0;$i<sizeof($this->users);$i++){
                if ($this->users[$i]){
                    $n++;
                } 
            }
            
            return $n;
        }
        
        public function onConnect(IWebSocketConnection $user){
            $this->users[sizeof($this->users)] = $user;
            $s = $this->getUsersConnected();
            
            $this->say("[INFO] $s users online");
            $this->say("[DEMO] {$user->getId()} connected");
            
            //Inform the others players about it
            $msg = new WebSocketMessage();
            $uid = $user->getId();
            $msg->setData('{"type": "userConnected", "userId": '.$uid.'}');
            for ($i=0;$i<sizeof($this->users);$i++){
                $u = $this->users[$i];
                if (!$u) continue;
                if ($u->getId() != $user->getId()){
                    $this->handler->onMessage($u, $msg);
                } 
            }
        }
        
        public function onMessage(IWebSocketConnection $user, IWebSocketMessage $msg){
            $this->say("[DEMO] {$user->getId()} says '{$msg->getData()}'");
            
            $m = $msg->getData();
            $m = str_replace("pId_x", $user->getId(), $m);
            $msg->setData($m);
            for ($i=0;$i<sizeof($this->users);$i++){
                $u = $this->users[$i];
                if (!$u) continue;
                if ($u->getId() != $user->getId()){
                    $this->handler->onMessage($u, $msg);
                } 
            }
        }
        
        public function onDisconnect(IWebSocketConnection $user){
            for ($i=0;$i<sizeof($this->users);$i++){
                if (!$this->users[$i]) continue;
                if ($this->users[$i]->getId() == $user->getId()){
                    $this->users[$i] = null;
                } 
            }
            
            $this->say("[DEMO] {$user->getId()} disconnected");
            
            //Inform the others players about it
            $msg = new WebSocketMessage();
            $uid = $user->getId();
            $msg->setData('{"type": "userLogout", "pId": '.$uid.'}');
            for ($i=0;$i<sizeof($this->users);$i++){
                $u = $this->users[$i];
                if (!$u) continue;
                if ($u->getId() != $user->getId()){
                    $this->handler->onMessage($u, $msg);
                } 
            }
        }
        
        public function onAdminMessage(IWebSocketConnection $user, IWebSocketMessage $msg){
            $this->say("[DEMO] Admin Message receievd!");
            
            $frame = WebSocketFrame::create(WebSocketOpcode::PongFrame);
            $user->sendFrame($frame);
        }
        
        public function say($msg){
            echo "$msg \r\n";
        }
        
        public function run(){
            $this->server->run();
        }
    }

    $server = new RodneySocketServer();
    $server->run();
?>