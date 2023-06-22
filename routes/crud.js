const auth = require('./auth');
var mysql = require('mysql');

let __DATA__SCHEMA__ = 'techlympic';

let API = {
    quiz:{
        questions(fn){
            var con = mysql.createConnection(auth.auth()[__DATA__SCHEMA__]);
            try {
                con.query(`
                select * from quiz_collections
              `, function (err, result) {
                    if (err) {
                        console.log('but with some error: ',err);
                    } else {
                        console.log('... with some data: ',result);
                        con.end();
                        
                        fn(result);
                    }
                });
            } catch (e) {
                console.log(e);
            }
        }
    }
}

module.exports = API;

