<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?>
</main>

<footer class="site-footer">
	<div class="footer-inner">
		<div>&copy; <?php echo esc_html( gmdate( 'Y' ) ); ?> <?php bloginfo( 'name' ); ?>. AI Travel Itinerary Planner.</div>
		<nav class="footer-links" aria-label="Footer Navigation">
			<a href="<?php echo esc_url( home_url( '/' ) ); ?>">Home</a>
			<a href="<?php echo esc_url( home_url( '/about-us/' ) ); ?>">About Us</a>
			<a href="<?php echo esc_url( home_url( '/blog/' ) ); ?>">Blog</a>
			<a href="<?php echo esc_url( home_url( '/ai-travel-itinerary-planner-guide/' ) ); ?>">AI Trip Guide</a>
			<a href="<?php echo esc_url( wandrgo_get_planner_url() ); ?>" target="_blank" rel="noopener">Launch AI Tool</a>
		</nav>
	</div>
</footer>

<script>
document.addEventListener('click', function (e) {
	var link = e.target.closest('a[target="_blank"]');
	if (link && typeof window.gtag === 'function') {
		window.gtag('event', 'outbound_click', { link_url: link.href });
	}
});
</script>
<?php wp_footer(); ?>
</body>
</html>
