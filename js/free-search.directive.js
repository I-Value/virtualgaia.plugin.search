// jshint strict:false
/* globals angular: true, console: true, $: true, Bloodhound: true */
// Start Angular Module
angular.module("virtualgaia.plugin.search", []);

// Directive
angular.module('virtualgaia.plugin.search').directive('freeSearch', function () {
    return {
        restrict: 'A',
        scope: {
            agencyId: "@?",
            networkId: "@?",
            form: "@?",
            purposeSelector: "@?",
            typeSelector: "@?",
            requiredFields: "@?"
        },
        link: function (scope, element, attributes, ctrl) {
            attributes = attributes;
            ctrl = ctrl;
            scope.form = scope.form || '#frmBusca';
            scope.purposeSelector = scope.purposeSelector || '#ddlPretensao';
            scope.typeSelector = scope.typeSelector || '#tipo';
            scope.requiredFields = scope.requiredFields || "cidade2,bairro,logradouro,empreendimento-pai,zona";

            function setFocusOnSearch() {
                clearFields();
                $(element).typeahead('val', '');
                $(element).focus();
            }
            function clearFields() {
                $("input[name='cidade2']", wrapper).val('');
                $("input[name='bairro']", wrapper).val('');
                $("input[name='logradouro']", wrapper).val('');
                $("input[name='empreendimento-pai']", wrapper).val('');
                $("input[name='zona']", wrapper).val('');
            }

            function getSource(item_type) {
                var items = new Bloodhound({
                    datumTokenizer: function (datum) {
                        return Bloodhound.tokenizers.whitespace(datum.value);
                    },
                    queryTokenizer: Bloodhound.tokenizers.whitespace,
                    remote: {
                        url: scope.url_api,
                        replace: function (url, query) {
                            url = url.replace('%QUERY', query);
                            url = url.replace('&purpose=0', '&purpose=' + $(scope.purposeSelector).val());
                            url = url.replace('&type=0', '&type=' + $(scope.typeSelector).val());
                            return url;
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
            function canSubmit() {
                var valid = true;
                var required = scope.requiredFields.split(",");
                for (var i = 0; i < required.length; i++) {
                    if (required[0].length > 0){
                        if ($("input[name='" + required[i] + "']", wrapper).val() !== "") {
                            valid = false;
                            i = required.length;
                        }
                    }
                }
                if (valid) {
                    $(".searchfree input").removeClass("errorInput");
                    $(".searchfree input").parent().removeClass("has-error");
                    clearForm(scope.form);
                    return true;
                } else {
                    $(".searchfree input").addClass("errorInput");
                    $(".searchfree input").parent().addClass("has-error");
                    return false;
                }
            }

            function clearForm(form) {
                $("select,input,textarea", form).each(function () {
                    if ($(this).val().length === 0 || $(this).val() === "0") {
                        $(this).removeAttr("name");
                    }
                });
            }


            if (scope.agencyId !== undefined) {
                scope.url_api = 'http://search.gaiasite.com.br/autocomplete?agency=' + scope.agencyId + '&q=%QUERY&purpose=0&type=0';
            }
            if (scope.networkId !== undefined) {
                scope.url_api = 'http://search.gaiasite.com.br/autocomplete?network=' + scope.networkId + '&q=%QUERY&purpose=0&type=0';
            }
            if (scope.url_api === undefined) {
                console.error("Não há a propriedade agency-id ou network-id na directiva");
            } else {
                $(element).wrap("<div class='wrap-textsearch'></div>");
                var wrapper = $(element).parent();
                wrapper.append('<input type="hidden" name="cidade2" />');
                wrapper.append('<input type="hidden" name="bairro" />');
                wrapper.append('<input type="hidden" name="logradouro" />');
                wrapper.append('<input type="hidden" name="empreendimento-pai" />');
                wrapper.append('<input type="hidden" name="zona" />');
                var empty = [
                      '<div class="empty-message">',
                        'Nenhum resultado foi encontrado',
                      '</div>'
                ].join('\n');
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
                        empty: empty,
                        header: '<h3 class="category">Bairros</h3>',
                    }
                },
                {
                    name: 'building',
                    displayKey: 'value',
                    source: getSource('building'),
                    templates: {
                        header: '<h3 class="category">Condom&iacute;nios</h3>',
                    }
                },
                {
                    name: 'street',
                    displayKey: 'value',
                    source: getSource('street'),
                    templates: {
                        header: '<h3 class="category">Endere&ccedil;os</h3>',
                    }
                },
                {
                    name: 'city',
                    displayKey: 'value',
                    source: getSource('city'),
                    templates: {
                        header: '<h3 class="category">Cidades</h3>',
                    }
                },
                {
                    name: 'region',
                    displayKey: 'value',
                    source: getSource('region'),
                    templates: {
                        header: '<h3 class="category">Regi&atilde;o</h3>',
                    }
                }).on('typeahead:selected', function (event, data) {
                    clearFields();
                    switch (data.type) {
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
                    $(scope.form).submit();
                }).bind('typeahead:render', function () {
                    $(scope.form).parent().find('.tt-selectable:first').addClass('tt-cursor');
                });


                $(scope.purposeSelector).change(setFocusOnSearch);
                $(scope.typeSelector).change(setFocusOnSearch).change();

                $(scope.form).submit(function () {
                    return canSubmit();
                });
            }
        }
    };
});