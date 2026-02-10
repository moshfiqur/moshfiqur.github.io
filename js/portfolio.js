  document.addEventListener('DOMContentLoaded', function () {
    var storageKey = 'theme-preference';
    var mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    var controls = Array.prototype.slice.call(document.querySelectorAll('[data-theme-value]'));
    var toggleRoot = document.querySelector('[data-theme-toggle]');
    var trigger = toggleRoot ? toggleRoot.querySelector('[data-theme-toggle-trigger]') : null;
    var menu = toggleRoot ? toggleRoot.querySelector('.theme-toggle-menu') : null;
    var expandedClass = 'is-open';
    var isMenuOpen = false;

    function sanitizePreference(value) {
      return value === 'light' || value === 'dark' || value === 'system' ? value : 'system';
    }

    function readStoredPreference() {
      try {
        return sanitizePreference(localStorage.getItem(storageKey));
      } catch (error) {
        return 'system';
      }
    }

    var preference = readStoredPreference();

    function resolveEffectiveTheme(value) {
      if (value === 'light' || value === 'dark') {
        return value;
      }
      return mediaQuery.matches ? 'dark' : 'light';
    }

    function reflectPreference() {
      var effective = resolveEffectiveTheme(preference);
      document.documentElement.setAttribute('data-theme', effective);
      document.documentElement.setAttribute('data-theme-preference', preference);

      var label = preference;

      controls.forEach(function (control, index) {
        var value = sanitizePreference(control.getAttribute('data-theme-value'));
        var isActive = value === preference;
        control.classList.toggle('is-active', isActive);
        control.setAttribute('aria-selected', isActive ? 'true' : 'false');
        control.setAttribute('tabindex', isActive ? '0' : '-1');
        if (isActive) {
          label = control.textContent.trim();
        }
      });

      if (trigger) {
        trigger.textContent = label.charAt(0).toUpperCase() + label.slice(1);
      }
    }

    function setPreference(value) {
      var nextPreference = sanitizePreference(value);
      if (preference === nextPreference) {
        reflectPreference();
        return;
      }
      preference = nextPreference;
      try {
        localStorage.setItem(storageKey, preference);
      } catch (error) {
        // Ignore write failures (e.g., storage disabled)
      }
      reflectPreference();
      closeMenu();
    }

    controls.forEach(function (control) {
      control.addEventListener('click', function () {
        setPreference(control.getAttribute('data-theme-value'));
      });
      control.addEventListener('keydown', function (event) {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          setPreference(control.getAttribute('data-theme-value'));
        }
      });
    });

    function focusControlAt(index) {
      if (!controls.length) {
        return;
      }
      var safeIndex = (index + controls.length) % controls.length;
      var control = controls[safeIndex];
      if (control) {
        control.focus();
      }
    }

    function getActiveIndex() {
      for (var i = 0; i < controls.length; i++) {
        if (controls[i].classList.contains('is-active')) {
          return i;
        }
      }
      return 0;
    }

    function openMenu() {
      if (!menu || !trigger || isMenuOpen) {
        return;
      }
      menu.classList.add(expandedClass);
      trigger.setAttribute('aria-expanded', 'true');
      isMenuOpen = true;
      focusControlAt(getActiveIndex());
    }

    function closeMenu() {
      if (!menu || !trigger || !isMenuOpen) {
        if (trigger) {
          trigger.setAttribute('aria-expanded', 'false');
        }
        return;
      }
      menu.classList.remove(expandedClass);
      trigger.setAttribute('aria-expanded', 'false');
      isMenuOpen = false;
    }

    function toggleMenu(explicitState) {
      if (!trigger || !menu) {
        return;
      }
      var shouldOpen = typeof explicitState === 'boolean' ? explicitState : !isMenuOpen;
      if (shouldOpen) {
        openMenu();
      } else {
        closeMenu();
      }
    }

    if (trigger) {
      trigger.addEventListener('click', function () {
        toggleMenu();
      });

      trigger.addEventListener('keydown', function (event) {
        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
          event.preventDefault();
          openMenu();
        }
      });
    }

    if (menu) {
      menu.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
          event.preventDefault();
          closeMenu();
          if (trigger) {
            trigger.focus();
          }
          return;
        }

        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
          event.preventDefault();
          var direction = event.key === 'ArrowDown' ? 1 : -1;
          focusControlAt(getActiveIndex() + direction);
        }
      });
    }

    document.addEventListener('click', function (event) {
      if (!isMenuOpen || !toggleRoot) {
        return;
      }
      if (!toggleRoot.contains(event.target)) {
        closeMenu();
      }
    });

    document.addEventListener('focusin', function (event) {
      if (!isMenuOpen || !toggleRoot) {
        return;
      }
      if (!toggleRoot.contains(event.target)) {
        closeMenu();
      }
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        closeMenu();
        if (trigger && document.activeElement && !toggleRoot.contains(document.activeElement)) {
          trigger.blur();
        }
      }
    });

    function handleSystemThemeChange() {
      if (preference === 'system') {
        reflectPreference();
      }
    }

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', handleSystemThemeChange);
    } else if (typeof mediaQuery.addListener === 'function') {
      mediaQuery.addListener(handleSystemThemeChange);
    }

    reflectPreference();
  });
  document.addEventListener('DOMContentLoaded', function () {
    var carousels = Array.prototype.slice.call(document.querySelectorAll('.portfolio-carousel'));

    carousels.forEach(function (carousel) {
      initializeCarousel(carousel);
    });

    function initializeCarousel(carousel) {
      var slidesWrapper = carousel.querySelector('.portfolio-slides');
      var slides = Array.prototype.slice.call(carousel.querySelectorAll('.portfolio-slide'));

      if (!slidesWrapper || !slides.length) {
        return;
      }

      var prevButton = carousel.querySelector('.portfolio-nav.prev');
      var nextButton = carousel.querySelector('.portfolio-nav.next');
      var metaRow = carousel.querySelector('.portfolio-meta');
      var dotsWrapper = carousel.querySelector('.portfolio-dots');
      var counterEl = carousel.querySelector('.portfolio-counter');

      if (!dotsWrapper && metaRow) {
        dotsWrapper = document.createElement('div');
        dotsWrapper.className = 'portfolio-dots';
        metaRow.appendChild(dotsWrapper);
      }

      if (dotsWrapper) {
        dotsWrapper.innerHTML = '';
      }

      var startingIndex = 0;
      for (var i = 0; i < slides.length; i++) {
        if (slides[i].classList.contains('is-active')) {
          startingIndex = i;
          break;
        }
      }

      var currentIndex = startingIndex;
      var totalSlides = slides.length;

      var motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      var prefersReducedMotion = motionQuery.matches;

      function handleMotionChange(event) {
        prefersReducedMotion = event.matches;
        setWrapperHeight(slides[currentIndex]);
      }

      if (typeof motionQuery.addEventListener === 'function') {
        motionQuery.addEventListener('change', handleMotionChange);
      } else if (typeof motionQuery.addListener === 'function') {
        motionQuery.addListener(handleMotionChange);
      }

      var dots = [];
      if (dotsWrapper) {
        for (var d = 0; d < slides.length; d++) {
          var dot = document.createElement('button');
          dot.type = 'button';
          dot.className = 'portfolio-dot' + (d === currentIndex ? ' is-active' : '');
          dot.setAttribute('aria-label', 'Show ' + (slides[d].getAttribute('data-title') || 'portfolio') + ' project');
          dot.setAttribute('aria-current', d === currentIndex ? 'true' : 'false');
          (function (index) {
            dot.addEventListener('click', function () {
              goToSlide(index);
            });
          })(d);
          dotsWrapper.appendChild(dot);
          dots.push(dot);
        }
      }

      slides.forEach(function (slide, idx) {
        slide.classList.toggle('is-active', idx === currentIndex);
        slide.setAttribute('aria-hidden', idx === currentIndex ? 'false' : 'true');
        slide.classList.remove('entering-from-left', 'entering-from-right', 'exiting-left', 'exiting-right');
      });

      var isAnimating = false;

      function setWrapperHeight(slide) {
        if (!slidesWrapper || !slide) {
          return;
        }
        slidesWrapper.style.height = slide.offsetHeight + 'px';
      }

      function updateCounter() {
        if (!counterEl) {
          return;
        }
        counterEl.textContent = padNumber(currentIndex + 1) + ' / ' + padNumber(totalSlides);
      }

      function updateNavState() {
        if (prevButton) {
          var prevDisabled = currentIndex === 0;
          prevButton.classList.toggle('disabled', prevDisabled);
          prevButton.setAttribute('aria-disabled', prevDisabled);
        }
        if (nextButton) {
          var nextDisabled = currentIndex === totalSlides - 1;
          nextButton.classList.toggle('disabled', nextDisabled);
          nextButton.setAttribute('aria-disabled', nextDisabled);
        }
      }

      function updateDotsState() {
        if (!dots.length) {
          return;
        }
        dots.forEach(function (dot, idx) {
          dot.classList.toggle('is-active', idx === currentIndex);
          dot.setAttribute('aria-current', idx === currentIndex ? 'true' : 'false');
        });
      }

      function clearAnimationClasses(slide) {
        slide.classList.remove('entering-from-left', 'entering-from-right', 'exiting-left', 'exiting-right');
      }

      function goToSlide(targetIndex) {
        if (targetIndex < 0 || targetIndex >= totalSlides || targetIndex === currentIndex || isAnimating) {
          return;
        }

        var currentSlide = slides[currentIndex];
        var nextSlide = slides[targetIndex];
        var direction = targetIndex > currentIndex ? 'next' : 'prev';

        if (prefersReducedMotion) {
          clearAnimationClasses(currentSlide);
          currentSlide.classList.remove('is-active');
          currentSlide.setAttribute('aria-hidden', 'true');

          clearAnimationClasses(nextSlide);
          nextSlide.classList.add('is-active');
          nextSlide.setAttribute('aria-hidden', 'false');
          setWrapperHeight(nextSlide);

          currentIndex = targetIndex;
          updateDotsState();
          updateCounter();
          updateNavState();
          return;
        }

        isAnimating = true;

        var exitClass = direction === 'next' ? 'exiting-left' : 'exiting-right';
        var enterClass = direction === 'next' ? 'entering-from-right' : 'entering-from-left';

        clearAnimationClasses(currentSlide);
        clearAnimationClasses(nextSlide);

        nextSlide.classList.add(enterClass);
        nextSlide.setAttribute('aria-hidden', 'false');

        void nextSlide.offsetWidth;

        nextSlide.classList.add('is-active');
        setWrapperHeight(nextSlide);

        currentSlide.classList.add(exitClass);

        var handleCurrentTransitionEnd = function (event) {
          if (event.target !== currentSlide || event.propertyName !== 'transform') {
            return;
          }
          currentSlide.classList.remove(exitClass, 'is-active');
          currentSlide.setAttribute('aria-hidden', 'true');
          currentSlide.removeEventListener('transitionend', handleCurrentTransitionEnd);
        };

        var handleNextTransitionEnd = function (event) {
          if (event.target !== nextSlide || event.propertyName !== 'transform') {
            return;
          }
          nextSlide.classList.remove(enterClass);
          nextSlide.removeEventListener('transitionend', handleNextTransitionEnd);
          isAnimating = false;
        };

        currentSlide.addEventListener('transitionend', handleCurrentTransitionEnd);
        nextSlide.addEventListener('transitionend', handleNextTransitionEnd);

        currentIndex = targetIndex;
        updateDotsState();
        updateCounter();
        updateNavState();
      }

      if (prevButton && totalSlides > 1) {
        prevButton.addEventListener('click', function () {
          goToSlide(currentIndex - 1);
        });
      }

      if (nextButton && totalSlides > 1) {
        nextButton.addEventListener('click', function () {
          goToSlide(currentIndex + 1);
        });
      }

      carousel.addEventListener('keydown', function (event) {
        if (event.key === 'ArrowLeft') {
          goToSlide(currentIndex - 1);
        } else if (event.key === 'ArrowRight') {
          goToSlide(currentIndex + 1);
        }
      });

      window.addEventListener('resize', function () {
        setWrapperHeight(slides[currentIndex]);
      });

      window.addEventListener('load', function () {
        setWrapperHeight(slides[currentIndex]);
      });

      setWrapperHeight(slides[currentIndex]);
      updateDotsState();
      updateCounter();
      updateNavState();
    }

    function padNumber(value) {
      return value < 10 ? '0' + value : String(value);
    }
  });

  document.addEventListener('DOMContentLoaded', function () {
    var galleryMap = {
      artemis: [
        '01_SplashScreen.png',
        '02_Registration.png',
        '03_Home.png',
        '04_Home2.png',
        '05_ClubHome.png',
        '06_ClubChat.png',
        '07_UserProfile.png'
      ],
      beauticator: [
        '0.png',
        '1.png',
        '2.png',
        '3.png',
        '4.png',
        '5.png'
      ],
      cinemated: [
        '01_Home.png',
        '02_Movies_of_the_Year.png',
        '03_Popular_Movies.png',
        '04_Recently_Released_Movies.png',
        '05_User_Preferences_Director.png',
        '06_User_Preferences_Favorite_Movies.png',
        '07_User_Preferences_Production_House.png',
        '08_User_Preferences_Set_Success.png',
        '09_User_Preferences_Select_Actors.png',
        '10_User_Preferences_Set_Genres.png',
        '10_User_Preferences_Set_Movies_Styles.png',
        '11_User_Preferences_Set_Genres.png',
        '12_Watchlist_Movies.png',
        '13_User_Profile.png',
        '14_Upload_Profile_Image.png',
        '15_Edit_Profile.png',
        '16_Liked_Movies.png',
        '17_Menu.png',
        '18_Movie_Recommendation.png'
      ],
      gutenberg: [
        '01_SplashScreen.png',
        '02_Home.png',
        '03_Reading.png',
        '04_Menu.png',
        '05_Search.png'
      ],
      klara: [
        '01_Splash.png',
        '02_Practice_Sentences.png',
        '03_Parts_of_Speech.png',
        '04_Parts_of_Speech_with_Audio.png',
        '05_Parts_of_Speech_Examples.png',
        '06_Parts_of_Speech_Verbs.png',
        '07_Practice_Youtube_Videos.png',
        '08_Practice_Youtube_Videos_Add_Note.png',
        '09_Practice_Video3.png'
      ],
      yegdoo: [
        '00_SplashLogo.png',
        '01_Splash.png',
        '02_Registration.png',
        '03_Home.png',
        '04_Settings.png',
        '05_User_Profile.png',
        '05_User_Profile2.png',
        '06_Bookmarked_User.png',
        '07_Edit_Profile.png',
        '08_Chat.png',
        '09_Chat2.png'
      ],
      booksmart: [
        '01_Cluttered_Browser_Long.png',
        '02_Cluttered_Browser.png',
        '03_Settings1.png',
        '04_Settings2.png',
        '05_Settings3.png',
        '06_Settings4.png',
        '07_Action_Window.png',
        '08_Bookmark_Tab_Groups.png',
        '09_Bookmark_Categories.png',
        '10_Bookmark_Sessions.png'
      ],
      'creative-storyboard-api': [
        '01_APIDoc1.png',
        '02_APIDoc2.png',
        '03_APIDoc3.png',
        '04_APIDoc4.png',
        '05_APIDoc5.png'
      ],
      royalia: [
        '01_Login.png',
        '02_UserProfile.png',
        '03_Album.png'
      ],
      'creative-storyboard': [
        '01_Landing.png',
        '02_Home.png',
        '03_Profile.png',
        '04_ProjectHome.png',
        '05_Scenes.png',
        '06_SceneHome.png',
        '07_ShotHome.png',
        '08_PreviewImage.png',
        '09_AudioLibrary.png',
        '10_MyProjects.png'
      ]
    };

    var projectDetails = {
      beauticator: {
        title: "Beauticator",
        subtitle: "Your AI Selfie Companion",
        tech: "Flutter · TensorFlow · MySQL · Firebase",
        screencast: "https://youtu.be/PR-nuKs5f1s",
        description: [
          "Beauticator is an AI-powered mobile app designed to enhance your selfie experience. Built using Flutter, TensorFlow, MySQL, and Firebase, it combines cutting-edge technology with a seamless user experience.",
          "The app runs a locally hosted TensorFlow CNN model to process images directly on your device, ensuring privacy and speed. Users can take pictures using the camera or select images from the gallery, and the app evaluates the aesthetic appeal with advanced machine learning.",
          "Whether you're capturing moments or perfecting your selfies, Beauticator is your trusted AI companion for instant feedback and fun!"
        ]
      },
      yegdoo: {
        title: "Yegdoo",
        subtitle: "Where Minds Meet Before Faces",
        tech: "Flutter · MySQL · Firebase",
        screencast: "https://youtu.be/CVBDpgK33Kg",
        description: [
          "Yegdoo is a unique dating app designed for sapiosexuals--those who value intellect and personality above all else. Built using Flutter, MySQL, and Firebase, it creates a safe and engaging space for meaningful connections.",
          "In Yegdoo, users can chat and get to know each other without seeing profile pictures. Once they feel a genuine connection, they can choose to reveal their photos, ensuring relationships are built on personality and shared interests first.",
          "Yegdoo is the perfect platform for those who believe that true attraction starts with the mind."
        ]
      },
      cinemated: {
        title: "Cinemated",
        subtitle: "No One Understands Your Movie Taste Better Than Us",
        tech: "Flutter · TensorFlow · MySQL · Firebase",
        screencast: "https://youtu.be/J2_83rGoJPs",
        description: [
          "Cinemated is an AI-powered movie recommendation app designed to cater to your unique cinematic preferences. Built using Flutter, TensorFlow, MySQL, and Firebase, it blends advanced machine learning with a friendly interface.",
          "Users can set up their profiles by liking movies, genres, actors, directors, and even production houses. The AI analyzes these preferences to recommend films tailored to their tastes.",
          "Cinemated goes beyond the usual genres, surfacing special categories like horror films in eerie castles or whodunits with charming detectives, so every movie night is a hit."
        ]
      },
      artemis: {
        title: "Artemis",
        subtitle: "Your Virtual Club Experience, Anytime, Anywhere.",
        tech: "Flutter · MySQL · Firebase",
        screencast: "https://youtu.be/_ApXFTfjofw",
        description: [
          "Artemis is a virtual club app that brings the essence of real-world clubs to the digital space. Built using Flutter, MySQL, and Firebase, it helps people discover communities around their passions.",
          "Users can join clubs for sports, literature, movies, comedy, or location-based meetups, with thoughtful entry limits to keep the vibe balanced. They can buy virtual drinks for others and spark one-to-one chats that feel natural and personal.",
          "Whether you are sharing a passion, meeting like-minded individuals, or simply unwinding, Artemis creates an immersive club experience anywhere."
        ]
      },
      klara: {
        title: "Klara",
        subtitle: "Your Personal German Learning Assistant",
        tech: "Flutter · MySQL · Firebase",
        screencast: "https://youtu.be/4j9suXQ46SQ",
        description: [
          "Klara is a mobile app designed to make learning German simple, engaging, and effective. Built using Flutter, MySQL, and Firebase, it supports learners with a structured path through the language.",
          "The app features dedicated sections for each part of speech, offering tailored lessons and exercises to help users understand the nuances of German grammar.",
          "Klara provides sample words, sentences, and pronunciation audio for every concept, so practicing vocabulary, sentence construction, and speaking feels natural at your own pace."
        ]
      },
      gutenberg: {
        title: "Gutenberg",
        subtitle: "Rediscover the Classics",
        tech: "Flutter · MySQL",
        screencast: "https://youtu.be/o6-ahDpa-o4",
        description: [
          "Gutenberg is a simple yet powerful reading app that brings timeless classics to your fingertips. Built using Flutter and MySQL, it offers instant access to free books from the Project Gutenberg catalog.",
          "Readers can explore and enjoy multiple books with their last position automatically bookmarked for a seamless experience.",
          "Adjustable font sizes, intuitive search, and a distraction-free interface make Gutenberg a delightful way to rediscover literary masterpieces anywhere."
        ]
      },
      booksmart: {
        title: "BookSmart",
        subtitle: "Tabs to knowledge in one click",
        tech: "TypeScript · Chrome Extension APIs · WebLLM",
        screencast: null,
        description: [
          "BookSmart is a Chrome extension that turns all open tabs into smart bookmarks, keeping titles, descriptions, visit history, and favicons in one organized dashboard.",
          "It solves the tab overwhelm problem by classifying saved pages automatically, offering session snapshots, exports, and quick reopen actions so nothing important is lost.",
          "Classification can run locally via WebLLM or route through online LLMs like DeepSeek and OpenAI, with a built-in safety gate that keeps sensitive content away from external APIs.",
          "Built with TypeScript, Webpack, Chrome Extension APIs, and @mlc-ai/web-llm; integrates commercial LLM REST endpoints while storing all preferences locally in chrome.storage."
        ]
      },
      'creative-storyboard-api': {
        title: "Creative Storyboard API",
        subtitle: "Secure backend for storyboard workflows",
        tech: "Node.js · Express · MySQL · Multer",
        screencast: null,
        description: [
          "Creative Storyboard API powers the storyboard planning platform with a secure Node.js/Express backend, exposing endpoints for authentication, dashboard analytics, project -> scene -> shot hierarchies, and rich media management (uploads plus audio-library linking).",
          "Key features include cookie-based sessions with bcrypt-hardened login, activity logging, aggregated stats, MySQL-backed CRUD for nested resources, multer-powered media uploads with file hygiene, and fuzzy-search across a local sound library.",
          "The stack combines Express, mysql2, bcryptjs, multer, body-parser, cors, dotenv, and vanilla SPA docs, running on Node.js and MySQL--ready to drop behind any Next.js or React frontend."
        ]
      },
      royalia: {
        title: "Royalia",
        subtitle: "Social network for the mentally royal",
        tech: "Meteor · React 18 · MongoDB · Bunny.net",
        screencast: null,
        description: [
          "Royalia is a social network where status and participation follow IQ-informed profiles, giving the mentally royal a shared place to compare notes and collaborate.",
          "The in-progress build ships authentication, themed profile pages, and rich media layouts with cover photos and avatars across light and dark modes.",
          "Uploads are validated for type and size before heading to Bunny.net storage, keeping profile imagery fast, reliable, and easy to manage.",
          "Next on the roadmap: IQ-weighted feeds, friend graph, messaging, and reputation anchored to verified profile data.",
          "Built with Meteor for full-stack reactivity, React 18 with react-meteor-data, Node.js modules configured via dotenv, Mongo-backed data models, Bunny.net storage SDK helpers, and automated tests through meteortesting:mocha."
        ]
      },
      'creative-storyboard': {
        title: "Creative Storyboard",
        subtitle: "Storyboard planning for modern crews",
        tech: "Next.js 14 · Express · MySQL · WebLLM",
        screencast: null,
        description: [
          "Creative Storyboard is a full-stack storyboarding app that helps filmmakers and creators plan projects with a clear hierarchy of Projects -> Scenes -> Shots, rich media uploads (images, video, audio), and AI prompt notes for ideation.",
          "It streamlines pre-production by centralizing assets, notes, and progress with dashboards, activity feeds, profile management, and a polished, responsive UI.",
          "Features include user registration/login, project creation and editing with banners, scene and shot management, drag-and-drop uploads with progress, lightbox previews, audio playback, and an integrated searchable audio library.",
          "It solves the common pain of scattered files and spreadsheets by keeping visual references, timing, and creative direction in one place—fast to set up and easy to iterate. Tech stack: Next.js 14 (React 18) for the frontend, Express/Node.js API, MySQL (mysql2) for persistence, multer for uploads, bcryptjs for auth, and dotenv/cors/body-parser for configuration and middleware, with custom components and global CSS for styling."
        ]
      }
    };

    var modal = document.getElementById('portfolio-modal');
    var galleryButtons = Array.prototype.slice.call(document.querySelectorAll('.portfolio-more-btn'));

    if (!modal || !galleryButtons.length) {
      return;
    }

    var modalTitle = modal.querySelector('.portfolio-modal__title');
    var modalTech = modal.querySelector('.portfolio-modal__tech');
    var modalSubtitle = modal.querySelector('.portfolio-modal__subtitle');
    var modalDescription = modal.querySelector('.portfolio-modal__description');
    var modalScreencast = modal.querySelector('[data-screencast-link]');
    var track = modal.querySelector('.portfolio-modal__track');
    var pagination = modal.querySelector('.portfolio-modal__pagination');
    var prevControl = modal.querySelector('[data-carousel-prev]');
    var nextControl = modal.querySelector('[data-carousel-next]');
    var closeElements = Array.prototype.slice.call(modal.querySelectorAll('[data-modal-close]'));

    var activeImages = [];
    var activeIndex = 0;
    var dots = [];
    var autoTimer = null;
    var autoDelay = 6000;
    var lastFocus = null;

    function padIndex(value) {
      return value < 10 ? '0' + value : String(value);
    }

    function stopAuto() {
      if (autoTimer) {
        clearInterval(autoTimer);
        autoTimer = null;
      }
    }

    function startAuto() {
      stopAuto();
      if (activeImages.length <= 1) {
        return;
      }
      autoTimer = setInterval(function () {
        goToSlide(activeIndex + 1);
      }, autoDelay);
    }

    function updateDots() {
      if (!dots.length) {
        return;
      }
      dots.forEach(function (dot, index) {
        dot.classList.toggle('is-active', index === activeIndex);
      });
    }

    function updateNavState() {
      var controls = [prevControl, nextControl];
      controls.forEach(function (control) {
        if (!control) {
          return;
        }
        if (activeImages.length <= 1) {
          control.setAttribute('disabled', 'true');
        } else {
          control.removeAttribute('disabled');
        }
      });
    }

    function goToSlide(index, userInitiated) {
      if (!activeImages.length || !track) {
        return;
      }
      var total = activeImages.length;
      var nextIndex = ((index % total) + total) % total;
      activeIndex = nextIndex;
      track.style.transform = 'translateX(' + (-100 * activeIndex) + '%)';
      updateDots();
      if (userInitiated) {
        startAuto();
      }
    }

    function buildDots(total) {
      dots = [];
      if (!pagination) {
        return;
      }
      pagination.innerHTML = '';
      for (var i = 0; i < total; i++) {
        var dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'portfolio-modal__dot' + (i === 0 ? ' is-active' : '');
        dot.setAttribute('aria-label', 'Show slide ' + (i + 1) + ' of ' + total);
        (function (idx) {
          dot.addEventListener('click', function () {
            goToSlide(idx, true);
          });
        })(i);
        pagination.appendChild(dot);
        dots.push(dot);
      }
    }

    function buildSlides(key, projectTitle) {
      if (!track) {
        return;
      }
      var images = galleryMap[key] || [];
      activeImages = images.slice();
      track.innerHTML = '';
      activeIndex = 0;

        images.forEach(function (imageName, index) {
          var slide = document.createElement('li');
          slide.className = 'portfolio-modal__slide';
          var link = document.createElement('a');
          link.href = 'portfolio/' + key + '/' + imageName;
          link.target = '_blank';
          link.rel = 'noopener';
          var img = document.createElement('img');
          img.src = 'portfolio/' + key + '/' + imageName;
          img.alt = projectTitle + ' screen ' + padIndex(index + 1);
          link.appendChild(img);
          slide.appendChild(link);
          track.appendChild(slide);
        });

      track.style.transform = 'translateX(0%)';
      buildDots(images.length);
      updateNavState();
      startAuto();
    }

    function openModal(key, trigger) {
      if (!galleryMap[key] || !galleryMap[key].length) {
        return;
      }
      lastFocus = trigger || null;
      var details = projectDetails[key] || {};
      var projectTitle = '';
      if (details.title) {
        projectTitle = details.title;
      } else if (trigger) {
        var detail = trigger.closest('.portfolio-details');
        var heading = detail ? detail.querySelector('h4') : null;
        if (heading) {
          projectTitle = heading.textContent.trim();
        }
      }
      if (!projectTitle) {
        projectTitle = key.charAt(0).toUpperCase() + key.slice(1);
      }

      if (modalTitle) {
        modalTitle.textContent = projectTitle;
      }

      if (modalTech) {
        if (details.tech) {
          modalTech.textContent = details.tech;
          modalTech.style.display = 'inline-block';
        } else {
          modalTech.textContent = '';
          modalTech.style.display = 'none';
        }
      }

      if (modalSubtitle) {
        if (details.subtitle) {
          modalSubtitle.textContent = details.subtitle;
          modalSubtitle.style.display = 'block';
        } else {
          modalSubtitle.textContent = '';
          modalSubtitle.style.display = 'none';
        }
      }

      if (modalDescription) {
        modalDescription.innerHTML = '';
        var paragraphs = details.description || [];
        paragraphs.forEach(function (copy) {
          var paragraph = document.createElement('p');
          paragraph.textContent = copy;
          modalDescription.appendChild(paragraph);
        });
      }

      if (modalScreencast) {
        if (details.screencast) {
          modalScreencast.href = details.screencast;
          modalScreencast.style.display = 'inline-flex';
        } else {
          modalScreencast.href = '#';
          modalScreencast.style.display = 'none';
        }
      }

      buildSlides(key, projectTitle);
      modal.classList.add('is-visible');
      modal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('is-modal-open');
      var closeButton = modal.querySelector('.portfolio-modal__close');
      if (closeButton) {
        closeButton.focus();
      }
    }

    function closeModal() {
      if (!modal.classList.contains('is-visible')) {
        return;
      }
      stopAuto();
      modal.classList.remove('is-visible');
      modal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('is-modal-open');
      activeImages = [];
      dots = [];
      if (track) {
        track.innerHTML = '';
      }
      if (pagination) {
        pagination.innerHTML = '';
      }
      if (modalTech) {
        modalTech.textContent = '';
        modalTech.style.display = 'none';
      }
      if (modalSubtitle) {
        modalSubtitle.textContent = '';
        modalSubtitle.style.display = 'none';
      }
      if (modalTitle) {
        modalTitle.textContent = '';
      }
      if (modalDescription) {
        modalDescription.innerHTML = '';
      }
      if (modalScreencast) {
        modalScreencast.href = '#';
        modalScreencast.style.display = 'none';
      }
      if (lastFocus && typeof lastFocus.focus === 'function') {
        lastFocus.focus();
      }
      lastFocus = null;
    }

    galleryButtons.forEach(function (button) {
      button.addEventListener('click', function () {
        var key = button.getAttribute('data-gallery');
        openModal(key, button);
      });
    });

    if (prevControl) {
      prevControl.addEventListener('click', function () {
        goToSlide(activeIndex - 1, true);
      });
    }

    if (nextControl) {
      nextControl.addEventListener('click', function () {
        goToSlide(activeIndex + 1, true);
      });
    }

    closeElements.forEach(function (element) {
      element.addEventListener('click', function () {
        closeModal();
      });
    });

    modal.addEventListener('click', function (event) {
      if (event.target === modal) {
        closeModal();
      }
    });

    document.addEventListener('keydown', function (event) {
      if (!modal.classList.contains('is-visible')) {
        return;
      }
      if (event.key === 'Escape') {
        event.preventDefault();
        closeModal();
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        goToSlide(activeIndex + 1, true);
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        goToSlide(activeIndex - 1, true);
      }
    });

    modal.addEventListener('keydown', function (event) {
      if (event.key !== 'Tab') {
        return;
      }
      var focusable = modal.querySelectorAll("button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])");
      focusable = Array.prototype.slice.call(focusable).filter(function (element) {
        return element.offsetParent !== null;
      });
      if (!focusable.length) {
        event.preventDefault();
        return;
      }
      var first = focusable[0];
      var last = focusable[focusable.length - 1];
      if (event.shiftKey) {
        if (document.activeElement === first) {
          event.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    });
  });
