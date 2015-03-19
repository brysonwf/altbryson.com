<?php
/**
 * @package WordPress
 * @subpackage Classic_Theme
 */
require_once('wp_bootstrap_navwalker.php');

add_action( 'init', 'my_add_excerpts_to_pages' );
function my_add_excerpts_to_pages() {
    add_post_type_support( 'page', 'excerpt' );
}

add_filter( 'request', 'my_request_filter' );
function my_request_filter( $query_vars ) {
    if( isset( $_GET['s'] ) && empty( $_GET['s'] ) ) {
        $query_vars['s'] = " ";
    }
    return $query_vars;
}

function new_excerpt_more( $more ) {
	return ' <a class="read-more" href="'. get_permalink( get_the_ID() ) . '">Read More</a>';
}
add_filter('excerpt_more', 'new_excerpt_more');


if ( function_exists('register_sidebar') ){
	register_sidebar(array('name'=>'Standard Pages Sidebar',
		'before_widget' => '<div class="panel panel-default">',
		'after_widget' => '</div></div></div>',
		'before_title' => '<div class="panel-heading" role="tab" id="heading-%1$s"><h4 class="panel-title"><a data-toggle="collapse" data-parent="#accordion" href="#collapse-%1$s" aria-expanded="true" aria-controls="collapse-%1$s">',
		'after_title' => '</a></h4></div><div id="collapse-%1$s" class="panel-collapse collapse in" role="tabpanel" aria-labelledby="heading-%1$s"><div class="panel-body">',
	));
}

//return the name of the top parent page base on a page_id
function getTopParentPostID($myid){
	$mypage = get_page($myid);

	if ($mypage->post_parent == 0){
		return $mypage->ID;
	}else{
		return getTopParentPostID($mypage->post_parent);
	}
}

add_filter('widget_text', 'do_shortcode');

//require_once(TEMPLATEPATH . '/controlpanel.php');

add_theme_support( 'post-thumbnails', array( 'post', 'page','jumbotron','quote','director','advertisement') );

function myplugin_settings() {
    // Add tag metabox to page
    register_taxonomy_for_object_type('post_tag', 'page');
    // Add category metabox to page
    register_taxonomy_for_object_type('category', 'page');
}
// Add to the admin_init hook of your theme functions.php file
add_action( 'admin_init', 'myplugin_settings' );

add_action( 'init', 'create_post_type' );
function create_post_type() {
}

function wpd_tax_alpha( $query ) {
    if ( is_category('distributor-forum') && $query->is_main_query() ) {
        if ( is_user_logged_in() ) {
            $query->set( 'orderby', 'title' );
            $query->set( 'order', 'ASC' );
        }else{
            $query->set('cat', '-3');
        }
    }
}
add_action( 'pre_get_posts', 'wpd_tax_alpha' );

?>
