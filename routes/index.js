var express = require('express');
var router = express.Router();
var db=require('../models/conexion');

//Modulo para cargar archivo
var fileUpload =require('express-fileupload');
router.use(fileUpload());

//////////////////////////////////////////Parte pública///////////////////////////////////////////////////////////

/* GET home page. */
router.get('/', function(req, res, next) {
var Total =0;
var Contador =0;
var UserID = 0;
if(req.session.UserID != null){
  UserID =req.session.UserID;
}
if(req.session.Carrito != null && req.session.Carrito.length>0){
  var exite = false;
  for(var i =0; i< req.session.Carrito.length; i++){
    Total = Total + parseFloat( req.session.Carrito[i].Precio);
    Contador++;
  }
}
db.query("SELECT * from Manuales ORDER by ManualID desc LIMIT 4",function(err,results){
  
  res.render('index', { title: 'Express', Contador: Contador, Total : Total, UserID :UserID, productos : results });

});
});

router.get('/close', function(req, res, next) {
  req.session.destroy();
  
    //req.session.destroy();
    res.redirect('/');
  });

router.get('/acercade', function(req, res, next) {
  var Total =0;
  var Contador =0;
  var UserID = 0;
if(req.session.UserID != null){
  UserID =req.session.UserID;
}
  if(req.session.Carrito != null && req.session.Carrito.length>0){
    var exite = false;
    for(var i =0; i< req.session.Carrito.length; i++){
      Total = Total + parseFloat( req.session.Carrito[i].Precio);
      Contador++;
    }
  }
  res.render('acerca', { title: 'Express', Total:Total, Contador: Contador , UserID :UserID });
});

router.get('/checkout', function(req, res, next) {
  var carrito = [];
  var total =0;
  var nombre ="";
  count =0;
  var UserID = 0;
if(req.session.UserID != null){
  UserID =req.session.UserID;
}
  if(req.session.Carrito != null && req.session.Carrito.length>0){
    carrito= req.session.Carrito;
    for(var i =0; i< req.session.Carrito.length;i++){
      total =total + parseFloat(req.session.Carrito[i].Precio);
      nombre = nombre +"; "+req.session.Carrito[i].Nombre;
      count ++; 
    }
  }
  res.render('detaille', { title: 'Express', carrito : carrito, total : total, nombre:nombre, Contador:count, Total: total , UserID :UserID });
});
router.post('/comentar', function(req, res, next) {
  //Datos de mysql desde la tabla books
  var Total =0;
var Contador =0;
var UserID = 0;
if(req.session.UserID != null){
  UserID =req.session.UserID;
}
if(req.session.Carrito != null && req.session.Carrito.length>0){
  var exite = false;
  for(var i =0; i< req.session.Carrito.length; i++){
    Total = Total + parseFloat( req.session.Carrito[i].Precio);
    Contador++;
  }
}
  console.log(req.body);
if(req.session.UserID!= null)
{
  var Comentario ={
    ManualID: req.body.ManualID,
    Comentario: req.body.comentario,
    UsuarioID: req.session.UserID,
  };

  db.query("INSERT INTO Comentarios SET ?",Comentario,function(err,results){
    res.redirect('/preview/' + Comentario.ManualID);
  });
}else{
  res.redirect('account');
}
});
router.post('/registro', function(req, res, next) {
  var Total =0;
var Contador =0;
var UserID = 0;
if(req.session.UserID != null){
  UserID =req.session.UserID;
}
if(req.session.Carrito != null && req.session.Carrito.length>0){
  var exite = false;
  for(var i =0; i< req.session.Carrito.length; i++){
    Total = Total + parseFloat( req.session.Carrito[i].Precio);
    Contador++;
  }
}
if(req.session.UserID== null)
{
  console.log(req.body);

  var user ={
    Nombre: req.body.Nombre,
    ApellidoPaterno: req.body.ApellidoPaterno,
    ApellidoMaterno: req.body.ApellidoMaterno,
    Email: req.body.Email,
    RolID: 1,
    Password: req.body.password
  };

  db.query("INSERT INTO Usuarios SET ?",user,function(err,results){
    res.render('login', { title: 'express', Contador: Contador, Total:Total, UserID :UserID  });
  });
}else{
  res.render('index', { title: 'express', Contador:Contador, Total:Total, UserID :UserID  });
}
});
router.post('/carrito' , function(req,res,next){
  var UserID = 0;
if(req.session.UserID != null){
  UserID =req.session.UserID;
}
  var objCarrito = {
    'ManualID' : req.body.ManualID,
    'Precio' : req.body.Precio,
    'Nombre' : req.body.Nombre,
    'Autor' : req.body.Autor,
    'URL' : req.body.URL,
}
  if(req.session.Carrito != null && req.session.Carrito.length>0){
    var exite = false;
    for(var i =0; i< req.session.Carrito.length; i++){
      if(req.session.Carrito[i].ManualID == objCarrito.ManualID){
        exite = true;
        break;
      }
    }
    if(exite == false){
      req.session.Carrito.push(objCarrito);
    }
  }
  else{
    var carrito=[];
    carrito.push(objCarrito);
    req.session.Carrito = carrito;
  }
  console.log("El carrito es : " + req.session.Carrito);
  res.redirect('/productos');
});

router.get('/eliminarcarrito/:id', function(req, res, next) {
  console.log(req.session.Carrito);
  for(var i =0; i< req.session.Carrito.length; i++){

    if(req.session.Carrito[i].ManualID == req.params.id){
      req.session.Carrito.splice(i, 1);
      req.session.Carrito = req.session.Carrito;
      break;
    }
  }
    var carrito = [];
    var total =0;
    var nombre ="";
    count =0;
    var UserID = 0;
  if(req.session.UserID != null){
    UserID =req.session.UserID;
  }
    if(req.session.Carrito != null && req.session.Carrito.length>0){
      carrito= req.session.Carrito;
      for(var i =0; i< req.session.Carrito.length;i++){
        total =total + parseFloat(req.session.Carrito[i].Precio);
        nombre = nombre +"; "+req.session.Carrito[i].Nombre;
        count ++; 
      }
    }
  
    res.render('detaille', { title: 'Express', carrito : carrito, total : total, nombre:nombre, Contador:count, Total: total , UserID :UserID });

    
  

});
router.post('/logueo', function(req, res, next) {
  //Datos de mysql desde la tabla books
  var Total =0;
var Contador =0;
var UserID = 0;
if(req.session.UserID != null){
  UserID =req.session.UserID;
}
if(req.session.Carrito != null && req.session.Carrito.length>0){
  var exite = false;
  for(var i =0; i< req.session.Carrito.length; i++){
    Total = Total + parseFloat( req.session.Carrito[i].Precio);
    Contador++;
  }
}
  var loguin ={
    Email: req.body.Email,
    password: req.body.password,
  };

  db.query("select * from Usuarios where Email='" + loguin.Email+"' and Password ='"+ loguin.password+"'",function(err,results){
    console.log(results);
    if(results!= undefined && results.length>0){
      req.session.UserID = results[0].UsuarioID ;
      UserID = results[0].UsuarioID;
      res.redirect('/');
   }
   else{
    res.render('login', { title: 'Express', error: "usuario y/o contraseña incorrectos", Contador:Contador, Total:Total, UserID :UserID  });
  }
  });

});
router.get('/register', function(req, res, next) {
  var Total =0;
  var Contador =0;
  var UserID = 0;
if(req.session.UserID != null){
  UserID =req.session.UserID;
}
  if(req.session.Carrito != null && req.session.Carrito.length>0){
    var exite = false;
    for(var i =0; i< req.session.Carrito.length; i++){
      Total = Total + parseFloat( req.session.Carrito[i].Precio);
      Contador++;
    }
  }
  res.render('registro', { title: 'Express', Total: Total, Contador: Contador, UserID :UserID  });
});
router.get('/account', function(req, res, next) {
  var Total =0;
  var Contador =0;
  var UserID = 0;
  if(req.session.Carrito != null && req.session.Carrito.length>0){
    var exite = false;
    
    for(var i =0; i< req.session.Carrito.length; i++){
      Total = Total + parseFloat( req.session.Carrito[i].Precio);
      Contador++;
    }
  }
  if(req.session.UserID!=null){
    UserID = req.session.UserID;
  }
  res.render('login', { title: 'Express', Total:Total, Contador:Contador, UserID : UserID });
});
router.get('/perfil', function(req, res, next) {
  var Total =0;
  var Contador =0;
  var UserID = 0;
  if(req.session.Carrito != null && req.session.Carrito.length>0){
    var exite = false;
    
    for(var i =0; i< req.session.Carrito.length; i++){
      Total = Total + parseFloat( req.session.Carrito[i].Precio);
      Contador++;
    }
  }
  if(req.session.UserID!=null){
    UserID = req.session.UserID;
    db.query("SELECT DISTINCT Manuales.ManualURL, Manuales.Nombre FROM Manuales INNER JOIN CompraDetalle ON Manuales.ManualID = CompraDetalle.Producto "+ 
    "INNER JOIN Compra ON Compra.CompraID = CompraDetalle.CompraID WHERE Compra.UsuarioID = " + UserID, function(err, results){
      console.log(results);
        res.render('perfil', { title: 'perfil', books: results,Total:Total, Contador:Contador, UserID :UserID, productos: results });
      });
    }
  else{
    res.redirect('/');
  }
});

router.get('/gracias/:id', function(req, res, next) {
  var Total =0;
  var Contador =0;
  var UserID = 0;
if(req.session.UserID != null){
  UserID =req.session.UserID;
}
var id = req.params.id;
if( id == req.session.Carrito.length){
  var objCompra = {'UsuarioID': req.session.UserID, 'Fecha': new Date()};
  req.session.UserID;
  if(req.session.Carrito!= null && req.session.Carrito.length>0){
    db.query("INSERT INTO Compra SET ?",objCompra,function(err,resulta){

    });
    for(var i =0; i< req.session.Carrito.length; i++){
      var id = parseInt(req.session.Carrito[i].ManualID);
      var query =" Update Manuales set Ventas = Ventas+1, Estatus = 0 where ManualID  = "+ id ;
      var query2= "INSERT INTO CompraDetalle SET ? ";
      db.query(query, function(err, results){
        console.log(results);   
      }); 
      db.query("SELECT * FROM Compra ORDER BY CompraID DESC LIMIT 1 ", function(err, results){
        var objCompraDetalle = {'Producto': id, 'Cantidad': 1, 'CompraID': results[0].CompraID};

        db.query(query2,objCompraDetalle, function(err, resultadito){

        });  
      }); 

     }
     var devolver = req.session.Carrito;
     req.session.Carrito = [];

     res.render('gracias', { title: 'Gracias',Total:Total, Contador:Contador, UserID :UserID, productos:devolver  });
 
  }
}
else{
  res.redirect("/");
}
});

router.get('/productos', function(req, res, next) {
  var Total =0;
  var Contador =0;
  var UserID = 0;
if(req.session.UserID != null){
  UserID =req.session.UserID;
}
  if(req.session.Carrito != null && req.session.Carrito.length>0){
    var exite = false;
    for(var i =0; i< req.session.Carrito.length; i++){
      Total = Total + parseFloat( req.session.Carrito[i].Precio);
      Contador++;
    }
  }
  db.query("SELECT * FROM Manuales where Estatus =1", function(err, results){
    console.log(results);
      res.render('productos', { title: 'Productos', books: results,Total:Total, Contador:Contador, UserID :UserID });
    });

});
router.get('/preview/:id', function(req, res, next) {
  var Total =0;
var Contador =0;
var UserID = 0;
if(req.session.UserID != null){
  UserID =req.session.UserID;
}
if(req.session.Carrito != null && req.session.Carrito.length>0){
  var exite = false;
  for(var i =0; i< req.session.Carrito.length; i++){
    Total = Total + parseFloat( req.session.Carrito[i].Precio);
    Contador++;
  }
}
  var id = req.params.id;
  db.query("SELECT * FROM Manuales where ManualID = "+ id , function(err, results){
    console.log(results);
    db.query("SELECT * FROM Comentarios inner join Usuarios on Comentarios.UsuarioID = Usuarios.UsuarioId where ManualID = " +id, function(err, result){
      console.log(result);
      res.render('preview', { title: 'Express', dato : results, comentarios : result, count : result.length , Contador: Contador, Total:Total, UserID :UserID  });
    });
  });
});

router.get('/contacto', function(req, res, next) {
  var Total =0;
  var Contador =0;
  var UserID = 0;
if(req.session.UserID != null){
  UserID =req.session.UserID;
}
  if(req.session.Carrito != null && req.session.Carrito.length>0){
    var exite = false;
    for(var i =0; i< req.session.Carrito.length; i++){
      Total = Total + parseFloat( req.session.Carrito[i].Precio);
      Contador++;
    }
  }
  //req.session.name=1;
  //Datos de mysql desde la tabla books
    res.render('contacto', { title: 'Sugerencia', Total: Total, Contador: Contador, UserID :UserID });
});

////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////Parte Privada/////////////////////////////////////////////

router.get('/panel', function(req, res, next) {
  if(req.session.Usuario == 1){
  res.render('index_p', { title: 'Express' });
  }
  else{
  res.render('Login/Login', { title: '' });    
  }
});

router.get('/Producto/confirmacion', function(req, res, next) {
  if(req.session.Usuario == 1){
  res.render('Producto/confirmacion', { title: '' });
  }
  else{
  res.render('Login/Login', { title: '' });    
  }
});

router.get('/closesesion', function(req, res, next) {
  req.session.destroy();
  res.render('Login/Login', { title: '' });
});
router.get('/Login/Login', function(req, res, next) {
  if(req.session.Usuario == 1){
  res.render('index_p', { title: '' });    
  }
  else{
    res.render('Login/Login', { title: '' });

  }
});
router.post('/Login/Login', function(req, res, next) {
  var query = "select * from Usuarios where "
  if(req.body.Email)
  { query+= "Email =" + "'"+req.body.Email + "'" +" AND " }
  if(req.body.Password)
  { query+= "Password =" + "'"+req.body.Password + "'" }
  console.log(query);
  db.query(query +" and RolID=2", function(err,results){
    if(results == null || results.length<=0 || !results.length>1)
    { 
    console.log(results.length);
    res.render('Login/Login', { title: 'No se pudo acceder' });            
    }
    else{
      req.session.Usuario= 1;
      res.render('index_p', { title : '' });  
    }
  });
});

//busqueda compra

router.post('/Producto/BuscarCompra', function(req, res, next) {
  if(req.session.Usuario == 1){

if(req.body.Fechainicio && req.body.Fechafin){
  console.log(req.body.Fechainicio);
  console.log(req.body.Fechafin);
  var Fechainicio = req.body.Fechainicio;
  var Fechafin = req.body.Fechafin;
  var query = "select * from Compra WHERE Fecha BETWEEN "+"'"+Fechainicio+"'"+" AND " +"'"+Fechafin+"'";
  db.query(query, function(err,results){
    res.render('Producto/compra', { title: '', Compra:results });
  });
} 
else{
  var query = "SELECT c.CompraID, us.Nombre, c.Fecha FROM Compra as c INNER JOIN Usuarios AS us on us.UsuarioID = c.UsuarioID"
  db.query(query, function(err,results){
   
    res.render('Producto/compra', { title: '', Compra:results });
  });
}
  }
  else{
  res.render('Login/Login', { title: '' });    
  }
  });

//clientes que han comprado
router.get('/Producto/compra', function(req, res, next) {
  if(req.session.Usuario == 1){
    console.log("HOLA");
  var query = "SELECT c.CompraID, us.Nombre, c.Fecha FROM Compra as c INNER JOIN Usuarios AS us on us.UsuarioID = c.UsuarioID"
    db.query(query, function(err,results){
      console.log(query);
      res.render('Producto/compra', { title: '', Compra:results });
    });
  }
  else{
  res.render('Login/Login', { title: '' });    
  }
  });
  router.get('/Producto/detalle/(:CompraID)', function(req, res, next) {
    console.log(req.params.CompraID);
    if(req.session.Usuario == 1){
    var query = "SELECT c.CompraDetalleID, m.Nombre, c.Cantidad "+
    "FROM CompraDetalle as c INNER JOIN Manuales AS m on m.ManualID = c.Producto where c.CompraID = "+req.params.CompraID;
    
      db.query(query, function(err,results){
        console.log(results);
        res.render('Producto/detalle', { title: '', CompraDetalle:results });
      });
    }
    else{
    res.render('Login/Login', { title: '' });    
    }
    });
  

router.get('/Producto/index', function(req, res, next) {
  if(req.session.Usuario == 1){
    db.query("select * from Manuales", function(err,results){
      //console.log(results);
      res.render('Producto/index', { title: '', Manuales:results });
    });
  }
  else{
  res.render('Login/Login', { title: '' });    
  }
  });
//post busqueda
  router.post('/Producto/Buscar', function(req, res, next) {
    if(req.session.Usuario == 1){
      var query = "select * from Manuales WHERE Nombre Like "
    console.log(req.body.busqueda); 
  if(req.body.busqueda){
     query += "'%" + req.body.busqueda +"%'"+" OR "+
     "Autor Like "+"'%" + req.body.busqueda +"%'"+" OR "+
     "Tecnologia Like "+"'%" + req.body.busqueda +"%'";
  } 
  else{
    db.query("select * from Manuales", function(err,results){
      //console.log(results);
      res.render('Producto/index', { title: '', Manuales:results });
    });
  }
  console.log(query);
      db.query(query, function(err,results){
        //console.log(results);
        res.render('Producto/index', { title: '', Manuales:results });
      });
    }
    else{
    res.render('Login/Login', { title: '' });    
    }
    });
//get create producto
router.get('/Producto/create', function(req, res, next) {
  if(req.session.Usuario == 1){
  res.render('Producto/create', { title: ''});
  }
  else{
    res.render('Login/Login', { title: '' });    
    }

});

  //post producto
router.post('/Producto/create', function(req, res, next) {
 if(req.session.Usuario == 1){    
  var query = "insert Manuales set ";

  if(req.body.Nombre)
  { query+= "Nombre =" + "'"+req.body.Nombre + "'" +"," }
  if(req.body.Descripcion)
  { query+= "Descripcion =" +"'"+req.body.Descripcion +"'"+ "," }
  if(req.body.Autor)
  { query+= "Autor ="+"'" +req.body.Autor +"'"+ "," }
  if(req.body.Tecnologia)
  { query+= "Tecnologia ="+"'" +req.body.Tecnologia +"'"+ "," }
  if(req.body.Precio)
  { query+= "Precio ="+"'" +req.body.Precio +"'"+ "," }
/*  if(req.body.Estatus)
  { */query+= "Estatus ="+"1"+ "," //}
  if(req.files.archivo)
  { 
    console.log("hay foto");
    if (req.files){
      let archivoSubir = req.files.archivo;
      archivoSubir.mv('public/images/'+req.files.archivo.name, function(err){
        if(err)
        return res.status(500).send(err);
      });
    }
    query+= "Imagen =" +"'"+ req.files.archivo.name+"'"+"," ; 
  }
  if(req.files.archivopdf)
  { 
    if (req.files){
      let archivopdfSubir = req.files.archivopdf;
      archivopdfSubir.mv('public/pdf/'+req.files.archivopdf.name, function(err){
        if(err)
        return res.status(500).send(err);
      });
    }
    query+= "ManualURL =" +"'/pdf/"+ req.files.archivopdf.name+"'"+"," ; 
  }
  query= query.substring(0, query.length-1);
  console.log(query);
  db.query(query, function(err, results){
    res.render('Producto/confirmacion', { title: ''});      
  }); 

}
else{
res.render('Login/Login', { title: '' });    
}
});


router.get('/Producto/edit/(:ManualID)', function(req, res, next) {
  db.query("select * from Manuales where ManualID=" +req.params.ManualID, function(err,results, fields){
    if (results.length<=0){
      req.flash('error','No se ha encontrado ese producto')
      res.redirect('/Producto/index', { title: '', Manuales:results })
    }
    else{
      res.render('Producto/edit',{
        title: 'editar',
        ManualID: results[0].ManualID,
        Nombre: results[0].Nombre,
        Descripcion: results[0].Descripcion,
        Autor: results[0].Autor,
        Tecnologia: results[0].Tecnologia,
        Precio: results[0].Precio,
        Estatus:results[0].Estatus
      })
      console.log(results);
    }
  //res.render('Empleado/edit/(:id)', { title: 'Empleado'});
});
});

router.post('/Producto/edit/(:ManualID)', function(req, res, next) {

  var query = "update Manuales set ";

  if(req.body.Nombre)
  { query+= "Nombre =" + "'"+req.body.Nombre + "'" +"," }
  if(req.body.Descripcion)
  { query+= "Descripcion =" +"'"+req.body.Descripcion +"'"+ "," }
  if(req.body.Autor)
  { query+= "Autor ="+"'" +req.body.Autor +"'"+ "," }
  if(req.body.Tecnologia)
  { query+= "Tecnologia ="+"'" +req.body.Tecnologia +"'"+ "," }
  if(req.body.Precio)
  { query+= "Precio ="+"'" +req.body.Precio +"'"+ "," }
  if(req.body.Estatus)
  { query+= "Estatus ="+"'" +req.body.Estatus +"'"+ "," }
  if(req.files.archivo)
  { 
    console.log("hay foto");
    if (req.files){
      let archivoSubir = req.files.archivo;
      archivoSubir.mv('public/images/'+req.files.archivo.name, function(err){
        if(err)
        return res.status(500).send(err);
      });
    }
    query+= "Imagen =" +"'"+ req.files.archivo.name+"'"+"," ; 
  }
  if(req.files.archivopdf)
  { 
    if (req.files){
      let archivopdfSubir = req.files.archivopdf;
      archivopdfSubir.mv('public/pdf/'+req.files.archivopdf.name, function(err){
        if(err)
        return res.status(500).send(err);
      });
    }
    query+= "ManualURL =" +"'public/pdf/"+ req.files.archivopdf.name+"'"+"," ; 
  }
  query= query.substring(0, query.length-1);
  console.log(query);
  query += " where ManualID =" + req.body.ManualID;
  console.log(query);

  
  db.query(query, function(err, results){
    res.render('Producto/confirmacion', { title: ''});      
  }); 
});

router.post('/Producto/delete/(:ManualID)', function(req, res, next) {
 
  var Manuales = { ManualID: req.params.ManualID }

  db.query("delete from Manuales where ManualID="+req.params.ManualID, Manuales, function(err, results){
    res.render('Producto/confirmacion', {title:''});      
  }); 
 
});








module.exports = router;
