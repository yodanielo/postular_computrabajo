<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class Postulacion extends Padre {

    public function index() {
        //$this->check_auth();
        $this->params["css_after"][]="home.less";
        $this->loadHTML("postulacion/home");
    }

}

/* End of file welcome.php */
/* Location: ./application/controllers/welcome.php */