/*
  Booking modal and UI interactions
  - Works if HTML contains elements with class .btn-book, .booking-btn, or id #bookNow
  - If no modal exists in the page, we create one dynamically
  - Simple validation, accessible attributes, and localStorage persistence for demo
*/
(function(){
  const BOOKING_MODAL_ID = 'bookingModal';

  function qs(selector){return document.querySelector(selector)}
  function qsa(selector){return Array.from(document.querySelectorAll(selector))}

  // Create modal markup if not present in DOM
  function ensureModal(){
    if(qs('#'+BOOKING_MODAL_ID)) return qs('#'+BOOKING_MODAL_ID);

    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.id = BOOKING_MODAL_ID;
    overlay.innerHTML = `
      <div class="modal-backdrop" data-close></div>
      <div class="modal" role="dialog" aria-modal="true" aria-labelledby="bookingTitle">
        <header>
          <h2 id="bookingTitle">Book an Appointment</h2>
          <button class="close-btn" aria-label="Close booking dialog" data-close>&times;</button>
        </header>
        <form class="booking-form" novalidate>
          <div class="form-grid">
            <div class="form-row">
              <label for="b-name">Full name</label>
              <input id="b-name" name="name" type="text" required placeholder="Jane Doe">
            </div>
            <div class="form-row">
              <label for="b-phone">Phone</label>
              <input id="b-phone" name="phone" type="tel" required placeholder="(555) 555-5555">
            </div>
            <div class="form-row">
              <label for="b-email">Email</label>
              <input id="b-email" name="email" type="email" placeholder="you@domain.com">
            </div>
            <div class="form-row">
              <label for="b-service">Service</label>
              <select id="b-service" name="service">
                <option>Fade / Taper (High & Low) - KES 700</option>
                <option>Twists - KES 1,500</option>
                <option>Cornrows - KES 1,500</option>
                <option>Finger Coils - KES 2,000</option>
              </select>
            </div>
          </div>
          <div class="form-grid">
            <div class="form-row">
              <label for="b-date">Date</label>
              <input id="b-date" name="date" type="date" required>
            </div>
            <div class="form-row">
              <label for="b-time">Time</label>
              <input id="b-time" name="time" type="time" required>
            </div>
          </div>
          <div class="form-row">
            <label for="b-notes">Notes (optional)</label>
            <textarea id="b-notes" name="notes" placeholder="Any preferences or notes..."></textarea>
          </div>
          <div class="form-actions">
            <div class="note muted-small">We will confirm availability shortly.</div>
            <div style="flex:1"></div>
            <button type="button" class="btn-ghost" data-close>Cancel</button>
            <button type="submit" class="btn-book">Confirm Booking</button>
          </div>
        </form>
      </div>
    `;

    document.body.appendChild(overlay);
    return overlay;
  }

  function openModal(){
    const modal = ensureModal();
    modal.classList.add('active');
    // focus the first input
    const first = modal.querySelector('input,select,textarea,button');
    if(first) setTimeout(()=>first.focus(),120);
    // attach events
    attachModalEvents(modal);
  }

  function closeModal(modal){
    if(!modal) modal = qs('#'+BOOKING_MODAL_ID);
    if(!modal) return;
    modal.classList.remove('active');
  }

  function attachModalEvents(modal){
    // guard to avoid attaching twice
    if(modal._eventsAttached) return;
    modal._eventsAttached = true;

    // close on backdrop or [data-close]
    modal.addEventListener('click', (e)=>{
      if(e.target.hasAttribute('data-close')) closeModal(modal);
    });

    // esc to close
    window.addEventListener('keydown', function escHandler(e){
      if(e.key === 'Escape') closeModal(modal);
    });

    const form = modal.querySelector('.booking-form');
    form.addEventListener('submit', function(e){
      e.preventDefault();
      submitBooking(form, modal);
    });
  }

  function validateForm(form){
    const name = form.querySelector('[name=name]');
    const date = form.querySelector('[name=date]');
    const time = form.querySelector('[name=time]');
    let ok = true;
    [name,date,time].forEach(el=>{
      if(!el) return;
      if(!el.value){
        el.style.outline = '2px solid rgba(255,122,89,0.18)';
        setTimeout(()=>el.style.outline='',900);
        ok = false;
      }
    });
    return ok;
  }

  function submitBooking(form, modal){
    console.log('📝 Form submitted, validating...');
    if(!validateForm(form)) {
      console.log('❌ Validation failed');
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Saving...';
    submitBtn.style.opacity = '0.6';

    const data = new FormData(form);
    const booking = {};
    data.forEach((v,k)=>booking[k]=v);
    booking.createdAt = new Date().toISOString();

    console.log('📦 Booking data prepared:', booking);
    console.log('🌐 Sending to server...');

    // Try to POST to API server first, fallback to localStorage
    fetch('/api/bookings', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(booking)
    })
    .then(res => {
      console.log('📡 Server response status:', res.status);
      if(!res.ok) throw new Error('API request failed with status: ' + res.status);
      return res.json();
    })
    .then(result => {
      console.log('✅ Booking saved to server:', result);
      showSuccessUI(modal, booking);
    })
    .catch(err => {
      console.warn('⚠️ API unavailable, using localStorage fallback:', err.message);
      // Fallback to localStorage
      try{
        const key = 'barber_bookings_v1';
        const existing = JSON.parse(localStorage.getItem(key) || '[]');
        existing.push(booking);
        localStorage.setItem(key, JSON.stringify(existing));
        console.log('💾 Booking saved to localStorage');
      }catch(localErr){
        console.error('❌ Could not persist booking:', localErr);
      }
      showSuccessUI(modal, booking);
    })
    .finally(() => {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
      submitBtn.style.opacity = '1';
    });
  }

  function showSuccessUI(modal, booking){
    console.log('🎉 Showing success UI for:', booking.name);
    // replace form with success UI
    const modalBox = modal.querySelector('.modal');
    const formElement = modalBox.querySelector('form');
    
    if(!formElement){
      console.error('❌ Form element not found!');
      return;
    }
    
    formElement.classList.add('hidden');
    
    const success = document.createElement('div');
    success.className = 'success-box';
    success.innerHTML = `
      <strong>Thanks, ${escapeHtml(booking.name || 'Guest')}!</strong>
      <div style="margin-top:8px" class="muted-small">Your request for <em>${escapeHtml(booking.service||'Service')}</em> on <strong>${escapeHtml(booking.date)} ${escapeHtml(booking.time)}</strong> was received.</div>
      <div style="margin-top:12px;display:flex;justify-content:flex-end"><button class="btn-book" id="closeAfterBooking">Done</button></div>
    `;
    modalBox.appendChild(success);

    console.log('✅ Success UI displayed');
    
    // wire close
    success.querySelector('#closeAfterBooking').addEventListener('click', ()=>{
      console.log('Closing modal and resetting form');
      formElement.classList.remove('hidden');
      success.remove();
      formElement.reset();
      closeModal(modal);
    });
  }

  function escapeHtml(s){
    return String(s||'').replace(/[&<>"']/g, function(c){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"}[c];
    });
  }

  // wire book buttons on page
  function attachBookButtons(){
    const buttons = qsa('.btn-book, .booking-btn, #bookNow, [data-book]');
    if(buttons.length===0){
      // If there are no buttons, create a minimal floating booking CTA (optional)
      // We'll avoid injecting aggressively, but we will create a gentle floating CTA for demos.
      const cta = document.createElement('button');
      cta.className = 'btn-book';
      cta.id = 'bookNow';
      cta.style.position = 'fixed';
      cta.style.right = '18px';
      cta.style.bottom = '18px';
      cta.style.zIndex = 1000;
      cta.textContent = 'Book Now';
      document.body.appendChild(cta);
      cta.addEventListener('click', openModal);
      return;
    }
    buttons.forEach(bt=>bt.addEventListener('click', function(e){
      e.preventDefault();
      // subtle scale animation
      bt.style.transform = 'scale(0.992)';
      setTimeout(()=>bt.style.transform='',140);
      openModal();
    }));
  }

  // Wire navigation buttons (Services, About)
  function attachNavigationButtons(){
    const navButtons = qsa('.nav-actions .btn-ghost');
    navButtons.forEach(btn => {
      btn.addEventListener('click', function(e){
        const text = btn.textContent.trim();
        // Only intercept internal nav buttons (e.g., Services/About).
        // Allow normal behavior for external links (Instagram) and tel: links.
        if(text !== 'Services' && text !== 'About') return;

        e.preventDefault();
        
        // Add click animation
        btn.style.transform = 'scale(0.96)';
        setTimeout(()=>btn.style.transform='',120);
        
        if(text === 'Services'){
          // Scroll to services section (the cards)
          const servicesSection = qs('.cards');
          if(servicesSection){
            servicesSection.scrollIntoView({behavior: 'smooth', block: 'center'});
            console.log('📋 Scrolled to Services section');
          }
        } else if(text === 'About'){
          // Show about modal or alert
          showAboutModal();
        }
      });
    });
  }

  // Create and show About modal
  function showAboutModal(){
    const existingAbout = qs('#aboutModal');
    if(existingAbout){
      existingAbout.remove();
    }

    const aboutModal = document.createElement('div');
    aboutModal.className = 'modal-overlay active';
    aboutModal.id = 'aboutModal';
    aboutModal.innerHTML = `
      <div class="modal-backdrop" data-close-about></div>
      <div class="modal" role="dialog" aria-modal="true" aria-labelledby="aboutTitle">
        <header>
          <h2 id="aboutTitle">About Heritage Blade</h2>
          <button class="close-btn" aria-label="Close about dialog" data-close-about>×</button>
        </header>
        <div style="padding: 20px 0;">
          <p style="margin-bottom: 16px; color: var(--text); line-height: 1.6;">
            Welcome to <strong style="color: var(--accent);">Heritage Blade</strong> — your destination for precision cuts and premium grooming experiences.
          </p>
          <p style="margin-bottom: 16px; color: var(--muted); line-height: 1.6;">
            Our expert barbers combine traditional techniques with modern styles to deliver exceptional results. 
            Whether you need a classic cut, fresh fade, beard trim, or hot towel shave, we've got you covered.
          </p>
          <div style="background: var(--glass); padding: 14px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.04); margin-bottom: 16px;">
            <div style="margin-bottom: 8px;"><strong>📍 Location:</strong> Moi avenue, Moi, Nairobi Area, Kenya 00100</div>
            <div style="margin-bottom: 8px;"><strong>⏰ Hours:</strong> Mon-Sat 8AM-8PM, Sun 9AM-6PM</div>
            <div><strong>📞 Phone:</strong> +2547 14 343 855</div>
          </div>
          <p style="color: var(--accent-2); font-size: 13px; margin: 0;">
            ✨ Book your appointment today and experience the difference!
          </p>
        </div>
        <div style="display: flex; justify-content: flex-end; gap: 10px;">
          <button class="btn-ghost" data-close-about>Close</button>
          <button class="btn-book" data-book-from-about>Book Now</button>
        </div>
      </div>
    `;

    document.body.appendChild(aboutModal);

    // Close handlers
    aboutModal.addEventListener('click', (e)=>{
      if(e.target.hasAttribute('data-close-about')){
        aboutModal.classList.remove('active');
        setTimeout(()=>aboutModal.remove(), 300);
      }
      if(e.target.hasAttribute('data-book-from-about')){
        aboutModal.classList.remove('active');
        setTimeout(()=>{
          aboutModal.remove();
          openModal();
        }, 300);
      }
    });

    // ESC key to close
    const escHandler = (e)=>{
      if(e.key === 'Escape'){
        aboutModal.classList.remove('active');
        setTimeout(()=>aboutModal.remove(), 300);
        window.removeEventListener('keydown', escHandler);
      }
    };
    window.addEventListener('keydown', escHandler);

    console.log('ℹ️ About modal displayed');
  }

  // Add click feedback to service cards
  function enhanceServiceCards(){
    const cards = qsa('.card');
    cards.forEach(card => {
      card.style.cursor = 'pointer';
      card.style.transition = 'transform 0.2s ease, box-shadow 0.2s ease';
      
      card.addEventListener('mouseenter', ()=>{
        card.style.transform = 'translateY(-4px)';
        card.style.boxShadow = '0 8px 24px rgba(255,122,89,0.15)';
      });
      
      card.addEventListener('mouseleave', ()=>{
        card.style.transform = 'translateY(0)';
        card.style.boxShadow = 'none';
      });
      
      card.addEventListener('click', ()=>{
        const serviceName = card.querySelector('h3')?.textContent;
        console.log('🎯 Service card clicked:', serviceName);
        
        // Pre-fill the booking form with selected service
        openModal();
        setTimeout(()=>{
          const serviceSelect = qs('#b-service');
          if(serviceSelect && serviceName){
            const option = Array.from(serviceSelect.options).find(o => (o.textContent || '').trim().startsWith(serviceName));
            if(option) serviceSelect.value = option.value;
          }
        }, 100);
      });
    });
  }

  // init on DOM ready
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', ()=>{
      attachBookButtons();
      attachNavigationButtons();
      enhanceServiceCards();
      console.log('✅ BarberPro booking system initialized');
    });
  }else{
    attachBookButtons();
    attachNavigationButtons();
    enhanceServiceCards();
    console.log('✅ BarberPro booking system initialized');
  }

})();
