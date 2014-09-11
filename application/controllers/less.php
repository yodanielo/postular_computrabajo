<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of less
 *
 * @author daniel
 */
class less extends padre{
    function index($file){
        $this->load->library("lessc");
        $this->lessc->pcompile(APPPATH."css/$file");
    }
}

?>
