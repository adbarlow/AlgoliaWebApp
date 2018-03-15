
var applicationID = 'PAP9M9QV4G';
var apiKey = '304841d37ceafeea288eb61373b4bcc9';
var index = 'getlocal_resturant';

var client = algoliasearch(applicationID, apiKey);
var helper = algoliasearchHelper(client, index, {
	facets: ['name', 'payment_options']
  });

helper.on('result', function(content) {
	renderFacetNameList(content);
	renderFacetPaymentList(content);
	renderHits(content);
});

function renderHits(content) {
  $('#container').html(function() {
    return $.map(content.hits, function(hit) {
      return '<li>' + hit._highlightResult.name.value + '</li>';
    });
  });
}

$('#search-box').on('keyup', function() {
  helper.setQuery($(this).val())
        .search();
});

$('#facet-list-name').on('click', 'input[type=checkbox]', function(e) {
	var facetValue = $(this).data('facet');
	helper.toggleFacetRefinement('name', facetValue).search();
});

$('#facet-list-payment').on('click', 'input[type=checkbox]', function(e) {
	var facetValue = $(this).data('facet');
	helper.toggleFacetRefinement('payment_options', facetValue).search();
});
//cobine the render facet functions once working.
function renderFacetNameList(content) {
	$('#facet-list-name').html(function() {
	  return $.map(content.getFacetValues('name'), function(facet) {
		var checkbox = $('<input name=checkbox>')
		  .data('facet', facet.name)
		  .attr('id', 'fl-' + facet.name);
		if(facet.isRefined) checkbox.attr('checked', 'checked');
		var label = $('<label>').html(facet.name + ' (' + facet.count + ')')
								.attr('for', 'fl-' + facet.name);
		return $('<li>').append(checkbox).append(label);
	  });
	});
  }

  function renderFacetPaymentList(content) {
	$('#facet-list-payment').html(function() {
	  return $.map(content.getFacetValues('payment_options'), function(facet) {
		var checkbox = $('<input payment_options=checkbox>')
		  .data('facet', facet.name)
		  .attr('id', 'fl-' + facet.name);
		if(facet.isRefined) checkbox.attr('checked', 'checked');
		var label = $('<label>').html(facet.name + ' (' + facet.count + ')')
								.attr('for', 'fl-' + facet.name);
		return $('<li>').append(checkbox).append(label);
	  });
	});
  }

helper.search();
