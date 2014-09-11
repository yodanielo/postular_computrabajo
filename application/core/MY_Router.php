<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class MY_Router extends CI_Router {

    var $error_controller = 'error';
    var $error_method_404 = 'error_404';
    public $appname = "";

    function My_Router() {
        parent::__construct();
    }

    // this is just the same method as in Router.php, with show_404() replaced by $this->error_404();
    function _validate_request($segments) {
        
        for($i=0;$i<count($segments);$i++){
            $segments[$i]= str_replace("-", "_", $segments[$i]);
        }
        
        //exonerados del prefjo del appname
        $exonerados = array("less");
        //exonerados de validar el login
        $exonerados2=array(
            "/(user|error)\/(.*)/"
        );
        /**
         * user/login/algo
         * user/login/algo/
         * user/login/
         * user/login
         * user/enter
         * error/error404
         * error/noautorizado
         * error/interno
         */
        if (array_search($segments[0], $exonerados) === FALSE) {
            if (count($segments) > 0) {
                //hay session?
                //si:{
                //  hay usuario logueado???
                //  no:{
                //      mando al login
                //  }
                //  si:{
                //      dejo pasar
                //  }
                //}
                //no:{
                //  creo una
                //  mando al login
                //}
                //
                //------ en el login
                //al login i o si va llegar con una session
                //hay info de la app?
                //si:{
                //  carga normal
                //}
                //no:{
                //  cargo datos de la app
                //  lleno la sesion
                //  cargo el login
                //}
                //
                //validando nombre de aplicacion
                $appurl = $segments[0];
                $segments = array_slice($segments, 1);
                foreach ($exonerados2 as $value) {
                    if(preg_match($value, implode("/", $segments))==1){
                        return parent::_validate_request($segments);
                    }
                }

                if (isset($_SESSION[$appurl])) {
                    if(isset($_SESSION[$appurl]["usuario"])){
                        //dejo pasar
                        return parent::_validate_request($segments);
                    }
                    else{
                        $segments=array("user","login");
                        return parent::_validate_request($segments);
                    }
                } else {
                    //seteando appname
                    $segments=array("user","login");
                    return parent::_validate_request($segments);
                }
            } else {
                return $this->error_404();
            }
        } else
            return parent::_validate_request($segments);
    }

    function error_404() {
        if (!empty($this->routes['404_override'])) {
            $x = explode('/', $this->routes['404_override']);

            //$this->set_directory('');
            $segments[0] = $x[0];
            $segments[1] = (isset($x[1]) ? $x[1] : 'index');

            return $x;
        } else {
            show_404($this->fetch_directory() . $segments[0]);
            return array();
        }
    }

}
