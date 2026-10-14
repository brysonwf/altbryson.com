<ul class="event-list">
    <?php
    $args = array( 'post_type' => 'event', 'posts_per_page' => -1, 'meta_key' => 'event_date', 'orderby' => 'meta_value_num', 'order'=> 'ASC' );
    $loop = new WP_Query( $args );

    while ( $loop->have_posts() ) : $loop->the_post();

        $date = get_field('event_date');

        // extract Y,M,D
        $y = substr($date, 0, 4);
        $m = substr($date, 4, 2);
        $d = substr($date, 6, 2);

        // create UNIX
        $time = strtotime("{$d}-{$m}-{$y}");

        // format date
        $formatedDate = date('m/d/Y', $time);

        echo '<li>';
        $permalink = get_permalink();
        echo '<a class="title" href="'.$permalink.'">';
        the_title();
        echo '</a><div class="date">'.$formatedDate.'</div><div class="p">';
        the_excerpt();
        echo '</div></li>';
        $count++;
    endwhile;
    ?>
</ul>