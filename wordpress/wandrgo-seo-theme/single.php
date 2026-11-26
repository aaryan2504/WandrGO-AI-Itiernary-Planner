<?php
/**
 * Single Blog Post Template (/%postname%/).
 */
get_header();
wandrgo_breadcrumbs();
$theme_uri = get_template_directory_uri();

while ( have_posts() ) :
	the_post();
	?>
	<article class="article-shell">
		<header class="page-hero" style="margin-bottom:18px;">
			<h1><?php the_title(); ?></h1>
		</header>

		<div class="article-meta">
			<span>By <strong><?php the_author(); ?></strong></span>
			<span>&bull;</span>
			<time datetime="<?php echo esc_attr( get_the_date( 'c' ) ); ?>">Published: <?php echo esc_html( get_the_date() ); ?></time>
			<span>&bull;</span>
			<span>Updated: <?php echo esc_html( get_the_modified_date() ); ?></span>
		</div>

		<?php if ( has_post_thumbnail() ) : ?>
			<figure class="article-figure">
				<?php the_post_thumbnail( 'large' ); ?>
			</figure>
		<?php else : ?>
			<figure class="article-figure">
				<img src="<?php echo esc_url( $theme_uri . '/assets/travel-planning-guide.webp' ); ?>" alt="<?php echo esc_attr( get_the_title() ); ?>" width="1200" height="675">
				<figcaption>Structured AI prompting transforms destination research into actionable daily schedules.</figcaption>
			</figure>
		<?php endif; ?>

		<div class="article-body">
			<?php the_content(); ?>
		</div>
	</article>

	<div class="cta-banner">
		<div>
			<h2 style="font-family:var(--font-heading);font-size:1.5rem;margin-bottom:4px;">Try the WandrGo AI Itinerary Planner</h2>
			<p style="color:var(--muted);font-size:0.88rem;margin:0;">
				Explore our <a href="<?php echo esc_url( home_url( '/about-us/' ) ); ?>" class="inline-link">About Us</a> page or launch the live AI planner tool.
			</p>
		</div>
		<a href="<?php echo esc_url( wandrgo_get_planner_url() ); ?>" target="_blank" rel="noopener" class="cta-btn">Start Planning &rarr;</a>
	</div>
	<?php
endwhile;

get_footer();
