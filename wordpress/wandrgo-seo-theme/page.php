<?php
/**
 * Standard Page Template (e.g. About Us).
 */
get_header();
wandrgo_breadcrumbs();

while ( have_posts() ) :
	the_post();
	?>
	<header class="page-hero">
		<h1><?php the_title(); ?></h1>
	</header>

	<article class="article-shell">
		<div class="article-body">
			<?php the_content(); ?>
		</div>
	</article>

	<div class="cta-banner">
		<div>
			<h2 style="font-family:var(--font-heading);font-size:1.5rem;margin-bottom:4px;">Ready to plan your next trip?</h2>
			<p style="color:var(--muted);font-size:0.88rem;margin:0;">Generate a personalized day-by-day itinerary with INR budgets in seconds.</p>
		</div>
		<a href="<?php echo esc_url( wandrgo_get_planner_url() ); ?>" target="_blank" rel="noopener" class="cta-btn">Open AI Trip Planner &rarr;</a>
	</div>
	<?php
endwhile;

get_footer();
