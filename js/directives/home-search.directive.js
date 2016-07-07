// jshint strict:false
/* globals angular: true, console: true, $: true, Bloodhound: true */

// Directive
angular.module('virtualgaia.plugin.search').directive('homeSearch', function ($httpParamSerializer) {
    return {
        restrict: 'E',
        templateUrl: "js/directives/partials/home-search.directive.html",
        scope: {
            remote: "@?",
            destination: "@?"
        },
        controllerAs: "vm",
        controller: function($scope){
            $scope.remote = $scope.remote || "./";
            $scope.destination = $scope.destination || "listagem.aspx";
            $scope.getSource = getSource;
            $scope.submit = submit;

            var vm = this;
            vm.destination = $scope.destination;
            vm.query = {};
            vm.changePurpose = changePurpose;
            vm.submit = submit;
            vm.property_types = [];
            vm.purposes = [];

            generatePurposes();

            function generatePurposes(){
                generateTypes("2");
                generateTypes("1");
            }

            function thousandsSeparator(x) {
                return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
            }
            function generateTypes(purpose){
                delete(vm.property_types[purpose]);
                $.ajax({
                    url: $scope.remote + "/property_types",
                    data: {ddlPretensao: purpose}
                }).done(function(body) {
                   for(var i in body.data){
                        body.data[i].title = body.data[i].title +
                        " ("+ thousandsSeparator(body.data[i].count) +") ";
                   }
                   vm.property_types[purpose] = body.data;
                   if(body.data.length > 0){
                        vm.purposes[purpose] = true;
                        vm.query.ddlPretensao = purpose;
                   }
                   $scope.$digest();
                });
            }

            function changePurpose(id){
                vm.query.ddlPretensao = id;
                vm.q = null;
            }

            function getSource(item_type) {
                var items = new Bloodhound({
                    datumTokenizer: function (datum) {
                        return Bloodhound.tokenizers.whitespace(datum.value);
                    },
                    queryTokenizer: Bloodhound.tokenizers.whitespace,
                    remote: {
                        url: $scope.remote + "/autocomplete",
                        replace: function (url, query) {
                            url = url + "?q=" + query + "&" + $httpParamSerializer(vm.query);
                            return url;
                        },
                        filter: function (items) {
                            vm.nothing = (items.data.length < 1);
                            $scope.$digest();
                            return $.map(items.data, function (item) {
                                if (item.type == item_type) {
                                    return {
                                        id: item.value,
                                        value: item.title,
                                        type: item.type,
                                        count: item.count,
                                        parent_id: item.parent_id
                                    };
                                }
                            });
                        }
                    }
                });
                items.initialize();
                return items.ttAdapter();
            }
            function submit(form){
                if(form.$valid){
                    for(var key in vm.query){
                        if(vm.query[key] === null || vm.query[key] === undefined) delete(vm.query[key]);
                    }
                    if(vm.query.ref) vm.query = new Object({ref: vm.query.ref});
                    var dest = vm.destination + "?" + $httpParamSerializer(vm.query);
                    location.href = dest;
                }
            }

        },
        link: function (scope, element /*, attributes, ctrl*/) {
            function clear(){
                delete(scope.vm.query.cidade2);
                delete(scope.vm.query.bairro);
                delete(scope.vm.query.ref);
                delete(scope.vm.q);
                $("input[name='free-search']",element).typeahead('val','');
            }
            function pluralize(count,sing,plural){
                return (count > 1) ? count + " " + plural : count + " " + sing;
            }
            scope.vm.clear = clear;
            $("input[name='free-search']",element).typeahead({
                    hint: false,
                    highlight: true,
                    minLength: 3
                },
                {
                    name: 'bairro',
                    displayKey: 'value',
                    source: scope.getSource('bairro'),
                    templates: {
                        header: '<h3 class="category">Bairros</h3>',
                        suggestion: function(data){
                            return "<div>" + data.value + "<small class='counter'>" +
                            pluralize(data.count,'imóvel','imóveis') + " </small></div>";
                        }
                    }
                },
                {
                    name: 'cidade2',
                    displayKey: 'value',
                    source: scope.getSource('cidade2'),
                    templates: {
                        header: '<h3 class="category">Cidades</h3>',
                        suggestion: function(data){
                            return "<div>" + data.value + "<small class='counter'>" +
                            pluralize(data.count,'imóvel','imóveis') + " </small></div>";
                        }
                    }
                }).on('typeahead:selected', function (event, data) {
                    if(data.type == 'bairro'){
                        scope.vm.query.bairro = data.id;
                        scope.vm.query.cidade2 = data.parent_id;
                    }else{
                        scope.vm.query.cidade2 = data.id;
                    }
                    scope.vm.submit(scope.vm.frmBusca);
                }).on('typeahead:asyncrequest', function () {
                    scope.vm.loading = true;
                    delete(scope.vm.nothing);
                    scope.$digest();
                }).on('typeahead:asyncreceive', function () {
                    delete(scope.vm.loading);
                    scope.$digest();
                }).bind('typeahead:render', function () {
                    $("input[name='free-search']",element).parent().find('.tt-selectable:first').addClass('tt-cursor');
                });
        }
    };
});