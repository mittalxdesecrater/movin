const menuBtn = document.querySelector(".menu-btn"),
  navLinks = document.querySelector(".nav-links");
if (menuBtn && navLinks) {
  menuBtn.addEventListener("click", () => {
    navLinks.classList.toggle("open");
    menuBtn.setAttribute(
      "aria-expanded",
      navLinks.classList.contains("open") ? "true" : "false",
    );
  });
  navLinks.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      navLinks.classList.remove("open");
      menuBtn.setAttribute("aria-expanded", "false");
    }),
  );
}
const intro = document.getElementById("intro"),
  site = document.getElementById("site"),
  go = document.getElementById("goMovin"),
  skip = document.getElementById("skipIntro"),
  soundToggle = document.getElementById("soundToggle"),
  introAudio = document.getElementById("movinIntroAudio");
let audioStarted = false;
function playClientAudio() {
  if (!introAudio) return;
  introAudio.currentTime = 0;
  const p = introAudio.play();
  if (p && p.catch)
    p.catch(() => {
      if (soundToggle) {
        soundToggle.style.display = "block";
        soundToggle.textContent = "♪ Tap for sound";
      }
    });
  audioStarted = true;
}
function enterSite() {
  if (!intro || intro.classList.contains("hidden")) return;
  intro.classList.add("hidden");
  document.body.classList.remove("lock-scroll");
  if (site) site.classList.add("ready");
  try {
    sessionStorage.setItem("movinIntroSeen", "1");
  } catch (e) {}
}
if (intro && site) {
  document.body.classList.add("lock-scroll");
  let seen = false;
  try {
    seen = sessionStorage.getItem("movinIntroSeen") === "1";
  } catch (e) {}
  if (seen) {
    intro.classList.add("hidden");
    site.classList.add("ready");
    document.body.classList.remove("lock-scroll");
  }
  // if (go)
  //   go.addEventListener("click", () => {
  //     playClientAudio();
  //     enterSite();
  //   });

const presentationScreen = document.getElementById("presentationScreen");
const presentationVideo = document.getElementById("movinPresentation");
const skipPresentation = document.getElementById("skipPresentation");

function finishPresentation() {
  if (presentationVideo) {
    presentationVideo.pause();
  }

  if (presentationScreen) {
    presentationScreen.classList.add("presentation-finished");
    presentationScreen.setAttribute("aria-hidden", "true");
  }

  // Show the existing homepage
  if (intro) intro.classList.add("hidden");

  document.body.classList.remove("lock-scroll");

  if (site) site.classList.add("ready");

  try {
    sessionStorage.setItem("movinIntroSeen", "1");
  } catch (e) {}
}

if (go) {
  go.addEventListener("click", async () => {

    // Start the presentation overlay
    if (presentationScreen && presentationVideo) {

      presentationScreen.classList.add("presentation-active");
      presentationScreen.setAttribute("aria-hidden", "false");

      presentationVideo.currentTime = 0;

      try {
        await presentationVideo.play();

        // Optional intro audio, if you want to keep your existing sound
        playClientAudio();

      } catch (error) {
        console.error("Presentation video could not play:", error);

        // Return to intro if video playback fails
        presentationScreen.classList.remove("presentation-active");
        presentationScreen.setAttribute("aria-hidden", "true");
      }

    } else {
      // Fallback if presentation elements are missing
      playClientAudio();
      enterSite();
    }
  });
}

// When video completes, show homepage
if (presentationVideo) {
  presentationVideo.addEventListener("ended", finishPresentation);
}

// Allow user to skip presentation
if (skipPresentation) {
  skipPresentation.addEventListener("click", finishPresentation);
}
// gpt help

  if (skip)
    skip.addEventListener("click", () => {
      if (introAudio) introAudio.pause();
      enterSite();
    });
  if (soundToggle)
    soundToggle.addEventListener("click", () => {
      if (introAudio) {
        introAudio.currentTime = 0;
        introAudio.play();
        soundToggle.textContent = "♪ Sound playing";
      }
    });
}
function setupTrack(trackId, prevId, nextId, progressId) {
  const track = document.getElementById(trackId),
    prev = document.getElementById(prevId),
    next = document.getElementById(nextId),
    progress = document.getElementById(progressId);
  if (!track) return;
  const step = () => {
    const card = track.querySelector(":scope > *");
    return card
      ? card.getBoundingClientRect().width +
          parseFloat(
            getComputedStyle(track).columnGap ||
              getComputedStyle(track).gap ||
              0,
          )
      : 300;
  };
  const update = () => {
    if (progress) {
      const max = track.scrollWidth - track.clientWidth;
      progress.style.width =
        (max > 0
          ? Math.min(
              100,
              Math.max(16.66, (track.scrollLeft / max) * 83.34 + 16.66),
            )
          : 100) + "%";
    }
  };
  if (prev)
    prev.addEventListener("click", () =>
      track.scrollBy({ left: -step(), behavior: "smooth" }),
    );
  if (next)
    next.addEventListener("click", () =>
      track.scrollBy({ left: step(), behavior: "smooth" }),
    );
  track.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
  update();
  let timer = setInterval(() => {
    if (document.hidden || !track.isConnected) return;
    const max = track.scrollWidth - track.clientWidth;
    if (max < 5) return;
    track.scrollBy({
      left: track.scrollLeft >= max - 10 ? -max : step(),
      behavior: "smooth",
    });
  }, 5200);
  track.addEventListener("mouseenter", () => clearInterval(timer), {
    once: true,
  });
}
setupTrack("verticalTrack", "verticalPrev", "verticalNext", "verticalProgress");
setupTrack("destinationTrack", "placePrev", "placeNext", "placeProgress");
const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();
// Configure the deployed Google Apps Script Web App URL here before accepting live enquiries.
const GOOGLE_SHEETS_WEB_APP_URL =
  "https://script.google.com/macros/s/AKfycbyGVYpYQvNx6ZdQ3DgQL8W6SooViINwdc3F2IIIK91n5mmWcWRLm9IhPRysOqkYdbX0/exec";
const form = document.getElementById("leadForm"),
  status = document.getElementById("formStatus");
if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    const data = Object.fromEntries(new FormData(form).entries());
    data.page = location.href;
    data.submittedAt = new Date().toISOString();
    const waText =
      "Hello Movin Realty, my name is " +
      data.name +
      ". I am enquiring about " +
      data.service +
      (data.destination ? " in " + data.destination : "") +
      ". Phone: " +
      data.phone +
      (data.message ? " Details: " + data.message : "");
    if (!GOOGLE_SHEETS_WEB_APP_URL) {
      if (status) {
        status.textContent =
          "The website form is ready, but Google Sheets is not connected yet. For this demo, your enquiry will open in WhatsApp so you can test the flow.";
        status.className = "form-status error";
      }
      const wa =
        "https://wa.me/919990661376?text=" + encodeURIComponent(waText);
      window.open(wa, "_blank", "noopener");
      return;
    }
    const btn = form.querySelector("button[type=submit]");
    btn.disabled = true;
    btn.querySelector("span").textContent = "…";
    if (status) {
      status.textContent = "Sending your enquiry…";
      status.className = "form-status";
    }
    try {
      await fetch(GOOGLE_SHEETS_WEB_APP_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(data),
      });
      if (status) {
        status.textContent = "Thank you. Your enquiry has been submitted.";
        status.className = "form-status success";
      }
      form.reset();
    } catch (err) {
      if (status) {
        status.textContent =
          "We could not submit the form. Please contact us on WhatsApp.";
        status.className = "form-status error";
      }
    } finally {
      btn.disabled = false;
      btn.querySelector("span").textContent = "↗";
    }
  });
}
const params = new URLSearchParams(location.search),
  type = params.get("type"),
  place = params.get("place");
const verticalData = {
  "real-estate": {
    title: "Real Estate",
    eyebrow: "PLACES & PROPERTY",
    desc: "Residential and commercial property sales, leasing, resale, land consultancy, investment sourcing, asset management and developer collaborations. Key markets include Noida, Greater Noida, YEIDA, Gurugram and emerging destinations.",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1800&q=85",
    //
    media: {
    type: "image", // image | video | youtube
    source: "assets/images/real-estate.jpg",
    poster: "assets/images/real-estate-poster.jpg"},
    //
    items: [
      "Residential and commercial sales and purchases",
      "Residential and commercial leasing",
      "Rental, resale and property management",
      "Land and institutional property consultancy",
      "Upcoming project advisory and property sourcing",
      "Asset management and developer collaborations",
    ],
    //
    pageHeading: "Discover Real Estate Opportunities",
    buttonText: "Explore Properties"
    //
  },
  transportation: {
    title: "Transportation",
    eyebrow: "CONNECTING PLACES",
    desc: "Daily car rentals, corporate transportation, vehicle sales and purchases, fleet sourcing and management, personal mobility and business transportation requirements.",
    image:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1800&q=85",
    items: [
      "Daily car rentals",
      "Corporate transportation",
      "Vehicle sales and purchases",
      "Fleet sourcing and management",
      "Personal mobility solutions",
      "Business transportation requirements",
    ],
  },
  manpower: {
    title: "Manpower",
    eyebrow: "PEOPLE & POTENTIAL",
    desc: "Domestic helpers, housekeeping, cooks, kitchen personnel, plumbers, maintenance and security staff, office support, skilled and semi-skilled workforce sourcing.",
    image:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1800&q=85",
    items: [
      "Domestic helpers and housekeeping",
      "Cooks and kitchen personnel",
      "Plumbing and maintenance staff",
      "Security and office support",
      "Skilled and semi-skilled workforce",
      "Staffing and workforce sourcing",
    ],
  },
  hospitality: {
    title: "Hospitality",
    eyebrow: "STAYS & EXPERIENCES",
    desc: "Restaurant and café setup assistance, hospitality consultancy, food business sourcing, operational supplies, kitchen equipment, collaborations and expansion support.",
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1800&q=85",
    items: [
      "Restaurant and café setup assistance",
      "Hospitality business consultancy",
      "Food sourcing and procurement",
      "Operational supplies and kitchen equipment",
      "Business collaborations and expansion",
      "Hospitality-related investment enquiries",
    ],
  },
  "machinery-technology": {
    title: "Machinery & Technology",
    eyebrow: "INDUSTRY & INNOVATION",
    desc: "Industrial machinery sourcing, procurement, manufacturing equipment, vendor connections and industrial consultancy—alongside digital business solutions, marketing, advertising, online development, technology sourcing and digital platform opportunities.",
    image:
      "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=1800&q=85",
    items: [
      "Industrial machinery sourcing and procurement",
      "Manufacturing and industrial equipment",
      "Machinery vendor connections",
      "Industrial consultancy and sourcing",
      "Digital business solutions and marketing",
      "Online business development and technology sourcing",
    ],
  },
};
const placeData = {
  noida: {
    title: "Noida",
    region: "UTTAR PRADESH, INDIA",
    desc: "Noida is a major commercial and residential destination with corporate infrastructure, IT hubs and established developments.",
    media: {
    type: "video",
    source: "media/noidaareilview.mp4",
    poster: "assets/images/noida.jpg"
    },
    items: [
      "Residential real estate",
      "Commercial property and corporate leasing",
      "Asset management",
      "Business services",
    ],
    pageHeading: "Explore Noida",
    buttonText: "Enquire About Noida"
    // image:  https://www.pexels.com/download/video/30876250/
    // "https://youtu.be/snilqDw4AQE"
    // "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1800&q=85",
  },
  "greater-noida": {
    title: "Greater Noida",
    region: "UTTAR PRADESH, INDIA",
    desc: "Greater Noida is an emerging destination supported by infrastructure, institutional hubs, industrial activity and residential townships.",
    media: {
    type: "video",
    source: "https://www.pexels.com/download/video/30876250/",
    poster: "assets/images/noida.jpg"
    },
    items: [
      "Residential investments",
      "Commercial assets",
      "Industrial opportunities",
      "Land and institutional properties",
    ],
    pageHeading: "Explore Greater Noida",
    buttonText: "Enquire About Greater Noida"
    // image:
    //   "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&q=82",
  },
  ayodhya: {
    title: "Ayodhya",
    region: "UTTAR PRADESH, INDIA",
    desc: "Ayodhya is a growing tourism and religious destination with evolving hospitality and infrastructure requirements.",
    media: {
    type: "video",
    source: "https://www.pexels.com/download/video/20008836/",
    poster: "assets/images/noida.jpg"
    },
    items: [
      "Hospitality and tourism-related opportunities",
      "Commercial property",
      "Infrastructure-related business enquiries",
      "Long-term development potential",
    ],
    pageHeading: "Explore Ayodhya",
    buttonText: "Enquire About Ayodhya"
    // image:
    //   "https://wallpaperbat.com/img/122087832-ayodhya-ram-temple-inauguration-time.jpg?auto=format&fit=crop&w=900&q=82",
  },
  dholera: {
    title: "Dholera",
    region: "GUJARAT, INDIA",
    desc: "Dholera is an emerging industrial and infrastructure destination in Gujarat. All opportunities require independent verification.",
    media: {
    type: "video",
    source: "https://www.pexels.com/download/video/3007810/",
    poster: "assets/images/noida.jpg"
    },
    items: [
      "Industrial infrastructure",
      "Machinery and equipment",
      "Business development",
      "Land and industrial investment enquiries",
    ],
    pageHeading: "Explore Dholera",
    buttonText: "Enquire About Dholera"
    // image:
    //   "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=1800&q=85",
  },
  gurugram: {
    title: "Gurugram",
    region: "HARYANA, INDIA",
    desc: "Gurugram is a major corporate and commercial destination with opportunities across real estate, hospitality and enterprise services.",
    media: {
    type: "video",
    source: "https://www.pexels.com/download/video/26102174/",
    poster: "assets/images/noida.jpg"
    },
    items: [
      "Commercial real estate",
      "Corporate leasing",
      "Premium residential properties",
      "Hospitality and enterprise services",
    ],
    pageHeading: "Explore Gurugram",
    buttonText: "Enquire About Gurugram"
    // image:
    //   "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=1800&q=85",
  },
  dubai: {
    title: "Dubai",
    region: "UNITED ARAB EMIRATES",
    desc: "Dubai is an international business and investment destination. Services and eligibility are subject to confirmation.",
    media: {
    type: "video",
    source: "https://www.pexels.com/download/video/14918326/",
    poster: "assets/images/noida.jpg"
    },
    items: [
      "International property opportunities",
      "Luxury real estate",
      "Hospitality",
      "Cross-border business collaborations",
    ],
    pageHeading: "Explore Dubai",
    buttonText: "Enquire About Dubai"
    // image:
    //   "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1800&q=85",
  },
};

//gpt help

/* =========================================
   MOVIN REALTY — CENTRAL CONTENT MANAGER
   Edit this section to update website content
========================================= */

const MOVIN_CONTENT = {

  // GLOBAL WEBSITE SETTINGS
  settings: {
    brand: "MOVIN REALTY",
    tagline: "Beyond Boundaries. Beyond Business.",
    philosophy: "One Ecosystem. Multiple Opportunities.",

    // Default media if a page has no background
    defaultImage: "assets/images/default-bg.jpg"
  },

  // HERO SECTION
  hero: {
    title: "One Ecosystem.",
    subtitle: "Multiple Opportunities.",
    description:
      "Discover opportunities across real estate, transportation, manpower, hospitality and technology.",

    media: {
      type: "image", // image | video | youtube
      source: "assets/images/hero.jpg",
      poster: "assets/images/hero-poster.jpg"
    },

    buttonText: "Explore MOVIN"
  },

  // =====================================
  // FIVE BUSINESS VERTICALS
  // =====================================

  verticals: {

    realEstate: {
      number: "01",
      title: "REAL ESTATE",
      subtitle: "Spaces That Create Possibilities",
      description:
        "Explore residential, commercial and investment opportunities across emerging destinations.",

      media: {
        type: "image",
        source: "assets/images/verticals/real-estate.jpg"
      },

      page: {
        heading: "Discover Real Estate Opportunities",
        description:
          "From residential developments to commercial investments, explore opportunities designed around your ambitions.",

        sections: [
          {
            title: "Residential Properties",
            text: "Explore thoughtfully selected residential opportunities."
          },
          {
            title: "Commercial Investments",
            text: "Discover commercial spaces and investment opportunities."
          },
          {
            title: "Land & Plots",
            text: "Find opportunities across developing locations."
          }
        ],

        button: "Explore Properties"
      }
    },

    transportation: {
      number: "02",
      title: "TRANSPORTATION",
      subtitle: "Moving Businesses Forward",
      description:
        "Transportation and mobility solutions connecting businesses and opportunities.",

      media: {
        type: "image",
        source: "assets/images/verticals/transportation.jpg"
      },

      page: {
        heading: "Transportation Solutions",
        description:
          "Reliable mobility and transportation solutions for businesses and individuals.",

        sections: [
          {
            title: "Logistics",
            text: "Transportation support for business operations."
          },
          {
            title: "Mobility",
            text: "Connecting people, places and opportunities."
          }
        ],

        button: "Enquire Now"
      }
    },

    manpower: {
      number: "03",
      title: "MANPOWER",
      subtitle: "People. Potential. Performance.",
      description:
        "Connecting organizations with workforce solutions.",

      media: {
        type: "image",
        source: "assets/images/verticals/manpower.jpg"
      },

      page: {
        heading: "People & Potential",
        description:
          "Workforce and manpower solutions supporting business growth.",

        sections: [
          {
            title: "Workforce Solutions",
            text: "Supporting organizations with manpower requirements."
          },
          {
            title: "Business Support",
            text: "Connecting talent with business opportunities."
          }
        ],

        button: "Connect With Us"
      }
    },

    hospitality: {
      number: "04",
      title: "HOSPITALITY",
      subtitle: "Experiences Beyond Expectations",
      description:
        "Hospitality and travel-related opportunities.",

      media: {
        type: "image",
        source: "assets/images/verticals/hospitality.jpg"
      },

      page: {
        heading: "Hospitality & Experiences",
        description:
          "Discover hospitality and travel-related services through the MOVIN ecosystem.",

        sections: [
          {
            title: "Travel",
            text: "Explore travel-related services and opportunities."
          },
          {
            title: "Hospitality",
            text: "Discover hospitality solutions."
          }
        ],

        button: "Discover More"
      }
    },

    machineryTechnology: {
      number: "05",
      title: "MACHINERY & TECHNOLOGY",
      subtitle: "Powering the Future",
      description:
        "Industrial machinery and technology-driven business solutions.",

      media: {
        type: "image",
        source: "assets/images/verticals/machinery-tech.jpg"
      },

      page: {
        heading: "Machinery & Technology",
        description:
          "Explore industrial machinery and technology-related business opportunities.",

        sections: [
          {
            title: "Industrial Machinery",
            text: "Machinery-related business solutions."
          },
          {
            title: "Technology",
            text: "Technology-driven opportunities and services."
          }
        ],

        button: "Enquire Now"
      }
    }

  },

  // =====================================
  // SIX DESTINATIONS
  // =====================================

  destinations: {

    noida: {
      title: "NOIDA CITY",
      subtitle: "A City of Modern Opportunities",

      media: {
        type: "youtube",
        source: "https://www.youtube.com/watch?v=YOUR_VIDEO_ID",
        poster: "assets/images/destinations/noida.jpg"
      },

      page: {
        heading: "Explore Noida",
        description:
          "Discover real estate and business opportunities in Noida.",

        sections: [
          {
            title: "Residential Opportunities",
            text: "Explore residential property opportunities."
          },
          {
            title: "Commercial Opportunities",
            text: "Discover commercial spaces and business locations."
          },
          {
            title: "Investment Potential",
            text: "Explore emerging investment opportunities."
          }
        ],

        button: "Enquire About Noida"
      }
    },

    greaterNoida: {
      title: "GREATER NOIDA",
      subtitle: "A Destination for Growth",

      media: {
        type: "image",
        source: "assets/images/destinations/greater-noida.jpg"
      },

      page: {
        heading: "Explore Greater Noida",
        description:
          "Explore property and investment opportunities in Greater Noida.",

        sections: [
          {
            title: "Residential Developments",
            text: "Explore residential opportunities."
          },
          {
            title: "Commercial Hubs",
            text: "Discover commercial developments."
          },
          {
            title: "Connectivity",
            text: "Explore the area's developing connectivity."
          }
        ],

        button: "Enquire About Greater Noida"
      }
    },

    ayodhya: {
      title: "AYODHYA",
      subtitle: "A New Chapter of Opportunity",

      media: {
        type: "image",
        source: "assets/images/destinations/ayodhya.jpg"
      },

      page: {
        heading: "Explore Ayodhya",
        description:
          "Discover opportunities in Ayodhya.",

        sections: [
          {
            title: "Real Estate",
            text: "Explore property opportunities."
          },
          {
            title: "Hospitality",
            text: "Discover hospitality-related opportunities."
          }
        ],

        button: "Enquire About Ayodhya"
      }
    },

    dholera: {
      title: "DHOLERA",
      subtitle: "The Future of Development",

      media: {
        type: "image",
        source: "assets/images/destinations/dholera.jpg"
      },

      page: {
        heading: "Explore Dholera",
        description:
          "Discover real estate and business opportunities in Dholera.",

        sections: [
          {
            title: "Land Opportunities",
            text: "Explore land-related opportunities."
          },
          {
            title: "Industrial Development",
            text: "Discover industrial development opportunities."
          }
        ],

        button: "Enquire About Dholera"
      }
    },

    gurugram: {
      title: "GURUGRAM",
      subtitle: "Where Business Meets Opportunity",

      media: {
        type: "image",
        source: "assets/images/destinations/gurugram.jpg"
      },

      page: {
        heading: "Explore Gurugram",
        description:
          "Explore real estate and business opportunities in Gurugram.",

        sections: [
          {
            title: "Luxury Residential",
            text: "Discover residential opportunities."
          },
          {
            title: "Commercial Spaces",
            text: "Explore commercial real estate."
          }
        ],

        button: "Enquire About Gurugram"
      }
    },

    dubai: {
      title: "DUBAI",
      subtitle: "Global Opportunities. Limitless Vision.",

      media: {
        type: "image",
        source: "assets/images/destinations/dubai.jpg"
      },

      page: {
        heading: "Explore Dubai",
        description:
          "Discover international real estate and business opportunities.",

        sections: [
          {
            title: "International Real Estate",
            text: "Explore international property opportunities."
          },
          {
            title: "Investment Opportunities",
            text: "Discover global investment options."
          }
        ],

        button: "Enquire About Dubai"
      }
    }

  }

};

/* =========================================
   UNIVERSAL MEDIA RENDERER
========================================= */


function getYouTubeEmbed(url) {
  try {
    const parsed = new URL(url);
    let id = "";

    if (parsed.hostname.includes("youtu.be")) {
      id = parsed.pathname.slice(1);
    } else {
      id =
        parsed.searchParams.get("v") ||
        parsed.pathname.split("/embed/")[1] ||
        parsed.pathname.split("/shorts/")[1] ||
        "";
    }

    return id ? `https://www.youtube.com/embed/${id}` : "";
  } catch {
    return "";
  }
}

function renderPageMedia(data) {
  const media = data.media || {
    type: "image",
    source: data.image
  };

  if (!media.source) return "";

  if (media.type === "video") {
    return `
      <video class="subpage-media"
        autoplay muted loop playsinline
        poster="${media.poster || ""}">
        <source src="${media.source}">
      </video>
    `;
  }

  if (media.type === "youtube") {
    const embed = getYouTubeEmbed(media.source);
    if (!embed) return "";

    return `
      <iframe class="subpage-media"
        src="${embed}?autoplay=1&mute=1&loop=1&playlist=${embed.split("/").pop()}"
        allow="autoplay; encrypted-media; picture-in-picture"
        allowfullscreen>
      </iframe>
    `;
  }

  return `
    <img class="subpage-media"
      src="${media.source}"
      alt="${data.title}">
  `;
}



/* =========================================
   UNIVERSAL DETAIL PAGE
========================================= */

function renderMovinPage(category, key) {

  const item = MOVIN_CONTENT[category]?.[key];

  if (!item) {
    console.error("MOVIN page not found:", category, key);
    return;
  }

  const page = item.page || {};
  const mediaHTML = renderMedia(item.media);

  const sectionsHTML = (page.sections || [])
    .map(section => `
      <div class="detail-section">
        <h3>${section.title}</h3>
        <p>${section.text}</p>
      </div>
    `)
    .join("");

  const container = document.querySelector("#page-content");

  if (!container) {
    console.error("Missing #page-content container");
    return;
  }

  container.innerHTML = `
    <section class="detail-page">

      <div class="detail-media">
        ${mediaHTML}
        <div class="detail-overlay"></div>

        <div class="detail-heading">
          <span>${item.title || ""}</span>
          <h1>${page.heading || item.title || ""}</h1>
          <p>${item.subtitle || ""}</p>
        </div>
      </div>

      <div class="detail-content">

        <p class="detail-description">
          ${page.description || item.description || ""}
        </p>

        <div class="detail-sections">
          ${sectionsHTML}
        </div>

        <button class="detail-enquiry">
          ${page.button || "Enquire Now"}
        </button>

      </div>

    </section>
  `;

  container.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}

// Open a vertical
function openVertical(key) {
  renderMovinPage("verticals", key);
}

// Open a destination
function openDestination(key) {
  renderMovinPage("destinations", key);
}


//
// function renderSubpage(data, kind) {
//   const root = document.getElementById("subpageRoot");
//   if (!root || !data) return;
//   document.title = data.title + " | Movin Realty";
//   const desc = data.desc;
//   const items = (data.items || []).map((v) => "<li>" + v + "</li>").join("");
//   const heading =
//     kind === "vertical" ? "Services & capabilities" : "Opportunity focus";
//   root.innerHTML =
//     '<section class="subpage-hero" style="--page-image:url(\'' +
//     data.image +
//     '\')"><div class="container"><p class="eyebrow">' +
//     (data.eyebrow || data.region) +
//     "</p><h1>Discover <em>" +
//     data.title +
//     "</em></h1><p>" +
//     desc +
//     '</p><a class="btn btn-gold" href="index.html#contact">Make an enquiry <span>↗</span></a></div></section><section class="subpage-body"><div class="container subpage-grid"><div><p class="eyebrow">MOVIN / ' +
//     (kind === "vertical" ? "OUR VERTICALS" : "OUR DESTINATIONS") +
//     "</p><h2>" +
//     heading +
//     '</h2><ul class="subpage-services">' +
//     items +
//     '</ul><p>This page is an introductory overview. Specific services, projects, availability, terms and location coverage will be confirmed by the Movin team before any commitment.</p></div><aside class="subpage-cta"><p class="eyebrow">LET’S TALK</p><h3>Have a requirement?</h3><p>Tell us what you need and the team will follow up with relevant information.</p><a class="btn btn-gold" href="index.html#contact">Contact Movin <span>↗</span></a><p class="notice-demo">Locations describe market opportunities and do not represent confirmed MOVIN offices or operating locations.</p></aside></div></section>';
// }

function renderSubpage(data, kind) {
  const root = document.getElementById("subpageRoot");
  if (!root || !data) return;

  document.title = data.title + " | Movin Realty";

  const items = (data.items || [])
    .map(v => `<li>${v}</li>`)
    .join("");

  const heading =
    kind === "vertical"
      ? "Services & capabilities"
      : "Opportunity focus";

  const mediaHTML = renderPageMedia(data);

  root.innerHTML = `
    <section class="subpage-hero">

      ${mediaHTML}

      <div class="subpage-media-overlay"></div>

      <div class="container subpage-hero-content">

        <p class="eyebrow">
          ${data.eyebrow || data.region || ""}
        </p>

        <h1>
          ${data.pageHeading || `Discover ${data.title}`}
        </h1>

        <p>${data.desc || ""}</p>

        <a class="btn btn-gold" href="index.html#contact">
          ${data.buttonText || "Make an enquiry"}
          <span>↗</span>
        </a>

      </div>
    </section>

    <section class="subpage-body">
      <div class="container subpage-grid">

        <div>
          <p class="eyebrow">
            MOVIN / ${kind === "vertical" ? "OUR VERTICALS" : "OUR DESTINATIONS"}
          </p>

          <h2>${heading}</h2>

          <ul class="subpage-services">
            ${items}
          </ul>

          <p>
            This page is an introductory overview.
            Specific services, projects, availability, terms and
            location coverage will be confirmed by the Movin team.
          </p>
        </div>

        <aside class="subpage-cta">
          <p class="eyebrow">LET'S TALK</p>
          <h3>Have a requirement?</h3>
          <p>
            Tell us what you need and the team will follow up
            with relevant information.
          </p>

          <a class="btn btn-gold" href="index.html#contact">
            Contact Movin <span>↗</span>
          </a>
        </aside>

      </div>
    </section>
  `;
}

if (document.getElementById("subpageRoot")) {
  if (location.pathname.endsWith("vertical.html"))
    renderSubpage(
      verticalData[type] || verticalData["real-estate"],
      "vertical",
    );
  else renderSubpage(placeData[place] || placeData["greater-noida"], "place");
}

const heroSlides = [
  {
    title: "Real Estate",
    kicker: "01 / FIVE BUSINESS VERTICALS",
    eyebrow: "PLACES & PROPERTY",
    desc: "Property solutions, investment guidance and real estate consultancy shaped around your goals.",
    img: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2000&q=85",
    tag: "PLACES & PROPERTY",
    link: "vertical.html?type=real-estate",
  },
  {
    title: "Transportation",
    kicker: "02 / FIVE BUSINESS VERTICALS",
    eyebrow: "CONNECTING PLACES",
    desc: "Mobility solutions for individuals, teams and businesses—moving people and opportunities forward.",
    img: "https://images.unsplash.com/photo-1494412519320-aa613dfb7738?auto=format&fit=crop&w=2000&q=85",
    tag: "CONNECTING PLACES",
    link: "vertical.html?type=transportation",
  },
  {
    title: "Manpower",
    kicker: "03 / FIVE BUSINESS VERTICALS",
    eyebrow: "PEOPLE & POTENTIAL",
    desc: "Workforce sourcing and practical staffing support for changing business requirements.",
    img: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=2000&q=85",
    tag: "PEOPLE & POTENTIAL",
    link: "vertical.html?type=manpower",
  },
  {
    title: "Hospitality",
    kicker: "04 / FIVE BUSINESS VERTICALS",
    eyebrow: "STAYS & EXPERIENCES",
    desc: "Supporting hospitality ideas with setup assistance, sourcing and operational connections.",
    img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=2000&q=85",
    tag: "STAYS & EXPERIENCES",
    link: "vertical.html?type=hospitality",
  },
  {
    title: "Machinery & Technology",
    kicker: "05 / FIVE BUSINESS VERTICALS",
    eyebrow: "INDUSTRY & INNOVATION",
    desc: "Connecting industrial resources with digital solutions to help businesses build what comes next.",
    img: "https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=2000&q=85",
    tag: "INDUSTRY & INNOVATION",
    link: "vertical.html?type=machinery-technology",
  },
];
(function initHeroCarousel() {
  const track = document.getElementById("heroCardTrack");
  if (!track) return;
  const dots = [...document.querySelectorAll("#heroDots button")],
    counter = document.getElementById("heroCardCounter");
  let active = 0,
    timer = null,
    animating = false;
  const icons = ["⌂", "➜", "♙", "✧", "⚙"];
  const rail = [
    heroSlides[heroSlides.length - 1],
    ...heroSlides,
    heroSlides[0],
  ];
  track.innerHTML = rail
    .map(
      (s, i) =>
        '<a class="showcase-card" href="' +
        s.link +
        '" aria-label="Explore ' +
        s.title +
        '" style="--card-image:url(\'' +
        s.img.replace(/'/g, "%27") +
        '\')"><span class="showcase-card-number">' +
        String(((i - 1 + 5) % 5) + 1).padStart(2, "0") +
        '</span><span class="showcase-card-icon">' +
        icons[(i - 1 + 5) % 5] +
        '</span><span class="showcase-card-title">' +
        s.title +
        '</span><span class="showcase-card-cta">EXPLORE <b>↗</b></span></a>',
    )
    .join("");
  const cards = [...track.children];
  function step() {
    return (
      cards[0].getBoundingClientRect().width +
      parseFloat(getComputedStyle(track).gap || 0)
    );
  }
  function position(animate = true) {
    track.style.transition = animate
      ? "transform .95s cubic-bezier(.22,.72,.16,1)"
      : "none";
    track.style.transform = "translate3d(" + -step() * (active + 1) + "px,0,0)";
    cards.forEach((card, i) =>
      card.classList.toggle("is-featured", i === active + 1),
    );
    dots.forEach((dot, i) => dot.classList.toggle("active", i === active));
    if (counter)
      counter.textContent = String(active + 1).padStart(2, "0") + " / 05";
  }
  function move(next) {
    if (animating) return;
    animating = true;
    active = (next + 5) % 5;
    position(true);
  }
  track.addEventListener("transitionend", () => {
    animating = false;
    if (active === 0 && track.style.transform.includes("translate3d(")) {
      /* first slide is already aligned */
    }
  });
  function advance() {
    if (active === 4) {
      active = 0;
      position(false);
      requestAnimationFrame(() => requestAnimationFrame(() => move(1)));
    } else move(active + 1);
  }
  function restart() {
    clearInterval(timer);
    if (!matchMedia("(prefers-reduced-motion: reduce)").matches)
      timer = setInterval(advance, 1000);
  }
  document.getElementById("heroPrev")?.addEventListener("click", () => {
    move(active - 1);
    restart();
  });
  document.getElementById("heroNext")?.addEventListener("click", () => {
    advance();
    restart();
  });
  dots.forEach((dot, i) =>
    dot.addEventListener("click", () => {
      move(i);
      restart();
    }),
  );
  window.addEventListener("resize", () => position(false));
  document.addEventListener("visibilitychange", () =>
    document.hidden ? clearInterval(timer) : restart(),
  );
  position(false);
  restart();
})();
