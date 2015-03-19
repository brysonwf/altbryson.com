<!DOCTYPE html>
<html <?php language_attributes(); ?>>
  <head>
    <title><?php wp_title('&laquo;', true, 'right'); ?> <?php bloginfo('name'); ?></title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta http-equiv="Content-Type" content="<?php bloginfo('html_type'); ?>; charset=<?php bloginfo('charset'); ?>" />

    <link href="<?php bloginfo('stylesheet_directory'); ?>/base.css" rel="stylesheet">

	<link rel="alternate" type="application/rss+xml" title="RSS 2.0" href="<?php bloginfo('rss2_url'); ?>" />
	<link rel="alternate" type="text/xml" title="RSS .92" href="<?php bloginfo('rss_url'); ?>" />
	<link rel="alternate" type="application/atom+xml" title="Atom 1.0" href="<?php bloginfo('atom_url'); ?>" />
    <link rel="shortcut icon" href="<?php bloginfo('stylesheet_directory'); ?>/favicon.ico" />
	<link rel="pingback" href="<?php bloginfo('pingback_url'); ?>" />
	<?php wp_get_archives('type=monthly&format=link'); ?>
	<?php //comments_popup_script(); // off by default ?>
	<?php wp_head(); ?>

    <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
    <script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
    <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
    <![endif]-->

</head>
<body>
    <!-- Wrap all page content here -->
    <div id="wrapper" class="bg">
        <!-- Begin page content -->
       <header>
           <div class="container">
               <nav class="navbar navbar-inverse navbar-fixed-top">
                   <div class="container">
                       <!-- Brand and toggle get grouped for better mobile display -->
                       <div class="navbar-header">
                           <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
                               <span class="sr-only">Toggle navigation</span>
                               <span class="icon-bar"></span>
                               <span class="icon-bar"></span>
                               <span class="icon-bar"></span>
                           </button>
                           <a class="navbar-brand" href="<?php bloginfo('url'); ?>"><?php bloginfo('name'); ?></a>
                       </div>

                       <!-- Collect the nav links, forms, and other content for toggling -->
                       <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                           <p class="navbar-text"><?=get_bloginfo ( 'description' );?></p>
                           <?php
                           wp_nav_menu( array(
                                   'menu'            => '',
                                   'depth'             => 2,
                                   'menu_class'        => 'nav navbar-nav navbar-right',
                                   'fallback_cb'       => 'wp_bootstrap_navwalker::fallback',
                                   'walker'            => new wp_bootstrap_navwalker())
                           );
                           ?>
                       </div><!-- /.navbar-collapse -->
                   </div><!-- /.container-fluid -->
               </nav>
           </div>
        </header>