<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class Postulacion extends Padre {

    public function index() {
        $this->loadHTML("listado");
    }

}

/* End of file welcome.php */
/* Location: ./application/controllers/welcome.php */