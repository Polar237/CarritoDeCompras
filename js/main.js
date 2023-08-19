


async function getApi () {
    try{
        const data = await fetch('https://ecommercebackend.fundamentos-29.repl.co');
        const res = await data.json();
        window.localStorage.setItem('products', JSON.stringify(res));
        return res;
    } catch (error) {
        console.log(error);
    }
}
function events () {
    const modal = document.querySelector('.modal');
    const cart_buttom = document.querySelector('.cart_buttom')
    const menu_cart = document.querySelector('.menu_cart')
    cart_buttom.addEventListener( "click", function() {
        menu_cart.classList.toggle('active');
    })
    modal.addEventListener('click',function(){
        modal.classList.toggle('active');
    })
}
function printProducts (db) {
    const productsHTML = document.querySelector('.products');
    let html = '';
    for (const product of db.products) {
        html += `
            <div class="product">
                <div class="product_img">
                    <img src="${product.image}" alt="image product">
                </div>

                <div class="product_info">
                    <h3>${product.name}</h3>
                    <h4>precio: ${product.price}</h4>
                    <p>Stock: ${product.quantity}</p>
                    <button id=${product.id}
                    class= 'cart_buy' >agregar al carrito</button>
                </div>
            </div>
        `
    }
    productsHTML.innerHTML = html;
}
function addtoCart(db){
    const productsHTML = document.querySelector('.products');
    productsHTML.addEventListener('click', function(event){
    if(event.target.classList.contains('cart_buy')){
        const id = Number(event.target.id);
        const productFind = db.products.find(function(product){
            return product.id === id;
        })
        // console.log(productFind);
        if(db.cart[productFind.id]){
            db.cart[productFind.id].amount++;
        }else {
            productFind.amount = 1;
            db.cart[productFind.id] = productFind;
        }
        //console.log(db.cart);
        window.localStorage.setItem('cart', JSON.
        stringify(db.cart));
        printToCart(db);
        totalCart(db);
    }
})
}
function printToCart(db){
    const cart_products = document.querySelector('.cart_products')
    let html = '';
    for (const product in db.cart) {
        const { quantity, price, name, image, id, amount } = db.cart[product];
        html += `
        <div class="cart_product">

            <div class="cart_product_img">
                <img class= 'modal_img' src="${image}" alt="image product"/>
            </div>

            <div class="cart_product_container">
                <div
                class= "cart_product_description">
                    <h3>${name}</h3>
                    <h4>precio: ${price}</h4>
                    <p>Stock: ${quantity}</p>
                </div>
                <div id=${id} class="cart_counter">
                    <b class= 'less'>-</b>
                    <span>${amount}</span>
                    <b class= 'plus'>+</b>
                    <img class= 'trash' src='./img/trash.png' alt='trash'/>
                </div> 
            </div>
        </div>
        `;
    }
    cart_products.innerHTML = html;

}
function handleCart(db){
    const cart_products = document.querySelector('.cart_products');
    cart_products.addEventListener('click', function (event){
        if(event.target.classList.contains('plus')){
            const id = Number(event.target.parentElement.id);
            const productFind = db.products.find(function(product){return product.id === id;
            });
            if(db.cart[productFind.id]){
                if(productFind.quantity === db.cart[productFind.id].amount){
                    return alert('no tenemos mas en bodega');
                }
            }
            db.cart[id].amount++;
        }
        if(event.target.classList.contains('less')){
            const id = Number(event.target.parentElement.id);
            if(db.cart[id].amount===1){
                return alert('vas a comprar aire?')
            } else {
                db.cart[id].amount--;
            }
        }
        if(event.target.classList.contains('trash')){
            const id = Number(event.target.parentElement.id);
            const response = confirm('Estas seguro que quieres borrar este producto?');
            if(!response){
                return;
            }
            delete db.cart[id];
            printProducts(db)
            printToCart(db)
            totalCart(db)
        }
        //console.log(event.target)
        window.localStorage.setItem('cart', JSON.
        stringify(db.cart));
        printToCart(db);
    });
}
function totalCart(db){
    
    const info_total = document.querySelector('.info_total')
    const info_amount = document.querySelector('.info_amount')
    
    let totalProducts = 0;
    let amountProducts = 0;

    for (const product in db.cart) {
        amountProducts += db.cart[product].amount;
        totalProducts += (db.cart[product].amount * db.cart[product].price);
    }

    info_total.textContent = '.total: $'+totalProducts;
    info_amount.textContent = 'cantidad: '+amountProducts;

}
function buyCart(db){
    const btnBuy = document.querySelector('.btn_buy');
    btnBuy.addEventListener('click', function(){
        if(!Object.keys(db.cart).length){
            return alert('no tienes productos');
        }
        const response= confirm('seguro que quieres comrar?');
        if(!response){
            return;
        }
        for (const product of db.products) {
            const cartProduct = db.cart[product.id];
            console.log(cartProduct?.id)
            if(product.id===cartProduct?.id){
                product.quantity -= cartProduct.amount;
            }
        }
        db.cart = {};
        window.localStorage.setItem
        ('products', JSON.stringify(db.products));
        window.localStorage.setItem('cart',JSON.stringify(db.cart));
        printProducts(db);
        printToCart(db);
        totalCart(db);
    });
}
async function main () {
    const db = {
        products: JSON.parse(window.localStorage.getItem('products')) || (await getApi()), 
        cart: JSON.parse(window.localStorage.getItem('cart')) || {},
    }
    console.log(db.products);
    // se ejecutan los eventos
    events();
    // imprimimos en la página los productos
    printProducts(db);
    // se adicionan los productos al carrito
    addtoCart(db);
    // se imprimen los productos del carrito
    printToCart(db);
    // manejamos los eventos del usuario en el carrito de compras
    handleCart(db);
    // se imprime la totalidad del carrito de compras
    totalCart(db);
    //manejamos el evento de la compra
    buyCart(db);
}
main();