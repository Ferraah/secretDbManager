

function generateTestIngressi(lists){

  var rows = [];

  lists.forEach(list => {
    rows.push(
      {
        idLista: list.idLista,
        uomini: 0,
        donne: 0
      }

    )
  });

  return rows;
}

function convertEntriesToClientFormat(objs){

  var newObjs = [];
  
  objs.forEach(tmp => {

    newObjs.push(
      {
        idLista: tmp.fk_idLista,
        uomini: tmp.Uomini,
        donne: tmp.Donne
      }
    )
  });

  return newObjs;
}

module.exports = { generateTestIngressi, convertEntriesToClientFormat };