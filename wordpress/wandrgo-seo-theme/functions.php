<?php
/**
 * WandrGo SEO Theme functions and definitions.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function wandrgo_theme_setup() {
	add_theme_support( 'title-tag' );
	add_theme_support( 'post-thumbnails' );
	add_theme_support(
		'html5',
		array( 'search-form', 'comment-form', 'comment-list', 'gallery', 'caption', 'style', 'script' )
	);

	register_nav_menus(
		array(
			'primary' => __( 'Primary Menu', 'wandrgo-seo' ),
			'footer'  => __( 'Footer Menu', 'wandrgo-seo' ),
		)
	);
}
add_action( 'after_setup_theme', 'wandrgo_theme_setup' );

/**
 * Remove WordPress emoji scripts to improve Core Web Vitals (LCP/TBT).
 */
function wandrgo_disable_emojis() {
	remove_action( 'wp_head', 'print_emoji_detection_script', 7 );
	remove_action( 'wp_print_styles', 'print_emoji_styles' );
}
add_action( 'init', 'wandrgo_disable_emojis' );

/**
 * Enqueue Google Fonts (display=swap) and theme stylesheet.
 */
function wandrgo_enqueue_assets() {
	wp_enqueue_style(
		'wandrgo-fonts',
		'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,400&family=Outfit:wght@300;400;500;600;700&display=swap',
		array(),
		null
	);
	wp_enqueue_style(
		'wandrgo-style',
		get_stylesheet_uri(),
		array( 'wandrgo-fonts' ),
		'1.0.0'
	);
}
add_action( 'wp_enqueue_scripts', 'wandrgo_enqueue_assets' );

/**
 * Add preconnect hints for Google Fonts.
 */
function wandrgo_resource_hints( $urls, $relation_type ) {
	if ( 'preconnect' === $relation_type ) {
		$urls[] = array( 'href' => 'https://fonts.googleapis.com' );
		$urls[] = array(
			'href'        => 'https://fonts.gstatic.com',
			'crossorigin' => 'anonymous',
		);
	}
	return $urls;
}
add_filter( 'wp_resource_hints', 'wandrgo_resource_hints', 10, 2 );

/**
 * Customizer settings for Live AI Planner URL, GA4 Measurement ID, and GSC Verification.
 */
function wandrgo_customize_register( $wp_customize ) {
	$wp_customize->add_section(
		'wandrgo_seo_settings',
		array(
			'title'    => __( 'WandrGo SEO & AI Planner', 'wandrgo-seo' ),
			'priority' => 30,
		)
	);

	$wp_customize->add_setting(
		'wandrgo_planner_url',
		array(
			'default'           => 'https://wandrgo-ai-itiernary-planner-1.onrender.com/',
			'sanitize_callback' => 'esc_url_raw',
		)
	);
	$wp_customize->add_control(
		'wandrgo_planner_url',
		array(
			'label'   => __( 'Live AI Planner URL (Render)', 'wandrgo-seo' ),
			'section' => 'wandrgo_seo_settings',
			'type'    => 'url',
		)
	);

	$wp_customize->add_setting(
		'wandrgo_ga4_id',
		array(
			'default'           => '',
			'sanitize_callback' => 'sanitize_text_field',
		)
	);
	$wp_customize->add_control(
		'wandrgo_ga4_id',
		array(
			'label'       => __( 'GA4 Measurement ID (G-XXXXXXXXXX)', 'wandrgo-seo' ),
			'section'     => 'wandrgo_seo_settings',
			'type'        => 'text',
		)
	);

	$wp_customize->add_setting(
		'wandrgo_gsc_token',
		array(
			'default'           => '',
			'sanitize_callback' => 'sanitize_text_field',
		)
	);
	$wp_customize->add_control(
		'wandrgo_gsc_token',
		array(
			'label'       => __( 'Google Search Console Meta Content Token', 'wandrgo-seo' ),
			'section'     => 'wandrgo_seo_settings',
			'type'        => 'text',
		)
	);
}
add_action( 'customize_register', 'wandrgo_customize_register' );

function wandrgo_get_planner_url() {
	return get_theme_mod( 'wandrgo_planner_url', 'https://wandrgo-ai-itiernary-planner-1.onrender.com/' );
}

/**
 * Output GA4 & GSC meta tags if set in Customizer.
 */
function wandrgo_head_analytics() {
	$gsc = trim( get_theme_mod( 'wandrgo_gsc_token', '' ) );
	if ( $gsc ) {
		echo '<meta name="google-site-verification" content="' . esc_attr( $gsc ) . '">' . "\n";
	}

	$ga4 = trim( get_theme_mod( 'wandrgo_ga4_id', '' ) );
	if ( $ga4 ) {
		$id = esc_attr( $ga4 );
		echo '<script async src="https://www.googletagmanager.com/gtag/js?id=' . $id . '"></script>' . "\n";
		echo "<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','" . esc_js( $ga4 ) . "');</script>\n";
	}

	// Fallback OpenGraph & Schema only when Rank Math and Yoast are inactive.
	if ( ! defined( 'RANK_MATH_VERSION' ) && ! defined( 'WPSEO_VERSION' ) ) {
		$site_url = home_url( '/' );
		if ( is_front_page() ) {
			$schema = array(
				'@context' => 'https://schema.org',
				'@graph'   => array(
					array(
						'@type' => 'Organization',
						'@id'   => $site_url . '#organization',
						'name'  => get_bloginfo( 'name' ),
						'url'   => $site_url,
					),
					array(
						'@type'     => 'WebSite',
						'@id'       => $site_url . '#website',
						'url'       => $site_url,
						'name'      => get_bloginfo( 'name' ),
						'publisher' => array( '@id' => $site_url . '#organization' ),
					),
				),
			);
			echo '<script type="application/ld+json">' . wp_json_encode( $schema ) . "</script>\n";
		} elseif ( is_single() ) {
			$schema = array(
				'@context'      => 'https://schema.org',
				'@type'         => 'Article',
				'headline'      => get_the_title(),
				'datePublished' => get_the_date( 'c' ),
				'dateModified'  => get_the_modified_date( 'c' ),
				'author'        => array(
					'@type' => 'Organization',
					'name'  => get_bloginfo( 'name' ),
				),
				'publisher'     => array(
					'@type' => 'Organization',
					'name'  => get_bloginfo( 'name' ),
				),
			);
			echo '<script type="application/ld+json">' . wp_json_encode( $schema ) . "</script>\n";
		}
	}
}
add_action( 'wp_head', 'wandrgo_head_analytics', 5 );

/**
 * Breadcrumbs helper: delegates to Rank Math or Yoast when active, else renders semantic breadcrumbs.
 */
function wandrgo_breadcrumbs() {
	if ( is_front_page() ) {
		return;
	}
	if ( function_exists( 'rank_math_the_breadcrumbs' ) ) {
		echo '<nav class="breadcrumbs" aria-label="Breadcrumb">';
		rank_math_the_breadcrumbs();
		echo '</nav>';
		return;
	}
	if ( function_exists( 'yoast_breadcrumb' ) ) {
		yoast_breadcrumb( '<nav class="breadcrumbs" aria-label="Breadcrumb">', '</nav>' );
		return;
	}

	echo '<nav class="breadcrumbs" aria-label="Breadcrumb">';
	echo '<a href="' . esc_url( home_url( '/' ) ) . '">Home</a>';
	if ( is_single() ) {
		echo '<span class="crumb-sep">/</span>';
		$posts_page_id = get_option( 'page_for_posts' );
		$blog_url      = $posts_page_id ? get_permalink( $posts_page_id ) : home_url( '/blog/' );
		echo '<a href="' . esc_url( $blog_url ) . '">Blog</a>';
		echo '<span class="crumb-sep">/</span>';
		echo '<span aria-current="page">' . esc_html( get_the_title() ) . '</span>';
	} elseif ( is_page() || is_home() ) {
		echo '<span class="crumb-sep">/</span>';
		echo '<span aria-current="page">' . esc_html( single_post_title( '', false ) ) . '</span>';
	}
	echo '</nav>';
}
