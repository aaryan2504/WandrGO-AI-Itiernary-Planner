<?php
/**
 * Blog Index / Fallback Archive Template.
 */
get_header();
wandrgo_breadcrumbs();
$theme_uri = get_template_directory_uri();
?>

<header class="page-hero">
	<h1>WandrGo <strong>Travel Blog</strong></h1>
	<p>Actionable guides on AI travel planning, destination pacing, and smart INR budgeting.</p>
</header>

<?php if ( have_posts() ) : ?>
	<?php while ( have_posts() ) : the_post(); ?>
		<article class="blog-card">
			<a href="<?php the_permalink(); ?>">
				<?php if ( has_post_thumbnail() ) : ?>
					<?php the_post_thumbnail( 'medium_large' ); ?>
				<?php else : ?>
					<img src="<?php echo esc_url( $theme_uri . '/assets/travel-planning-guide.webp' ); ?>" alt="<?php echo esc_attr( get_the_title() ); ?>" width="1200" height="675">
				<?php endif; ?>
			</a>
			<div>
				<h2><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h2>
				<p style="color:var(--muted);font-size:0.9rem;margin-bottom:14px;">
					<?php echo esc_html( get_the_excerpt() ); ?>
				</p>
				<a href="<?php the_permalink(); ?>" class="cta-btn">Read Full Guide &rarr;</a>
			</div>
		</article>
	<?php endwhile; ?>
<?php else : ?>
	<div class="article-shell">
		<p>No blog posts found yet. Import <code>wandrgo-content-import.xml</code> via Tools &rarr; Import &rarr; WordPress.</p>
	</div>
<?php endif; ?>

<?php
get_footer();
