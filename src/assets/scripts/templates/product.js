import '../../styles/layout/templates/_product.scss';

import '../sections/product';

import $ from 'jquery';
import sections from '@shopify/theme-sections';

$(document).ready(() => {
    sections.load('product');
});
