import 'lazysizes/plugins/object-fit/ls.object-fit';
import 'lazysizes/plugins/parent-fit/ls.parent-fit';
import 'lazysizes/plugins/rias/ls.rias';
import 'lazysizes/plugins/bgset/ls.bgset';
import 'lazysizes';
import 'lazysizes/plugins/respimg/ls.respimg';

import '../../styles/theme.scss';
import '../../styles/theme.scss.liquid';

import $ from 'jquery';
import 'bootstrap';
import {pageLinkFocus} from '@shopify/theme-a11y';
import {cookiesEnabled} from '@shopify/theme-cart';

window.slate = window.slate || {};
window.theme = window.theme || {};

$(document).ready(() => {
  // Common a11y fixes
  if (window.location.hash !== '#') {
    pageLinkFocus($(window.location.hash));
  }

  $('.in-page-link').on('click', (evt) => {
    pageLinkFocus($(evt.currentTarget.hash));
  });

  // Apply a specific class to the html element for browser support of cookies.
  if (cookiesEnabled()) {
    document.documentElement.className = document.documentElement.className.replace(
      'supports-no-cookies',
      'supports-cookies',
    );
  }
});
