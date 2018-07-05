/**
 * Customer Addresses Script
 * ------------------------------------------------------------------------------
 * A file that contains scripts highly couple code to the Customer Addresses
 * template.
 *
 * @namespace customerAddresses
 */

import '../../../styles/layout/templates/customers/_addresses.scss';
import $ from 'jquery';

const $newAddressForm = $('#AddressNewForm');

if ($newAddressForm.length) {
  // Initialize observers on address selectors, defined in shopify_common.js
  if (Shopify) {
    new Shopify.CountryProvinceSelector(
      'AddressCountryNew',
      'AddressProvinceNew',
      {
        hideElement: 'AddressProvinceContainerNew',
      },
    );
  }

  // Initialize each edit form's country/province selector
  $('.address-country-option').each(function() {
    const formId = $(this).data('form-id');
    const countrySelector = `AddressCountry_${formId}`;
    const provinceSelector = `AddressProvince_${formId}`;
    const containerSelector = `AddressProvinceContainer_${formId}`;

    new Shopify.CountryProvinceSelector(countrySelector, provinceSelector, {
      hideElement: containerSelector,
    });
  });


  $('.address-delete').on('click', function() {
    const $el = $(this);
    const formId = $el.data('form-id');
    const confirmMessage = $el.data('confirm-message');
    if (
      window.confirm(
        confirmMessage || 'Are you sure you wish to delete this address?',
      )
    ) {
      Shopify.postLink(`/account/addresses/${formId}`, {
        parameters: {_method: 'delete'},
      });
    }
  });
}
