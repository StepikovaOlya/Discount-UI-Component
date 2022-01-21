define([
    'jquery',
    'ko',
    'uiComponent',
    'Magento_Customer/js/customer-data'
], function ($, ko, Component, customerData) {
    'use strict';

    return Component.extend({
        defaults: {
            template: 'product/message',
            attributeQty: '',
            cartQty: '',
            maxQty: 1000,
            productDiscountType: '',
            displayDiscount: 0,
            displayQty: 0
        },

        observableProperties: [
            'attributeQty',
            'cartQty',
            'productQty',
            'displayDiscount',
            'displayQty'
        ],

        /**
         * Initialize function
         */
        initialize: function () {
            var self = this;

            this._super();

            this.discountList = JSON.parse(this.discountTierData.replace(/&quot;/g,'"'));

            // Sets listener to the cart data
            customerData.get('cart').subscribe(function (cartData) {
                self.cartQty(JSON.stringify(cartData.attributeQty[self.productDiscountType]));
                self.calculateDiscount();
            });
            this.cartQty(customerData.get('cart')()['attributeQty'][this.productDiscountType]);

            // Sets check to the cart data exist
            (this.cartQty() !== '' && this.cartQty() !== undefined) ? this.cartQty(customerData.get('cart')()['attributeQty'][this.productDiscountType]) : this.cartQty(0) ;

            // Sets listener to the qty controls
            const buttonQty = $('.qty-control');

            buttonQty.on('click', function () {
                self.calculateDiscount();
            });

            this.initialQty();

            this.calculateDiscount();
        },

        /**
         * Initial product quantity
         */
        initialQty: function() {
            return Number(this.productQty()) + Number(this.cartQty());
        },

        /**
         * Calculate Discount Value
         */
        calculateDiscount: function () {
            const discountArray = this.discountList[this.productDiscountType].filter(item => item.qty <= this.initialQty());
            this.displayQty(Number(this.discountList[this.productDiscountType][discountArray.length].qty) - Number(this.initialQty()));
            this.displayDiscount((this.discountList[this.productDiscountType][discountArray.length].discount));
        },

        /**
         * Init observable properties
         */
        initObservable: function () {
            this._super();
            this.observe(this.observableProperties);

            return this;
        }
    });
});
