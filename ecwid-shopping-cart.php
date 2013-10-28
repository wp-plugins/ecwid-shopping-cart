<?php
/*
Plugin Name: Ecwid Shopping Cart
Plugin URI: http://www.ecwid.com?source=wporg
Description: Ecwid is a free full-featured shopping cart. It can be easily integrated with any Wordpress blog and takes less than 5 minutes to set up.
Author: Ecwid Team
Version: 2.0
Author URI: http://www.ecwid.com?source=wporg
*/

register_activation_hook( __FILE__, 'ecwid_store_activate' );
register_deactivation_hook( __FILE__, 'ecwid_store_deactivate' );

define("APP_ECWID_COM", "app.ecwid.com");
define("ECWID_DEMO_STORE_ID", 1003);

if ( ! defined( 'ECWID_PLUGIN_DIR' ) ) {
	define( 'ECWID_PLUGIN_DIR', plugin_dir_path( realpath(__FILE__) ) );
}

if ( ! defined( 'ECWID_PLUGIN_URL' ) ) {
	define( 'ECWID_PLUGIN_URL', plugin_dir_url( realpath(__FILE__) ) );
}

if ( is_admin() ){ 
  add_action('admin_init', 'ecwid_settings_api_init');
  add_action('admin_notices', 'ecwid_show_admin_message');
  add_action('admin_menu', 'ecwid_options_add_page');
  add_action('wp_dashboard_setup', 'ecwid_add_dashboard_widgets' );
  add_action('admin_enqueue_scripts', 'ecwid_register_admin_styles');
  add_action('admin_enqueue_scripts', 'ecwid_register_settings_styles');

} else {
  add_shortcode('ecwid_script', 'ecwid_script_shortcode');
  add_shortcode('ecwid_minicart', 'ecwid_minicart_shortcode');
  add_shortcode('ecwid_searchbox', 'ecwid_searchbox_shortcode');
  add_shortcode('ecwid_categories', 'ecwid_categories_shortcode');
  add_shortcode('ecwid_productbrowser', 'ecwid_productbrowser_shortcode');
  add_action('init', 'ecwid_backward_compatibility');
  add_filter('wp_title', 'ecwid_seo_title', 20);
  add_action('wp_head', 'ecwid_ajax_crawling_fragment');
  add_action('wp_head', 'ecwid_meta');
  add_action('wp_title', 'ecwid_seo_compatibility_init', 0);
  add_action('wp_head', 'ecwid_seo_compatibility_restore', 1000);
  add_action('wp_head', 'ecwid_meta_description', 0);
  $ecwid_seo_title = '';
}
add_action('admin_bar_menu', 'add_ecwid_admin_bar_node', 1000);

$version = get_bloginfo('version');

if (version_compare($version, '3.6') < 0) {
    /**
     * A copy of has_shortcode functionality from wordpress 3.6
     * http://core.trac.wordpress.org/browser/tags/3.6/wp-includes/shortcodes.php
     */

	if (!function_exists('shortcode_exists')) {
		function shortcode_exists( $tag ) {
			global $shortcode_tags;
				return array_key_exists( $tag, $shortcode_tags );
		}
	}

	if (!function_exists('has_shortcode')) {
		function has_shortcode( $content, $tag ) {
			if ( shortcode_exists( $tag ) ) {
				preg_match_all( '/' . get_shortcode_regex() . '/s', $content, $matches, PREG_SET_ORDER );
				if ( empty( $matches ) )
					return false;

				foreach ( $matches as $shortcode ) {
					if ( $tag === $shortcode[2] ) {
						return true;
					}
				}
			}
			return false;
		}
	}
}

function ecwid_load_textdomain() {
	load_plugin_textdomain( 'ecwid-shopping-cart', false, dirname( plugin_basename( __FILE__ ) ) . '/languages' );
}

add_filter( 'plugins_loaded', 'ecwid_load_textdomain' );

function ecwid_backward_compatibility() {

    // Backward compatibility with 1.1.2 and earlier
    if (isset($_GET['ecwid_product_id']) || isset($_GET['ecwid_category_id'])) {
        $ecwid_page = get_option("ecwid_store_page_id");
        $ecwid_page = get_page_link($ecwid_page);
        $ecwid_page .= '#!/~/';

        if (isset($_GET['ecwid_product_id']))
            $redirect = $ecwid_page . 'product/id=' . $_GET['ecwid_product_id'];
        elseif (isset($_GET['ecwid_category_id']))
            $redirect = $ecwid_page . 'category/id=' . $_GET['ecwid_category_id'];

        wp_redirect($redirect, 301);
        exit();
    }
}

function ecwid_override_option($name, $new_value = null)
{
    static $overridden = array();

    if (!array_key_exists($name, $overridden)) {
        $overridden[$name] = get_option($name);
    }

    if (!is_null($new_value)) {
        update_option($name, $new_value);
    } else {
        update_option($name, $overridden[$name]);
    }
}

function ecwid_seo_compatibility_init($title)
{
    if (!array_key_exists('_escaped_fragment_', $_GET) || !ecwid_page_has_productbrowser()) {
        return $title;
    }

    // Default wordpress canonical
    remove_action( 'wp_head','rel_canonical');

    // Canonical for Yoast Wordpress SEO
    global $wpseo_front;
    remove_action( 'wpseo_head', array( $wpseo_front, 'canonical' ), 20);
	remove_action( 'wpseo_head', array( $wpseo_front, 'metadesc' ), 10 );

    // Canonical for Platinum SEO Pack
    ecwid_override_option('psp_canonical', false);
    // Title for Platinum SEO Pack
    ecwid_override_option('aiosp_rewrite_titles', false);

    global $aioseop_options, $aiosp;
    // Canonical for All in One SEO Pack
    $aioseop_options['aiosp_can'] = false;
    // Title for All in One SEO Pack
	add_filter('aioseop_description', __return_null);
	add_filter('aioseop_title', __return_null);

	return $title;

}

function ecwid_seo_compatibility_restore()
{
    if (!array_key_exists('_escaped_fragment_', $_GET) || !ecwid_page_has_productbrowser()) {
        return;
    }

    ecwid_override_option('psp_canonical');
    ecwid_override_option('aiosp_rewrite_titles');
}

function add_ecwid_admin_bar_node() {
    global $wp_admin_bar;
     if ( !is_super_admin() || !is_admin_bar_showing() )
        return;

    $wp_admin_bar->add_menu( array(
        'id' => 'ecwid_main',
        'title' => '<div class="ecwid-top-menu-item"></div>',
    ));
	$wp_admin_bar->add_menu(array(
			"id" => "ecwid_help",
			"title" => __("Get help", 'ecwid-shopping-cart'),
			"parent" => "ecwid_main",
			'href' =>  'http://help.ecwid.com'
		)
	);
    $wp_admin_bar->add_menu(array(
            "id" => "ecwid_home",
            "title" => __("Go to Ecwid site", 'ecwid-shopping-cart'),
            "parent" => "ecwid_main",
            'href' => 'http://www.ecwid.com?source=wporg'
        )
    );
    $wp_admin_bar->add_menu(array(
            "id" => "ecwid_go_to_page",
            "title" => __("Visit storefront", 'ecwid-shopping-cart'),
            "parent" => "ecwid_main",
            'href' =>  get_page_link(get_option("ecwid_store_page_id"))
        )
    );
    $wp_admin_bar->add_menu(array(
            "id" => "ecwid_control_panel",
            "title" => __("Manage my store", 'ecwid-shopping-cart'),
            "parent" => "ecwid_main",
            'href' =>  'https://my.ecwid.com/cp/?source=wporg#t1=&t2=Dashboard'
        )
    );
	$wp_admin_bar->add_menu(array(
			"id" => "ecwid_settings",
			"title" => __("Manage plugin settings", 'ecwid-shopping-cart'),
			"parent" => "ecwid_main",
			'href' =>  admin_url('admin.php?page=ecwid')
		)
	);
	$wp_admin_bar->add_menu(array(
            "id" => "ecwid_fb_app",
            "title" => __("→ Sell on Facebook", 'ecwid-shopping-cart'),
            "parent" => "ecwid_main",
            'href' =>  'http://apps.facebook.com/ecwid-shop/?fb_source=wp'
        )
    );
}

function ecwid_page_has_productbrowser()
{
    static $result = null;

    if (is_null($result)) {
        $post_content = get_post(get_the_ID())->post_content;
        $result = has_shortcode($post_content, 'ecwid_productbrowser');
    }

    return $result;
}

function ecwid_ajax_crawling_fragment() {
    $ecwid_page_id = get_option("ecwid_store_page_id");
    if (ecwid_is_api_enabled() && !isset($_GET['_escaped_fragment_']) && ecwid_page_has_productbrowser())
        echo '<meta name="fragment" content="!">' . PHP_EOL; 
}

function ecwid_meta() {

    echo '<link rel="dns-prefetch" href="//images-cdn.ecwid.com/">' . PHP_EOL;
    echo '<link rel="dns-prefetch" href="//images.ecwid.com/">' . PHP_EOL;
    echo '<link rel="dns-prefetch" href="//app.ecwid.com/">' . PHP_EOL;

    if (!ecwid_page_has_productbrowser()) {
        $ecwid_page_id = get_option("ecwid_store_page_id");
        $page_url = get_page_link($ecwid_page_id);
        echo '<link rel="prefetch" href="' . $page_url . '" />' . PHP_EOL;
        echo '<link rel="prerender" href="' . $page_url . '" />' . PHP_EOL;
    }
}

function ecwid_meta_description() {

    $allowed = ecwid_is_api_enabled() && isset($_GET['_escaped_fragment_']);
    if (!$allowed) return;

    $params = ecwid_parse_escaped_fragment($_GET['_escaped_fragment_']);
    if (!$params) return;

    if (!in_array($params['mode'], array('category', 'product')) || !isset($params['id'])) return;

    $api = ecwid_new_product_api();
    if ($params['mode'] == 'product') {
        $product = $api->get_product($params['id']);
        $description = $product['description'];
    } elseif ($params['mode'] == 'category') {
        $category = $api->get_category($params['id']);
        $description = $category['description'];
    } else return;

    $description = strip_tags($description);
    $description = html_entity_decode($description, ENT_NOQUOTES, 'UTF-8');

	$description = preg_replace("![\\s]+!", " ", $description);
	$description = trim($description, " \t\xA0\n\r"); // Space, tab, non-breaking space, newline, carriage return
	$description = mb_substr($description, 0, 160);
	$description = htmlspecialchars($description, ENT_COMPAT | ENT_HTML401, 'UTF-8');

    echo <<<HTML
<meta name="description" content="$description" />
HTML;
}

function ecwid_get_product_and_category($category_id, $product_id) {
    $params = array 
    (
        array("alias" => "c", "action" => "category", "params" => array("id" => $category_id)),
        array("alias" => "p", "action" => "product", "params" => array("id" => $product_id)),           
    );

    $api = ecwid_new_product_api();
    $batch_result = $api->get_batch_request($params);

    $category = $batch_result["c"];
    $product = $batch_result["p"];
    $return = "";

    if (is_array($product)) {
        $return .=$product["name"];
    }

    if(is_array($category)) {
        $return.=" | ";
        $return .=$category["name"];
    }
    return $return;
}

function ecwid_seo_title($content) {
    if (isset($_GET['_escaped_fragment_']) && ecwid_is_api_enabled()) {
    $params = ecwid_parse_escaped_fragment($_GET['_escaped_fragment_']);
    $ecwid_seo_title = '';

    $api = ecwid_new_product_api();

    if (isset($params['mode']) && !empty($params['mode'])) {
        if ($params['mode'] == 'product') {
            $ecwid_product = $api->get_product($params['id']);
            $ecwid_seo_title = $ecwid_product['name'];
            if(isset($params['category']) && !empty($params['category'])){
                $ecwid_seo_title= ecwid_get_product_and_category($params['category'], $params['id']);
            }
            elseif(empty($params['category'])){
                $ecwid_product = $api->get_product($params['id']);
                $ecwid_seo_title .=$ecwid_product['name'];
                if(is_array($ecwid_product['categories'])){
                    foreach ($ecwid_product['categories'] as $ecwid_category){
                        if($ecwid_category['defaultCategory']==true){
                        $ecwid_seo_title .=" | ";
                        $ecwid_seo_title .=  $ecwid_category['name'];
                        }
                    }
                }
        }
    }

        elseif ($params['mode'] == 'category'){
         $api = ecwid_new_product_api();
         $ecwid_category = $api->get_category($params['id']);
         $ecwid_seo_title =  $ecwid_category['name'];
        }
    }
    if (!empty($ecwid_seo_title))
        return $ecwid_seo_title . " | " . $content;
    else
        return $content;

  } else {
    return $content;
  }
}

function ecwid_wrap_shortcode_content($content)
{
    return "<!-- Ecwid shopping cart plugin v 2.0 --><div>$content</div><!-- END Ecwid Shopping Cart v 2.0 -->";
}

function ecwid_get_scriptjs_code() {
    if (!defined('ECWID_SCRIPTJS')) {
      $store_id = get_ecwid_store_id();
      $s =  '<script type="text/javascript" data-cfasync="false" src="//' . APP_ECWID_COM . '/script.js?' . $store_id . '"></script>';
      define('ECWID_SCRIPTJS','Yep');
      $s = $s . ecwid_sso(); 
      return $s;
    } else {
      return '';
    }
}

function ecwid_script_shortcode() {
    return ecwid_wrap_shortcode_content(ecwid_get_scriptjs_code());
}

function ecwid_minicart_shortcode() {

    $ecwid_enable_minicart = get_option('ecwid_enable_minicart');
    $ecwid_show_categories = get_option('ecwid_show_categories');
    if (!empty($ecwid_enable_minicart) && !empty($ecwid_show_categories)) {
        $s = <<<EOT
<script type="text/javascript"> xMinicart("style=","layout=attachToCategories"); </script>
EOT;
        return ecwid_wrap_shortcode_content($s);
    } else {
        return "";
    }
}
function ecwid_searchbox_shortcode() {
    $ecwid_show_search_box = get_option('ecwid_show_search_box');
    if (!empty($ecwid_show_search_box)) {
        $s = <<<EOT
<script type="text/javascript"> xSearchPanel("style="); </script>
EOT;
        return ecwid_wrap_shortcode_content($s);
    } else {
        return "";
    }
}

function ecwid_categories_shortcode() {
    $ecwid_show_categories = get_option('ecwid_show_categories');
    if (!empty($ecwid_show_categories)) {
        $s = <<<EOT
<script type="text/javascript"> xCategories("style="); </script>
EOT;
        return ecwid_wrap_shortcode_content($s);
    } else {
        return "";
    }
}

function ecwid_parse_escaped_fragment($escaped_fragment) {
    $fragment = urldecode($escaped_fragment);
    $return = array();

    if (preg_match('/^(\/~\/)([a-z]+)\/(.*)$/', $fragment, $matches)) {
        parse_str($matches[3], $return);
        $return['mode'] = $matches[2];
    } 
    return $return;
}

function ecwid_productbrowser_shortcode($shortcode_params) {
    global $ecwid_seo_product_title;
    $store_id = get_ecwid_store_id();
    $list_of_views = array('list','grid','table');

    $ecwid_pb_categoriesperrow = get_option('ecwid_pb_categoriesperrow');
    $ecwid_pb_productspercolumn_grid = get_option('ecwid_pb_productspercolumn_grid');
    $ecwid_pb_productsperrow_grid = get_option('ecwid_pb_productsperrow_grid');
    $ecwid_pb_productsperpage_list = get_option('ecwid_pb_productsperpage_list');
    $ecwid_pb_productsperpage_table = get_option('ecwid_pb_productsperpage_table');
    $ecwid_pb_defaultview = get_option('ecwid_pb_defaultview');
    $ecwid_pb_searchview = get_option('ecwid_pb_searchview');

    $ecwid_mobile_catalog_link = get_option('ecwid_mobile_catalog_link');
    $ecwid_default_category_id =
        !empty($shortcode_params) && array_key_exists('default_category_id', $shortcode_params)
        ? $shortcode_params['default_category_id']
        : get_option('ecwid_default_category_id');

    if (empty($ecwid_pb_categoriesperrow)) {
        $ecwid_pb_categoriesperrow = 3;
    }
    if (empty($ecwid_pb_productspercolumn_grid)) {
        $ecwid_pb_productspercolumn_grid = 3;
    }
    if (empty($ecwid_pb_productsperrow_grid)) {
        $ecwid_pb_productsperrow_grid = 3;
    }
    if (empty($ecwid_pb_productsperpage_list)) {
        $ecwid_pb_productsperpage_list = 10;
    }
    if (empty($ecwid_pb_productsperpage_table)) {
        $ecwid_pb_productsperpage_table = 20;
    }

    if (empty($ecwid_pb_defaultview) || !in_array($ecwid_pb_defaultview, $list_of_views)) {
        $ecwid_pb_defaultview = 'grid';
    }
    if (empty($ecwid_pb_searchview) || !in_array($ecwid_pb_searchview, $list_of_views)) {
        $ecwid_pb_searchview = 'list';
    }

    if (empty($ecwid_mobile_catalog_link)) {
        $ecwid_mobile_catalog_link = "http://" . APP_ECWID_COM . "/jsp/{$store_id}/catalog";
    }

    if (empty($ecwid_default_category_id)) {
        $ecwid_default_category_str = '';
    } else {
        $ecwid_default_category_str = ',"defaultCategoryId='. $ecwid_default_category_id .'"';
    }

    $ecwid_open_product = '';
    $plain_content = '';

    if (ecwid_is_api_enabled()) {
        if (isset($_GET['_escaped_fragment_'])) {
            $params = ecwid_parse_escaped_fragment($_GET['_escaped_fragment_']);
            include_once WP_PLUGIN_DIR . '/ecwid-shopping-cart/lib/ecwid_product_api.php';
            include_once WP_PLUGIN_DIR . '/ecwid-shopping-cart/lib/EcwidCatalog.php';

            $page_url = get_page_link();

            $catalog = new EcwidCatalog($store_id, $page_url); 

            if (isset($params['mode']) && !empty($params['mode'])) {
                if ($params['mode'] == 'product') {
                    $plain_content = $catalog->get_product($params['id']);
                    $plain_content .= '<script type="text/javascript"> if (!document.location.hash) document.location.hash = "!/~/product/id='. intval($params['id']) .'";</script>';
                } elseif ($params['mode'] == 'category') {
                    $plain_content = $catalog->get_category($params['id']);
                    $ecwid_default_category_str = ',"defaultCategoryId=' . $params['id'] . '"';
                }

            } else {
                $plain_content = $catalog->get_category(intval($ecwid_default_category_id));
            }
        }
    } else {
        $plain_content = '<noscript>Your browser does not support JavaScript.<a href="' . $ecwid_mobile_catalog_link .'">HTML version of this store</a></noscript>';
    }

    $s = <<<EOT
<script type="text/javascript"> xProductBrowser("categoriesPerRow=$ecwid_pb_categoriesperrow","views=grid($ecwid_pb_productspercolumn_grid,$ecwid_pb_productsperrow_grid) list($ecwid_pb_productsperpage_list) table($ecwid_pb_productsperpage_table)","categoryView=$ecwid_pb_defaultview","searchView=$ecwid_pb_searchview","style="$ecwid_default_category_str);</script>
{$plain_content}
EOT;
    return ecwid_wrap_shortcode_content($s);
}



function ecwid_store_activate() {
	$my_post = array();
	$content = <<<EOT
<!-- Ecwid code. Please do not remove this line  otherwise your Ecwid shopping cart will not work properly. --> [ecwid_script] [ecwid_minicart] [ecwid_searchbox] [ecwid_categories] [ecwid_productbrowser] <!-- Ecwid code end -->
EOT;
  	add_option("ecwid_store_page_id", '', '', 'yes');	
  	add_option("ecwid_store_id", ECWID_DEMO_STORE_ID, '', 'yes');
    
    add_option("ecwid_enable_minicart", 'Y', '', 'yes');
    add_option("ecwid_show_categories", 'Y', '', 'yes');
    add_option("ecwid_show_search_box", '', '', 'yes');


    add_option("ecwid_pb_categoriesperrow", '3', '', 'yes');

    add_option("ecwid_pb_productspercolumn_grid", '3', '', 'yes');
    add_option("ecwid_pb_productsperrow_grid", '3', '', 'yes');
    add_option("ecwid_pb_productsperpage_list", '10', '', 'yes');
    add_option("ecwid_pb_productsperpage_table", '20', '', 'yes');

    add_option("ecwid_pb_defaultview", 'grid', '', 'yes');
    add_option("ecwid_pb_searchview", 'list', '', 'yes');

    add_option("ecwid_mobile_catalog_link", '', '', 'yes');  
    add_option("ecwid_default_category_id", '', '', 'yes');  
     
    add_option('ecwid_is_api_enabled', 'on', '', 'yes');
    add_option('ecwid_api_check_time', 0, '', 'yes');
   
    add_option("ecwid_sso_secret_key", '', '', 'yes'); 
    
    $id = get_option("ecwid_store_page_id");	
	$_tmp_page = null;
	if (!empty($id) and ($id > 0)) { 
		$_tmp_page = get_post($id);
	}
	if ($_tmp_page !== null) {
		$my_post = array();
		$my_post['ID'] = $id;
		$my_post['post_status'] = 'publish';
		wp_update_post( $my_post );

	} else {
		$my_post['post_title'] = __('Store', 'ecwid-shopping-cart');
		$my_post['post_content'] = $content;
		$my_post['post_status'] = 'publish';
		$my_post['post_author'] = 1;
		$my_post['post_type'] = 'page';
		$id =  wp_insert_post( $my_post );
		update_option('ecwid_store_page_id', $id);
	}

}
function ecwid_show_admin_message() {

	if (get_ecwid_store_id() != ECWID_DEMO_STORE_ID || $_GET['page'] == 'ecwid') {
		return;
	} else {
		$ecwid_page_id = get_option("ecwid_store_page_id");
		$page_url = get_page_link($ecwid_page_id);
		echo sprintf(
			'<div class="updated fade"><p>'
			. __('<strong>Ecwid shopping cart is almost ready</strong>. Please visit <a target="_blank" href="%s">the created page</a> to see your store with demo products. In order to finish the installation, please go to the <a href="admin.php?page=ecwid"><strong>Ecwid settings</strong></a> and configure the plugin.', 'ecwid-shopping-cart')
			. '</p></div>',
			$page_url
		);
	}
}

function ecwid_store_deactivate() {
	$ecwid_page_id = get_option("ecwid_store_page_id");
	$_tmp_page = null;
	if (!empty($ecwid_page_id) and ($ecwid_page_id > 0)) {
		$_tmp_page = get_page($ecwid_page_id);
		if ($_tmp_page !== null) {
			$my_post = array();
			$my_post['ID'] = $ecwid_page_id;
			$my_post['post_status'] = 'draft';
			wp_update_post( $my_post );
		} else {
			update_option('ecwid_store_page_id', '');	
		}
	}

}

function ecwid_abs_intval($value) {
	if (!is_null($value))
    	return abs(intval($value));
	else
		return null;
}

function ecwid_options_add_page() {


	add_menu_page(
		__('Ecwid shopping cart settings', 'ecwid-shopping-cart'),
		__('Ecwid Store', 'ecwid-shopping-cart'),
		'manage_options',
		'ecwid',
		'ecwid_general_settings_do_page'
	);

	add_submenu_page(
		'ecwid',
		__('General settings', 'ecwid-shopping-cart'),
		__('General', 'ecwid-shopping-cart'),
		'manage_options',
		'ecwid',
		'ecwid_general_settings_do_page'
	);

	add_submenu_page(
		'ecwid',
		__('Appearance settings', 'ecwid-shopping-cart'),
		__('Appearance', 'ecwid-shopping-cart'),
		'manage_options',
		'ecwid-appearance',
		'ecwid_appearance_settings_do_page'
	);

	add_submenu_page(
		'ecwid',
		__('Advanced settings', 'ecwid-shopping-cart'),
		__('Advanced', 'ecwid-shopping-cart'),
		'manage_options',
		'ecwid-advanced',
		'ecwid_advanced_settings_do_page'
	);
	//add_options_page('Ecwid shopping cart settings', 'Ecwid shopping cart', 'manage_options', 'ecwid_options_page', 'ecwid_options_do_page');
}

function ecwid_register_admin_styles() {
	wp_register_style('ecwid-admin-css', plugins_url('ecwid-shopping-cart/css/admin.css'), array(), '', 'all');
	wp_enqueue_style('ecwid-admin-css');
}

function ecwid_register_settings_styles() {
	wp_register_style('ecwid-settings-pure-css', plugins_url('ecwid-shopping-cart/css/pure-min.css'), array(), '', 'all');
	wp_enqueue_style('ecwid-settings-pure-css');
	wp_register_style('ecwid-settings-css', plugins_url('ecwid-shopping-cart/css/settings.css'), array(), '', 'all');
	wp_enqueue_style('ecwid-settings-css');
}


function ecwid_settings_api_init() {
	switch ($_POST['settings_section']) {
		case 'appearance':
			register_setting('ecwid_options_page', 'ecwid_enable_minicart');

			register_setting('ecwid_options_page', 'ecwid_show_categories');
			register_setting('ecwid_options_page', 'ecwid_show_search_box');

			register_setting('ecwid_options_page', 'ecwid_pb_categoriesperrow', 'ecwid_abs_intval');
			register_setting('ecwid_options_page', 'ecwid_pb_productspercolumn_grid', 'ecwid_abs_intval');
			register_setting('ecwid_options_page', 'ecwid_pb_productsperrow_grid', 'ecwid_abs_intval');
			register_setting('ecwid_options_page', 'ecwid_pb_productsperpage_list', 'ecwid_abs_intval');
			register_setting('ecwid_options_page', 'ecwid_pb_productsperpage_table', 'ecwid_abs_intval');
			register_setting('ecwid_options_page', 'ecwid_pb_defaultview');
			register_setting('ecwid_options_page', 'ecwid_pb_searchview');
			break;

		case 'general':
			register_setting('ecwid_options_page', 'ecwid_store_id','ecwid_abs_intval' );
			break;

		case 'advanced':
			register_setting('ecwid_options_page', 'ecwid_default_category_id');
			register_setting('ecwid_options_page', 'ecwid_sso_secret_key');
			break;

	}
	if (isset($_POST['ecwid_store_id'])) {
		update_option('ecwid_is_api_enabled', 'off');
		update_option('ecwid_api_check_time', 0);
	}
}

function ecwid_general_settings_do_page() {

	if (get_ecwid_store_id() == ECWID_DEMO_STORE_ID) {
		require_once plugin_dir_path(__FILE__) . '/templates/general-settings-initial.php';
	} else {
		require_once plugin_dir_path(__FILE__) . '/templates/general-settings.php';
	}
}

function ecwid_advanced_settings_do_page() {
	wp_register_script('ecwid-appearance-js', plugins_url('ecwid-shopping-cart/js/advanced.js'), array(), '', '');
	wp_enqueue_script('ecwid-appearance-js');

	wp_register_script('select2-js', plugins_url('ecwid-shopping-cart/lib/select2/select2.js'), array(), '', '');
	wp_enqueue_script('select2-js');

	wp_register_style('select2-css', plugins_url('ecwid-shopping-cart/lib/select2/select2.css'), array(), '', 'all');
	wp_enqueue_style('select2-css');

	$categories = false;
	if (ecwid_is_paid_account()) {
		$api = ecwid_new_product_api();
		$categories = $api->get_all_categories();
		$by_id = array();
		foreach ($categories as $key => $category) {
			$by_id[$category['id']] = $category;
		}
		unset($categories);

		foreach ($by_id as $id => $category) {
			$name_path = array($category['name']);
			while (isset($category['parentId'])) {
				$category = $by_id[$category['parentId']];
				$name_path[] = $category['name'];
			}

			$by_id[$id]['path'] = array_reverse($name_path);
			$by_id[$id]['path_str'] = implode(" > ", $by_id[$id]['path']);
		}

		function sort_by_path($a, $b) {
			return strcmp($a['path_str'], $b['path_str']);
		}

		uasort($by_id, 'sort_by_path');

		$categories = $by_id;
	}

	require_once plugin_dir_path(__FILE__) . '/templates/advanced-settings.php';
}

function ecwid_appearance_settings_do_page() {

	wp_register_script('ecwid-appearance-js', plugins_url('ecwid-shopping-cart/js/appearance.js'), array(), '', '');
	wp_enqueue_script('ecwid-appearance-js');

	$disabled = false;
	if (!empty($ecwid_page_id) && ($ecwid_page_id > 0)) {
		$_tmp_page = get_post($ecwid_page_id);
		$content = $_tmp_page->post_content;
		if ( (strpos($content, "[ecwid_productbrowser]") === false) && (strpos($content, "xProductBrowser") !== false) )
			$disabled = true;
	}
	// $disabled_str is used in appearance settings template
	if ($disabled)
		$disabled_str = 'disabled = "disabled"';
	else
		$disabled_str = "";

	require_once ECWID_PLUGIN_DIR . 'templates/appearance-settings.php';
}
  
function get_ecwid_store_id() {
    static $store_id = null;
    if (is_null($store_id)) {
        $store_id = get_option('ecwid_store_id');
        if (empty($store_id))
          $store_id = ECWID_DEMO_STORE_ID;
    }
	return $store_id;
}

function ecwid_dashboard_widget_function() {
echo "<a href=\"https://my.ecwid.com/\" target=\"_blank\">Go to the Ecwid Control Panel</a><br /><br /><a href=\"http://kb.ecwid.com/\" target=\"_blank\">Ecwid Knowledge Base</a>&nbsp;|&nbsp;<a href=\"http://www.ecwid.com/forums/\" target=\"_blank\">Ecwid Forums</a>";
} 

function ecwid_add_dashboard_widgets() {
  if (current_user_can('administrator')) {
    wp_add_dashboard_widget('ecwid_dashboard_widget','Ecwid Links', 'ecwid_dashboard_widget_function');	
  }
}


class EcwidMinicartWidget extends WP_Widget {

    function EcwidMinicartWidget() {
		$widget_ops = array('classname' => 'widget_ecwid_minicart', 'description' => __("Your store's minicart", 'ecwid-shopping-cart') );
    	$this->WP_Widget('ecwidminicart', __('Ecwid Shopping Bag (Normal)', 'ecwid-shopping-cart'), $widget_ops);

	}

    function widget($args, $instance) {
	    extract($args);
        $title = apply_filters('widget_title', empty($instance['title']) ? '&nbsp;' : $instance['title']);

        echo $before_widget;

        if ( $title )
            echo $before_title . $title . $after_title;

        echo '<div>';
        echo ecwid_get_scriptjs_code();

        $ecwid_page_id = get_option("ecwid_store_page_id");
        $page_url = get_page_link($ecwid_page_id);
        $_tmp_page = get_page($ecwid_page_id);
        if (!empty($page_url) && $_tmp_page != null)
            echo "<script type=\"text/javascript\">var ecwid_ProductBrowserURL = \"$page_url\";</script>";
        echo <<<EOT
          <script type="text/javascript"> xMinicart("style="); </script>
          </div>
EOT;

        echo $after_widget;
    }

    function update($new_instance, $old_instance){
      $instance = $old_instance;
      $instance['title'] = strip_tags(stripslashes($new_instance['title']));

    return $instance;
  }

    function form($instance){
      $instance = wp_parse_args( (array) $instance, array('title'=>'') );

      $title = htmlspecialchars($instance['title']);

      echo '<p><label for="' . $this->get_field_name('title') . '">' . __('Title:') . ' <input style="width:100%;" id="' . $this->get_field_id('title') . '" name="' . $this->get_field_name('title') . '" type="text" value="' . $title . '" /></label></p>';
  }

}

class EcwidMinicartMiniViewWidget extends WP_Widget {

    function EcwidMinicartMiniViewWidget() {
    $widget_ops = array('classname' => 'widget_ecwid_minicart_miniview', 'description' => __("Your store's minicart", 'ecwid-shopping-cart') );
    $this->WP_Widget('ecwidminicart_miniview', __('Ecwid Shopping Bag (Mini view)', 'ecwid-shopping-cart'), $widget_ops);
    }

    function widget($args, $instance) {
        extract($args);
        $title = apply_filters('widget_title', empty($instance['title']) ? '&nbsp;' : $instance['title']);

        echo $before_widget;

        if ( $title )
            echo $before_title . $title . $after_title;

        echo '<div>';
        echo ecwid_get_scriptjs_code();

        $ecwid_page_id = get_option("ecwid_store_page_id");
        $page_url = get_page_link($ecwid_page_id);
        $_tmp_page = get_page($ecwid_page_id);
        if (!empty($page_url) && $_tmp_page != null)
            echo "<script type=\"text/javascript\">var ecwid_ProductBrowserURL = \"$page_url\";</script>";
        echo <<<EOT
          <script type="text/javascript"> xMinicart("style=left:10px","layout=Mini"); </script>
          </div>
EOT;

        echo $after_widget;
    }

    function update($new_instance, $old_instance){
      $instance = $old_instance;
      $instance['title'] = strip_tags(stripslashes($new_instance['title']));

    return $instance;
  }

    function form($instance){
      $instance = wp_parse_args( (array) $instance, array('title'=>'') );

      $title = htmlspecialchars($instance['title']);

      echo '<p><label for="' . $this->get_field_name('title') . '">' . __('Title:') . ' <input style="width:100%;" id="' . $this->get_field_id('title') . '" name="' . $this->get_field_name('title') . '" type="text" value="' . $title . '" /></label></p>';
  }

}


class EcwidSearchWidget extends WP_Widget {

    function EcwidSearchWidget() {
    $widget_ops = array('classname' => 'widget_ecwid_search', 'description' => __("Your store's search box", 'ecwid-shopping-cart'));
    $this->WP_Widget('ecwidsearch', __('Ecwid Search Box', 'ecwid-shopping-cart'), $widget_ops);
    }

    function widget($args, $instance) {
      extract($args);
      $title = apply_filters('widget_title', empty($instance['title']) ? '&nbsp;' : $instance['title']);

      echo $before_widget;

      if ( $title )
      echo $before_title . $title . $after_title;

      echo '<div>';
      echo ecwid_get_scriptjs_code();

	$ecwid_page_id = get_option("ecwid_store_page_id");
        $page_url = get_page_link($ecwid_page_id);
                $_tmp_page = get_page($ecwid_page_id);
                if (!empty($page_url) && $_tmp_page != null)
		echo "<script type=\"text/javascript\">var ecwid_ProductBrowserURL = \"$page_url\";</script>";
      echo <<<EOT
	<script type="text/javascript"> xSearchPanel("style="); </script>	      
	</div>
EOT;
      
echo $after_widget;
  }

    function update($new_instance, $old_instance){
      $instance = $old_instance;
      $instance['title'] = strip_tags(stripslashes($new_instance['title']));

    return $instance;
  }

    function form($instance){
      $instance = wp_parse_args( (array) $instance, array('title'=>'') );

      $title = htmlspecialchars($instance['title']);

      echo '<p><label for="' . $this->get_field_name('title') . '">' . __('Title:') . ' <input style="width:100%;" id="' . $this->get_field_id('title') . '" name="' . $this->get_field_name('title') . '" type="text" value="' . $title . '" /></label></p>';
  }

}

class EcwidVCategoriesWidget extends WP_Widget {

    function EcwidVCategoriesWidget() {
    $widget_ops = array('classname' => 'widget_ecwid_vcategories', 'description' => __('Vertical menu of categories', 'ecwid-shopping-cart'));
    $this->WP_Widget('ecwidvcategories', __('Ecwid Vertical Categories', 'ecwid-shopping-cart'), $widget_ops);
    }

    function widget($args, $instance) {
      extract($args);
      $title = apply_filters('widget_title', empty($instance['title']) ? '&nbsp;' : $instance['title']);

      echo $before_widget;

      if ( $title )
      echo $before_title . $title . $after_title;

      echo '<div>';
      echo ecwid_get_scriptjs_code();
	$ecwid_page_id = get_option("ecwid_store_page_id");
        $page_url = get_page_link($ecwid_page_id);
                $_tmp_page = get_page($ecwid_page_id);
                if (!empty($page_url) && $_tmp_page != null)
		echo "<script type=\"text/javascript\">var ecwid_ProductBrowserURL = \"$page_url\";</script>";
      echo <<<EOT
	<script type="text/javascript"> xVCategories("style="); </script>
	      </div>
EOT;
      
echo $after_widget;
  }

    function update($new_instance, $old_instance){
      $instance = $old_instance;
      $instance['title'] = strip_tags(stripslashes($new_instance['title']));

    return $instance;
  }

    function form($instance){
      $instance = wp_parse_args( (array) $instance, array('title'=>'') );

      $title = htmlspecialchars($instance['title']);

      echo '<p><label for="' . $this->get_field_name('title') . '">' . __('Title:') . ' <input style="width:100%;" id="' . $this->get_field_id('title') . '" name="' . $this->get_field_name('title') . '" type="text" value="' . $title . '" /></label></p>';
  }

}


function ecwid_sidebar_widgets_init() {
	register_widget('EcwidMinicartWidget');
	register_widget('EcwidSearchWidget');
	register_widget('EcwidVCategoriesWidget');
	register_widget('EcwidMinicartMiniViewWidget');
}

add_action('widgets_init', 'ecwid_sidebar_widgets_init');

function ecwid_encode_json($data) {
    if(version_compare(PHP_VERSION,"5.2.0",">=")) {
      return json_encode($data);
     } else {
 include_once(ABSPATH . 'wp-content/plugins/ecwid-shopping-cart/lib/JSON.php');
        $json_parser = new Services_JSON(SERVICES_JSON_LOOSE_TYPE);
        return $json_parser->encode($data);
}
        }



function ecwid_sso() {
    $key = get_option('ecwid_sso_secret_key');
    if (empty($key)) {
        return "";
    }

    global $current_user;
    get_currentuserinfo();

    if ($current_user->ID) {
        $user_data = array(
            'appId' => "wp_" . get_ecwid_store_id(),
            'userId' => "{$current_user->ID}",
            'profile' => array(
            'email' => $current_user->user_email,
            'billingPerson' => array(
                'name' => $current_user->display_name
            )
            )
        );
   $user_data = base64_encode(ecwid_encode_json($user_data));
    $time = time();
    $hmac = ecwid_hmacsha1("$user_data $time", $key);
    return "<script> var ecwid_sso_profile='$user_data $hmac $time' </script>";   
    }
    else {
        return "<script> var ecwid_sso_profile='' </script>";
    }

 
}

// from: http://www.php.net/manual/en/function.sha1.php#39492

function ecwid_hmacsha1($data, $key) {
  if (function_exists("hash_hmac")) {
    return hash_hmac('sha1', $data, $key);
  } else {
    $blocksize=64;
    $hashfunc='sha1';
    if (strlen($key)>$blocksize)
        $key=pack('H*', $hashfunc($key));
    $key=str_pad($key,$blocksize,chr(0x00));
    $ipad=str_repeat(chr(0x36),$blocksize);
    $opad=str_repeat(chr(0x5c),$blocksize);
    $hmac = pack(
                'H*',$hashfunc(
                    ($key^$opad).pack(
                        'H*',$hashfunc(
                            ($key^$ipad).$data
                        )
                    )
                )
            );
    return bin2hex($hmac);
    }
}

function ecwid_is_paid_account()
{
	return ecwid_is_api_enabled() && get_ecwid_store_id() != ECWID_DEMO_STORE_ID;
}

function ecwid_is_api_enabled()
{
    $ecwid_is_api_enabled = get_option('ecwid_is_api_enabled');
    $ecwid_api_check_time = get_option('ecwid_api_check_time');
    $now = time();

    if ($now > ($ecwid_api_check_time + 60 * 60 * 3)) {
        // check whether API is available once in 3 hours
        $ecwid = ecwid_new_product_api();
        $ecwid_is_api_enabled = ($ecwid->is_api_enabled() ? 'on' : 'off');
        update_option('ecwid_is_api_enabled', $ecwid_is_api_enabled);
        update_option('ecwid_api_check_time', $now);
    }

    if ('on' == $ecwid_is_api_enabled)
        return true;
    else
        return false;
}

function ecwid_new_product_api()
{
    include_once WP_PLUGIN_DIR . '/ecwid-shopping-cart/lib/ecwid_product_api.php';
    $ecwid_store_id = intval(get_ecwid_store_id());
    $api = new EcwidProductApi($ecwid_store_id);

    return $api;
}
?>
