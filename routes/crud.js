const auth = require('./auth');
var mysql = require('mysql');

let __DATA__SCHEMA__ = 'techlympic';

let API = {
    quiz:{
        questions(fn){
            var con = mysql.createConnection(auth.auth()[__DATA__SCHEMA__]);
            try {
                con.query(`
                select * from quiz_collections order by isarchive,updatedate desc limit 20
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
        },
        questionsSet(series, fn){
            if(series.length===0)
                series='0';
                
            console.log(series);
            var con = mysql.createConnection(auth.auth()[__DATA__SCHEMA__]);
            try {
                con.query(`
                select * from quiz_collections where qid in(${series})
              `, series.split(','), function (err, result) {
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
        },
        themes(fn){
            var con = mysql.createConnection(auth.auth()[__DATA__SCHEMA__]);
            try {
                con.query(`
                select * from quiz_themes order by theme
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
        },
        subthemes(theme, fn){
            var con = mysql.createConnection(auth.auth()[__DATA__SCHEMA__]);
            try {
                con.query(`
                select * from quiz_subthemes where theme = ? order by sub_theme
              `, theme, function (err, result) {
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
        },
        search(t,st,sr,fn){
            console.log(t,st,sr);
            var con = mysql.createConnection(auth.auth()[__DATA__SCHEMA__]);
            try {
                con.query(`
                select * from quiz_collections 
                where theme regexp ? and sub_theme regexp ? and (lcase(question) regexp lcase(?) || lcase(tags) regexp lcase(?)) order by isarchive,updatedate desc limit 100
              `, [t,st,sr,sr],function (err, result) {
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
        },
        delete(id,fn){
            var con = mysql.createConnection(auth.auth()[__DATA__SCHEMA__]);
            try {
                con.query(`
                update quiz_collections 
                set isarchive = 1
                where qid = ? 
              `, id,function (err, result) {
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
        },
        revive(id,fn){
            console.log(t,st,sr);
            var con = mysql.createConnection(auth.auth()[__DATA__SCHEMA__]);
            try {
                con.query(`
                update quiz_collections 
                set isarchive = 0
                where qid = ? 
              `, id,function (err, result) {
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
        },
        addQuestion(data, fn){
            var con = mysql.createConnection(auth.auth()[__DATA__SCHEMA__]);
            try {
                con.query(`
                insert into quiz_collections(qtype,theme, sub_theme, question, objective_options, correct_answer, tags) 
                values(?,?,?,?,?,?,?)
              `, data, function (err, result) {
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
        },
        quizset:{
            list(fn){
                var con = mysql.createConnection(auth.auth()[__DATA__SCHEMA__]);
                try {
                    con.query(`
                    select * from quiz_sets order by updatedate
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
            },
            createNew(title,fn){
                var con = mysql.createConnection(auth.auth()[__DATA__SCHEMA__]);
                try {
                    con.query(`
                    insert into quiz_sets(title) values(?)
                `, title,function (err, result) {
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
            },
            updateSet(data,fn){
                var con = mysql.createConnection(auth.auth()[__DATA__SCHEMA__]);
                try {
                    con.query(`
                    update quiz_sets
                    set 
                    title = ?,
                    target_group = ?,
                    instructions = ?,
                    questions = ?
                    where id = ?
                `, data,function (err, result) {
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
            },
            publishSet(data,fn){
                var con = mysql.createConnection(auth.auth()[__DATA__SCHEMA__]);
                try {
                    console.log('data publishSet: ', data);
                    con.query(`
                    update quiz_sets
                    set 
                        ispublished = 1,
                        publish_type = ?,
                        repeatable = ?,
                        datepublish = ?,
                        datepublish_end = ?
                    where id = ?
                `, data,function (err, result) {
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
            },
        }
    }
}

module.exports = API;

