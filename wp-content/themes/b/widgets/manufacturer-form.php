<form action="/" method="get">
    <fieldset>
        <input type="text" name="s" id="search" value="<?php the_search_query(); ?>" />
        <input type="image" alt="Search" src="<?php bloginfo( 'template_url' ); ?>/images/search.png" />
        <input type="hidden" name="post_type" value="sfs_manufacturer" />
    </fieldset>
</form>