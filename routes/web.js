const homeController=require("../app/http/controllers/homeControllers");
const authController=require("../app/http/controllers/authController");
const cartController=require("../app/http/controllers/customer/cartController");
const menuController=require("../app/http/controllers/menuController");
const orderController=require("../app/http/controllers/customer/orderController");
const adminorderController=require("../app/http/controllers/admin/orderController");
const statusController=require("../app/http/controllers/admin/statusController");
const orderplacedController=require("../app/http/controllers/customer/orderplacedController");
// const paymentController=require("../app/http/controllers/paymentController");

const guest= require('../app/http/middleware/guest');
const auth=require('../app/http/middleware/auth');
const admin=require('../app/http/middleware/admin');

function initRoutes(app)
{   
    app.get('/',homeController().index)

    app.get('/login',guest,authController().login)
    app.post('/login',authController().postLogin)
    
   

    app.get('/register',guest,authController().register) 
    app.post('/register',authController().postRegister)

    app.post('/logout',authController().logout)


    app.get('/menu',menuController().index)

    app.get('/cart',cartController().index)
    app.post('/update-cart',cartController().update)

    //customer routes
    app.post('/orders',auth,orderController().store)
    app.get('/customer/orders',auth, orderController().index)
    app.get('/customer/orders/:_id',auth, orderController().show)
    app.get('/customer/notlogin',orderController().notlogin)

    app.get('/customer/orderplaced',orderplacedController().index)

    //admin routes
    app.get('/admin/orders',admin, adminorderController().index)
    app.post('/admin/order/status',admin, statusController().update)

    //payment routes
    // app.post('/payment',paymentController().index)



}

module.exports=initRoutes; 