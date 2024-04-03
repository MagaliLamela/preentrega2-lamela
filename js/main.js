//! DECLARO VARIABLES

//* Variables para controlar el flujo del programa y almacenar información relevante.
let seguirComprando = 1; // Variable que indica si el usuario desea seguir comprando o realizar otra acción.
let seleccionarProducto; // Variable para almacenar el número de índice del producto seleccionado por el usuario en el catálogo.
let producto; // Variable para almacenar el objeto del producto seleccionado.
let tamanio; // Variable para almacenar el tamaño seleccionado del producto, si el producto tiene opciones de tamaño.
let cantidad; // Variable para almacenar la cantidad de productos seleccionados.
let resumenCarrito; // Variable para almacenar el resumen detallado del carrito de compra.
let indice; // Variable para almacenar el índice del producto seleccionado por el usuario para eliminar del carrito.
let precioTotal; // Variable para almacenar el precio total de los productos en el carrito.
let modoDeEntrega; // Variable para almacenar el modo de entrega seleccionado por el usuario.
let totalConEnvio; // Variable para almacenar el precio total con el costo de envío incluido si corresponde.


//! CREO ARRAY DE PRODUCTOS

// Array que contiene los productos disponibles junto con sus detalles como nombre, precio y opciones de tamaño.
const productos = [
    // Ejemplo de un producto con opciones de tamaño.
    {
        nombre: "Royal Canin Gato Castrado",
        precio: "15.000 - $50.000",
        opciones: [
            { tamanio: "3kg", precio: 15000 },
            { tamanio: "7.5kg", precio: 30000 },
            { tamanio: "15kg", precio: 50000 }]
    },
    // Ejemplo de un producto sin opciones de tamaño.
    {
        nombre: "Pipeta Frontline Gato",
        precio: 6500
    },
    {
        nombre: "Pro Plan Perro Adulto Raza Mediana",
        precio: "12.000 - $45.000",
        opciones: [
            { tamanio: "3kg", precio: 12000 },
            { tamanio: "7.5kg", precio: 25000 },
            { tamanio: "15kg", precio: 45000 }]
    },
    {
        nombre: "Shampoo para Perro",
        precio: 3000
    }
];


//! CREO ARRAY DE CARRITO 

// Array que almacena los productos seleccionados por el usuario para su compra.
const carrito = [];


//! FUNCIONES PRINCIPALES

//*  Función para mostrar el catálogo de productos.
function mostrarCatalogo() {
    // Genera un string que contiene el catálogo de productos con sus precios.
    let catalogo = "Catálogo de productos:\n";
    productos.forEach((producto, index) => {
        catalogo += ((index + 1) + ". " + producto.nombre + " ($" + producto.precio.toLocaleString() + ").") + "\n";
    });
    return catalogo;
}


//* Función para seleccionar el tamaño del producto, si hay opciones disponibles.
function seleccionarTamanio() {
    // Verifica si el producto tiene opciones de tamaño.
    if (producto.opciones) {
        // Permite al usuario seleccionar el tamaño del producto.
        do {
            tamanio = Number(prompt("Seleccione el tamaño del producto:\n" + producto.opciones.map((opc, index) => (index + 1) + ". " + opc.tamanio + " ($" + opc.precio.toLocaleString() + ").").join("\n")));
            // Verifica si la opción seleccionada es válida.
            if (validarTamanio()) {
                mostrarOpcionInvalida();
            }
        } while (validarTamanio());
        // Actualiza el precio del producto según el tamaño seleccionado.
        producto.precio = producto.opciones[tamanio - 1].precio;
    }
}


//* Función para seleccionar la cantidad de productos a comprar.
function seleccionarCantidad() {
    // Permite al usuario ingresar la cantidad deseada del producto seleccionado.
    do {
        cantidad = Number(prompt("Ha seleccionado: " + producto.nombre + ". Por favor, ingrese la cantidad que desea comprar:"));
        // Verifica si la cantidad ingresada es válida.
        if (validarCantidad()) {
            mostrarOpcionInvalida();
        }
    } while (validarCantidad());
}


//* Funcion para agregar un producto al carrito de compra.
function agregarProductoAlCarrito() {
    // Permite al usuario seleccionar un producto del catálogo.
    do {
        seleccionarProducto = Number(prompt(mostrarCatalogo() + "\nSeleccione el número del producto que desea comprar:"));
        // Verifica si la selección del producto es válida.
        if (validarProductos()) {
            mostrarOpcionInvalida();
        }
    } while (validarProductos());

    // Obtiene el producto seleccionado del catálogo.
    producto = productos[seleccionarProducto - 1];

    // Reinicia el tamaño y la cantidad seleccionados.
    tamanio = null;
    cantidad = null;

    // Permite al usuario seleccionar el tamaño del producto.
    seleccionarTamanio();

    // Permite al usuario seleccionar la cantidad del producto.
    seleccionarCantidad();

    // Busca si el producto ya está en el carrito.
    const productoEnCarritoIndex = carrito.findIndex(item => item.nombre === producto.nombre && item.tamanio === tamanio);
    // Si el producto ya está en el carrito, aumenta la cantidad.
    if (productoEnCarritoIndex !== -1) {
        carrito[productoEnCarritoIndex].cantidad += cantidad; 
    } else {
        // Si el producto no está en el carrito, lo agrega.
        carrito.push({ nombre: producto.nombre, tamanio, cantidad, precio: producto.precio });
    }
}


//* Función para calcular el precio total del carrito de compra.
function calcularPrecioTotal(carrito) {
    // Utiliza reduce para sumar los precios de todos los productos en el carrito.
    precioTotal = carrito.reduce((acumulador, producto) => acumulador + (producto.precio * producto.cantidad), 0);
    return precioTotal;
}


//* Funcion para mostrar el resumen del carrito de compra.
function mostrarResumenCarrito(carrito) {
    // Genera un resumen detallado del carrito de compra.
    let contadorProductos = 1;
    resumenCarrito = "Resumen del carrito:\n";
    carrito.forEach(item => {
        let descripcionProducto = item.nombre;
        // Si el producto tiene opciones de tamaño, agrega la descripción del tamaño.
        if (productos.some(producto => producto.nombre === item.nombre && producto.opciones)) {
            let opcionProducto = productos.find(producto => producto.nombre === item.nombre && producto.opciones);
            descripcionProducto += ` (${opcionProducto.opciones.find(opcion => opcion.precio === item.precio).tamanio})`;
        }
        // Agrega la información del producto al resumen.
        resumenCarrito += contadorProductos + ". " + descripcionProducto + " -  Cantidad: " + item.cantidad + " - Precio unitario: $" + item.precio.toLocaleString() + " - Total: $" + (item.cantidad * item.precio).toLocaleString() + ".\n";
        contadorProductos++;
    });

    // Calcula y agrega el precio total al resumen.
    precioTotal = calcularPrecioTotal(carrito);
    resumenCarrito += "\nPrecio total: $" + precioTotal.toLocaleString() + ".";

    // Muestra el resumen del carrito en un cuadro de diálogo.
    alert(resumenCarrito);
    return resumenCarrito;
}


//* Función para eliminar un producto del carrito de compra.
function eliminarProducto(carrito) {
    // Permite al usuario seleccionar un producto del carrito para eliminarlo.
    do {
        indice = Number(prompt(resumenCarrito + "\n\nIngrese el número del producto que desea eliminar:") - 1);
        // Verifica si la selección del producto es válida.
        if (validarEliminarProducto()) {
            mostrarOpcionInvalida();
        } else {
            // Elimina el producto seleccionado del carrito.
            carrito.splice(indice, 1);
            alert("Producto eliminado del carrito exitosamente.");
            // Muestra el resumen actualizado del carrito.
            mostrarResumenCarrito(carrito);
            return
        }
    } while (validarEliminarProducto());
}


//* Función para finalizar la compra.
function finalizarCompra() {
    // Permite al usuario seleccionar el modo de entrega.
    do {
        modoDeEntrega = Number(prompt(`¿Cómo quiere recibir su producto?
1- Envío a domicilio (Costo de envío: $2.000. Envío sin costo para compras mayores a $20.000).
2- Retiro en tienda (Sin costo).`));

        // Verifica si la selección del modo de entrega es válida.
        if (modoDeEntrega == 1) {
            // Si se selecciona envío a domicilio, muestra el resumen con el costo del envío si corresponde.
            if (precioTotal >= 20000) {
                alert(resumenCarrito + "\n\nEl envío es sin costo.");
            } else {
                totalConEnvio = precioTotal + 2000;
                alert(resumenCarrito + "\n\nEl envío es de $2.000. \nEl total con el envío es de $" + totalConEnvio.toLocaleString() + `.`);
            }
        } else if (modoDeEntrega == 2) {
            // Si se selecciona retiro en tienda, muestra el resumen con la información de retiro.
            alert(resumenCarrito + "\n\nPuede retirar de lunes a viernes de 10:00 a 20:00hs o sábados de 10:00 a 14:00hs.");
        } else {
            mostrarOpcionInvalida();
        }
    } while (modoDeEntrega != 1 && modoDeEntrega != 2);
}


//* Función para continuar la compra, eliminar un producto del carrito o finalizar la compra.
function continuarCompra() {
    // Permite al usuario seleccionar una acción entre agregar otro producto, eliminar un producto ya agregado o finalizar la compra.
    do {
        seguirComprando = Number(prompt(`¿Qué acción desea realizar?
    1- Agregar otro producto al carrito.
    2- Eliminar un producto del carrito.
    3- Finalizar compra.`));

        // Verifica si la selección de acción es válida.
        if (validarSeguirComprando()) {
            mostrarOpcionInvalida();
        } else if (seguirComprando == 2) {
            // Si se selecciona eliminar un producto, llama a la función correspondiente.
            eliminarProducto(carrito);
        } else if (seguirComprando == 3) {
            // Si se selecciona finalizar la compra, llama a la función correspondiente.
            finalizarCompra();
        }
    } while (validarSeguirComprando() || seguirComprando == 2);
}


//! FUNCIONES DE VALIDACIÓN

//* Función para mostrar un mensaje de opción inválida.
function mostrarOpcionInvalida() {
    alert("La opción ingresada no es válida.");
}

//* Función para validar la selección de productos.
function validarProductos() {
    return seleccionarProducto != Math.floor(seleccionarProducto) || seleccionarProducto < 1 || seleccionarProducto > productos.length;
}

//* Función para validar la selección de tamaño.
function validarTamanio() {
    return producto.opciones && (tamanio != Math.floor(tamanio) || tamanio < 1 || tamanio > producto.opciones.length);
}

//* Función para validar la cantidad ingresada.
function validarCantidad() {
    return cantidad <= 0 || cantidad != Math.floor(cantidad)
}

//* Función para validar la selección de seguir comprando.
function validarSeguirComprando() {
    return seguirComprando != 1 && seguirComprando != 2 && seguirComprando != 3;
}

//* Función para validar la selección de eliminar producto.
function validarEliminarProducto() {
    return indice < 0 || indice >= carrito.length || indice != Math.floor(indice)
}


//! FUNCIÓN PRINCIPAL DEL CARRITO DE COMPRA
//* Función principal que controla el flujo del carrito de compra.
function iniciarCarritoDeCompra() {
    // Permite al usuario agregar productos al carrito y realizar acciones adicionales como eliminar productos del carrito o finalizar la compra.
    while (seguirComprando == 1) {
        agregarProductoAlCarrito();
        mostrarResumenCarrito(carrito);
        continuarCompra();
    }
}

//* Llama a la función principal para iniciar el carrito de compra.
iniciarCarritoDeCompra();
