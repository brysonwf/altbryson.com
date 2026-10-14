<ul class="advertisements-sidebar">
    <?php
    $args = array( 'post_type' => 'advertisement', 'posts_per_page' => -1, 'cat' => 2 );
    $loop = new WP_Query( $args );
    while ( $loop->have_posts() ) : $loop->the_post();
        echo '<li><div class="pad">';
        $permalink = get_permalink();
        echo '<a class="image" href="'.$permalink.'">';
        the_post_thumbnail('full');
        echo '</a></div></li>';
        $count++;
    endwhile;
    ?>
</ul>