if (typeof(Ecwid) == 'object') {
	Ecwid.OnAPILoaded.add(function() {

		var html_id = document.getElementsByTagName("html")[0].id;
		var body_id = document.getElementsByTagName("body")[0].id;;
		var css_prefix = 'html#'+html_id+' body#'+body_id+'.chameleon';

		var css = '';
        var parent = document.querySelector('.ecwid').parentNode;
		var computedStyle = getComputedStyle(parent, null);

		var primary_color = tinycolor( (typeof ecwidChameleon !== 'undefined' && typeof ecwidChameleon.primary_color !== 'undefined') ? ecwidChameleon.primary_color : computedStyle.color );
		var primary_background = tinycolor( (typeof ecwidChameleon !== 'undefined' && typeof ecwidChameleon.primary_background !== 'undefined') ? ecwidChameleon.primary_background : getBackground(parent) );

		if (typeof ecwidChameleon !== 'undefined' && typeof ecwidChameleon.primary_background !== 'undefined') {
			var primary_link = tinycolor( ecwidChameleon.primary_link );
		}
		else {
			var a = document.createElement('a');
			a.href = a.textContent = url = '';
			parent.appendChild(a);
			var primary_link = tinycolor( document.defaultView.getComputedStyle(a, null).color );
			parent.removeChild(a);	
		}

		if (tinycolor.equals(primary_background, 'transparent')) {
			primary_background = tinycolor('#fff');
		}

		var accent_color = tinycolor(primary_link.toString()).darken(15).brighten();
		var muted_accent_color = tinycolor(primary_link.toString()).darken(15).setAlpha(.6);

		var hover_link = tinycolor(primary_link.toString()).lighten(20);
		var muted_color = (primary_color.isLight()) ? tinycolor(primary_color.toString()).darken(15) : tinycolor(primary_color.toString()).lighten(20);
		var muted_link = tinycolor(primary_color.toString()).lighten(20);
		var secondary_link = tinycolor(primary_link.toString()).darken(20);

		var border_color = tinycolor(primary_color.toString()).setAlpha(.1);

		var muted_background = tinycolor(primary_background.toString());
		var muted_background = (muted_background.isLight()) ? muted_background.darken(5) : muted_background.lighten(15);
		var muted_soft_background = tinycolor(primary_background.toString());
		var muted_soft_background = (muted_soft_background.isLight()) ? muted_soft_background.darken(10) : muted_soft_background.lighten(20);
		var hover_background = tinycolor(primary_link.toString()).lighten(20).setAlpha(.2);

		var button_border_color = tinycolor(hover_link.toString()).darken(5);
		var button_hover_top = tinycolor(hover_link.toString()).lighten(5);
		var button_hover_bottom = tinycolor(primary_link.toString()).lighten(5);
		var button_shadow = tinycolor(button_border_color.toString()).lighten(15).setAlpha(.3);
		var button_hover_shadow = tinycolor(button_border_color.toString()).lighten(15).setAlpha(.4);
		var button_border_hover_color = tinycolor(hover_link.toString());

// Additional rules
if (!tinycolor.isReadable(accent_color, muted_soft_background)) {
	accent_color = tinycolor(secondary_link.toString()).brighten(20);
	muted_accent_color = tinycolor(secondary_link.toString()).lighten(20);
}
if (!tinycolor.isReadable(secondary_link, '#F0F0F0')) {
	secondary_link =  (secondary_link.isLight()) ? tinycolor(secondary_link.toString()).darken() : tinycolor(secondary_link.toString()).lighten();
}
var button_color = tinycolor('#fff');
if (!tinycolor.isReadable(button_color, primary_link)) {
	button_color = tinycolor(primary_background.toString());
}

// Font family
css+= css_prefix + ' .ecwid, ' + css_prefix + ' .ecwid * { font-family: inherit !important; }\n';

// Primary colors
css+= css_prefix + ' div.ecwid-productBrowser-head{ color: '+ primary_color.toString() +'; }\n';
css+= css_prefix + ' div.ecwid-productBrowser-productNameLink a, ' + css_prefix + ' div.ecwid-productBrowser-productNameLink a:active, ' + css_prefix + ' div.ecwid-productBrowser-productNameLink a:visited{ color: '+ muted_color.toString() +'; }\n';
css+= css_prefix + ' div.ecwid-productBrowser-productsGrid-productMiddleFragment-mouseover div.ecwid-productBrowser-productNameLink a, ' + css_prefix + ' div.ecwid-productBrowser-productsGrid-productMiddleFragment-mouseover div.ecwid-productBrowser-productNameLink a:active, ' + css_prefix + ' div.ecwid-productBrowser-productsGrid-productMiddleFragment-mouseover div.ecwid-productBrowser-productNameLink a:visited{ font-size: 17px; color: '+ primary_color.toString() +'; }\n';
css+= css_prefix + ' div.ecwid-productBrowser-cart div.ecwid-productBrowser-productNameLink a, ' + css_prefix + ' div.ecwid-productBrowser-cart div.ecwid-productBrowser-productNameLink a:active, ' + css_prefix + ' div.ecwid-productBrowser-cart div.ecwid-productBrowser-productNameLink a:visited{ color: '+ primary_color.toString() +'; }\n';
css+= css_prefix + ' div.ecwid-productBrowser-cart div.ecwid-productBrowser-price{ color: '+ primary_color.toString() +'; }\n';
css+= css_prefix + ' div.ecwid-productBrowser-cart-subtotalAmount, ' + css_prefix + ' div.ecwid-productBrowser-cart-subtotalAmountMinus, ' + css_prefix + ' div.ecwid-productBrowser-cart-shippingAmount, ' + css_prefix + ' div.ecwid-productBrowser-cart-taxAmount{ color: '+ primary_color.toString() +'; }\n';
css+= css_prefix + ' div.ecwid-productBrowser-cart-totalLabel{ color: '+ primary_color.toString() +'; }\n';
css+= css_prefix + ' table.ecwid-productBrowser-productsTable-v2 div.ecwid-productBrowser-productNameLink:hover a, ' + css_prefix + ' table.ecwid-productBrowser-productsList-v2 div.ecwid-productBrowser-productNameLink:hover a, ' + css_prefix + ' table.ecwid-productBrowser-productsGrid-v2 div.ecwid-productBrowser-productNameLink:hover a { color: '+ primary_color.toString() +'; }\n';
css+= css_prefix + ' table.ecwid-Invoice-itemsTable .ecwid-productBrowser-price, ' + css_prefix + ' table.ecwid-Invoice-itemsTable .ecwid-Invoice-qtyLabel{ color: '+ primary_color.toString() +'; }\n';

// Muted colors
css+= css_prefix + ' .ecwid{ color: '+ muted_color.toString() +'; }\n';
css+= css_prefix + ' div.ecwid-productBrowser-categoryPath{ color: '+ muted_color.toString() +'; }\n';
css+= css_prefix + ' div.ecwid-productBrowser-subcategories-categoryName{ color: '+ muted_color.toString() +'; }\n';
css+= css_prefix + ' div.ecwid-results-topPanel div.ecwid-results-topPanel-itemsCountLabel{ color: '+ muted_color.toString() +'; }\n';
css+= css_prefix + ' div.ecwid-productBrowser-sku{ color: '+ muted_color.toString() +'; }\n';
css+= css_prefix + ' div.ecwid-results-topPanel div{ color: '+ muted_color.toString() +'; }\n';
css+= css_prefix + ' div.ecwid-productBrowser-details-optionPanel label.ecwid-fieldLabel{ color: '+ muted_color.toString() +'; }\n';
css+= css_prefix + ' div.ecwid-productBrowser-details-qtyLabel{ color: '+ muted_color.toString() +'; }\n';
css+= css_prefix + ' div.ecwid-productBrowser-cart div.ecwid-productBrowser-sku{ color: '+ muted_color.toString() +'; }\n';
css+= css_prefix + ' span.ecwid-productBrowser-cart-weight{ color: '+ muted_color.toString() +'; }\n';
css+= css_prefix + ' div.ecwid-productBrowser-cart-optionsList{ color: '+ muted_color.toString() +'; }\n';
css+= css_prefix + ' div.ecwid-productBrowser-cart-subtotalLabel,' + css_prefix + ' div.ecwid-productBrowser-cart-shippingLabel,' + css_prefix + ' div.ecwid-productBrowser-cart-taxLabel{ color: '+ muted_color.toString() +'; }\n';
css+= css_prefix + ' div.ecwid-productBrowser-cart-estimationNote{ color: '+ muted_color.toString() +'; }\n';
css+= css_prefix + ' label.ecwid-fieldLabel{ color: '+ muted_color.toString() +'; }\n';
css+= css_prefix + ' div.ecwid-FormPopup-fieldWrapper label.ecwid-fieldLabel{ color: '+ muted_color.toString() +'; }\n';
css+= css_prefix + ' div.ecwid-Checkout-PasswordBlock-tip{ color: '+ muted_color.toString() +'; }\n';
css+= css_prefix + ' div.ecwid-pager{ color: '+ muted_color.toString() +'; }\n';
css+= css_prefix + ' div.ecwid-pager span.ecwid-pager-link-disabled{ color: '+ muted_color.toString() +'; }\n';
css+= css_prefix + ' div.ecwid-productBrowser-details-inTheBag div{ color: '+ muted_color.toString() +'; }\n';
css+= css_prefix + ' div.ecwid-productBrowser-productsList-descr{ color: '+ muted_color.toString() +'; }\n';
css+= css_prefix + ' div.ecwid-productBrowser-productsTable div.ecwid-productBrowser-sku{ color: '+ muted_color.toString() +'; }\n';
css+= css_prefix + ' div.ecwid-productBrowser-extraFields-side{ color: '+ muted_color.toString() +'; }\n';
css+= css_prefix + ' div.ecwid-Invoice-block{ color: '+ muted_color.toString() +'; }\n';
css+= css_prefix + ' table.ecwid-Invoice-itemsTable .ecwid-productBrowser-sku{ color: '+ muted_color.toString() +'; }\n';
css+= css_prefix + ' table.ecwid-Invoice-itemsTable .ecwid-Invoice-optionsList{ color: '+ muted_color.toString() +'; }\n';
css+= css_prefix + ' table.ecwid-Invoice-itemsTable .ecwid-productBrowser-price,' + css_prefix + ' table.ecwid-Invoice-itemsTable .ecwid-Invoice-qtyLabel{ color: '+ muted_color.toString() +'; }\n';
css+= css_prefix + ' div.ecwid-Invoice-Summary-label,' + css_prefix + ' div.ecwid-Invoice-Summary-value{ color: '+ muted_color.toString() +'; }\n';
css+= css_prefix + ' div.ecwid-Invoice-header-placeOrder div.gwt-Label,' + css_prefix + ' div.ecwid-Invoice-footer-placeOrder div.gwt-Label,' + css_prefix + ' td.ecwid-Invoice-header-orderConfirmation-text,' + css_prefix + ' td.ecwid-Invoice-footer-orderConfirmation-text{ color: '+ muted_color.toString() +'; }\n';
css+= css_prefix + ' div.ecwid-productBrowser-details-outOfStockLabel{ color: '+ muted_color.toString() +'; }\n';

// Borders
css+= css_prefix + ' div.ecwid-productBrowser-productsGrid-productTopFragment-mouseover,' + css_prefix + ' div.ecwid-productBrowser-productsGrid-productBottomFragment-mouseover{ border-color: '+ border_color.toString() +'; }\n';
css+= css_prefix + ' .ecwid-productBrowser-productsGrid-v2 td.ecwid-productBrowser-productsGrid-productInside.ecwid-productBrowser-productsGrid-hover{ border-color: '+ border_color.toString() +'; }\n';
css+= css_prefix + ' td.ecwid-productBrowser-productsList-mouseover{ border-color: '+ border_color.toString() +'; }\n';
css+= css_prefix + ' .ecwid-productBrowser-relatedProducts .ecwid-productBrowser-relatedProducts-item-top-hover{ border-color: '+ border_color.toString() +'; }\n';
css+= css_prefix + ' .ecwid-productBrowser-relatedProducts .ecwid-productBrowser-relatedProducts-item-bottom-hover{ border-color: '+ border_color.toString() +'; }\n';
css+= css_prefix + ' table.ecwid-categoriesTabBar div.gwt-TabBarFirst,' + css_prefix + ' table.ecwid-categoriesTabBar div.gwt-TabBarRest,' + css_prefix + ' table.ecwid-categoriesTabBar table.gwt-TabBarItem,' + css_prefix + ' div.ecwid-categories-horizontal-menuBarContainer,' + css_prefix + ' td.ecwid-categories-vertical-table-cell,' + css_prefix + ' div.ecwid-categories-MenuBarPopup div.menuSeparatorInner{ border-color: '+ border_color.toString() +'; }\n';

// Accents
css+= css_prefix + ' div.ecwid-productBrowser-price{ color: '+ accent_color.toString() +'; }\n';
css+= css_prefix + ' div.ecwid-productBrowser-details-inStockLabel{ color: '+ muted_accent_color.toString() +'; }\n';
css+= css_prefix + ' div.ecwid-Checkout-blockTitle,' + css_prefix + ' table.ecwid-Checkout-blockTitle div.gwt-Label,' + css_prefix + ' table.ecwid-Checkout-blockTitle div.gwt-HTML{ color: '+ muted_accent_color.toString() +'; }\n';
css+= css_prefix + ' div.ecwid-Checkout-BreadCrumbs-link-visited{ color: '+ muted_accent_color.toString() +'; }\n';
css+= css_prefix + ' div.ecwid-Checkout-BreadCrumbs-link-current{ color: '+ muted_accent_color.toString() +'; border-color: '+ muted_accent_color.toString() +'; }\n';
css+= css_prefix + ' div.ecwid-fieldEnvelope-label{ color: '+ accent_color.toString() +'; }\n';
css+= css_prefix + ' input.gwt-PasswordTextBox,' + css_prefix + ' textarea.gwt-TextArea,' + css_prefix + ' input.gwt-DateBox{ color: '+ accent_color.toString() +'; }\n';
css+= css_prefix + ' .ecwid div.ecwid-AccentedContinueButton-label{ color: '+ accent_color.toString() +'; }\n';
css+= css_prefix + ' div.ecwid-productBrowser-cart-termsCheckbox-rollover{ background-color: '+ hover_background.toString() +'; }\n';
css+= css_prefix + ' div.ecwid-productBrowser-cart-estimationNote span{ color: '+ muted_accent_color.toString() +'; }\n';
css+= css_prefix + ' div.ecwid-productBrowser-cart-asterisk{ color: '+ muted_accent_color.toString() +'; }\n';
css+= css_prefix + ' div.ecwid-productBrowser-cart-totalAmount{ color: '+ accent_color.toString() +'; }\n';

// Primary links
css+= css_prefix + ' div.ecwid-productBrowser-categoryPath a,' + css_prefix + ' div.ecwid-productBrowser-categoryPath a:active,' + css_prefix + ' div.ecwid-productBrowser-categoryPath a:visited{ color: '+ primary_link.toString() +'; }\n';
css+= css_prefix + ' .ecwid a,' + css_prefix + ' .ecwid a:active, ' + css_prefix + ' .ecwid a:visited{ color: '+ primary_link.toString() +'; }\n';
css+= css_prefix + ' div.ecwid-results-topPanel div.ecwid-results-topPanel-viewAsPanel-link{ color: '+ primary_link.toString() +'; }\n';
css+= css_prefix + ' div.ecwid-pager span.ecwid-pager-link-enabled{ color: '+ primary_link.toString() +'; }\n';
css+= css_prefix + ' div.ecwid-productBrowser-productsTable-addToBagLink{ color: '+ primary_link.toString() +'; }\n';

// Hover links
css+= css_prefix + ' div.ecwid-productBrowser-categoryPath a:hover{ color: '+ hover_link.toString() +'; }\n';
css+= css_prefix + ' .ecwid a:hover{ color: '+ hover_link.toString() +'; }\n';
css+= css_prefix + ' div.ecwid-results-topPanel div.ecwid-results-topPanel-viewAsPanel-link:hover{ color: '+ hover_link.toString() +'; }\n';

// Backgrounds
css+= css_prefix + ' .ecwid .ecwid-ProductDetails-gray-panel-bottom,' + css_prefix + ' .ecwid .ecwid-productBrowser-ask-advice-panel{ background-color: '+ muted_background.toString() +'; }\n';
css+= css_prefix + ' .ecwid-productBrowser-details-rightPanel div.ecwid-productBrowser-sharePanel-header{ background-color: '+ muted_background.toString() +'; }\n';
css+= css_prefix + ' a.ecwid-productBrowser-nav-left,' + css_prefix + ' a.ecwid-productBrowser-nav-right{ background-color: '+ muted_background.toString() +'; }\n';
css+= css_prefix + ' .ecwid .ecwid-productBrowser-ask-advice-panel{ background-color: '+ muted_background.toString() +'; }\n';
css+= css_prefix + ' .ecwid .ecwid-productBrowser-ask-advice-panel .ecwid-productBrowser-ask-advice-panel-icon{ background-color: '+ muted_background.toString() +'; }\n';
css+= css_prefix + ' div.ecwid-productBrowser-backgroundedPanel{ background-color: '+ muted_soft_background.toString() +'; }\n';
css+= css_prefix + ' .ecwid-productBrowser-details-rightPanel .ecwid-productBrowser-sharePanel-buttonsContainer{ background-color: '+ muted_soft_background.toString() +'; border-color: '+ tinycolor(muted_color.toString()).setAlpha(.2).toString() +'}\n';
css+= css_prefix + ' tr.ecwid-productBrowser-cart-itemsTable-row-selected,' + css_prefix + ' td.ecwid-productBrowser-cart-itemsTable-cell-selected{ background-color: '+ muted_background.toString() +'; }\n';
css+= css_prefix + ' div.ecwid-productBrowser-cart-EnterCouponBox{ background-color: '+ muted_background.toString() +'; border-color: transparent; }\n';
css+= css_prefix + ' div.ecwid-form{ background-color: '+ muted_background.toString() +'; }\n';
css+= css_prefix + ' .ecwid input.ecwid-productBrowser-details-qtyTextField{ color: '+ primary_color.toString() +'; }\n';
css+= css_prefix + ' td.ecwid-productBrowser-productsTable-cell{ background-color: '+ primary_background.toString() +'; }\n';
css+= css_prefix + ' td.ecwid-productBrowser-productsTable-cellOdd{ background-color: '+ muted_background.toString() +'; }\n';

css+= css_prefix + ' div.ecwid-Invoice-cell-title{ color: '+ muted_color +';background-color: '+ muted_background.toString() +'; }\n';
css+= css_prefix + ' div.ecwid-Invoice-blockTitle{ color: '+ muted_color +';background-color: '+ muted_background.toString() +'; }\n';
css+= css_prefix + ' td.ecwid-Invoice-cell{ background-color: '+ muted_background.toString() +'; }\n';
css+= css_prefix + ' td.ecwid-Invoice-edgeCell{ background-color: '+ muted_background.toString() +'; }\n';

// Buttons
css+= css_prefix + ' div.ecwid-AddToBagButton::after { content: "' + msg('TableProductsContainer.add_to_bag', 'Add To Bag') + '"; white-space: nowrap; }\n';
css+= css_prefix + ' div.ecwid-ContinueShoppingButton::after { content: "' + msg('ShoppingCartView.continue', 'Continue Shopping') + '"; white-space: nowrap; }\n';
css+= css_prefix + ' div.ecwid-productBrowser-cart-checkoutButton:after { content: "' + msg('FBAutofillCheckout.Breadcrumbs.checkout', 'Checkout') + '"; white-space: nowrap; }\n';
css+= css_prefix + ' div.ecwid-Checkout-placeOrderButton::after { content: "' + msg('FBAutofillCheckout.Breadcrumbs.checkout', 'Place Order') + '"; white-space: nowrap; }\n';

css+= css_prefix + ' div.ecwid-ContinueShoppingButton::after,' + css_prefix + ' div.ecwid-Checkout-placeOrderButton::after, ' + css_prefix + ' div.ecwid-AddToBagButton::after, ' + css_prefix + ' div.ecwid-productBrowser-cart-checkoutButton::after, ' + css_prefix + ' button.ecwid-AccentedButton span, ' + css_prefix + ' div.ecwid-Checkout-placeOrderButton::after{ color: '+ button_color +'; }\n';

css+= css_prefix + ' button.ecwid-AccentedButton,' + css_prefix + ' div.ecwid-AddToBagButton-up, ' + css_prefix + ' div.ecwid-productBrowser-cart-checkoutButton-up,' + css_prefix + ' div.ecwid-Checkout-placeOrderButton-up,' + css_prefix + ' div.ecwid-ContinueShoppingButton-up,' + css_prefix + ' div.ecwid-AddToBagButton-up-hovering,' + css_prefix + ' div.ecwid-AddToBagButton-down-hovering,' + css_prefix + ' div.ecwid-productBrowser-cart-checkoutButton-up-hovering,' + css_prefix + ' div.ecwid-productBrowser-cart-checkoutButton-down-hovering,' + css_prefix + ' div.ecwid-Checkout-placeOrderButton-down-hovering,' + css_prefix + ' div.ecwid-Checkout-placeOrderButton-up-hovering,' + css_prefix + ' div.ecwid-ContinueShoppingButton-up-hovering,' + css_prefix + ' div.ecwid-ContinueShoppingButton-down-hovering,' + css_prefix + ' button.ecwid-AccentedButton:hover { -webkit-box-sizing: border-box; box-sizing: border-box; width: auto; min-width: 160px; height: auto; padding: 11px 40px; background-color: '+primary_link+'; background-image: -webkit-gradient(linear, left top, left bottom, from('+hover_link+'), to('+primary_link+')); background-image: -webkit-linear-gradient(top, '+hover_link+', '+primary_link+'); background-image: -moz-linear-gradient(top, '+hover_link+', '+primary_link+'); background-image: -ms-linear-gradient(top, '+hover_link+', '+primary_link+'); background-image:  -o-linear-gradient(top, '+hover_link+', '+primary_link+'); background-image:   linear-gradient(to bottom, '+hover_link+', '+primary_link+'); border: 1px solid '+button_border_color+'; -webkit-box-shadow: inset 0 1px 0 '+button_shadow+'; box-shadow: inset 0 1px 0 '+button_shadow+'; text-decoration: none; text-shadow: 0 1px 0 rgba(0,0,0,0.1); border-radius: 3px; padding-left: 20px; padding-right: 20px; }\n';

css+= css_prefix + ' div.ecwid-AddToBagButton-up-hovering,' + css_prefix + ' div.ecwid-productBrowser-cart-checkoutButton-up-hovering,' + css_prefix + ' div.ecwid-Checkout-placeOrderButton-up-hovering,' + css_prefix + ' div.ecwid-ContinueShoppingButton-up-hovering { background-image: -webkit-gradient(linear, left top, left bottom, from('+button_hover_top+'), to('+button_hover_bottom+')); background-image: -webkit-linear-gradient(top, '+button_hover_top+', '+button_hover_bottom+'); background-image: -moz-linear-gradient(top, '+button_hover_top+', '+button_hover_bottom+'); background-image: -ms-linear-gradient(top, '+button_hover_top+', '+button_hover_bottom+'); background-image: -o-linear-gradient(top, '+button_hover_top+', '+button_hover_bottom+'); background-image: linear-gradient(to bottom, '+button_hover_top+', '+button_hover_bottom+'); border: 1px solid '+button_border_hover_color+'; -webkit-box-shadow: inset 0 1px 0 '+button_hover_shadow+'; box-shadow: inset 0 1px 0 '+button_hover_shadow+'; text-decoration: none; text-shadow: 0 -1px 0 rgba(0,0,0,0.2); } \n';


css+= css_prefix + ' button.gwt-Button,' + css_prefix + ' #wrapper button.gwt-Button{ color: '+ secondary_link +'; }\n';
css+= css_prefix + ' button.ecwid-AccentedButton{ line-height: 1; }\n';

// Search
css+= css_prefix + ' .ecwid-SearchPanel-button {  background-color: '+ muted_background.toString() +'; border: 1px solid '+ border_color +'; border-radius: 2px; color: '+ primary_color +'; cursor: pointer; font-size: 12px; height: 26px; outline: medium none; padding: 2px 5px; text-decoration: none; vertical-align: baseline; white-space: nowrap; }\n';

// Categories
css+= css_prefix + ' span.ecwid-categories-category{ color: '+ muted_color.toString() +'; }\n';
css+= css_prefix + ' div.ecwid-categoriesMenuBar td.gwt-MenuItem-selected span.ecwid-categories-category,' + css_prefix + ' div.ecwid-categoriesMenuBar td.gwt-MenuItem-current span.ecwid-categories-category,' + css_prefix + ' td.ecwid-categories-vertical-table-cell-selected span.ecwid-categories-category,' + css_prefix + ' table.ecwid-categoriesTabBar table.gwt-TabBarItem-selected span.ecwid-categories-category{ color: '+ primary_link.toString() +'; }\n';

css+= css_prefix + ' table.ecwid-categoriesTabBar table.gwt-TabBarItem-selected td { background: none !important; }\n';
css+= css_prefix + ' table.ecwid-categoriesTabBar table.gwt-TabBarItem-selected { border: 1px solid; border-bottom: 0px; border-color: '+ border_color.toString() +'; }\n';
css+= css_prefix + ' .ecwid .ecwid-productBrowser-ask-advice-panel  { min-height: 18px; height: auto; }\n';

head = document.getElementsByTagName('head')[0],
style = document.createElement('style');
style.type = 'text/css';
if (style.styleSheet) {
	style.styleSheet.cssText = css;
} else {
	style.appendChild(document.createTextNode(css));
}
head.appendChild(style);
document.getElementsByTagName("body")[0].className += ' chameleon';
});
}

function getLinkColor(url) {
	var a = document.createElement('a');
	a.href = a.textContent = url;
	document.body.appendChild(a);
	return document.defaultView.getComputedStyle(a, null).color;
}

function toCamelCase(s){
	for(var exp=/-([a-z])/; exp.test(s); s=s.replace(exp,RegExp.$1.toUpperCase()));
		return s;
}

function getStyle(e,a){
	var v=null;
	if(document.defaultView && document.defaultView.getComputedStyle){
		var cs = document.defaultView.getComputedStyle(e, null);
		if(cs && cs.getPropertyValue)
			v = cs.getPropertyValue(a);
	}
	if(!v && e.currentStyle)
		v = e.currentStyle[toCamelCase(a)];
	return v;
}

function getBackground(e){
	var v = getStyle(e,'background-color');
	while (!v || v=='transparent' || v=='#000000' || v=='rgba(0, 0, 0, 0)'){
		if( e == document.body )
			v = '#fff';
		else {
			e = e.parentNode;
			v = getStyle(e, 'background-color');
		}
	}
	return v;
}

function msg(label, defaultValue) {
	var messageBundles = (window.Ecwid && window.Ecwid.MessageBundles) ? window.Ecwid.MessageBundles : {};
	var bundle = messageBundles['ru.cdev.xnext.client'] ? messageBundles['ru.cdev.xnext.client'] : {};
	return bundle[label] || defaultValue;
}

// TinyColor v1.1.2
// https://github.com/bgrins/TinyColor
// Brian Grinstead, MIT License
!function(){function t(r,n){if(r=r?r:"",n=n||{},r instanceof t)return r;if(!(this instanceof t))return new t(r,n);var a=e(r);this._originalInput=r,this._r=a.r,this._g=a.g,this._b=a.b,this._a=a.a,this._roundA=j(100*this._a)/100,this._format=n.format||a.format,this._gradientType=n.gradientType,this._r<1&&(this._r=j(this._r)),this._g<1&&(this._g=j(this._g)),this._b<1&&(this._b=j(this._b)),this._ok=a.ok,this._tc_id=I++}function e(t){var e={r:0,g:0,b:0},n=1,i=!1,o=!1;return"string"==typeof t&&(t=q(t)),"object"==typeof t&&(t.hasOwnProperty("r")&&t.hasOwnProperty("g")&&t.hasOwnProperty("b")?(e=r(t.r,t.g,t.b),i=!0,o="%"===String(t.r).substr(-1)?"prgb":"rgb"):t.hasOwnProperty("h")&&t.hasOwnProperty("s")&&t.hasOwnProperty("v")?(t.s=O(t.s),t.v=O(t.v),e=s(t.h,t.s,t.v),i=!0,o="hsv"):t.hasOwnProperty("h")&&t.hasOwnProperty("s")&&t.hasOwnProperty("l")&&(t.s=O(t.s),t.l=O(t.l),e=a(t.h,t.s,t.l),i=!0,o="hsl"),t.hasOwnProperty("a")&&(n=t.a)),n=k(n),{ok:i,format:t.format||o,r:T(255,$(e.r,0)),g:T(255,$(e.g,0)),b:T(255,$(e.b,0)),a:n}}function r(t,e,r){return{r:255*A(t,255),g:255*A(e,255),b:255*A(r,255)}}function n(t,e,r){t=A(t,255),e=A(e,255),r=A(r,255);var n,a,i=$(t,e,r),s=T(t,e,r),o=(i+s)/2;if(i==s)n=a=0;else{var f=i-s;switch(a=o>.5?f/(2-i-s):f/(i+s),i){case t:n=(e-r)/f+(r>e?6:0);break;case e:n=(r-t)/f+2;break;case r:n=(t-e)/f+4}n/=6}return{h:n,s:a,l:o}}function a(t,e,r){function n(t,e,r){return 0>r&&(r+=1),r>1&&(r-=1),1/6>r?t+6*(e-t)*r:.5>r?e:2/3>r?t+(e-t)*(2/3-r)*6:t}var a,i,s;if(t=A(t,360),e=A(e,100),r=A(r,100),0===e)a=i=s=r;else{var o=.5>r?r*(1+e):r+e-r*e,f=2*r-o;a=n(f,o,t+1/3),i=n(f,o,t),s=n(f,o,t-1/3)}return{r:255*a,g:255*i,b:255*s}}function i(t,e,r){t=A(t,255),e=A(e,255),r=A(r,255);var n,a,i=$(t,e,r),s=T(t,e,r),o=i,f=i-s;if(a=0===i?0:f/i,i==s)n=0;else{switch(i){case t:n=(e-r)/f+(r>e?6:0);break;case e:n=(r-t)/f+2;break;case r:n=(t-e)/f+4}n/=6}return{h:n,s:a,v:o}}function s(t,e,r){t=6*A(t,360),e=A(e,100),r=A(r,100);var n=N.floor(t),a=t-n,i=r*(1-e),s=r*(1-a*e),o=r*(1-(1-a)*e),f=n%6,h=[r,s,i,i,o,r][f],u=[o,r,r,s,i,i][f],l=[i,i,o,r,r,s][f];return{r:255*h,g:255*u,b:255*l}}function o(t,e,r,n){var a=[M(j(t).toString(16)),M(j(e).toString(16)),M(j(r).toString(16))];return n&&a[0].charAt(0)==a[0].charAt(1)&&a[1].charAt(0)==a[1].charAt(1)&&a[2].charAt(0)==a[2].charAt(1)?a[0].charAt(0)+a[1].charAt(0)+a[2].charAt(0):a.join("")}function f(t,e,r,n){var a=[M(P(n)),M(j(t).toString(16)),M(j(e).toString(16)),M(j(r).toString(16))];return a.join("")}function h(e,r){r=0===r?0:r||10;var n=t(e).toHsl();return n.s-=r/100,n.s=H(n.s),t(n)}function u(e,r){r=0===r?0:r||10;var n=t(e).toHsl();return n.s+=r/100,n.s=H(n.s),t(n)}function l(e){return t(e).desaturate(100)}function c(e,r){r=0===r?0:r||10;var n=t(e).toHsl();return n.l+=r/100,n.l=H(n.l),t(n)}function g(e,r){r=0===r?0:r||10;var n=t(e).toRgb();return n.r=$(0,T(255,n.r-j(255*-(r/100)))),n.g=$(0,T(255,n.g-j(255*-(r/100)))),n.b=$(0,T(255,n.b-j(255*-(r/100)))),t(n)}function d(e,r){r=0===r?0:r||10;var n=t(e).toHsl();return n.l-=r/100,n.l=H(n.l),t(n)}function b(e,r){var n=t(e).toHsl(),a=(j(n.h)+r)%360;return n.h=0>a?360+a:a,t(n)}function p(e){var r=t(e).toHsl();return r.h=(r.h+180)%360,t(r)}function m(e){var r=t(e).toHsl(),n=r.h;return[t(e),t({h:(n+120)%360,s:r.s,l:r.l}),t({h:(n+240)%360,s:r.s,l:r.l})]}function _(e){var r=t(e).toHsl(),n=r.h;return[t(e),t({h:(n+90)%360,s:r.s,l:r.l}),t({h:(n+180)%360,s:r.s,l:r.l}),t({h:(n+270)%360,s:r.s,l:r.l})]}function v(e){var r=t(e).toHsl(),n=r.h;return[t(e),t({h:(n+72)%360,s:r.s,l:r.l}),t({h:(n+216)%360,s:r.s,l:r.l})]}function y(e,r,n){r=r||6,n=n||30;var a=t(e).toHsl(),i=360/n,s=[t(e)];for(a.h=(a.h-(i*r>>1)+720)%360;--r;)a.h=(a.h+i)%360,s.push(t(a));return s}function w(e,r){r=r||6;for(var n=t(e).toHsv(),a=n.h,i=n.s,s=n.v,o=[],f=1/r;r--;)o.push(t({h:a,s:i,v:s})),s=(s+f)%1;return o}function x(t){var e={};for(var r in t)t.hasOwnProperty(r)&&(e[t[r]]=r);return e}function k(t){return t=parseFloat(t),(isNaN(t)||0>t||t>1)&&(t=1),t}function A(t,e){R(t)&&(t="100%");var r=F(t);return t=T(e,$(0,parseFloat(t))),r&&(t=parseInt(t*e,10)/100),N.abs(t-e)<1e-6?1:t%e/parseFloat(e)}function H(t){return T(1,$(0,t))}function S(t){return parseInt(t,16)}function R(t){return"string"==typeof t&&-1!=t.indexOf(".")&&1===parseFloat(t)}function F(t){return"string"==typeof t&&-1!=t.indexOf("%")}function M(t){return 1==t.length?"0"+t:""+t}function O(t){return 1>=t&&(t=100*t+"%"),t}function P(t){return Math.round(255*parseFloat(t)).toString(16)}function C(t){return S(t)/255}function q(t){t=t.replace(z,"").replace(E,"").toLowerCase();var e=!1;if(B[t])t=B[t],e=!0;else if("transparent"==t)return{r:0,g:0,b:0,a:0,format:"name"};var r;return(r=U.rgb.exec(t))?{r:r[1],g:r[2],b:r[3]}:(r=U.rgba.exec(t))?{r:r[1],g:r[2],b:r[3],a:r[4]}:(r=U.hsl.exec(t))?{h:r[1],s:r[2],l:r[3]}:(r=U.hsla.exec(t))?{h:r[1],s:r[2],l:r[3],a:r[4]}:(r=U.hsv.exec(t))?{h:r[1],s:r[2],v:r[3]}:(r=U.hsva.exec(t))?{h:r[1],s:r[2],v:r[3],a:r[4]}:(r=U.hex8.exec(t))?{a:C(r[1]),r:S(r[2]),g:S(r[3]),b:S(r[4]),format:e?"name":"hex8"}:(r=U.hex6.exec(t))?{r:S(r[1]),g:S(r[2]),b:S(r[3]),format:e?"name":"hex"}:(r=U.hex3.exec(t))?{r:S(r[1]+""+r[1]),g:S(r[2]+""+r[2]),b:S(r[3]+""+r[3]),format:e?"name":"hex"}:!1}function L(t){var e,r;return t=t||{level:"AA",size:"small"},e=(t.level||"AA").toUpperCase(),r=(t.size||"small").toLowerCase(),"AA"!==e&&"AAA"!==e&&(e="AA"),"small"!==r&&"large"!==r&&(r="small"),{level:e,size:r}}var z=/^[\s,#]+/,E=/\s+$/,I=0,N=Math,j=N.round,T=N.min,$=N.max,D=N.random;t.prototype={isDark:function(){return this.getBrightness()<128},isLight:function(){return!this.isDark()},isValid:function(){return this._ok},getOriginalInput:function(){return this._originalInput},getFormat:function(){return this._format},getAlpha:function(){return this._a},getBrightness:function(){var t=this.toRgb();return(299*t.r+587*t.g+114*t.b)/1e3},getLuminance:function(){var t,e,r,n,a,i,s=this.toRgb();return t=s.r/255,e=s.g/255,r=s.b/255,n=.03928>=t?t/12.92:Math.pow((t+.055)/1.055,2.4),a=.03928>=e?e/12.92:Math.pow((e+.055)/1.055,2.4),i=.03928>=r?r/12.92:Math.pow((r+.055)/1.055,2.4),.2126*n+.7152*a+.0722*i},setAlpha:function(t){return this._a=k(t),this._roundA=j(100*this._a)/100,this},toHsv:function(){var t=i(this._r,this._g,this._b);return{h:360*t.h,s:t.s,v:t.v,a:this._a}},toHsvString:function(){var t=i(this._r,this._g,this._b),e=j(360*t.h),r=j(100*t.s),n=j(100*t.v);return 1==this._a?"hsv("+e+", "+r+"%, "+n+"%)":"hsva("+e+", "+r+"%, "+n+"%, "+this._roundA+")"},toHsl:function(){var t=n(this._r,this._g,this._b);return{h:360*t.h,s:t.s,l:t.l,a:this._a}},toHslString:function(){var t=n(this._r,this._g,this._b),e=j(360*t.h),r=j(100*t.s),a=j(100*t.l);return 1==this._a?"hsl("+e+", "+r+"%, "+a+"%)":"hsla("+e+", "+r+"%, "+a+"%, "+this._roundA+")"},toHex:function(t){return o(this._r,this._g,this._b,t)},toHexString:function(t){return"#"+this.toHex(t)},toHex8:function(){return f(this._r,this._g,this._b,this._a)},toHex8String:function(){return"#"+this.toHex8()},toRgb:function(){return{r:j(this._r),g:j(this._g),b:j(this._b),a:this._a}},toRgbString:function(){return 1==this._a?"rgb("+j(this._r)+", "+j(this._g)+", "+j(this._b)+")":"rgba("+j(this._r)+", "+j(this._g)+", "+j(this._b)+", "+this._roundA+")"},toPercentageRgb:function(){return{r:j(100*A(this._r,255))+"%",g:j(100*A(this._g,255))+"%",b:j(100*A(this._b,255))+"%",a:this._a}},toPercentageRgbString:function(){return 1==this._a?"rgb("+j(100*A(this._r,255))+"%, "+j(100*A(this._g,255))+"%, "+j(100*A(this._b,255))+"%)":"rgba("+j(100*A(this._r,255))+"%, "+j(100*A(this._g,255))+"%, "+j(100*A(this._b,255))+"%, "+this._roundA+")"},toName:function(){return 0===this._a?"transparent":this._a<1?!1:G[o(this._r,this._g,this._b,!0)]||!1},toFilter:function(e){var r="#"+f(this._r,this._g,this._b,this._a),n=r,a=this._gradientType?"GradientType = 1, ":"";if(e){var i=t(e);n=i.toHex8String()}return"progid:DXImageTransform.Microsoft.gradient("+a+"startColorstr="+r+",endColorstr="+n+")"},toString:function(t){var e=!!t;t=t||this._format;var r=!1,n=this._a<1&&this._a>=0,a=!e&&n&&("hex"===t||"hex6"===t||"hex3"===t||"name"===t);return a?"name"===t&&0===this._a?this.toName():this.toRgbString():("rgb"===t&&(r=this.toRgbString()),"prgb"===t&&(r=this.toPercentageRgbString()),("hex"===t||"hex6"===t)&&(r=this.toHexString()),"hex3"===t&&(r=this.toHexString(!0)),"hex8"===t&&(r=this.toHex8String()),"name"===t&&(r=this.toName()),"hsl"===t&&(r=this.toHslString()),"hsv"===t&&(r=this.toHsvString()),r||this.toHexString())},_applyModification:function(t,e){var r=t.apply(null,[this].concat([].slice.call(e)));return this._r=r._r,this._g=r._g,this._b=r._b,this.setAlpha(r._a),this},lighten:function(){return this._applyModification(c,arguments)},brighten:function(){return this._applyModification(g,arguments)},darken:function(){return this._applyModification(d,arguments)},desaturate:function(){return this._applyModification(h,arguments)},saturate:function(){return this._applyModification(u,arguments)},greyscale:function(){return this._applyModification(l,arguments)},spin:function(){return this._applyModification(b,arguments)},_applyCombination:function(t,e){return t.apply(null,[this].concat([].slice.call(e)))},analogous:function(){return this._applyCombination(y,arguments)},complement:function(){return this._applyCombination(p,arguments)},monochromatic:function(){return this._applyCombination(w,arguments)},splitcomplement:function(){return this._applyCombination(v,arguments)},triad:function(){return this._applyCombination(m,arguments)},tetrad:function(){return this._applyCombination(_,arguments)}},t.fromRatio=function(e,r){if("object"==typeof e){var n={};for(var a in e)e.hasOwnProperty(a)&&(n[a]="a"===a?e[a]:O(e[a]));e=n}return t(e,r)},t.equals=function(e,r){return e&&r?t(e).toRgbString()==t(r).toRgbString():!1},t.random=function(){return t.fromRatio({r:D(),g:D(),b:D()})},t.mix=function(e,r,n){n=0===n?0:n||50;var a,i=t(e).toRgb(),s=t(r).toRgb(),o=n/100,f=2*o-1,h=s.a-i.a;a=f*h==-1?f:(f+h)/(1+f*h),a=(a+1)/2;var u=1-a,l={r:s.r*a+i.r*u,g:s.g*a+i.g*u,b:s.b*a+i.b*u,a:s.a*o+i.a*(1-o)};return t(l)},t.readability=function(e,r){var n=t(e),a=t(r);return(Math.max(n.getLuminance(),a.getLuminance())+.05)/(Math.min(n.getLuminance(),a.getLuminance())+.05)},t.isReadable=function(e,r,n){var a,i,s=t.readability(e,r);switch(i=!1,a=L(n),a.level+a.size){case"AAsmall":case"AAAlarge":i=s>=4.5;break;case"AAlarge":i=s>=3;break;case"AAAsmall":i=s>=7}return i},t.mostReadable=function(e,r,n){var a,i,s,o,f=null,h=0;n=n||{},i=n.includeFallbackColors,s=n.level,o=n.size;for(var u=0;u<r.length;u++)a=t.readability(e,r[u]),a>h&&(h=a,f=t(r[u]));return t.isReadable(e,f,{level:s,size:o})||!i?f:(n.includeFallbackColors=!1,t.mostReadable(e,["#fff","#000"],n))};var B=t.names={aliceblue:"f0f8ff",antiquewhite:"faebd7",aqua:"0ff",aquamarine:"7fffd4",azure:"f0ffff",beige:"f5f5dc",bisque:"ffe4c4",black:"000",blanchedalmond:"ffebcd",blue:"00f",blueviolet:"8a2be2",brown:"a52a2a",burlywood:"deb887",burntsienna:"ea7e5d",cadetblue:"5f9ea0",chartreuse:"7fff00",chocolate:"d2691e",coral:"ff7f50",cornflowerblue:"6495ed",cornsilk:"fff8dc",crimson:"dc143c",cyan:"0ff",darkblue:"00008b",darkcyan:"008b8b",darkgoldenrod:"b8860b",darkgray:"a9a9a9",darkgreen:"006400",darkgrey:"a9a9a9",darkkhaki:"bdb76b",darkmagenta:"8b008b",darkolivegreen:"556b2f",darkorange:"ff8c00",darkorchid:"9932cc",darkred:"8b0000",darksalmon:"e9967a",darkseagreen:"8fbc8f",darkslateblue:"483d8b",darkslategray:"2f4f4f",darkslategrey:"2f4f4f",darkturquoise:"00ced1",darkviolet:"9400d3",deeppink:"ff1493",deepskyblue:"00bfff",dimgray:"696969",dimgrey:"696969",dodgerblue:"1e90ff",firebrick:"b22222",floralwhite:"fffaf0",forestgreen:"228b22",fuchsia:"f0f",gainsboro:"dcdcdc",ghostwhite:"f8f8ff",gold:"ffd700",goldenrod:"daa520",gray:"808080",green:"008000",greenyellow:"adff2f",grey:"808080",honeydew:"f0fff0",hotpink:"ff69b4",indianred:"cd5c5c",indigo:"4b0082",ivory:"fffff0",khaki:"f0e68c",lavender:"e6e6fa",lavenderblush:"fff0f5",lawngreen:"7cfc00",lemonchiffon:"fffacd",lightblue:"add8e6",lightcoral:"f08080",lightcyan:"e0ffff",lightgoldenrodyellow:"fafad2",lightgray:"d3d3d3",lightgreen:"90ee90",lightgrey:"d3d3d3",lightpink:"ffb6c1",lightsalmon:"ffa07a",lightseagreen:"20b2aa",lightskyblue:"87cefa",lightslategray:"789",lightslategrey:"789",lightsteelblue:"b0c4de",lightyellow:"ffffe0",lime:"0f0",limegreen:"32cd32",linen:"faf0e6",magenta:"f0f",maroon:"800000",mediumaquamarine:"66cdaa",mediumblue:"0000cd",mediumorchid:"ba55d3",mediumpurple:"9370db",mediumseagreen:"3cb371",mediumslateblue:"7b68ee",mediumspringgreen:"00fa9a",mediumturquoise:"48d1cc",mediumvioletred:"c71585",midnightblue:"191970",mintcream:"f5fffa",mistyrose:"ffe4e1",moccasin:"ffe4b5",navajowhite:"ffdead",navy:"000080",oldlace:"fdf5e6",olive:"808000",olivedrab:"6b8e23",orange:"ffa500",orangered:"ff4500",orchid:"da70d6",palegoldenrod:"eee8aa",palegreen:"98fb98",paleturquoise:"afeeee",palevioletred:"db7093",papayawhip:"ffefd5",peachpuff:"ffdab9",peru:"cd853f",pink:"ffc0cb",plum:"dda0dd",powderblue:"b0e0e6",purple:"800080",rebeccapurple:"663399",red:"f00",rosybrown:"bc8f8f",royalblue:"4169e1",saddlebrown:"8b4513",salmon:"fa8072",sandybrown:"f4a460",seagreen:"2e8b57",seashell:"fff5ee",sienna:"a0522d",silver:"c0c0c0",skyblue:"87ceeb",slateblue:"6a5acd",slategray:"708090",slategrey:"708090",snow:"fffafa",springgreen:"00ff7f",steelblue:"4682b4",tan:"d2b48c",teal:"008080",thistle:"d8bfd8",tomato:"ff6347",turquoise:"40e0d0",violet:"ee82ee",wheat:"f5deb3",white:"fff",whitesmoke:"f5f5f5",yellow:"ff0",yellowgreen:"9acd32"},G=t.hexNames=x(B),U=function(){var t="[-\\+]?\\d+%?",e="[-\\+]?\\d*\\.\\d+%?",r="(?:"+e+")|(?:"+t+")",n="[\\s|\\(]+("+r+")[,|\\s]+("+r+")[,|\\s]+("+r+")\\s*\\)?",a="[\\s|\\(]+("+r+")[,|\\s]+("+r+")[,|\\s]+("+r+")[,|\\s]+("+r+")\\s*\\)?";return{rgb:new RegExp("rgb"+n),rgba:new RegExp("rgba"+a),hsl:new RegExp("hsl"+n),hsla:new RegExp("hsla"+a),hsv:new RegExp("hsv"+n),hsva:new RegExp("hsva"+a),hex3:/^([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,hex6:/^([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,hex8:/^([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/}}();"undefined"!=typeof module&&module.exports?module.exports=t:"function"==typeof define&&define.amd?define(function(){return t}):window.tinycolor=t}();
