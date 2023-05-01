const prevPageButton = document.getElementById('prev-page');
const nextPageButton = document.getElementById('next-page');
const zoomInButton = document.getElementById('zoom-in');
const zoomOutButton = document.getElementById('zoom-out');
const canvasContainer = document.getElementById('pdf-viewer');

// Inicializar variables
let currentPage = 1;
let numPages = 0;
let scale = 1;

// Función para ir a la página anterior
function goToPrevPage() {
  if (currentPage <= 1) return;
  currentPage--;
  renderPage(currentPage);
}

// Función para ir a la página siguiente
function goToNextPage() {
  if (currentPage >= numPages) return;
  currentPage++;
  renderPage(currentPage);
}

// Función para aumentar el zoom
function zoomIn() {
  if (scale >= 2) return;
  scale += 0.1;
  renderPage(currentPage);
}

// Función para disminuir el zoom
function zoomOut() {
  if (scale <= 0.5) return;
  scale -= 0.1;
  renderPage(currentPage);
}

// Agregar event listeners a los botones
prevPageButton.addEventListener('click', goToPrevPage);
nextPageButton.addEventListener('click', goToNextPage);
zoomInButton.addEventListener('click', zoomIn);
zoomOutButton.addEventListener('click', zoomOut);

// Función para renderizar la página en el canvas
function renderPage(pageNumber) {
  pdf.getDocument(pdfUrl).promise.then(function(pdf) {
    numPages = pdf.numPages;
    pdf.getPage(pageNumber).then(function(page) {
      const canvas = document.createElement('canvas');
      canvasContainer.innerHTML = '';
      canvasContainer.appendChild(canvas);
      const viewport = page.getViewport({ scale: scale });
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      const context = canvas.getContext('2d');
      const renderContext = {
        canvasContext: context,
        viewport: viewport
      };
      page.render(renderContext);
    });
  });
}

// Renderizar la primera página
renderPage(currentPage);
