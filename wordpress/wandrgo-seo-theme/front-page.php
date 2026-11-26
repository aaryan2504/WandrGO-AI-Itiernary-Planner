<?php
/**
 * Homepage Template for WandrGo AI Travel Itinerary Planner.
 */
get_header();
$planner_url = wandrgo_get_planner_url();
$theme_uri   = get_template_directory_uri();
?>

<header class="page-hero">
	<h1>Plan your next<br><strong>AI-powered adventure</strong></h1>
	<p>
		Tell us where you're headed — our <strong>AI travel itinerary planner</strong> schedules
		zero-duplicate daily activities, realistic INR budgets, local food guides, and trip-aware AI chat.
	</p>
</header>

<section class="planner-box" aria-label="Quick AI Trip Launcher">
	<h2 style="font-family:var(--font-heading);font-size:1.7rem;margin-bottom:14px;">Launch Your Custom Trip Plan</h2>
	<form id="wp-planner-launch" onsubmit="wandrgoLaunchPlanner(event)">
		<div class="form-row">
			<div class="form-group">
				<label for="wp-dest">Destination</label>
				<input type="text" id="wp-dest" placeholder="e.g. Kyoto, Japan or Goa, India" required>
			</div>
			<div class="form-group">
				<label for="wp-days">Duration (Days)</label>
				<input type="number" id="wp-days" value="5" min="1" max="30">
			</div>
			<div class="form-group">
				<label for="wp-budget">Budget (INR &#8377;)</label>
				<input type="number" id="wp-budget" value="25000" min="1000" step="1000">
			</div>
		</div>
		<button type="submit" class="generate-btn">&#10022; Open Live WandrGo AI Itinerary Planner</button>
	</form>
</section>

<script>
function wandrgoLaunchPlanner(e) {
	e.preventDefault();
	if (typeof window.gtag === 'function') {
		window.gtag('event', 'launch_ai_planner', {
			destination: document.getElementById('wp-dest').value || 'unspecified',
			days: document.getElementById('wp-days').value || '5'
		});
	}
	window.open('<?php echo esc_js( $planner_url ); ?>', '_blank', 'noopener');
}
</script>

<section class="seo-section" aria-labelledby="why-wandrgo">
	<h2 id="why-wandrgo">Why Use an AI Travel Itinerary Planner?</h2>
	<p>
		Planning a multi-day trip manually means juggling dozens of tabs for transit routes, attraction
		timings, and hotel costs. WandrGo brings those details together into one structured workflow
		with transparent Indian Rupee (INR) estimates and zero repeated landmarks across days.
	</p>

	<div class="seo-grid">
		<article class="seo-card">
			<h3>Zero-Duplicate Daily Plans</h3>
			<p>Every attraction and restaurant across Day 1 through departure is automatically deduplicated.</p>
		</article>
		<article class="seo-card">
			<h3>Transparent INR Budgets</h3>
			<p>Clear cost breakdowns covering flights, stays, local transit, meals, and entry tickets in &#8377;.</p>
		</article>
		<article class="seo-card">
			<h3>Trip-Aware AI Assistant</h3>
			<p>Refine pacing, swap rainy-day stops, or ask local street food tips in multi-turn chat.</p>
		</article>
	</div>

	<h2>How WandrGo Works</h2>
	<figure class="article-figure">
		<img src="<?php echo esc_url( $theme_uri . '/assets/ai-workflow.webp' ); ?>" alt="WandrGo four-stage AI itinerary planner architecture" width="1200" height="600" loading="lazy">
		<figcaption>Four-stage AI itinerary pipeline from structured trip constraints to live chat refinement.</figcaption>
	</figure>

	<?php
	if ( have_posts() ) :
		while ( have_posts() ) :
			the_post();
			$raw = trim( wp_strip_all_tags( get_the_content() ) );
			if ( ! empty( $raw ) ) :
				echo '<div class="article-body">';
				the_content();
				echo '</div>';
			endif;
		endwhile;
	endif;
	?>

	<p>
		Read our in-depth guide on <a href="<?php echo esc_url( home_url( '/ai-travel-itinerary-planner-guide/' ) ); ?>" class="inline-link">how to plan a trip with AI</a>
		or learn more <a href="<?php echo esc_url( home_url( '/about-us/' ) ); ?>" class="inline-link">about the WandrGo platform</a>.
	</p>
</section>

<?php
get_footer();
