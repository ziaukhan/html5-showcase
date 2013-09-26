/**
 * Created with JetBrains WebStorm.
 * User: zeeshan
 * Date: 9/13/13
 * Time: 5:17 PM
 * To change this template use File | Settings | File Templates.
 */

exports = module.exports = function(app, mongoose) {
    //general sub docs
    require('./schema/User')(app, mongoose);
    //require('./schema/Note')(app, mongoose);
}