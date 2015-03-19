<?php
/**
 * @package WordPress
 * @subpackage Classic_Theme
 */
/*
Template Name: Index Page
*/
get_header(); ?>

<div class="index">
    <div class="page-container">

        <div class="container content">
            <div class="row">
                <div class="col-sm-8 maincol">
                    <?php $post = $posts[0]; // Hack. Set $post so that the_date() works. ?>
                    <?php /* If this is a category archive */ if (is_category()) { ?>
                        <h2 class="info"><?php single_cat_title(); ?></h2>
                        <p><?php echo category_description( $category ); ?></p>
                    <?php /* If this is a tag archive */ } elseif( is_tag() ) { ?>
                        <h2 class="info">Posts Tagged &#8216;<?php single_tag_title(); ?>&#8217;</h2>
                    <?php /* If this is a daily archive */ } elseif (is_day()) { ?>
                        <h2 class="info">Archive for <?php the_time('F jS, Y'); ?></h2>
                    <?php /* If this is a monthly archive */ } elseif (is_month()) { ?>
                        <h2 class="info">Archive for <?php the_time('F, Y'); ?></h2>
                    <?php /* If this is a yearly archive */ } elseif (is_year()) { ?>
                        <h2 class="info">Archive for <?php the_time('Y'); ?></h2>
                    <?php /* If this is an author archive */ } elseif (is_author()) { ?>
                        <h2 class="info">Author Archive</h2>
                    <?php } elseif (is_404()) { ?>
                        <h2 class="info">Error 404 - Page not found...</h2>
                    <?php } elseif (is_search()) { ?>
                        <h2 class="info">You are searching for "<?php echo $_GET["s"]; ?>".</h2>
                    <?php /* If this is a paged archive */ } elseif (isset($_GET['paged']) && !empty($_GET['paged'])) { ?>
                        <h2 class="info">Blog Archives</h2>
                    <?php } ?>
                    <?php if (have_posts()) : while (have_posts()) : the_post(); ?>

                    <?php global $post; $current_post_id = $post->ID; ?>
                    <?php $top_parent_id = getTopParentPostID( $current_post_id ); ?>

                    <div class="post" id="post-<?php the_ID(); ?>">

                        <div class="page-header clearfix">
                            <h3 class="pull-left"><?php echo get_the_title($top_parent_id); ?></h3>
                            <?php edit_post_link(__('edit'), '<div class="edit pull-right btn btn-default btn-xs">', '</div>'); ?>
                        </div>

                        <div class="post-bg" style=" <?php $hide_content_box = get_post_meta($post->ID, "hide_content_box", true); if ($hide_content_box){ echo 'display:none;'; } ?> ">

                            <?php

                            $alt_h2 = get_post_meta($post->ID, "alternate_title", true);
                            if ($alt_h2 == ''){
                                $alt_h2 = get_the_title($post->ID);
                            }

                            if ($alt_h2 != get_the_title($top_parent_id)){
                                ?>
                                <h1 class="orange-title <?php if ( in_category( 32, $_post) ) { echo 'newstitle'; } ?> "><a href="<?php the_permalink() ?>" rel="bookmark"><?=$alt_h2;?></a></h1>
                                <?php
                            }

                            ?>

                            <div id="subpage-image">
                                <?php the_post_thumbnail('full'); ?>
                            </div>

                            <p>
                                <?php if ( is_page() ) { } else { ?>
                                    <span class="meta"><?php if($theme_author=="Enable") { ?> <?php the_author(); ?> | <?php } the_date('','',''); ?></span>
                                <?php }?>
                            </p>

                            <div class="storycontent">
                                <?php the_content(__('(more...)')); ?>
                            </div>

                            <div class="feedback">
                                <?php wp_link_pages(); ?>
                            </div>

                        </div>

                    </div>

                    <?php comments_template(); // Get wp-comments.php template ?>

                    <?php endwhile; else: ?>
                        <div class="post">
                            <h3 class="info"><?php _e('Sorry, no posts matched your criteria. You might want to search (again)?'); ?></h3>
                        </div>
                    <?php endif; ?>

                    <?php if (is_single() || is_page()) {} else { ?>
                        <p class="nav_link">
                            <?php
                            global $wp_query;

                            $big = 999999999; // need an unlikely integer

                            echo paginate_links( array(
                                'base' => str_replace( $big, '%#%', esc_url( get_pagenum_link( $big ) ) ),
                                'format' => '?paged=%#%',
                                'current' => max( 1, get_query_var('paged') ),
                                'total' => $wp_query->max_num_pages
                            ) );
                            ?>
                        </p>
                    <?php } ?>

                    <div id="content-widgets" class="content-widgets">
                        <ul>
                            <?php if ( !function_exists('dynamic_sidebar')
                                || !dynamic_sidebar('Standard Pages Below Content') ) : ?>
                            <?php endif; ?>
                        </ul>
                    </div>
                </div>
                <div class="col-sm-4 sidebarcol">
                    <div class="sidebar-div">

                        <?php if ( (get_children($top_parent_id)) && ($top_parent_id != 117) && ($top_parent_id != 1162) && !is_single() ) { ?>
                            <div class="sidebar-navbox">
                                <div class="sn-header"></div>
                                <div class="sn-bg">
                                    <ul><?php wp_list_pages('title_li=&sort_column=menu_order&child_of='.$top_parent_id); ?></ul>
                                </div>
                                <div class="sn-footer"></div>
                            </div>
                        <?php } ?>


                        <?php get_sidebar(); ?>

                    </div>
                </div>
            </div>
        </div>

    </div>
</div>
<?php get_footer(); ?>
