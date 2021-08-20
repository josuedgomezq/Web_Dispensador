//Proyecto.js y su index estan enlazados
var provider = new firebase.auth.GoogleAuthProvider();

google.charts.load('current', {'packages':['gauge']});
google.charts.setOnLoadCallback(drawChartHum);
google.charts.load('current', {'packages':['table']});
google.charts.setOnLoadCallback(drawTable);
google.charts.load('current', {'packages':['table']});
google.charts.setOnLoadCallback(drawTable1);

//Esto es una referencia a su base de datos en tiempo real
var refHum = firebase.database().ref('Nodemcu/Distancia');
var hum = 0;
//Cuando el valor de la referencia cambia dispara el metodo .on('value')
refHum.on('value', function(snapshot) {
	//snapshot es el objeto que esta en la base ya actualizado
    //snapshot.val() tiene el value;
	//Se guarda en una variable apara que el reloj la pueda mostrar
    hum= snapshot.val()*100; //envia un link y no el valor 
    
});

var refClientesRegistrados = firebase.database().ref('Nodemcu/ClientesRegistrados');
refClientesRegistrados.on('value', function(snapshot) {
	//usted usa el mismo nombre de id que le dio al div o spawn como variable,
	//no necesita declararlo en este script sino en el index
    id_var_clientes_registrados= snapshot.val();
    drawTable(id_var_clientes_registrados,id_var_envases_reutilizados,id_var_litros_vendidos); 


});

var refCantidadDeEmbasesReutilizados = firebase.database().ref('Nodemcu/CantidadDeEmbasesReutilizados');
refCantidadDeEmbasesReutilizados.on('value', function(snapshot) {
    id_var_envases_reutilizados= snapshot.val();
    drawTable(id_var_clientes_registrados,id_var_envases_reutilizados,id_var_litros_vendidos,id_var_presentacion_mas_vendida,id_porcentaje_reutilizacion,id_var_tienda_poco_inventario); 
      
});


var refLitrosVendidos = firebase.database().ref('Nodemcu/Litros_Vendidos');
refLitrosVendidos.on('value', function(snapshot) {
    id_var_litros_vendidos= snapshot.val();
    drawTable(id_var_clientes_registrados,id_var_envases_reutilizados,id_var_litros_vendidos,id_var_presentacion_mas_vendida,id_porcentaje_reutilizacion,id_var_tienda_poco_inventario);
});

var refPresentacionqueMasSeVendio = firebase.database().ref('Nodemcu/PresentacionqueMasSeVendio');
refPresentacionqueMasSeVendio.on('value', function(snapshot) {
    id_var_presentacion_mas_vendida= snapshot.val();
    drawTable(id_var_clientes_registrados,id_var_envases_reutilizados,id_var_litros_vendidos,id_var_presentacion_mas_vendida,id_porcentaje_reutilizacion,id_var_tienda_poco_inventario);
});

var refTiendasAsociadas = firebase.database().ref('Nodemcu/TiendasAsociadas');
refTiendasAsociadas.on('value', function(snapshot) {
    id_var_tiendasAsociadas= snapshot.val();
	var total = snapshot.val().split(',');
    
});

var refPorcentajeReutilizacion = firebase.database().ref('Nodemcu/PorcentajeDeClientesQueReutilizanEmvases');
refPorcentajeReutilizacion.on('value', function(snapshot) {
    id_porcentaje_reutilizacion= snapshot.val();
	drawTable(id_var_clientes_registrados,id_var_envases_reutilizados,id_var_litros_vendidos,id_var_presentacion_mas_vendida,id_porcentaje_reutilizacion,id_var_tienda_poco_inventario);
    
});

var refTiendaAsociadaPocoInventario = firebase.database().ref('Nodemcu/TiendaAsociadaPocoInventario');
refTiendaAsociadaPocoInventario.on('value', function(snapshot) {
    id_var_tienda_poco_inventario= snapshot.val();
    drawTable(id_var_clientes_registrados,id_var_envases_reutilizados,id_var_litros_vendidos,id_var_presentacion_mas_vendida,id_porcentaje_reutilizacion,id_var_tienda_poco_inventario);
});

function drawChartHum() {

  var dataHum = google.visualization.arrayToDataTable([
    ['Label', 'Value'],
    ['Nivel', 0]
    ]);

  var optionsHum = {
      width: 270, height: 270,
      redFrom: 0, redTo: 33,
      yellowFrom: 33, yellowTo: 66,
      greenFrom: 66, greenTo: 100,
      majorTicks: ['0','5','10','15','20','25','30','35','40','45', '50'],
      minorTicks: 10
          };
      var formatterHum = new google.visualization.NumberFormat({
      suffix: 'L',
      fractionDigits: 1
      });
      formatterHum.format(dataHum, 1);

  var chartHum = new google.visualization.Gauge(document.getElementById("chart_Hum"));

  chartHum.draw(dataHum, optionsHum,formatterHum);

  setInterval(function() {
    dataHum.setValue(0, 1,hum);
    formatterHum.format(dataHum, 1);
    chartHum.draw(dataHum, optionsHum);
  }, 300);

}   

function drawTable1() {
       
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Informacion general');
        data.addColumn('number', 'Valores');
        
        data.addRows([
          ['Tienda asociadas',  {v: 1}],
          ['Dispensadores',  {v: 2}],
          

        

        ]);

        var table = new google.visualization.Table(document.getElementById('tabla_tiendas'));

        table.draw(data, {showRowNumber: true, width: '100%', height: '100%'});
      }     


function drawTable(cr,er,lv,pv,pr,pi) {
       
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Abasto "El Cafetal"');
        data.addColumn('number', 'Valores');
        
        data.addRows([
          ['Clientes registrados',  {v: cr}],
          ['Cantidad de envases reutilizados',  {v: er}], // con la variable x me muestra la tabla solo
          ['Porcentaje de clientes que reutilizaron envases',  {v: pr}],
          ['Presentacion que mas se vendio',  {v: pv}],
          ['Litros comprados por la tienda',  {v: 50}],
          ['Inventario actual en (L)',  {v: pi}],
          ['Litros de producto vendido',  {v: lv}]
                    

        ]);

        var table = new google.visualization.Table(document.getElementById('table_div'));

        table.draw(data, {showRowNumber: true, width: '100%', height: '100%'});
      }     



$('#login').click(function() {
  firebase.auth()
  .signInWithPopup(provider)
  .then(function(result) {
    console.log(result.user);
    guardaDatos(result.user);
    $('#login').hide();
    $('#root').append("<img width='100px' src='"+result.user.photoURL+"'/>");
  });

});


//Esta función guarda automaticamente
function guardaDatos(user){
var usuario={
  uid:user.uid,
  nombre:user.displayName,
  email:user.email,
  foto:user.photoURL
}
  firebase.database().ref("Diploma/" +user.uid)
  .set(usuario)
}

//Leyendo la BD
firebase.database().ref("Diploma")
.on("child_added", function (s) {
var user = s.val();
$('#root').append("<img width='100px' src='"+user.foto+"'/>");
})
