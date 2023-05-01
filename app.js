const pdfUrl = 'https://noglerc3.sg-host.com/pdf/pdf.pdf';
let currentPage = 1;

pdfjsLib.getDocument(pdfUrl).promise.then((pdf) => {
  const pdfViewer = document.getElementById('pdf-container');

  // Muestra la primera página del PDF
  pdf.getPage(currentPage).then((page) => {
    const canvas = document.createElement('canvas');
    pdfViewer.appendChild(canvas);

    const viewport = page.getViewport({ scale: 1 });
    const scale = pdfViewer.clientWidth / viewport.width;
    const scaledViewport = page.getViewport({ scale: scale });

    const context = canvas.getContext('2d');
    canvas.height = scaledViewport.height;
    canvas.width = scaledViewport.width;
    const renderContext = {
      canvasContext: context,
      viewport: scaledViewport
    };
    page.render(renderContext);
  });

  // Actualiza el número de páginas
  const totalPages = pdf.numPages;
  const pageSlider = document.getElementById('page-slider');
  pageSlider.max = totalPages;
  const pageNumberLabel = document.getElementById('page-number-label');
  pageNumberLabel.textContent = `${currentPage}/${totalPages}`;

  // Actualiza la página actual al cambiar el slider
  pageSlider.addEventListener('input', () => {
    const pageNumber = parseInt(pageSlider.value);
    pdf.getPage(pageNumber).then((page) => {
      const canvas = pdfViewer.querySelector('canvas');
      const context = canvas.getContext('2d');
      context.clearRect(0, 0, canvas.width, canvas.height);
      currentPage = pageNumber;
      const viewport = page.getViewport({ scale: 1 });
      const scale = pdfViewer.clientWidth / viewport.width;
      const scaledViewport = page.getViewport({ scale: scale });
      canvas.height = scaledViewport.height;
      canvas.width = scaledViewport.width;
      const renderContext = {
        canvasContext: context,
        viewport: scaledViewport
      };
      page.render(renderContext);
      pageNumberLabel.textContent = `${currentPage}/${totalPages}`;
    });
  });
}).catch((error) => {
  console.error('Error al cargar el PDF', error);
  
  // Mostrar mensaje de error
  const pdfViewer = document.getElementById('pdf-container');
  pdfViewer.innerHTML = 'No se pudo cargar el PDF. Por favor, inténtalo de nuevo más tarde.';
});

// Solicitud fetch en modo no-cors
fetch(pdfUrl, {
  mode: 'no-cors'
}).then((response) => {
  return response.blob();
}).then((blob) => {
  pdfjsLib.getDocument(blob);
}).catch((error) => {
  console.error('Error al cargar el archivo PDF', error);
});
