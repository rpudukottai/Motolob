document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       ELEMENTS
    ====================================================== */

    const body = document.body;

    const pageLoader = document.getElementById("pageLoader");

    const siteHeader = document.getElementById("siteHeader");

    const themeToggle = document.getElementById("themeToggle");

    const menuToggle = document.getElementById("menuToggle");

    const mobileNav = document.getElementById("mobileNav");

    const mobileNavLinks =
        document.querySelectorAll(".mobile-nav-link");

    const navLinks =
        document.querySelectorAll(".nav-link");

    const sections =
        document.querySelectorAll("main section[id]");


    /* =====================================================
       PAGE LOADER
    ====================================================== */

    window.addEventListener("load", () => {

        setTimeout(() => {

            if (pageLoader) {
                pageLoader.classList.add("hidden");
            }

        }, 500);

    });


    /* =====================================================
       AUTOMATIC THEME SYSTEM
       
       06:00 → 17:59 = LIGHT
       18:00 → 05:59 = DARK
    ====================================================== */

    const THEME_STORAGE_KEY = "motolob-theme";
    const THEME_MODE_KEY = "motolob-theme-mode";


    function getAutomaticTheme() {

        const currentHour = new Date().getHours();

        /*
            Day:
            06:00 - 17:59

            Night:
            18:00 - 05:59
        */

        if (currentHour >= 18 || currentHour < 6) {
            return "dark";
        }

        return "light";
    }


    function applyTheme(theme) {

        if (theme === "dark") {

            body.classList.add("dark-theme");

        } else {

            body.classList.remove("dark-theme");

        }

    }


    function applyAutomaticTheme() {

        /*
            If the visitor has manually selected
            a theme, don't override it.
        */

        const themeMode =
            localStorage.getItem(THEME_MODE_KEY);

        if (themeMode === "manual") {
            return;
        }


        const automaticTheme =
            getAutomaticTheme();

        applyTheme(automaticTheme);

    }


    /* =====================================================
       INITIAL THEME
    ====================================================== */

    function initializeTheme() {

        const savedTheme =
            localStorage.getItem(THEME_STORAGE_KEY);

        const themeMode =
            localStorage.getItem(THEME_MODE_KEY);


        /*
            Manual preference exists
        */

        if (
            savedTheme &&
            themeMode === "manual"
        ) {

            applyTheme(savedTheme);

            return;

        }


        /*
            Otherwise use automatic theme
        */

        localStorage.setItem(
            THEME_MODE_KEY,
            "automatic"
        );

        applyTheme(getAutomaticTheme());

    }


    initializeTheme();


    /* =====================================================
       THEME TOGGLE
    ====================================================== */

    if (themeToggle) {

        themeToggle.addEventListener(
            "click",
            () => {

                const isDark =
                    body.classList.contains("dark-theme");


                const newTheme =
                    isDark ? "light" : "dark";


                /*
                    Apply selected theme
                */

                applyTheme(newTheme);


                /*
                    Remember user's manual choice
                */

                localStorage.setItem(
                    THEME_STORAGE_KEY,
                    newTheme
                );

                localStorage.setItem(
                    THEME_MODE_KEY,
                    "manual"
                );


                /*
                    Accessibility
                */

                themeToggle.setAttribute(
                    "aria-label",
                    newTheme === "dark"
                        ? "Switch to light theme"
                        : "Switch to dark theme"
                );

            }
        );

    }


    /* =====================================================
       AUTOMATIC THEME REFRESH
       
       Checks every minute.
       
       This means if someone keeps the website open
       across 6:00 AM or 6:00 PM, the theme can change.
    ====================================================== */

    setInterval(() => {

        const themeMode =
            localStorage.getItem(THEME_MODE_KEY);


        /*
            Only automatic mode should change
            according to the time.
        */

        if (themeMode !== "manual") {

            applyTheme(getAutomaticTheme());

        }

    }, 60 * 1000);


    /* =====================================================
       OPTIONAL:
       RESET MANUAL THEME AFTER A NEW DAY
       
       This keeps the normal automatic system simple.
       
       If the visitor manually selects a theme,
       their choice stays until they switch back.
    ====================================================== */


    /* =====================================================
       STICKY HEADER
    ====================================================== */

    function updateHeader() {

        if (!siteHeader) {
            return;
        }

        if (window.scrollY > 30) {

            siteHeader.classList.add("scrolled");

        } else {

            siteHeader.classList.remove("scrolled");

        }

    }


    window.addEventListener(
        "scroll",
        updateHeader,
        { passive: true }
    );


    updateHeader();


    /* =====================================================
       MOBILE MENU
    ====================================================== */

    function closeMobileMenu() {

        if (!menuToggle || !mobileNav) {
            return;
        }

        menuToggle.classList.remove("active");

        menuToggle.setAttribute(
            "aria-expanded",
            "false"
        );

        menuToggle.setAttribute(
            "aria-label",
            "Open menu"
        );

        mobileNav.classList.remove("open");

    }


    function openMobileMenu() {

        if (!menuToggle || !mobileNav) {
            return;
        }

        menuToggle.classList.add("active");

        menuToggle.setAttribute(
            "aria-expanded",
            "true"
        );

        menuToggle.setAttribute(
            "aria-label",
            "Close menu"
        );

        mobileNav.classList.add("open");

    }


    if (menuToggle) {

        menuToggle.addEventListener(
            "click",
            () => {

                const isOpen =
                    mobileNav.classList.contains("open");


                if (isOpen) {

                    closeMobileMenu();

                } else {

                    openMobileMenu();

                }

            }
        );

    }


    /* =====================================================
       CLOSE MOBILE MENU AFTER CLICKING LINK
    ====================================================== */

    mobileNavLinks.forEach((link) => {

        link.addEventListener(
            "click",
            () => {

                closeMobileMenu();

            }
        );

    });


    /* =====================================================
       CLOSE MOBILE MENU WHEN CLICKING OUTSIDE
    ====================================================== */

    document.addEventListener(
        "click",
        (event) => {

            if (!mobileNav || !menuToggle) {
                return;
            }


            const clickedInsideMenu =
                mobileNav.contains(event.target);


            const clickedMenuButton =
                menuToggle.contains(event.target);


            if (
                !clickedInsideMenu &&
                !clickedMenuButton
            ) {

                closeMobileMenu();

            }

        }
    );


    /* =====================================================
       CLOSE MOBILE MENU WITH ESCAPE
    ====================================================== */

    document.addEventListener(
        "keydown",
        (event) => {

            if (event.key === "Escape") {

                closeMobileMenu();

            }

        }
    );


    /* =====================================================
       ACTIVE NAVIGATION LINK
    ====================================================== */

    function updateActiveNavigation() {

        const scrollPosition =
            window.scrollY + 160;


        sections.forEach((section) => {

            const sectionTop =
                section.offsetTop;

            const sectionHeight =
                section.offsetHeight;

            const sectionId =
                section.getAttribute("id");


            if (
                scrollPosition >= sectionTop &&
                scrollPosition <
                sectionTop + sectionHeight
            ) {

                navLinks.forEach((link) => {

                    link.classList.remove("active");

                });


                const activeLink =
                    document.querySelector(
                        `.nav-link[href="#${sectionId}"]`
                    );


                if (activeLink) {

                    activeLink.classList.add("active");

                }

            }

        });

    }


    window.addEventListener(
        "scroll",
        updateActiveNavigation,
        { passive: true }
    );


    updateActiveNavigation();


    /* =====================================================
       SCROLL REVEAL
    ====================================================== */

    /*
        Add .reveal to elements dynamically.

        We don't need to modify every element manually.
    */

    const revealTargets =
        document.querySelectorAll(
            ".section-heading, " +
            ".product-card, " +
            ".about-content, " +
            ".service-item, " +
            ".contact-container"
        );


    revealTargets.forEach((element) => {

        element.classList.add("reveal");

    });


    /*
        IntersectionObserver watches when elements
        enter the viewport.
    */

    const revealObserver =
        new IntersectionObserver(
            (entries, observer) => {

                entries.forEach((entry) => {

                    if (entry.isIntersecting) {

                        entry.target.classList.add(
                            "visible"
                        );


                        /*
                            Once visible, stop observing
                            to improve performance.
                        */

                        observer.unobserve(
                            entry.target
                        );

                    }

                });

            },
            {
                threshold: 0.12,

                rootMargin:
                    "0px 0px -50px 0px"
            }
        );


    revealTargets.forEach((element) => {

        revealObserver.observe(element);

    });


    /* =====================================================
       PRODUCT CARD STAGGER
    ====================================================== */

    const productCards =
        document.querySelectorAll(
            ".product-card"
        );


    productCards.forEach(
        (card, index) => {

            card.style.transitionDelay =
                `${index * 80}ms`;

        }
    );


    /* =====================================================
       SERVICE ITEM STAGGER
    ====================================================== */

    const serviceItems =
        document.querySelectorAll(
            ".service-item"
        );


    serviceItems.forEach(
        (item, index) => {

            item.style.transitionDelay =
                `${index * 80}ms`;

        }
    );


    /* =====================================================
       SMOOTH ANCHOR NAVIGATION
    ====================================================== */

    const anchorLinks =
        document.querySelectorAll(
            'a[href^="#"]'
        );


    anchorLinks.forEach((link) => {

        link.addEventListener(
            "click",
            (event) => {

                const targetId =
                    link.getAttribute("href");


                if (
                    !targetId ||
                    targetId === "#"
                ) {
                    return;
                }


                const target =
                    document.querySelector(
                        targetId
                    );


                if (!target) {
                    return;
                }


                event.preventDefault();


                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }
        );

    });


    /* =====================================================
       CURRENT YEAR
    ====================================================== */

    const yearElements =
        document.querySelectorAll(
            "[data-current-year]"
        );


    yearElements.forEach((element) => {

        element.textContent =
            new Date().getFullYear();

    });


    /* =====================================================
       CONSOLE BRANDING
    ====================================================== */

    console.log(
        "%c MOTOLOB ",
        "background:#FE9900;color:#682A00;font-size:20px;font-weight:bold;padding:8px 14px;border-radius:6px;"
    );

    console.log(
        "Reliable Products. Local Service."
    );

});