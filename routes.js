/**
 * Created with JetBrains WebStorm.
 * User: zeeshan
 * Date: 9/13/13
 * Time: 4:57 PM
 * To change this template use File | Settings | File Templates.
 */


exports = module.exports = function(app, passport) {

    app.get('/', require('./views/main').index);

    app.post('/user/:username', require('./views/user').addUser);
    //app.get('/', require('./views/index').init);

    app.get('/test', function(req, res){
        res.render('../../test/e2e/runner.html')
    })

};
