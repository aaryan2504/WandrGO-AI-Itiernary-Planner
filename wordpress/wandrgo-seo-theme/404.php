<?php
/**
 * 404 Not Found Template.
 */
get_header();
?>
<header class="page-hero">
	<h1>404 &mdash; <strong>Page Not Found</strong></h1>
	<p>The page you requested could not be found. Return to the WandrGo homepage or browse our travel planning guide.</p>
</header>
<div class="cta-banner">
	<div>
		<h2 style="font-family:var(--font-heading);font-size:1.5rem;">Explore WandrGo</h2>
	</div>
	<a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="cta-btn">Back to Home &rarr;</a>
</div>
<?php
get_footer();
