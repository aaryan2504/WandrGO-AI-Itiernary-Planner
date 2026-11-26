<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?><!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<nav class="navbar" aria-label="Primary Navigation">
	<a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="nav-logo">
		W<em>a</em>ndrGo <span class="nav-logo-sub">Itinerary Planner</span>
	</a>

	<?php
	if ( has_nav_menu( 'primary' ) ) {
		wp_nav_menu(
			array(
				'theme_location' => 'primary',
				'container'      => false,
				'menu_class'     => 'nav-menu',
			)
		);
	} else {
		?>
		<ul class="nav-menu">
			<li><a href="<?php echo esc_url( home_url( '/' ) ); ?>">Home</a></li>
			<li><a href="<?php echo esc_url( home_url( '/about-us/' ) ); ?>">About Us</a></li>
			<li><a href="<?php echo esc_url( home_url( '/blog/' ) ); ?>">Blog</a></li>
			<li><a href="<?php echo esc_url( home_url( '/ai-travel-itinerary-planner-guide/' ) ); ?>">AI Guide</a></li>
		</ul>
		<?php
	}
	?>

	<a href="<?php echo esc_url( wandrgo_get_planner_url() ); ?>" target="_blank" rel="noopener" class="nav-badge">
		<span class="dot"></span>
		Live AI Planner
	</a>
</nav>

<main class="main-container">
