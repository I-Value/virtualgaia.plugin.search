// Start Angular Module
angular.module("vg-free-search",[]);

// Directive
angular.module('vg-free-search').directive('freeSearch', function() {
	return {
		restrict: 'A',
		link: function(scope, element, attributes, ctrl){

			$(element).wrap( "<div class='wrap-textsearch'></div>" );
			var wrapper = $(element).parent();
			wrapper.append('<input type="hidden" name="cidade2" />');
			wrapper.append('<input type="hidden" name="bairro" />');
			wrapper.append('<input type="hidden" name="logradouro" />');
			wrapper.append('<input type="hidden" name="empreendimento-pai" />');
			wrapper.append('<input type="hidden" name="zona" />');

			function setFocusOnSearch() {
				clearFields();
				$(element).typeahead('val', '');
				$(element).focus()
			}

			function clearFields() {
				$("input[name='cidade2']", wrapper).val('')
				$("input[name='bairro']", wrapper).val('')
				$("input[name='logradouro']", wrapper).val('')
				$("input[name='empreendimento-pai']", wrapper).val('')
				$("input[name='zona']", wrapper).val('')
			}

			function getSource(item_type) {
				var items = new Bloodhound({
					datumTokenizer: function (datum) {
						return Bloodhound.tokenizers.whitespace(datum.value);
					},
					queryTokenizer: Bloodhound.tokenizers.whitespace,
					remote: {
						url: 'http://search.gaiasite.com.br/autocomplete?network=142&q=%QUERY&purpose=0&type=0',
						replace: function(url, query) {
							url = url.replace('%QUERY', query)
							url = url.replace('&purpose=0', '&purpose=' + $('#ddlPretensao').val())
							url = url.replace('&type=0', '&type=' + $('#ddltipo').val())
							return url
						},
						filter: function (items) {
										// Map the remote source JSON array to a JavaScript object array
										return $.map(items.hits, function (item) {
											if (item.type == item_type) {
												return {
													value: item.value + ' (' + item.additional + ')',
													id: item.id,
													type: item.type,
													city_id: item.city_id
												};
											}
										});
									}
								}
							});
				items.initialize();
				return items.ttAdapter();
			}

			$(element).typeahead({
				hint: false,
				highlight: true,
				minLength: 3
			},
			{
				name: 'neighborhood',
				displayKey: 'value',
				source: getSource('neighborhood'),
				templates: {
					header: '<h3 class="category">Bairros</h3>'
				}
			},
			{
				name: 'building',
				displayKey: 'value',
				source: getSource('building'),
				templates: {
					header: '<h3 class="category">Condom&iacute;nios</h3>'
				}
			},
			{
				name: 'street',
				displayKey: 'value',
				source: getSource('street'),
				templates: {
					header: '<h3 class="category">Endere&ccedil;os</h3>'
				}
			},
			{
				name: 'city',
				displayKey: 'value',
				source: getSource('city'),
				templates: {
					header: '<h3 class="category">Cidades</h3>'
				}
			},
			{
				name: 'region',
				displayKey: 'value',
				source: getSource('region'),
				templates: {
					header: '<h3 class="category">Regi&atilde;o</h3>'
				}
			}).on('typeahead:selected', function(event, data) {

				clearFields()
				switch(data.type) {
					case 'city':
					$("input[name='cidade2']", wrapper).val(data.id);
					break;
					case 'neighborhood':
					$("input[name='bairro']", wrapper).val(data.id);
					$("input[name='cidade2']", wrapper).val(data.city_id);
					break;
					case 'street':
					$("input[name='logradouro']", wrapper).val(data.id);
					break;
					case 'building':
					$("input[name='empreendimento-pai']", wrapper).val(data.id);
					break;
					case 'region':
					$("input[name='zona']", wrapper).val(data.id);
					break;
				}
				$('#frmBusca').submit();
			}).bind('typeahead:render', function(e) {
				$('#frmBusca').parent().find('.tt-selectable:first').addClass('tt-cursor');
			});


			$('#ddlPretensao').change(setFocusOnSearch);
			$('#ddltipo').change(setFocusOnSearch).change();

			$('#frmBusca').submit(function() {
				return canSubmit();
			});

			function canSubmit() {
				if($("input[name='cidade2']", wrapper).val() != "" ||
					$("input[name='bairro']", wrapper).val() != "" ||
					$("input[name='logradouro']", wrapper).val() != "" ||
					$("input[name='empreendimento-pai']", wrapper).val() != "" ||
					$("input[name='zona']", wrapper).val() != ""){
					$(".searchfree input").removeClass("errorInput");
					$(".searchfree input").parent().removeClass("has-error");
				return true; 
			} else {
				$(".searchfree input").addClass("errorInput");
				$(".searchfree input").parent().addClass("has-error");
				return false;					
			}
		}

	}

};
});

angular.element(window).load(function() {
	angular.bootstrap(document, ["vg-free-search"]);
});
