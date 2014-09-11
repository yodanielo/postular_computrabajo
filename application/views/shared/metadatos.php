<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title><?php echo ($params["pagetitle"] ? $params["pagetitle"] . " | " : "") . $params["sitename"]; ?></title>
<meta name="Description" content="<?php echo $params["sitedescription"]; ?>" />
<meta name="author" content="<?php echo $params["author"]; ?>" />
<meta name="owner" content="<?php echo $params["owner"]; ?>" />
<meta name="robots" content="index, follow" />

<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>

<link rel="icon" href="" type="image/x-icon" />

<link href='http://fonts.googleapis.com/css?family=Inconsolata' rel='stylesheet' type='text/css'/>
<link rel="stylesheet" type="text/css" href="<?= site_url("paquetes/bootstrap/css/bootstrap.min.css") ?>" />
<link rel="stylesheet" type="text/css" href="<?= site_url("paquetes/jquery-ui/css/vipo-theme/jquery-ui-1.10.3.custom.min.css") ?>" />
<?php
if (count($params["css"]) > 0) {
    foreach ($params["css"] as $key => $sc) {
        if (substr($sc, 0, 7) == "http://" || substr($sc, 0, 8) == "https://")
            echo '<link rel="stylesheet" type="text/css" href="' . $sc . '" />' . "\n";
        else
            echo '<link rel="stylesheet" type="text/css" href="' . site_url('css/' . $sc) . '" />' . "\n";
    }
}
?>
<link rel="stylesheet" type="text/css" href="<?= site_url("less/index/nav.less") ?>" />
<?php
if (count($params["css_after"]) > 0) {
    foreach ($params["css_after"] as $key => $sc) {
        if (substr($sc, 0, 7) == "http://" || substr($sc, 0, 8) == "https://")
            echo '<link rel="stylesheet" type="text/css" href="' . $sc . '" />' . "\n";
        else
            echo '<link rel="stylesheet" type="text/css" href="' . site_url('css/' . $sc) . '" />' . "\n";
    }
}
?>
<script type="text/javascript">siteurl = "<?= site_url($params["appname"]) ?>";</script>
<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jqueryui/1.10.3/jquery-ui.min.js"></script>
<script type="text/javascript" src="<?= site_url("paquetes/bootstrap/js/bootstrap.min.js") ?>"></script>
<?php
if (isset($params["scripts"])) {
    if (count($params["scripts"]) > 0) {
        foreach ($params["scripts"] as $key => $sc) {
            if (substr($sc, 0, 7) == "http://" || substr($sc, 0, 8) == "https://")
                echo '<script type="text/javascript" src="' . $sc . '"></script>' . "\n";
            else
                echo '<script type="text/javascript" src="' . site_url('js/' . $sc) . '"></script>' . "\n";
        }
    }
}
?>

<script type="text/javascript" src="<?= site_url("js/general.js") ?>"></script>