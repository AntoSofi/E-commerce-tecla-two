let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
const carritoLista = document.getElementById("carritoLista");
const carritoTemplate = document.getElementById("carritoTemplate");
const carritoTotal = document.getElementById("carritoTotal");
const listaProductos = document.getElementById("listaProductos");
const template = document.getElementById("productosTemplate");
async function cargarProductos() {
    if (!listaProductos) return; 
    try {
        const respuesta = await fetch("https://fakestoreapi.com/products/category/electronics");
        const productos = await respuesta.json();
        mostrarProductos(productos);
    } catch (error) {
        console.error("Error al cargar productos:", error);
        listaProductos.innerHTML = "<p>Error al cargar productos</p>";
    }
}
function mostrarProductos(productos) {
    listaProductos.innerHTML = "";
    productos.forEach(product => {
        const card = template.content.cloneNode(true);
        card.querySelector(".productosImagen").src = product.image;
        card.querySelector(".productosTitulo").textContent = product.title;
        card.querySelector(".productosPrecio").textContent = "$" + product.price;
        const btn = card.querySelector(".btn-carrito");
        const contador = card.querySelector(".contador-producto");
        const itemEnCarrito = carrito.find(p => p.id === product.id);
        contador.textContent = itemEnCarrito ? itemEnCarrito.cantidad : 0;
        btn.addEventListener("click", () => {
            agregarAlCarrito(product);
            const itemActualizado = carrito.find(p => p.id === product.id);
            contador.textContent = itemActualizado.cantidad;
            actualizarContadorCarrito();
        });
        listaProductos.appendChild(card);
    });
}
function agregarAlCarrito(product) {
    const item = carrito.find(p => p.id === product.id);
    if (item) {
        item.cantidad++;
    } else {
        carrito.push({
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.image,
            cantidad: 1
        });
    }
    guardarCarrito();
    actualizarContadorCarrito();
}
function actualizarContadorCarrito() {
    const total = carrito.reduce((acc, p) => acc + p.cantidad, 0);
    const contador = document.getElementById("contadorCarrito");
    if (contador) {
        contador.textContent = total;
    }
}
function mostrarCarrito() {
    carritoLista.innerHTML = "";
    carrito.forEach((item, index) => {
        const card = carritoTemplate.content.cloneNode(true);
        card.querySelector(".carrito-img").src = item.image;
        card.querySelector(".carrito-titulo").textContent = item.title;
        card.querySelector(".carrito-precio").textContent = "$" + item.price;
        card.querySelector(".cantidad").textContent = item.cantidad;
        card.querySelector(".btn-sumar").addEventListener("click", () => {
            item.cantidad++;
            guardarCarrito();
            mostrarCarrito();
        });
        card.querySelector(".btn-restar").addEventListener("click", () => {
            if (item.cantidad > 1) {
                item.cantidad--;
            } else {
                carrito.splice(index, 1);
            }
            guardarCarrito();
            mostrarCarrito();
        });
        card.querySelector(".btn-eliminar").addEventListener("click", () => {
            carrito.splice(index, 1);
            guardarCarrito();
            mostrarCarrito();
        });
        carritoLista.appendChild(card);
    });
    actualizarTotal();
}
function actualizarTotal() {
    const total = carrito.reduce((acc, item) => acc + (item.price * item.cantidad), 0);
    if (carritoTotal) {
        carritoTotal.textContent = total.toFixed(2);
    }
}
function guardarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}
document.addEventListener("DOMContentLoaded", () => {
    cargarProductos();
    if (carritoLista) {
        mostrarCarrito();
    }
    actualizarContadorCarrito();
});






