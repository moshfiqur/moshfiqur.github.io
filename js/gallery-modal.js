/**
 * Gallery Modal
 * Displays images in a modal overlay with previous/next navigation
 */
(function() {
  'use strict';
  
  // Modal state
  let currentImageIndex = 0;
  let galleryImages = [];
  
  // Create modal HTML structure
  function createModal() {
    const modal = document.createElement('div');
    modal.className = 'gallery-modal';
    modal.id = 'gallery-modal';
    modal.innerHTML = `
      <div class="gallery-modal__overlay"></div>
      <div class="gallery-modal__container">
        <button class="gallery-modal__close" aria-label="Close gallery">&times;</button>
        <button class="gallery-modal__prev" aria-label="Previous image">&#10094;</button>
        <button class="gallery-modal__next" aria-label="Next image">&#10095;</button>
        <div class="gallery-modal__content">
          <img src="" alt="" class="gallery-modal__image">
        </div>
        <div class="gallery-modal__counter"></div>
      </div>
    `;
    document.body.appendChild(modal);
    return modal;
  }
  
  // Initialize gallery modal
  function initGalleryModal() {
    const gallery = document.querySelector('.case-gallery');
    if (!gallery) return;
    
    // Get all gallery items
    const items = gallery.querySelectorAll('.case-gallery__item');
    if (!items.length) return;
    
    // Store gallery images data
    galleryImages = Array.from(items).map(item => ({
      src: item.querySelector('img').src,
      alt: item.querySelector('img').alt
    }));
    
    // Create modal if it doesn't exist
    let modal = document.getElementById('gallery-modal');
    if (!modal) {
      modal = createModal();
    }
    
    // Get modal elements
    const modalImage = modal.querySelector('.gallery-modal__image');
    const modalCounter = modal.querySelector('.gallery-modal__counter');
    const closeBtn = modal.querySelector('.gallery-modal__close');
    const prevBtn = modal.querySelector('.gallery-modal__prev');
    const nextBtn = modal.querySelector('.gallery-modal__next');
    const overlay = modal.querySelector('.gallery-modal__overlay');
    
    // Function to show modal with specific image
    function showModal(index) {
      currentImageIndex = index;
      modalImage.src = galleryImages[index].src;
      modalImage.alt = galleryImages[index].alt;
      modalCounter.textContent = `${index + 1} / ${galleryImages.length}`;
      modal.classList.add('is-active');
      document.body.style.overflow = 'hidden';
      
      // Update button states
      prevBtn.disabled = index === 0;
      nextBtn.disabled = index === galleryImages.length - 1;
    }
    
    // Function to hide modal
    function hideModal() {
      modal.classList.remove('is-active');
      document.body.style.overflow = '';
    }
    
    // Function to show previous image
    function showPrev() {
      if (currentImageIndex > 0) {
        showModal(currentImageIndex - 1);
      }
    }
    
    // Function to show next image
    function showNext() {
      if (currentImageIndex < galleryImages.length - 1) {
        showModal(currentImageIndex + 1);
      }
    }
    
    // Add click handlers to gallery items
    items.forEach((item, index) => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        showModal(index);
      });
    });
    
    // Add event listeners to modal controls
    closeBtn.addEventListener('click', hideModal);
    overlay.addEventListener('click', hideModal);
    prevBtn.addEventListener('click', showPrev);
    nextBtn.addEventListener('click', showNext);
    
    // Keyboard navigation (add only once using a flag)
    if (!modal.dataset.keyboardListenerAdded) {
      document.addEventListener('keydown', (e) => {
        if (!modal.classList.contains('is-active')) return;
        
        switch(e.key) {
          case 'Escape':
            hideModal();
            break;
          case 'ArrowLeft':
            showPrev();
            break;
          case 'ArrowRight':
            showNext();
            break;
        }
      });
      modal.dataset.keyboardListenerAdded = 'true';
    }
  }
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGalleryModal);
  } else {
    initGalleryModal();
  }
})();
