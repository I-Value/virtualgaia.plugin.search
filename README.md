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

 1. Rode `bower install vg-free-search -D`
 2. Adicione no `head` os arquivos  após todos os .js 
	 - `bower_components\angular\angular.min.js` 
	 - `bower_components\vg-free-search\js\typeahead.bundle.min.js` 
	 - `bower_components\vg-free-search\js\free-search.directive.js` 
	 - `bower_components\vg-free-search\css\free-search.css` 
 3. No arquivo `inc_busca.aspx` (ou o arquivo de busca do modelo) substitua o trecho da busca rápida por:
	```C#
objBuscaRapida.template += "[pretensao]" + Environment.NewLine;         
objBuscaRapida.template += "[tipo]" + Environment.NewLine;                      
objBuscaRapida.template += "<dl class='searchfree'><input type='text' class='form-control' placeholder='Digite um bairro ou cidade' free-search /></dl>" + Environment.NewLine;

	```
