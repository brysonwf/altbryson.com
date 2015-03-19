<ul class="home-galleries">
   
    <?php
        $count=0;		
		$args = array( 'post_type' => 'hh_homegalleries', 'posts_per_page' => -1 );
		$loop = new WP_Query( $args );
		while ( $loop->have_posts() ) : $loop->the_post();
			$openFrame = false;
			if (($count == 0) || ($count%4 == 0)){
				if ($count != 0){
					echo '</div>';
				}
				echo '<div class="frame">';
			}
			echo '<li>';
			$permalink = get_permalink();
			echo '<a href="'.$permalink.'"><div class="image">';
			the_post_thumbnail('thumbnail');
			echo '</div><div class="title">';
			the_title();
			echo '</div></a></li>';
			$count++;
		endwhile;
		
        if ($count==0){
            ?>
            <?
        }
    ?>
	
</ul>
<a id="home-galleries-next"><img src="<?php bloginfo('stylesheet_directory'); ?>/img/arrow-gallery-left.png" /></a>
<a id="home-galleries-prev"><img src="<?php bloginfo('stylesheet_directory'); ?>/img/arrow-gallery-right.png" /></a>


<script type="text/javascript">
	jQuery(document).ready(function() {
		$('.home-galleries').cycle({ 
			fx:     'fade', 
			speed:  'slow',
			next:   '#home-galleries-next', 
			prev:   '#home-galleries-prev' 
		});
	});
</script>