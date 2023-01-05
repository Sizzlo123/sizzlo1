const Menu= require('../../models/menu');
const Menuramjihatti = require('../../models/menuramjihatti');
const Menuvan=require('../../models/menuvan')
const Menushake=require('../../models/menushake')
function menuControllers()
{
    return {
        async index(req,res)
        {
            const menuItems=await Menu.find()
            res.render('menu',{menuItems:menuItems});
        },

        async menuvan(req,res){
            const menuItems=await Menuvan.find()
            res.render('menuvan',{menuItems:menuItems});
        },

        async menuramjihatti(req,res){
            const menuItems=await Menuramjihatti.find()
            res.render('menuramjihatti',{menuItems:menuItems});
        },

        async menushake(req,res){
            const menuItems=await Menushake.find()
            res.render('menushake',{menuItems:menuItems});
        }
    }
}

module.exports=menuControllers; 