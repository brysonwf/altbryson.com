<ul class="videoitems">
   
    <?php
        $count=0;		
		$args = array( 'post_type' => 'post', 'posts_per_page' => 1, 'cat' => 11 );
		$loop = new WP_Query( $args );
		while ( $loop->have_posts() ) : $loop->the_post();
			echo '<li class="video">';
			the_content();
			echo '</li>';
			$count++;
		endwhile;
		
        if ($count==0){
            ?>
            <?
        }
    ?>
	
</ul>