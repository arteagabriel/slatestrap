/**
 * Product Template Script
 * ------------------------------------------------------------------------------
 * A file that contains scripts highly couple code to the Product template.
 *
 * @namespace product
 */

import $ from 'jquery';
import Variants from '@shopify/theme-variants';
import {imageSize, preload, getSizedImageUrl} from '@shopify/theme-images';
import {formatMoney} from '@shopify/theme-currency';
import sections from '@shopify/theme-sections';

const selectors = {
    addToCart: '[data-add-to-cart]',
    addToCartText: '[data-add-to-cart-text]',
    comparePrice: '[data-compare-price]',
    comparePriceText: '[data-compare-text]',
    originalSelectorId: '[data-product-select]',
    priceWrapper: '[data-price-wrapper]',
    productFeaturedImage: '[data-product-featured-image]',
    productJson: '[data-product-json]',
    productPrice: '[data-product-price]',
    productThumbs: '[data-product-single-thumbnail]',
    singleOptionSelector: '[data-single-option-selector]',
};

/**
 * Product section constructor. Runs on page load as well as Theme Editor
 * `section:load` events.
 * @param {string} container - selector for the section container DOM element
 */

sections.register('product', {
    onLoad() {
        // Stop parsing if we don't have the product json script tag when loading
        // section in the Theme Editor
        if (!$(selectors.productJson, this.$container).html()) {
            return;
        }

        this.productSingleObject = JSON.parse(
            $(selectors.productJson, this.$container).html(),
        );

        const options = {
            $container: this.$container,
            enableHistoryState: this.$container.data('enable-history-state') || false,
            singleOptionSelector: selectors.singleOptionSelector,
            originalSelectorId: selectors.originalSelectorId,
            product: this.productSingleObject,
        };

        this.settings = {};
        this.$featuredImage = $(selectors.productFeaturedImage, this.$container);
        this.settings.imageSize = imageSize(this.$featuredImage.attr('src'));

        preload(this.productSingleObject.images, this.settings.imageSize);

        this.variants = new Variants(options);

        this.$container.on(
            `variantChange${this.namespace}`,
            this.updateAddToCartState.bind(this),
        );

        this.$container.on(
            `variantPriceChange${this.namespace}`,
            this.updateProductPrices.bind(this),
        );

        this.$container.on(
            `variantImageChange${this.namespace}`,
            this.updateProductImage.bind(this),
        );

        this.initImagesSwitch();
        this.productImageZoom();


        if (this.$featuredImage.length > 0) {
        }
    },

    /**
     * Updates the DOM state of the add to cart button
     *
     * @param {boolean} enabled - Decides whether cart is enabled or disabled
     * @param {string} text - Updates the text notification content of the cart
     */
    updateAddToCartState(evt) {
        const variant = evt.variant;

        if (variant) {
            $(selectors.priceWrapper, this.$container).removeClass('hide');
        } else {
            $(selectors.addToCart, this.$container).prop('disabled', true);
            $(selectors.addToCartText, this.$container).html(
                theme.strings.unavailable,
            );
            $(selectors.priceWrapper, this.$container).addClass('hide');
            return;
        }

        if (variant.available) {
            $(selectors.addToCart, this.$container).prop('disabled', false);
            $(selectors.addToCartText, this.$container).html(theme.strings.addToCart);
        } else {
            $(selectors.addToCart, this.$container).prop('disabled', true);
            $(selectors.addToCartText, this.$container).html(theme.strings.soldOut);
        }

        console.log('in update cart state');
    },

    /**
     * Updates the DOM with specified prices
     *
     * @param {string} productPrice - The current price of the product
     * @param {string} comparePrice - The original price of the product
     */
    updateProductPrices(evt) {
        const variant = evt.variant;
        const $comparePrice = $(selectors.comparePrice, this.$container);
        const $compareEls = $comparePrice.add(
            selectors.comparePriceText,
            this.$container,
        );

        $(selectors.productPrice, this.$container).html(
            formatMoney(variant.price, theme.moneyFormat),
        );

        if (variant.compare_at_price > variant.price) {
            $comparePrice.html(
                formatMoney(variant.compare_at_price, theme.moneyFormat),
            );
            $compareEls.removeClass('hide');
        } else {
            $comparePrice.html('');
            $compareEls.addClass('hide');
        }
        console.log('in update prices');
    },

    initImagesSwitch() {
        console.log('in initimagesswitch');
        if (!$(selectors.productThumbs, this.$container).length) {
            return;
        }

        var self = this;

        $(selectors.productThumbs, this.$container).on('click', function(evt) {
            evt.preventDefault();

            var $el = $(this);
            var imageSrc = $el.attr('href');

            self.switchImage(imageSrc);
        });
    },

    productImageZoom() {
        if (!$(selectors.imageWrapper, this.$container).length) {
            return;
        }

        // Destroy zoom (in case it was already set), then set it up again
        $(selectors.imageWrapper, this.$container).trigger('zoom.destroy');

        $(selectors.imageWrapper, this.$container).zoom({
            url: $(selectors.productFeaturedImage, this.$container).data('zoom')
        });
    },

    /**
     * Updates the DOM with the specified image URL
     *
     * @param {string} src - Image src URL
     */
    updateProductImage(evt) {
        console.log('in update image');
        const variant = evt.variant;
        const sizedImgUrl = getSizedImageUrl(
            variant.featured_image.src,
            this.settings.imageSize,
        );

        this.$featuredImage.attr('src', sizedImgUrl);


        this.switchImage(sizedImgUrl);
        this.productImageZoom();
    },

    switchImage(imageSrc) {
        $(selectors.productFeaturedImage, this.$container)
            .attr('src', imageSrc)
            .data('zoom', imageSrc);

        this.productImageZoom();
    },

    /**
     * Event callback for Theme Editor `section:unload` event
     */
    onUnload() {
        this.$container.off(this.namespace);
    },
});
