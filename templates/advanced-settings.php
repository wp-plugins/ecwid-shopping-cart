<form class="wrap pure-form pure-form-aligned ecwid-settings advanced-settings" method="POST" action="options.php">

	<h2><?php _e('Ecwid Shopping Cart - Advanced settings', 'ecwid-shopping-cart'); ?></h2>

	<?php settings_fields('ecwid_options_page'); ?>
	<input type="hidden" name="settings_section" value="advanced" />

	<fieldset>

		<div class="pure-control-group">

			<?php if (ecwid_is_paid_account()): ?>
			<label for="ecwid_default_category_id">
				<?php _e('Category shown by default', 'ecwid-shopping-cart'); ?>
			</label>

			<select name="ecwid_default_category_id" id="ecwid_default_category_id">
				<option value=""><?php _e('Store root category', 'ecwid-shopping-cart'); ?></option>
				<?php foreach ($categories as $category): ?>
				<option
					value="<?php echo esc_attr($category['id']); ?>"
					<?php if ($category['id'] == get_option('ecwid_default_category_id')): ?>
					selected="selected"
					<?php endif; ?>
				>
					<?php echo esc_html($category['path_str']); ?>
				</option>
				<?php endforeach; ?>
			</select>
			<?php else: ?>

			<label for="ecwid_default_category_id">
				<?php _e('Default category ID', 'ecwid-shopping-cart'); ?>
			</label>

			<input
				id="ecwid_default_category_id"
				name="ecwid_default_category_id"
				type="text"
				placeholder="<?php _e('Default category ID', 'ecwid-shopping-cart'); ?>"
				value="<?php echo esc_attr(get_option('ecwid_default_category_id')) ?>"
				/>
			<?php endif; ?>
			<div class="note">
				<?php _e('By default, the storefront shows a list of root categories. You can override this behaviour and show a different category when customers open your store for the first time. It is useful if you have one category only or want to display a specific set of items (e.g. "Featured products") to all new visitors.', 'ecwid-shopping-cart'); ?>
			</div>
			<div class="note">
			<?php if (!ecwid_is_paid_account()): ?>
				<?php echo sprintf(
						__('In order to set this option, <a %s>find an ID of the necessary category</a> and save it here.', 'ecwid-shopping-cart'),
						'target="_blank" href="http://kb.ecwid.com/w/page/23947812/How%20to%20get%20ID%20of%20your%20product%20or%20category"'
					);
				?>
			<?php endif; ?>
			</div>
		</div>

		<hr />

		<div class="pure-control-group last">
			<label for="ecwid_sso_secret_key">
				<?php _e('Single Sign-on Secret Key', 'ecwid-shopping-cart'); ?>
			</label>

			<input
				id="ecwid_sso_secret_key"
				type="text"
				name="ecwid_sso_secret_key"
				placeholder="<?php _e('Single Sign-on Secret Key', 'ecwid-shopping-cart'); ?>"
				value="<?php echo esc_attr(get_option('ecwid_sso_secret_key')); ?>"
				/>

			<div class="note">
				<?php _e("This optional feature allows enabling Single Sign-On : when customers are logged in to your site, they are automatically logged in to your Ecwid store as well, even if they didn't have an account in the store before. It makes sense to enable this feature, if your visitors actually create accounts in your WordPress website.", 'ecwid-shopping-cart'); ?>
			</div>
			<div class="note grayed-links">
				<?php _e('In order to enable this feature you should submit a secret key. You will find this key in your Ecwid control panel,  at "System Settings > API > Single Sign-on API" page . This feature is available for <a href="http://www.ecwid.com/compare-plans.html" target="_blank">paid users</a> only.', 'ecwid-shopping-cart'); ?>
			</div>
		</div>

	</fieldset>

	<fieldset>
		<hr />

		<div class="pure-control-group">
			<button type="submit" class="pure-button pure-button-primary">
				<?php _e('Save changes', 'ecwid-shopping-cart'); ?>
			</button>
		</div>
	</fieldset>
</form>