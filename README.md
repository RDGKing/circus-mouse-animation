# circus-mouse-animation

## Circus Mouse - WebGL con Three.js

Este proyecto es una aplicación WebGL que utiliza la biblioteca **Three.js** para renderizar un escenario interactivo en 3D. El objetivo es controlar un personaje 3D (un ratón) que interactúa con el entorno, realizando acciones como caminar, saltar, y bailar, entre otras. Además, el escenario incluye dinámicas físicas, control de cámara, iluminación, niebla, y la colisión entre objetos.

## Características

1. **Personaje con animaciones**: El ratón tiene varias secuencias de animación, como caminar, saltar y bailar, las cuales pueden ser activadas mediante teclas específicas.
2. **Plano tridimensional**: El escenario incluye un plano 3D en el que el ratón se mueve y puede interactuar con objetos.
3. **Control de movimientos del personaje**: El personaje se mueve usando las teclas **W**, **A**, **S**, **D** y se controla el salto con la tecla **Espacio**.
4. **Control de cámara**: La cámara puede ser controlada tanto por el teclado como por el mouse, permitiendo una visualización dinámica del escenario.
5. **Control de iluminación**: La iluminación del escenario puede ser ajustada.
6. **Control de niebla**: Se puede activar y modificar la intensidad de la niebla para agregar atmósferas.
7. **Elementos 3D con dinámica física**: El escenario incluye múltiples objetos 3D como pelotas y un globo que interactúan con el personaje mediante dinámica física.
8. **Colisión física**: Los objetos reaccionan ante la colisión con el ratón, desapareciendo y mostrando animaciones de impacto.

## Combinaciones de teclas

- **W**: Caminar hacia atrás
- **A**: Caminar a la izquierda
- **S**: Caminar hacia adelante
- **D**: Caminar a la derecha
- **Espacio**: Saltar
- **G**: Bailar Sexy
- **H**: Bailar Raro
- **Z + W**: Correr hacia atrás
- **Z + A**: Correr a la izquierda
- **Z + S**: Correr hacia adelante
- **Z + D**: Correr a la derecha

## Tecnologías utilizadas

- **Three.js**: Biblioteca para renderizar gráficos 3D en el navegador.
- **WebGL**: API de gráficos 3D en el navegador.
- **FBXLoader**: Para cargar modelos 3D y animaciones en formato FBX (obtenidos de Mixamo).
- **JavaScript**: Lenguaje de programación principal para la lógica del juego.

## Créditos

- **Three.js**: [https://threejs.org](https://threejs.org)
- **Mixamo**: Modelos y animaciones del personaje obtenidos de [Mixamo](https://www.mixamo.com)
- **Desarrollado por**: Ángel Rodrigo Barrios Yáñez
