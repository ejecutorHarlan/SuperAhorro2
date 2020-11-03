const express = require('express');
const router = express.Router();
var mysql = require('mysql');

const pool = require('../database');
const { isLoggedin } = require('../lib/auth');

router.get('/add', isLoggedin, (req, res) => {
    res.render('links/add.hbs');
})

router.post('/add', isLoggedin, async (req, res) => {
    const { modelo, marca, patente, anio } = req.body;
    const newlink = {
        modelo,
        marca,
        patente,
        anio,
        user_id: req.user.user_id
    };

    await pool.query('INSERT INTO auto set ?', [newlink])
    req.flash('success', 'Auto agregado correctamente');
    res.redirect('/links');

})

router.get('/', isLoggedin, async (req, res) => {
    const links = await pool.query('SELECT * FROM auto WHERE user_id = ?', [req.user.user_id]);
    console.log(links);
    res.render('links/list', { links });

});

router.get('/delete/:id', isLoggedin, async (req, res) => {
    const { id } = req.params;
    await pool.query('DELETE FROM auto WHERE ID = ?', [id]);
    req.flash('success', 'Auto erased correctly');
    res.redirect('/links');
});

router.get('/edit/:id', isLoggedin, async (req, res) => {
    const { id } = req.params;
    const links = await pool.query('SELECT * FROM auto WHERE id = ?', [id]);
    console.log(links[0]);
    res.render('links/edit', { link: links[0] });
});

router.post('/edit/:id', isLoggedin, async (req, res) => {
    const { id } = req.params;
    const { modelo, marca, patente, anio } = req.body;
    const newLink = {
        modelo,
        marca,
        patente,
        anio
    };
    await pool.query('UPDATE auto set ? Where id = ?', [newLink, id]);
    req.flash('success', 'Auto updated correctly');
    res.redirect('/links');
})



router.get('/turno/:id', isLoggedin, async (req, res) => {
    const { id } = req.params;
    const links = await pool.query('SELECT * FROM auto WHERE id = ?', [id]);
    console.log(links[0]);
    res.render('links/turno', { link: links[0] });
});



router.post('/turno/:id', isLoggedin, async (req, res) => {
    const { id } = req.params;
    const { fecha, hora, id_auto } = req.body;
    const newlink = {
        fecha,
        hora,
        id_auto: id
    };
    console.log(newlink[0]);
    await pool.query('INSERT INTO turno set ?', [newlink])
    req.flash('success', 'Turno agregado correctamente');
    res.redirect('/links');

})









// router.get('/buscar', isLoggedin, async (req, res) => {

//     const dbcoto = {
//         host: 'localhost',
//         user: 'root',
//         password: '',
//         database: 'supercoto'
//     } 

//     const poolcoto = mysql.createPool(dbcoto);
//     poolcoto.getConnection((err, connection) => {
//     if (err) {  
//         if(err.code === 'PROTOCOL_CONNECTION_LOST'){
//             console.error('Database connectios was closed');
//         }
//         if (err.code === 'ER_CON_COUNT_ERROR'){
//             console.error('DATABASE HAS TO MANY CONNECTIONS');
//         }
//         if (err.code === 'ECONNREFUSED'){
//             console.error('DATABASE CONNECTION WAS REFUSED');
//         }
//     }
    
//     if (connection ) connection.release();
//     console.log('DB Coto is connected');
//     const aa = poolcoto.query('SELECT * FROM articulos WHERE nombre = "Unarticulo"');
//     console.log(aa);
//     return;
    
//     })
//     //Promisify Pool Querys
//     /*pool.query = promisify(pool.query);
//     module.exports = pool;*/



//     const { string } = req.body;

//     const links = await poolcoto.query('SELECT * FROM articulos WHERE nombre = ?', [string]);

//    /* var links = {
//       nombre: 'Mayonesa Natura 250Gr',
//       precio: 27
//      }*/
//     console.log(links);
//     res.render('links/buscar', { link: links });
//     poolcoto.end();


// });




router.get('/buscar', isLoggedin, async (req, res) => {

    var con = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'supercoto'
    });
    
   // const string  = "Unarticulo";
    const  strings  = req.params.string;
   
    console.log('sss');
    console.log(strings);
    console.log(req.body);
    console.log('sss');
        
    const links = con.connect(function(err) {
      if (err) throw err;
        con.query('SELECT * FROM articulos WHERE nombre = ?', [ strings ] , function (err, link, fields) {
        if (err) throw err;
        console.log(link);
      });
    });
    
        console.log(links);
        res.render('links/buscar', { link: links });

    
    
    });
/*
    router.get('/edit/:id', async (req, res) => {
        const { id } = req.params;
        const links = await pool.query('SELECT * FROM links WHERE id = ?', [id]);
        console.log(links);
        res.render('links/edit', {link: links[0]});
    });

*/








module.exports = router;