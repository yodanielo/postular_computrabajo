<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:fb="http://www.facebook.com/2008/fbml">
    <head>
        <?php include 'metadatos.php' ?>
    </head>
    <body>
        <div id="cuerpototal">
            <header>
                <section id="menuvipo">
                    <div class="container">
                        <div class="row">
                            <div id="col1welcome" class="col-md-4">
                                <div id="sistemanombre">VIPO Hotel Management</div>
                                <div id="usuario">Bienvenido <a href="<?= site_url("user/profile") ?>"><?= $params["username"] ?></a>
                                </div>
                            </div>
                            <div id="col2menu" class="col-md-8">
                                <nav class="navbar navbar-default" role="navigation">
                                    <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                                        <ul class="nav navbar-nav navbar-right">
                                            <li><a href="<?= site_url("user/profile") ?>">Mi cuenta</a></li>
                                            <li class="dropdown">
                                                <a class="dropdown-toggle" data-toggle="dropdown" href="#">Mis Aplicaciones<b class="caret"></b></a>
                                                <ul class="dropdown-menu">
                                                    <li><a target="_blank" href="<?= site_url("app/hotel-choque-y-fuga") ?>">Hotel Choque y Fuga</a></li>
                                                    <li><a target="_blank" href="<?= site_url("app/tienda-choque-y-fuga") ?>">Tienda Choque y Fuga</a></li>
                                                    <li><a target="_blank" href="<?= site_url("app/servicios-choque-y-fuga") ?>">Servicios Choque y Fuga</a></li>
                                                    <li class="divider"></li>
                                                    <li><a target="_blank" href="<?= site_url("vipo/catalogo") ?>">Nueva Aplicacion</a></li>
                                                </ul>
                                            </li>
                                            <li><a>Ayuda</a></li>
                                            <li><a>Salir</a></li>
                                        </ul>
                                    </div>
                                </nav>


                            </div>

                        </div>
                    </div>
                </section>
                <section id="menuapp">
                    <div class="container"></div>
                </section>
            </header>

