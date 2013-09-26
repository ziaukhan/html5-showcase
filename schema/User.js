/**
 * Created with JetBrains WebStorm.
 * User: zeeshan
 * Date: 9/13/13
 * Time: 5:18 PM
 * To change this template use File | Settings | File Templates.
 */


exports = module.exports = function(app, mongoose) {
    var userSchema = new mongoose.Schema({
        username: { type: String, unique: true },
        password: String,
        email: String,
        isActive: Boolean,
        /*
        roles: {
            admin: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
            account: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' }
        },
        */
    });

    // Custom instance function to be added in schema
    /*
    userSchema.methods.newUser = function() {
        // TODO: new a field for denoting if user has completed profile
        return !this.profileCompleted;
    };

     // Custom static function to be added in schema
    userSchema.statics.encryptPassword = function(password) {
        return require('crypto').createHmac('sha512', app.get('crypto-key')).update(password).digest('hex');
    };
    */

    //userSchema.index({ username: 1 }, {unique: true});
    //userSchema.index({ email: 1 });
    //userSchema.set('autoIndex', (app.get('env') == 'development'));

    app.db.model('User', userSchema);
}