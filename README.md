# Plugin Free Search para VirtualGaia (V2)

Conteúdo
-----------------

* [Requerimentos](#requerimentos)
* [Module virtualgaia.plugin.search](#virtualgaiapluginsearch) (obrigatório)
* [Directive free-search](#directive-free-search) (deprecated)
* [Directive home-search](#directive-home-search)

-----------------
## Requerimentos

- Node  [NodeJS](https://nodejs.org/en/)
- Bower `npm install bower -g`

## Verificar se há o bower.json no site
Se não haver o arquivo `bower.json`  na raiz do site:
```shell
bower init
```
Siga os passos e seja feliz.

-----------------
## virtualgaia.plugin.search

 1. `bower install virtualgaia.plugin.search -D`
 2. Adicione os js (verifique se já não está):
	 - `bower_components\angular\angular.min.js`
	 - `bower_components\virtualgaia.plugin.search\dist\virtualgaia.plugin.search.min.js`
	 - `bower_components\virtualgaia.plugin.search\css\free-search.css`

 3. Substituir na tag `<html>` por `<html lang="pt-br" ng-app="virtualgaia">`.
 4. Adicionar o script na página, abaixo dos scripts de preferência:
	```javascript
	angular.module("virtualgaia",[
		'virtualgaia.plugin.search'
	]);
	```


-----------------
## Directive free-search


Após instalar o [virtualgaia.plugin.search](virtualgaiapluginsearch)

 1. No arquivo `inc_busca.aspx` (ou o arquivo de busca do modelo) substitua o trecho da busca rápida por:
	```C#
	objBuscaRapida.template += "[pretensao]" + Environment.NewLine;
	objBuscaRapida.template += "[tipo]" + Environment.NewLine;
	objBuscaRapida.template += "<dl class='searchfree'><input type='text' agency-id='123' class='form-control' placeholder='Digite um bairro ou cidade' free-search /></dl>" + Environment.NewLine;

	```
 2. **Atenção**: não se esquecer de trocar a atributo `agency-id` pelo ID da imobiliária. Se for uma rede imobiliária, substituir pelo atributo `network-id`

#### Alterar o campo tipo

 1. No arquivo `js\virtualGaia2.js` comentar as seguintes linhas:
 	```javascript
 	$("#ddltipo").multiselect({
		close:function(){
    	   $("#ddlFinalidade").selectmenu().selectmenu("refresh", true);
  	 }
 	});

 	```
 2. Descomentar a linha:
 	```javascript
 	$("#ddltipo").append("<option value='0'>Tipo</option>");

 	```
 3. Remover do arquivo css `css\style.css`
 	```css
 	.busca dl.tipo .ui-selectmenu-button

	```
 4. Alterar para `false` a seguinte linha do template da busca:
 	```javascript
 	objBuscaRapida.multiplaSelecaoTipo = false;

 	```

-----------------
## Directive home-search
Após instalar o [virtualgaia.plugin.search](virtualgaiapluginsearch)
1. Coloque no html:
	```html
	<home-search></home-search>
	```

-----------------
# Manutenção

Para dar manutenção no plugin, não se esqueça de colocar a nova versão para atualizar no bower:

```javascript
 "name": "virtualgaia.plugin.search",
  "version": "0.0.2",
  "authors": ...
```

Instale os pacotes Node
 ```shell
npm install
gulp
 ```
 Crie as tags
 ```shell
git tag the commit
git tag -a v0.0.2 -m "Release version 0.0.2"
 ```
Push to GitHub
 ```shell
 git push origin master --tags
 ```