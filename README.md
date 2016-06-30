#Plugin Free Search para VirtualGaia

##Instalação

### Bower
Verifique se está instalado em seu computado o Node e o Bower. Caso não estiver:

### Instale Node e Bower no seu computador
 1. Instale o  [NodeJS](https://nodejs.org/en/)
 2. Após, instale o bower com `npm install bower -g`

### Verificar se há o bower.json no site
Se não haver o arquivo `bower.json`  na raiz do site:
```shell
bower init
```
Siga os passos e seja feliz.

### Instale o plugin de Free Search

 1. Rode `bower install virtualgaia.plugin.search -D`
 2. Adicione no `head` os arquivos  após todos os .js
	 - `bower_components\angular\angular.min.js`
	 - `bower_components\virtualgaia.plugin.search\js\typeahead.bundle.min.js`
	 - `bower_components\virtualgaia.plugin.search\js\free-search.directive.js`
	 - `bower_components\virtualgaia.plugin.search\css\free-search.css`
 3. No arquivo `inc_busca.aspx` (ou o arquivo de busca do modelo) substitua o trecho da busca rápida por:
	```C#
objBuscaRapida.template += "[pretensao]" + Environment.NewLine;
objBuscaRapida.template += "[tipo]" + Environment.NewLine;
objBuscaRapida.template += "<dl class='searchfree'><input type='text' agency-id='123' class='form-control' placeholder='Digite um bairro ou cidade' free-search /></dl>" + Environment.NewLine;

	```
 4. **Atenção**: não se esquecer de trocar a atributo `agency-id` pelo ID da imobiliária. Se for uma rede imobiliária, substituir pelo atributo `network-id`

 5. Substituir na tag `<html>` por `<html lang="pt-br" ng-app="virtualgaia">`.

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

#### Verifcar layout

Verifique se o layout da busca está ok, caso contrário efetuar os ajustes necessários.


# Manutenção

Para dar manutenção no plugin, não se esqueça de colocar a nova versão para atualizar no bower:

```javascript
 "name": "virtualgaia.plugin.search",
  "version": "0.0.2",
  "authors": ...
```

E depois rodar:

 ```shell
# tag the commit
git tag -a v0.0.2 -m "Release version 0.0.2"

# push to GitHub
git push origin master --tags
 ```