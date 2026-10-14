<ul class="newsitems">
   
    <?php
        $count=0;		
		$args = array( 'post_type' => 'post', 'posts_per_page' => -1, 'cat' => 31 );
		$loop = new WP_Query( $args );
		while ( $loop->have_posts() ) : $loop->the_post();
			echo '<li class="article">';
			$permalink = get_permalink();
			echo '<a class="title" href="'.$permalink.'">';
			the_title();
			echo '</a><div class="date">';
			echo get_the_date();
			echo '</div><a class="image" href="'.$permalink.'">';
			the_post_thumbnail('full');
			echo '</a><div class="p">';
			the_excerpt();
			echo '</div></li>';
			$count++;
		endwhile;
		
        if ($count==0){
            ?>
            <?
        }
    ?>
	
</ul>