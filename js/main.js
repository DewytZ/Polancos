document.addEventListener('DOMContentLoaded', () => {
    // 1. Register GSAP Plugins
    gsap.registerPlugin(ScrollTrigger);

    // 2. Initialize Lenis Smooth Scroll (Inertial Scroll to replicate ScrollSmoother)
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // easeOutExpo
        smoothWheel: true,
        autoRaf: false // Disable internal loop to avoid conflicts with GSAP ticker
    });

    // Connect Lenis to GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // 3. Interactive Sushi Roll Selection Data
    const rolls = [
        {
            id: "01",
            name: "GREÑUDO",
            price: "$125 MXN",
            desc: "Philadelphia, Aguacate, Pepino, Surimi empanizado, coronado con ajonjolí y salsa de Anguila. Por fuera Surimi desmechado, aderezo Chipotle y cebollín."
        },
        {
            id: "02",
            name: "SAN ANDRÉS",
            price: "$150 MXN",
            desc: "Pollo, camarón empanizado y tocino por dentro. Horneado con una mezcla cremosa de quesos y aderezo spicy, coronado con rodajas de chile serrano y salsa de anguila."
        },
        {
            id: "03",
            name: "AVOCADO ROLL",
            price: "$145 MXN",
            desc: "Philadelphia, aguacate, pepino, camarón, surimi empanizado. Forrado de aguacate con un topping de surimi frito, bañado con salsa de anguila, aderezo y coronado con ajonjolí."
        },
        {
            id: "04",
            name: "TIGRE SPECIAL",
            price: "$195 MXN",
            desc: "Queso, aguacate, res y camarón por dentro. Gratinado con res, pollo, tocino y chipotle; coronado de camarón empanizado, salsa de anguila, aderezo de chipotle y aderezo de cilantro con ajonjolí."
        }
    ];

    const tabs = document.querySelectorAll('.roll-tab');
    const nameEl = document.getElementById('roll-name');
    const priceEl = document.getElementById('roll-price');
    const descEl = document.getElementById('roll-desc');
    const numberEl = document.getElementById('roll-number');
    const detailsContainer = document.getElementById('roll-details-container');

    // Image Elements
    const imgGrenudo = document.getElementById('img-sushi-grenudo');
    const imgSanAndres = document.getElementById('img-sushi-san-andres');
    const imgAvocado = document.getElementById('img-sushi-avocado');
    const imgTigreReal = document.getElementById('img-sushi-tigre');
    const imgs = [imgGrenudo, imgSanAndres, imgAvocado, imgTigreReal];

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const index = parseInt(tab.getAttribute('data-index') || "0");
            const activeRoll = rolls[index];

            // Update Tabs Visual State
            tabs.forEach((t, i) => {
                const label = t.querySelector('span:nth-child(2)');
                const dot = t.querySelector('span:first-child');
                const border = t.querySelector('span:last-child');
                
                if (i === index) {
                    t.classList.remove('opacity-40');
                    label?.classList.add('text-sushi-white');
                    label?.classList.remove('text-neutral-400');
                    dot?.classList.add('text-sushi-red', 'font-bold');
                    dot?.classList.remove('text-neutral-500');
                    border?.classList.add('bg-sushi-red', 'w-full');
                    border?.classList.remove('bg-transparent', 'w-0');
                } else {
                    t.classList.add('opacity-40');
                    label?.classList.remove('text-sushi-white');
                    label?.classList.add('text-neutral-400');
                    dot?.classList.remove('text-sushi-red', 'font-bold');
                    dot?.classList.add('text-neutral-500');
                    border?.classList.remove('bg-sushi-red', 'w-full');
                    border?.classList.add('bg-transparent', 'w-0');
                }
            });

            // 1. Fast Image Switch (appear first)
            imgs.forEach((img, i) => {
                if (img) {
                    if (i === index) {
                        img.classList.remove('hidden');
                        gsap.fromTo(img, 
                            { opacity: 0, scale: 1.05 },
                            { opacity: 1, scale: 1, duration: 0.45, ease: 'power2.out' }
                        );
                    } else {
                        gsap.to(img, {
                            opacity: 0,
                            scale: 0.95,
                            duration: 0.45,
                            ease: 'power2.out',
                            onComplete: () => img.classList.add('hidden')
                        });
                    }
                }
            });

            // 2. Liquid slide-fade text reveal animation
            const textElements = [nameEl, priceEl, descEl];
            gsap.to(textElements, {
                opacity: 0,
                y: -10,
                duration: 0.25,
                ease: 'power2.in',
                stagger: 0.04,
                onComplete: () => {
                    // Update text values
                    if (nameEl && activeRoll.name) nameEl.textContent = activeRoll.name;
                    if (priceEl && activeRoll.price) priceEl.textContent = activeRoll.price;
                    if (descEl && activeRoll.desc) descEl.textContent = activeRoll.desc;
                    if (numberEl) numberEl.textContent = `${activeRoll.id} / 04`;

                    // Set initial state for reveal
                    gsap.set(textElements, { y: 15, opacity: 0 });

                    // Fade back in
                    gsap.to(textElements, {
                        opacity: 1,
                        y: 0,
                        duration: 0.45,
                        ease: 'power3.out',
                        stagger: 0.06
                    });
                }
            });
        });
    });

    // 4. Mobile Menu Toggle via GSAP
    const menuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (menuBtn && mobileMenu) {
        const spans = menuBtn.querySelectorAll('span');
        menuBtn.addEventListener('click', () => {
            const isOpen = !mobileMenu.classList.contains('hidden');
            
            if (isOpen) {
                gsap.to(mobileMenu, {
                    opacity: 0,
                    y: -10,
                    duration: 0.3,
                    ease: 'power2.in',
                    onComplete: () => mobileMenu.classList.add('hidden')
                });
                
                gsap.to(spans[0], { y: 0, rotate: 0, duration: 0.3 });
                gsap.to(spans[1], { opacity: 1, duration: 0.2 });
                gsap.to(spans[2], { y: 0, rotate: 0, duration: 0.3 });
            } else {
                mobileMenu.classList.remove('hidden');
                gsap.fromTo(mobileMenu, 
                    { opacity: 0, y: -10 },
                    { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
                );
                
                gsap.to(spans[0], { y: 6, rotate: 45, duration: 0.3 });
                gsap.to(spans[1], { opacity: 0, duration: 0.2 });
                gsap.to(spans[2], { y: -9, rotate: -45, duration: 0.3 });
            }
        });

        // Close menu when links are clicked
        const mobileLinks = mobileMenu.querySelectorAll('.mobile-link');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                gsap.to(mobileMenu, {
                    opacity: 0,
                    y: -10,
                    duration: 0.3,
                    ease: 'power2.in',
                    onComplete: () => mobileMenu.classList.add('hidden')
                });
                gsap.to(spans[0], { y: 0, rotate: 0, duration: 0.3 });
                gsap.to(spans[1], { opacity: 1, duration: 0.2 });
                gsap.to(spans[2], { y: 0, rotate: 0, duration: 0.3 });
            });
        });
    }

    // 5. GSAP Animations on Load (Entrance)
    gsap.set(".gsap-nav", { opacity: 0, y: -20 });
    gsap.set(".hero-title-line", { y: "135%" }); // Increased translation to 135% to fully mask the serif accent of 'Precisión'
    gsap.set([".gsap-hero-desc", ".gsap-hero-cta"], { opacity: 0, y: 15 });
    gsap.set(".gsap-hero-interactive", { opacity: 0, scale: 0.9 });
    gsap.set("#img-sushi-grenudo", { scale: 1.2 });

    // Entrance Timeline (First text letters, then the roll visualizer)
    const tl = gsap.timeline({ delay: 0.1 });
    
    // Navbar and Main title lines reveal first
    tl.to(".gsap-nav", { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" })
        .to(".hero-title-line", { y: 0, duration: 1.1, ease: "power4.out", stagger: 0.15 }, "-=0.4")
        
        // Description and CTA buttons slide in
        .to([".gsap-hero-desc", ".gsap-hero-cta"], { opacity: 1, y: 0, duration: 0.7, ease: "power2.out", stagger: 0.08 }, "-=0.6")
        
        // Sushi visualizer fades in and settles at the end of the timeline
        .to(".gsap-hero-interactive", { opacity: 1, scale: 1, duration: 0.9, ease: "power3.out" }, "-=0.3")
        
        // Smoothly scale down the image in parallel
        .to("#img-sushi-grenudo", { scale: 1, duration: 1.4, ease: "power2.out" }, "-=0.9");

    // 6. Scroll Trigger Animations
    gsap.from(".branches-title-line", {
        scrollTrigger: {
            trigger: "#sucursales",
            start: "top 85%"
        },
        y: "100%",
        duration: 1,
        ease: "power4.out",
        stagger: 0.15
    });

    gsap.from(".gsap-branch-card", {
        scrollTrigger: {
            trigger: "#sucursales",
            start: "top 75%"
        },
        opacity: 0,
        y: 40,
        duration: 1.2,
        ease: "expo.out",
        stagger: 0.15
    });

    // Creative Hover Micro-interactions
    const btns = document.querySelectorAll('.gsap-btn');
    btns.forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            const isRedBtn = btn.classList.contains('bg-sushi-red');
            gsap.to(btn, {
                scale: 1.03,
                boxShadow: isRedBtn ? '0 15px 30px rgba(230, 0, 18, 0.25)' : '0 10px 20px rgba(255, 255, 255, 0.05)',
                borderColor: isRedBtn ? '#E60012' : 'rgba(255, 255, 255, 0.25)',
                duration: 0.3,
                ease: 'power2.out'
            });
        });
        btn.addEventListener('mouseleave', () => {
            const isRedBtn = btn.classList.contains('bg-sushi-red');
            gsap.to(btn, {
                scale: 1,
                boxShadow: isRedBtn ? '0 20px 25px -5px rgba(230, 0, 18, 0.1), 0 10px 10px -5px rgba(230, 0, 18, 0.04)' : 'none',
                borderColor: isRedBtn ? '#E60012' : 'rgba(255, 255, 255, 0.1)',
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });

    const branchCards = document.querySelectorAll('.gsap-branch-card');
    branchCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            gsap.to(card, {
                scale: 1.02,
                borderColor: 'rgba(230, 0, 18, 0.25)',
                boxShadow: '0 15px 30px rgba(230, 0, 18, 0.03)',
                duration: 0.4,
                ease: 'power2.out'
            });
        });
        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                scale: 1,
                borderColor: 'rgba(255, 255, 255, 0.05)',
                boxShadow: 'none',
                duration: 0.4,
                ease: 'power2.out'
            });
        });
    });

    // Scroll Trigger Animations for Reservations Title
    gsap.from(".booking-title-line", {
        scrollTrigger: {
            trigger: "#reservar",
            start: "top 85%"
        },
        y: "100%",
        duration: 1,
        ease: "power4.out",
        stagger: 0.15
    });

    // 7. Dynamic Date and Time Constraints for Booking Form
    const sucursalSelect = document.getElementById('sucursal');
    const bookingDateInput = document.getElementById('fecha');
    const bookingTimeInput = document.getElementById('hora');

    const SUCURSALES_HORARIOS = {
        "Conquista": { open: "12:00", close: "21:45", label: "12:00 PM - 09:45 PM" },
        "Universitarios": { open: "10:00", close: "23:00", label: "10:00 AM - 11:00 PM" },
        "Valle Alto": { open: "12:00", close: "21:45", label: "12:00 PM - 09:45 PM" },
        "Plaza Sendero": { open: "10:00", close: "21:00", label: "10:00 AM - 09:00 PM" }
    };

    if (sucursalSelect && bookingDateInput && bookingTimeInput) {
        // Enable fields on sucursal change
        sucursalSelect.addEventListener('change', () => {
            const selectedSucursal = sucursalSelect.value;
            if (selectedSucursal) {
                bookingDateInput.disabled = false;
                bookingTimeInput.disabled = false;
                updateTimeConstraints();
            } else {
                bookingDateInput.disabled = true;
                bookingTimeInput.disabled = true;
                bookingDateInput.value = "";
                bookingTimeInput.value = "";
            }
        });

        // Function to update constraints dynamically
        const updateTimeConstraints = () => {
            const selectedSucursal = sucursalSelect.value;
            if (!selectedSucursal) return;

            const horario = SUCURSALES_HORARIOS[selectedSucursal];
            if (!horario) return;

            const now = new Date();
            let minDate = new Date(now);

            // Parse opening and closing hours
            const [openHour, openMinute] = horario.open.split(':').map(Number);
            const [closeHour, closeMinute] = horario.close.split(':').map(Number);

            const currentHour = now.getHours();
            const currentMinute = now.getMinutes();

            const isPastClosingToday = (currentHour > closeHour) || (currentHour === closeHour && currentMinute >= closeMinute);

            // If past closing today, reservations start tomorrow
            if (isPastClosingToday) {
                minDate.setDate(minDate.getDate() + 1);
            }

            // Max date: 1 week from min date
            const maxDate = new Date(minDate);
            maxDate.setDate(maxDate.getDate() + 7);

            const formatDate = (d) => {
                const year = d.getFullYear();
                const month = String(d.getMonth() + 1).padStart(2, '0');
                const day = String(d.getDate()).padStart(2, '0');
                return `${year}-${month}-${day}`;
            };

            const minDateString = formatDate(minDate);
            bookingDateInput.min = minDateString;
            bookingDateInput.max = formatDate(maxDate);

            // Default or adjust date value if out of bounds
            if (!bookingDateInput.value || bookingDateInput.value < minDateString || bookingDateInput.value > bookingDateInput.max) {
                bookingDateInput.value = minDateString;
            }

            // Update time inputs min and max
            const selectedDate = bookingDateInput.value;
            const todayString = formatDate(now);

            if (selectedDate === todayString) {
                // Same day: min is current hour/minute OR opening hour (whichever is later)
                let minHour = currentHour;
                let minMinute = currentMinute;

                if (minHour < openHour || (minHour === openHour && minMinute < openMinute)) {
                    minHour = openHour;
                    minMinute = openMinute;
                }

                const minTimeStr = `${String(minHour).padStart(2, '0')}:${String(minMinute).padStart(2, '0')}`;
                bookingTimeInput.min = minTimeStr;
                bookingTimeInput.max = horario.close;

                if (bookingTimeInput.value && (bookingTimeInput.value < minTimeStr || bookingTimeInput.value > horario.close)) {
                    bookingTimeInput.value = minTimeStr;
                }
            } else {
                // Future days: min is opening hour, max is closing hour
                bookingTimeInput.min = horario.open;
                bookingTimeInput.max = horario.close;

                if (bookingTimeInput.value && (bookingTimeInput.value < horario.open || bookingTimeInput.value > horario.close)) {
                    bookingTimeInput.value = horario.open;
                }
            }
        };

        bookingDateInput.addEventListener('change', updateTimeConstraints);

        // 8. Booking Form Submission Logic
        const bookingForm = document.getElementById('booking-form');
        const bookingFeedback = document.getElementById('booking-feedback');
        const feedbackSpinner = document.getElementById('feedback-spinner');
        const feedbackSuccessCheck = document.getElementById('feedback-success-check');
        const feedbackTitle = document.getElementById('feedback-title');
        const feedbackDesc = document.getElementById('feedback-desc');
        const feedbackBtn = document.getElementById('feedback-btn');

        if (bookingForm && bookingFeedback) {
            bookingForm.addEventListener('submit', async (e) => {
                e.preventDefault();

                // Show loading feedback state
                bookingFeedback.classList.remove('hidden');
                gsap.to(bookingFeedback, { opacity: 1, duration: 0.4, ease: 'power2.out' });
                
                if (feedbackSpinner) feedbackSpinner.classList.remove('hidden');
                if (feedbackSuccessCheck) feedbackSuccessCheck.classList.add('hidden');
                if (feedbackTitle) feedbackTitle.textContent = 'Enviando...';
                if (feedbackDesc) feedbackDesc.textContent = 'Procesando tu solicitud de reservación. Por favor espera.';
                if (feedbackBtn) feedbackBtn.classList.add('hidden');

                // Collect input values using Spanish keys to match GAS properties
                const formData = new FormData(bookingForm);
                const data = {
                    nombre: formData.get('nombre'),
                    whatsapp: formData.get('whatsapp'),
                    fecha: formData.get('fecha'),
                    hora: formData.get('hora'),
                    personas: formData.get('personas'),
                    sucursal: formData.get('sucursal')
                };

                const ENDPOINT_URL = 'https://script.google.com/macros/s/AKfycbzJq_F1uu0DfTBRvMSJBLxk0bwE6_mWeuV_KiKXl6Tr0GxayD4nt6FoxKtGZCRRI_NnUg/exec';

                try {
                    let response;
                    if (ENDPOINT_URL === '#') {
                        // Simulate delay
                        await new Promise(resolve => setTimeout(resolve, 1500));
                        response = { ok: true };
                    } else {
                        // Send request with mode: 'no-cors'
                        await fetch(ENDPOINT_URL, {
                            method: 'POST',
                            mode: 'no-cors',
                            headers: {
                                'Content-Type': 'text/plain;charset=utf-8'
                            },
                            body: JSON.stringify(data)
                        });
                        response = { ok: true };
                    }

                    if (response.ok) {
                        // Success State
                        if (feedbackSpinner) feedbackSpinner.classList.add('hidden');
                        if (feedbackSuccessCheck) feedbackSuccessCheck.classList.remove('hidden');
                        if (feedbackTitle) feedbackTitle.textContent = '¡Reservación recibida!';
                        if (feedbackDesc) feedbackDesc.textContent = 'Nos comunicaremos por WhatsApp para confirmar.';
                        if (feedbackBtn) {
                            feedbackBtn.classList.remove('hidden');
                            feedbackBtn.onclick = () => {
                                gsap.to(bookingFeedback, { 
                                    opacity: 0, 
                                    duration: 0.3, 
                                    ease: 'power2.in',
                                    onComplete: () => {
                                        bookingFeedback.classList.add('hidden');
                                        bookingForm.reset();
                                        bookingDateInput.disabled = true;
                                        bookingTimeInput.disabled = true;
                                    }
                                });
                            };
                        }
                    } else {
                        throw new Error('Server error');
                    }
                } catch (error) {
                    // Error State
                    if (feedbackSpinner) feedbackSpinner.classList.add('hidden');
                    if (feedbackSuccessCheck) feedbackSuccessCheck.classList.add('hidden');
                    if (feedbackTitle) feedbackTitle.textContent = 'Error al Enviar';
                    if (feedbackDesc) feedbackDesc.textContent = 'Ocurrió un problema de red. Por favor intenta de nuevo.';
                    if (feedbackBtn) {
                        feedbackBtn.classList.remove('hidden');
                        feedbackBtn.onclick = () => {
                            gsap.to(bookingFeedback, { 
                                opacity: 0, 
                                duration: 0.3, 
                                ease: 'power2.in',
                                onComplete: () => bookingFeedback.classList.add('hidden')
                            });
                        };
                    }
                }
            });
        }
    }
});
