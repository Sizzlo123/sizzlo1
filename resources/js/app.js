import axios from 'axios'
import Noty, { button } from 'noty'
import {initAdmin} from './admin'
import moment from 'moment'

let addToCart=document.querySelectorAll('.add-to-cart')
let cartCounter=document.querySelector('.cartCounter')

function updateCart(menuItems){
    axios.post('/update-cart',menuItems).then(res=>{
        // console.log(res.data.data)
        // console.log(cartCounter)
        cartCounter.innerText=res.data.data   
        new Noty({
            type: 'success',
            timeout: 1000,
            layout: 'topRight',
            text: 'Item added to cart',
            progressBar: false,
        }).show();
    }).catch(err=>{
        new Noty({
            type: 'success',
            timeout: 1000,
            layout: 'topRight',
            text: 'Something Went Wrong',
            progressBar: false,
        }).show();
     })
}

addToCart.forEach((btn) =>{
    btn.addEventListener('click',(e)=>{
        let menuItems=JSON.parse(btn.dataset.menu)
        updateCart(menuItems)
        // console.log(e);
        // console.log(menuItems)
    })
})



// Remove alert message after X seconds
const alertMsg = document.querySelector('#success-alert')
if(alertMsg) {
    setTimeout(() => {
        alertMsg.remove()
    }, 2000)
}

//change order status
let statuses = document.querySelectorAll('.status_line')
let hiddenInput = document.querySelector('#hiddenInput')
let order = hiddenInput ? hiddenInput.value : null
order = JSON.parse(order)
let time = document.createElement('small')

function updateStatus(order){
    statuses.forEach((status) => {
        status.classList.remove('step-completed')
        status.classList.remove('current')
    })
    let stepCompleted = true;
    statuses.forEach((status) => {
       let dataProp = status.dataset.status
       if(stepCompleted) {
            status.classList.add('step-completed')
       }
       if(dataProp === order.status) {
            stepCompleted = false
            time.innerText = moment(order.updatedAt).format('hh:mm A')
            status.appendChild(time)
           if(status.nextElementSibling) {
            status.nextElementSibling.classList.add('current')
           }
       }
    })
   
}
updateStatus(order);

//socket
let socket= io()

//join
if(order){
socket.emit('join',`order_${order._id}`)
}

let adminAreaPath= window.location.pathname
if(adminAreaPath.includes('admin')){
    initAdmin(socket)
    socket.emit('join','adminRoom')
}

socket.on('orderUpdated',(data)=>{
    const updatedOrder= {...order}
    updatedOrder.updatedAt=moment().format()
    updatedOrder.status=data.status
    // console.log(data)
    updateStatus(updatedOrder)
    new Noty({
        type: 'success',
        timeout: 1000,
        layout: 'topRight',
        text: 'Order Updated',
        progressBar: false,
    }).show();

})