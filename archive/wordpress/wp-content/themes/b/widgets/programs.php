<ul class="programs-list">
    <?php
    $args = array( 'post_type' => 'program', 'posts_per_page' => -1, 'order_by' => 'menu_order', 'order' => 'ASC' );
    $loop = new WP_Query( $args );

    while ( $loop->have_posts() ) : $loop->the_post();
        echo '<li>';
        $permalink = get_permalink();
        echo '<a class="title" href="'.$permalink.'">';
        the_title();
        echo '</a><div class="p">';
        the_excerpt();
        echo '</div></li>';
        $count++;
    endwhile;
    ?>
</ul>