function orderplacedController()
{
    return {
        index(req,res)
        {
            res.render('customer/orderplaced');
        }
    }
}

module.exports=orderplacedController;