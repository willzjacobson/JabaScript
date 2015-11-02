// Require our models -- these should register the model into mongoose
// so the rest of the application can simply call mongoose.model('User')
// anywhere the User model needs to be used.
require('./models.user');
require('./models.product');
require('./models.order');
require('./models.review');
