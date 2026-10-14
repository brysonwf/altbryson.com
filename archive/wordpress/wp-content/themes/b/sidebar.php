<?php
/**
 * @package WordPress
 * @subpackage Classic_Theme
 */
?>
<!-- begin sidebar -->
<div id="sidebar" class="sidebar">
	<ul class="list-unstyled">
		<?php if ( !function_exists('dynamic_sidebar')
            || !dynamic_sidebar('Standard Pages Sidebar') ) : ?>
        <?php endif; ?>
    </ul>

    <div class="panel-group" id="accordion" role="tablist" aria-multiselectable="true">

    </div>
</div>
<!-- end sidebar -->
