const fs = require('fs');


function recipesJSONToCSV (recipesJSON) {
  var header = 'name;time'
  header += ';input_1_qty;input_1_name;input_2_qty;input_2_name;input_3_qty;input_3_name'
  header += ';output_1_qty;output_1_name;output_2_qty;output_2_name;output_3_qty;output_3_name'
  header += ';facility\n'

  var csv = header

  var recipes = JSON.parse(recipesJSON)
  var lines = recipes.map(function(recipe){
    var line = recipe.name + ';' + recipe.time + ';'
    for(var i=0; i<3; i++){
      line += recipe.input[i] ? recipe.input[i][0] : ''
      line += ';'
      line += recipe.input[i] ? recipe.input[i][1] : ''
      line += ';'
    }
    
    for(var i=0; i<3; i++){
      line += recipe.output[i] ? recipe.output[i][0] : ''
      line += ';'
      line += recipe.output[i] ? recipe.output[i][1] : ''
      line += ';'
    }
    line += recipe.facility
    return line
  })

  csv += lines.join('\n')
  return csv
}

function recipesCSVToJSON(recipesCSV) {
  var lines = recipesCSV.split('\n');

  var result = [];
  var headers=lines[0].split(';');

  for(var i=1;i<lines.length;i++){

    var obj = {};
    var currentline=lines[i].split(';');

    for(var j=0;j<headers.length;j++){
      obj[headers[j]] = currentline[j]
    }

    result.push(obj);
  }

  return JSON.stringify(result.map(function(row){
    var input = []
    var output = []
    for(var i=0; i<3; i++){
      if(row['input_'+i+'_qty'] || row['input_'+i+'_name']){
        input.push([parseFloat(row['input_'+i+'_qty']),row['input_'+i+'_name']])
      }
      if(row['output_'+i+'_qty'] || row['output_'+i+'_name']){
        output.push([parseFloat(row['output_'+i+'_qty']),row['output_'+i+'_name']])
      }
    }

    return { 
      name : row.name, 
      time : parseFloat(row.time), 
      input, 
      output, 
      facility : row.facility
    }
  }))
}



function exportFiles () {
  console.log('Exporting...')
  var recipes = fs.readFileSync('./src/data/recipes.json')
  var contentCSV = recipesJSONToCSV(recipes)
  fs.writeFile('./src/data/recipes.csv', contentCSV, (error, data) => {
    if (error) {
      return console.log(error);
    }
    
    console.log('Recipe.csv file exported successfully');
  })
}

function importFiles () {
  console.log('Importing...')
  var recipes = fs.readFileSync('./src/data/recipes.csv', 'utf-8')
  var contentJSON = recipesCSVToJSON(recipes)
  fs.writeFile('./src/data/recipes.json', contentJSON, (error, data) => {
    if (error) {
      return console.log(error);
    }
    
    console.log('Recipe.csv file imported successfully, recipes.json updated');
  })
}


var myArgs = process.argv.slice(2);
switch(myArgs[0]){
  case 'export':
    exportFiles()
    break;
  case 'import':
    importFiles()
    break;
  default:
    console.log('Usage: npm run data export') 
    console.log('       npm run data import') 
}
