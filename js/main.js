/* =========================================================
   FULL THROTTLE — OVERLANDING GEAR & FITMENT — SITE SCRIPT
   ========================================================= */
(function(){
  "use strict";

  var WHATSAPP_NUMBER = "27660631757"; // 066 063 1757
  var CALL_NUMBER = "0660631757";

  function openWhatsApp(message){
    var url = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(message);
    window.open(url, "_blank", "noopener");
  }
  window.FTWhatsApp = openWhatsApp;

  /* ---------- Reveal-on-scroll helper ---------- */
  function isInViewport(el){
    var r = el.getBoundingClientRect();
    var vh = window.innerHeight || document.documentElement.clientHeight;
    var vw = window.innerWidth || document.documentElement.clientWidth;
    return r.bottom > 0 && r.top < vh && r.right > 0 && r.left < vw;
  }
  function observeReveals(elements, onReveal){
    var reveal = onReveal || function(el){ el.classList.add("in-view"); };
    var pending = [];
    elements.forEach(function(el){
      if(isInViewport(el)) reveal(el);
      else pending.push(el);
    });
    if(!pending.length) return;
    if("IntersectionObserver" in window){
      var obs = new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
          if(entry.isIntersecting){ reveal(entry.target); obs.unobserve(entry.target); }
        });
      }, { threshold:0.12 });
      pending.forEach(function(el){ obs.observe(el); });
    } else {
      pending.forEach(reveal);
    }
  }

  /* ---------- Scroll progress bar ---------- */
  var progress = document.querySelector(".scroll-progress");
  function updateProgress(){
    if(!progress) return;
    var h = document.documentElement;
    var scrolled = h.scrollTop;
    var max = h.scrollHeight - h.clientHeight;
    progress.style.width = (max > 0 ? (scrolled / max) * 100 : 0) + "%";
  }

  /* ---------- Nav scroll state ---------- */
  var nav = document.querySelector(".topnav");
  function onScroll(){
    if(nav){ if(window.scrollY > 30) nav.classList.add("scrolled"); else nav.classList.remove("scrolled"); }
    updateProgress();
  }
  window.addEventListener("scroll", onScroll, { passive:true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  var burger = document.querySelector(".burger");
  var menu = document.querySelector(".mobile-menu");
  var menuClose = document.querySelector(".mobile-menu-close");
  function toggleMenu(open){
    if(!menu) return;
    menu.classList.toggle("open", open);
    document.body.classList.toggle("menu-open", open);
  }
  if(burger) burger.addEventListener("click", function(){ toggleMenu(true); });
  if(menuClose) menuClose.addEventListener("click", function(){ toggleMenu(false); });
  if(menu){ menu.querySelectorAll("a").forEach(function(a){ a.addEventListener("click", function(){ toggleMenu(false); }); }); }

  /* ---------- Generic WhatsApp CTA buttons ---------- */
  document.querySelectorAll("[data-wa-message]").forEach(function(btn){
    btn.addEventListener("click", function(e){
      e.preventDefault();
      openWhatsApp(btn.getAttribute("data-wa-message"));
    });
  });

  /* ---------- Reveals + stitch dividers ---------- */
  observeReveals(document.querySelectorAll(".reveal"));
  observeReveals(document.querySelectorAll(".stitch-line"));

  /* ---------- Timeline (Custom Builds) ---------- */
  var timeline = document.querySelector(".timeline");
  if(timeline){
    var fill = timeline.querySelector(".timeline-track-fill");
    var steps = timeline.querySelectorAll(".timeline-step");
    observeReveals(steps, function(el){
      var idx = Array.prototype.indexOf.call(steps, el);
      el.classList.add("in-view");
      if(fill) fill.style.height = (((idx + 1) / steps.length) * 100) + "%";
    });
  }

  /* ---------- Stat counters ---------- */
  var stats = document.querySelectorAll(".stat-num[data-count]");
  if(stats.length){
    observeReveals(stats, function(el){
      var target = parseInt(el.getAttribute("data-count"), 10) || 0;
      var suffix = el.getAttribute("data-suffix") || "";
      var duration = 1200, start = null;
      function step(ts){
        if(!start) start = ts;
        var p = Math.min((ts - start) / duration, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(eased * target) + suffix;
        if(p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }

  /* ---------- Custom cursor (desktop only) ---------- */
  if(window.matchMedia && window.matchMedia("(hover:hover) and (pointer:fine)").matches){
    var cursor = document.createElement("div");
    cursor.className = "cursor";
    var label = document.createElement("span");
    label.className = "cursor-label";
    cursor.appendChild(label);
    document.body.appendChild(cursor);
    document.body.classList.add("has-cursor");
    var cx = 0, cy = 0, tx = 0, ty = 0;
    window.addEventListener("mousemove", function(e){ tx = e.clientX; ty = e.clientY; });
    (function loop(){
      cx += (tx - cx) * 0.22; cy += (ty - cy) * 0.22;
      cursor.style.transform = "translate(" + cx + "px," + cy + "px) translate(-50%,-50%)";
      requestAnimationFrame(loop);
    })();
    document.querySelectorAll("[data-cursor]").forEach(function(el){
      el.addEventListener("mouseenter", function(){
        cursor.classList.add("hover");
        label.textContent = el.getAttribute("data-cursor");
      });
      el.addEventListener("mouseleave", function(){ cursor.classList.remove("hover"); label.textContent = ""; });
    });
  }

  /* ---------- Horizontal rail drag-scroll (desktop mouse) ---------- */
  document.querySelectorAll(".rail").forEach(function(rail){
    var isDown = false, startX, scrollStart;
    rail.addEventListener("mousedown", function(e){
      isDown = true; rail.classList.add("dragging");
      startX = e.pageX; scrollStart = rail.scrollLeft;
    });
    window.addEventListener("mouseup", function(){ isDown = false; rail.classList.remove("dragging"); });
    window.addEventListener("mousemove", function(e){
      if(!isDown) return;
      e.preventDefault();
      rail.scrollLeft = scrollStart - (e.pageX - startX);
    });
  });

  /* ---------- Intro animation ---------- */
  var intro = document.getElementById("intro");
  if(intro){
    var skipBtn = intro.querySelector(".intro-skip");
    var seen = false;
    try { seen = sessionStorage.getItem("ft_intro_seen") === "1"; } catch(e){}
    var reducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var isNarrow = window.matchMedia && window.matchMedia("(max-width: 640px)").matches;

    function endIntro(){
      intro.classList.add("hide");
      document.body.classList.remove("intro-active");
      try { sessionStorage.setItem("ft_intro_seen", "1"); } catch(e){}
      setTimeout(function(){ intro.style.display = "none"; }, 750);
    }
    if(seen || reducedMotion){
      intro.style.display = "none";
    } else {
      document.body.classList.add("intro-active");
      var duration = isNarrow ? 2600 : 4300;
      var timer = setTimeout(endIntro, duration);
      if(skipBtn) skipBtn.addEventListener("click", function(){ clearTimeout(timer); endIntro(); });
    }
  }

  /* =========================================================
     PRODUCT DATA — 27 items across new filter taxonomy:
     vehicles | overlanding | canvas | furniture | covers | bags | custom
     ========================================================= */
  var PRODUCTS = [
    { name:"Vehicle Seat Re-Upholstery", cat:"vehicles", desc:"Complete restoration and re-upholstery of worn vehicle seats.", materials:"Automotive Vinyl · Leatherette · Foam", wa:"Hi Full Throttle, I'd like a quote for vehicle upholstery. I can send you photos of the seats.", img:"https://images.unsplash.com/photo-1541443131876-44b03de101c5?q=80&w=1200&auto=format&fit=crop" },
    { name:"Custom Vehicle Seat Designs", cat:"vehicles", desc:"Custom-designed seating with personalised patterns, piping and contrast stitching.", materials:"Automotive Vinyl · Synthetic Leather · Piping", wa:"Hi Full Throttle, I'd like to design custom vehicle seats. Please can you assist me with a quote?", img:"https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=1200&auto=format&fit=crop" },
    { name:"Motorcycle & ATV Seat Upholstery", cat:"vehicles", desc:"Custom motorcycle, quad bike and ATV seat restoration and redesign.", materials:"Marine-Grade Vinyl · Non-Slip Backing", wa:"Hi Full Throttle, I'd like a quote to upgrade my motorcycle/ATV seat.", img:"https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=1200&auto=format&fit=crop" },
    { name:"Vehicle Boot & Cargo Liners", cat:"vehicles", desc:"Made-to-measure protective liners for vehicle boots and cargo areas.", materials:"Quilted Vinyl · Foam-Backed Padding", wa:"Hi Full Throttle, I'd like a quote for a custom boot/cargo liner.", img:"https://images.unsplash.com/photo-1591637333472-7d2ff5c9c395?q=80&w=1200&auto=format&fit=crop" },

    { name:"Camping & Overlanding Tent Enclosures", cat:"overlanding", desc:"Custom canvas rooms and tent enclosures for camping and overlanding setups.", materials:"Waterproof Canvas · Mesh · Clear PVC", wa:"Hi Full Throttle, I'd like a quote for a tent enclosure.", img:"https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=1200&auto=format&fit=crop" },
    { name:"Roof-Rack Gear Covers", cat:"overlanding", desc:"Custom protective covers for equipment transported on your roof rack.", materials:"Waterproof Canvas · Webbing · Buckles", wa:"Hi Full Throttle, I'd like to order a custom roof-rack cover.", img:"https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=1200&auto=format&fit=crop" },
    { name:"Rooftop Tent Protective Covers", cat:"overlanding", desc:"Custom covers to protect your rooftop tent during travel and storage.", materials:"PVC-Coated Canvas · UV-Resistant", wa:"Hi Full Throttle, I'd like a quote for a rooftop tent cover.", img:"https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=1200&auto=format&fit=crop" },
    { name:"Awning Protective Covers", cat:"overlanding", desc:"Protective covers for vehicle-mounted camping and overlanding awnings.", materials:"Waterproof Canvas · UV-Resistant", wa:"Hi Full Throttle, I'd like to request an awning cover.", img:"https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=1200&auto=format&fit=crop" },
    { name:"Camper & Caravan Storage Pockets", cat:"overlanding", desc:"Custom zippered storage compartments for camper, trailer or caravan cabinetry.", materials:"Heavy-Duty Canvas · Reinforced Edging", wa:"Hi Full Throttle, I'd like a quote for a camper storage solution.", img:"https://images.unsplash.com/photo-1602868043243-cbe8811954ec?q=80&w=1200&auto=format&fit=crop" },
    { name:"Camper Cabinet Zipper Inserts", cat:"overlanding", desc:"Custom soft-storage inserts manufactured to fit directly into camper cabinetry.", materials:"Outdoor-Grade Canvas · Heavy-Duty Zips", wa:"Hi Full Throttle, I'd like to customise my camper storage.", img:"https://images.unsplash.com/photo-1533107862482-0e6974b06ec4?q=80&w=1200&auto=format&fit=crop" },

    { name:"Custom Bakkie / Load-Bin Canvas Canopies", cat:"canvas", desc:"Custom-manufactured soft canvas canopies for bakkies and load bins.", materials:"Waterproof Canvas · Reinforced Seams", wa:"Hi Full Throttle, I'm interested in a custom canopy. Please can you assist me with a quote?", img:"https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=1200&auto=format&fit=crop" },
    { name:"Patio & Lapa Canvas Enclosures", cat:"canvas", desc:"Made-to-measure outdoor canvas walls and enclosures for patios and lapas.", materials:"Weather-Resistant Canvas · Clear PVC Windows", wa:"Hi Full Throttle, I'd like to enquire about an outdoor enclosure.", img:"https://images.unsplash.com/photo-1533107862482-0e6974b06ec4?q=80&w=1200&auto=format&fit=crop" },

    { name:"Custom Chair Re-Upholstery", cat:"furniture", desc:"Restoration and modernisation of dining chairs, stools and other furniture.", materials:"Upholstery Vinyl · Leatherette · Foam", wa:"Hi Full Throttle, I'd like a quote for chair upholstery.", img:"https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=1200&auto=format&fit=crop" },
    { name:"Custom Bar Stool Upholstery", cat:"furniture", desc:"Custom upholstered bar stools for homes, restaurants, bars and businesses.", materials:"Heavy-Duty Vinyl · Reinforced Bases", wa:"Hi Full Throttle, I'd like to customise my bar stools.", img:"https://images.unsplash.com/photo-1541443131876-44b03de101c5?q=80&w=1200&auto=format&fit=crop" },
    { name:"Furniture Re-Upholstery", cat:"furniture", desc:"Restoration for chairs, benches, backrests and commercial seating.", materials:"Vinyl · Leatherette · Fabric · Foam", wa:"Hi Full Throttle, I'd like a quote for furniture restoration.", img:"https://images.unsplash.com/photo-1605559911160-a3d95d213904?q=80&w=1200&auto=format&fit=crop" },
    { name:"Custom Upholstered Furniture Panels", cat:"furniture", desc:"Custom padded and upholstered panels for benches and custom installations.", materials:"High-Density Foam · Upholstery Vinyl", wa:"Hi Full Throttle, I'd like to enquire about custom panels.", img:"https://images.unsplash.com/photo-1605559911160-a3d95d213904?q=80&w=1200&auto=format&fit=crop" },

    { name:"Outdoor Appliance Covers", cat:"covers", desc:"Made-to-measure protective covers for fridges, freezers and outdoor appliances.", materials:"PVC-Coated Canvas · UV-Resistant", wa:"Hi Full Throttle, I'd like a made-to-measure appliance cover.", img:"https://images.unsplash.com/photo-1600661653561-629509216228?q=80&w=1200&auto=format&fit=crop" },
    { name:"Outdoor Equipment Covers", cat:"covers", desc:"Heavy-duty custom covers for outdoor equipment, storage units and machinery.", materials:"Waterproof Canvas · Webbing Straps", wa:"Hi Full Throttle, I'd like to request an equipment cover.", img:"https://images.unsplash.com/photo-1602868043243-cbe8811954ec?q=80&w=1200&auto=format&fit=crop" },
    { name:"Large & Double Equipment Covers", cat:"covers", desc:"Made-to-measure covers for larger equipment or multiple items positioned together.", materials:"Weatherproof Canvas · Tie-Down Straps", wa:"Hi Full Throttle, I'd like to send you my dimensions for a large equipment cover.", img:"https://images.unsplash.com/photo-1602868043243-cbe8811954ec?q=80&w=1200&auto=format&fit=crop" },
    { name:"General Custom Protective Covers", cat:"covers", desc:"Covers manufactured to the exact dimensions of almost any equipment, generator, tools or accessories.", materials:"Heavy-Duty Canvas · Ripstop · Velcro", wa:"Hi Full Throttle, I'd like to send you measurements for a custom protective cover.", img:"https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?q=80&w=1200&auto=format&fit=crop" },

    { name:"Custom Overlanding Gear Bags", cat:"bags", desc:"Heavy-duty storage and transport bags manufactured for camping and overlanding equipment.", materials:"Ripstop Canvas · Reinforced Handles", wa:"Hi Full Throttle, I'd like to design a custom gear bag.", img:"https://images.unsplash.com/photo-1533107862482-0e6974b06ec4?q=80&w=1200&auto=format&fit=crop" },
    { name:"Cylindrical Camping Storage Bags", cat:"bags", desc:"Round custom camping and overlanding storage bags.", materials:"Ripstop Canvas · Reinforced Handle", wa:"Hi Full Throttle, I'd like to enquire about a cylindrical storage bag.", img:"https://images.unsplash.com/photo-1533107862482-0e6974b06ec4?q=80&w=1200&auto=format&fit=crop" },
    { name:"Braai & Cooking Plate Carry Bags", cat:"bags", desc:"Protective custom bags for braai plates, cooking plates and camping cooking equipment.", materials:"Heavy-Duty Canvas · Protective Lining", wa:"Hi Full Throttle, I'd like to order a custom braai bag.", img:"https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=1200&auto=format&fit=crop" },
    { name:"Toiletry & Utility Organiser Bags", cat:"bags", desc:"Custom multi-compartment organisers for camping, travel and overlanding.", materials:"Heavy-Duty Canvas · Clear PVC · Mesh", wa:"Hi Full Throttle, I'd like to customise a utility organiser.", img:"https://images.unsplash.com/photo-1533107862482-0e6974b06ec4?q=80&w=1200&auto=format&fit=crop" },

    { name:"Custom Embroidery & Branding", cat:"custom", desc:"Personalised branding, logos and stitching added to suitable Full Throttle products.", materials:"Machine Embroidery · Patches · Contrast Stitch", wa:"Hi Full Throttle, I'd like to ask about custom branding.", img:"https://images.unsplash.com/photo-1605559911160-a3d95d213904?q=80&w=1200&auto=format&fit=crop" },
    { name:"Industrial Sewing & Stitching", cat:"custom", desc:"Heavy-duty industrial sewing for canvas, upholstery and overlanding fabrication.", materials:"Industrial Thread · Webbing · Canvas", wa:"Hi Full Throttle, I have a custom project I'd like you to manufacture. I would like to send you photos and measurements for a quote.", img:"https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=1200&auto=format&fit=crop" },
    { name:"Upholstery Repairs & Restoration", cat:"custom", desc:"Professional repair and restoration instead of full replacement, where possible.", materials:"Matched Vinyl · Foam · Reinforcement", wa:"Hi Full Throttle, I'd like to send you a photo for a repair quote.", img:"https://images.unsplash.com/photo-1591637333472-7d2ff5c9c395?q=80&w=1200&auto=format&fit=crop" }
  ];
  window.FT_PRODUCT_COUNT = PRODUCTS.length;

  var productGrid = document.getElementById("productGrid");
  if(productGrid){
    function waMessage(item){ return item.wa; }
    function renderProducts(filter){
      productGrid.innerHTML = "";
      PRODUCTS.filter(function(item){ return filter === "all" || item.cat === filter; })
        .forEach(function(item, i){
          var card = document.createElement("div");
          card.className = "workcard reveal" + (i % 3 === 1 ? " reveal-d1" : i % 3 === 2 ? " reveal-d2" : "");
          card.innerHTML =
            '<div class="workcard-media" data-cursor="Explore"><span class="badge">Custom Made</span><img loading="lazy" src="' + item.img + '" alt="' + item.name + '">' +
              '<span class="workcard-corner tl"></span><span class="workcard-corner br"></span></div>' +
            '<div class="workcard-body">' +
              '<h3>' + item.name + '</h3>' +
              '<p>' + item.desc + '</p>' +
              '<div class="workcard-materials">' + item.materials + '</div>' +
              '<div class="workcard-price">Custom Quote</div>' +
              '<button class="btn btn-green btn-sm btn-block" type="button">' +
                '<svg viewBox="0 0 32 32" fill="currentColor"><path d="M16 3C9.4 3 4 8.4 4 15c0 2.4.7 4.6 1.9 6.5L4 29l7.7-1.9c1.8 1 3.9 1.6 6.3 1.6 6.6 0 12-5.4 12-12S22.6 3 16 3zm6.9 17.1c-.3.8-1.7 1.6-2.3 1.6-.6.1-1.3.1-2.1-.1-.5-.2-1.1-.4-1.9-.7-3.3-1.4-5.5-4.7-5.6-4.9-.2-.2-1.3-1.8-1.3-3.4s.8-2.4 1.1-2.8c.3-.3.7-.4.9-.4h.6c.2 0 .5 0 .7.6.3.7.9 2.4 1 2.6.1.2.2.4 0 .6-.1.2-.2.4-.4.6-.2.2-.4.5-.6.6-.2.2-.4.4-.2.8.2.4 1 1.6 2.1 2.6 1.4 1.3 2.6 1.7 3 1.9.4.2.6.2.8-.1.2-.3.9-1.1 1.2-1.4.3-.3.5-.3.8-.2.3.1 2 1 2.4 1.1.4.2.6.3.7.4.1.3.1.9-.2 1.7z"/></svg>' +
                'Ask About This Product' +
              '</button>' +
            '</div>';
          card.querySelector("button").addEventListener("click", function(){ openWhatsApp(waMessage(item)); });
          productGrid.appendChild(card);
        });
      observeReveals(productGrid.querySelectorAll(".reveal"));
    }
    var validCats = ["vehicles","overlanding","canvas","furniture","covers","bags","custom"];
    var urlCat = new URLSearchParams(window.location.search).get("cat");
    var initialFilter = validCats.indexOf(urlCat) !== -1 ? urlCat : "all";
    document.querySelectorAll(".filter-btn[data-filter]").forEach(function(b){
      b.classList.toggle("active", b.getAttribute("data-filter") === initialFilter);
    });
    renderProducts(initialFilter);
    document.querySelectorAll(".filter-btn[data-filter]").forEach(function(btn){
      btn.addEventListener("click", function(){
        document.querySelectorAll(".filter-btn[data-filter]").forEach(function(b){ b.classList.remove("active"); });
        btn.classList.add("active");
        renderProducts(btn.getAttribute("data-filter"));
      });
    });
  }

  /* ---------- Gallery + lightbox ---------- */
  var GALLERY = [
    { src:"https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=1400&auto=format&fit=crop", cat:"custom-made", label:"Custom canopy — field fitment" },
    { src:"https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?q=80&w=1400&auto=format&fit=crop", cat:"custom-made", label:"Full vehicle cover, made-to-measure" },
    { src:"https://images.unsplash.com/photo-1541443131876-44b03de101c5?q=80&w=1400&auto=format&fit=crop", cat:"upholstery", label:"Bucket seat re-trim in progress" },
    { src:"https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=1400&auto=format&fit=crop", cat:"upholstery", label:"Motorcycle seat upholstery detail" },
    { src:"https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=1400&auto=format&fit=crop", cat:"restoration", label:"Interior panel stitching" },
    { src:"https://images.unsplash.com/photo-1600661653561-629509216228?q=80&w=1400&auto=format&fit=crop", cat:"custom-made", label:"Spare wheel cover, workshop finish" },
    { src:"https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=1400&auto=format&fit=crop", cat:"overlanding", label:"Rooftop tent cover on site" },
    { src:"https://images.unsplash.com/photo-1591637333472-7d2ff5c9c395?q=80&w=1400&auto=format&fit=crop", cat:"upholstery", label:"Adventure tourer seat rebuild" },
    { src:"https://images.unsplash.com/photo-1533107862482-0e6974b06ec4?q=80&w=1400&auto=format&fit=crop", cat:"overlanding", label:"Canvas storage roll, custom order" },
    { src:"https://images.unsplash.com/photo-1602868043243-cbe8811954ec?q=80&w=1400&auto=format&fit=crop", cat:"custom-made", label:"Trailer cover, bespoke project" },
    { src:"https://images.unsplash.com/photo-1605559911160-a3d95d213904?q=80&w=1400&auto=format&fit=crop", cat:"restoration", label:"Console trim, workshop detail" },
    { src:"https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=1400&auto=format&fit=crop", cat:"overlanding", label:"Recovery gear bag, field use" }
  ];

  var masonry = document.getElementById("masonryGrid");
  if(masonry){
    var currentIndex = 0, visibleItems = GALLERY;
    function renderGallery(filter){
      visibleItems = GALLERY.filter(function(g){ return filter === "all" || g.cat === filter; });
      masonry.innerHTML = "";
      visibleItems.forEach(function(item, i){
        var div = document.createElement("div");
        div.className = "masonry-item reveal";
        div.setAttribute("data-cursor", "View");
        div.innerHTML = '<img loading="lazy" src="' + item.src + '" alt="' + item.label + '"><div class="masonry-cap"><span class="tag">Full Throttle</span><span>' + item.label + '</span></div>';
        div.addEventListener("click", function(){ openLightbox(i); });
        masonry.appendChild(div);
      });
      observeReveals(masonry.querySelectorAll(".reveal"));
    }
    renderGallery("all");
    document.querySelectorAll("[data-gallery-filter]").forEach(function(btn){
      btn.addEventListener("click", function(){
        document.querySelectorAll("[data-gallery-filter]").forEach(function(b){ b.classList.remove("active"); });
        btn.classList.add("active");
        renderGallery(btn.getAttribute("data-gallery-filter"));
      });
    });

    var lightbox = document.getElementById("lightbox");
    var lightboxImg = lightbox ? lightbox.querySelector("img") : null;
    var lightboxCap = lightbox ? lightbox.querySelector(".lightbox-cap") : null;
    function openLightbox(i){ currentIndex = i; updateLightbox(); lightbox.classList.add("open"); }
    function updateLightbox(){
      var item = visibleItems[currentIndex]; if(!item) return;
      lightboxImg.src = item.src; lightboxImg.alt = item.label; lightboxCap.textContent = item.label;
    }
    if(lightbox){
      lightbox.querySelector(".lightbox-close").addEventListener("click", function(){ lightbox.classList.remove("open"); });
      lightbox.querySelector(".prev").addEventListener("click", function(){ currentIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length; updateLightbox(); });
      lightbox.querySelector(".next").addEventListener("click", function(){ currentIndex = (currentIndex + 1) % visibleItems.length; updateLightbox(); });
      lightbox.addEventListener("click", function(e){ if(e.target === lightbox) lightbox.classList.remove("open"); });
      document.addEventListener("keydown", function(e){
        if(!lightbox.classList.contains("open")) return;
        if(e.key === "Escape") lightbox.classList.remove("open");
        if(e.key === "ArrowRight"){ currentIndex = (currentIndex + 1) % visibleItems.length; updateLightbox(); }
        if(e.key === "ArrowLeft"){ currentIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length; updateLightbox(); }
      });
    }
  }

  /* ---------- Before / after sliders ---------- */
  document.querySelectorAll(".ba-slider").forEach(function(slider){
    var wrap = slider.closest(".ba-wrap");
    var after = wrap.querySelector(".ba-after");
    var handle = wrap.querySelector(".ba-handle");
    function update(){ var v = slider.value; after.style.clipPath = "inset(0 0 0 " + v + "%)"; handle.style.left = v + "%"; }
    slider.addEventListener("input", update);
    update();
  });

  /* =========================================================
     CONFIGURATOR — "What Do You Need Made?"
     ========================================================= */
  var configurator = document.getElementById("configurator");
  if(configurator){
    var step1 = configurator.querySelector('[data-step="1"]');
    var step2 = configurator.querySelector('[data-step="2"]');
    var selectedLabel = configurator.querySelector(".config-selected");
    var chosenCategory = "";
    configurator.querySelectorAll(".config-option").forEach(function(opt){
      opt.addEventListener("click", function(){
        configurator.querySelectorAll(".config-option").forEach(function(o){ o.classList.remove("selected"); });
        opt.classList.add("selected");
        chosenCategory = opt.textContent.trim();
        if(selectedLabel) selectedLabel.textContent = chosenCategory;
        step1.classList.remove("active");
        step2.classList.add("active");
      });
    });
    configurator.querySelectorAll(".config-back").forEach(function(b){
      b.addEventListener("click", function(){ step2.classList.remove("active"); step1.classList.add("active"); });
    });
    var configForm = configurator.querySelector("#configForm");
    if(configForm){
      configForm.addEventListener("submit", function(e){
        e.preventDefault();
        var data = new FormData(configForm);
        var msg = "Hi Full Throttle, I have a custom project I'd like you to manufacture.\n\n" +
          "Category: " + (chosenCategory || "-") + "\n" +
          "Vehicle (if relevant): " + (data.get("vehicle") || "-") + "\n" +
          "Approx. Dimensions: " + (data.get("dimensions") || "-") + "\n" +
          "Preferred Material: " + (data.get("material") || "-") + "\n" +
          "Preferred Colour: " + (data.get("colour") || "-") + "\n" +
          "Quantity: " + (data.get("quantity") || "-") + "\n" +
          "Description: " + (data.get("description") || "-") +
          "\n\nI would like to send photos and measurements for a quote.";
        openWhatsApp(msg);
      });
    }
  }

  /* ---------- Contact form -> WhatsApp ---------- */
  var contactForm = document.getElementById("contactForm");
  if(contactForm){
    var fileInput = contactForm.querySelector("#photoUpload");
    var fileName = contactForm.querySelector(".file-drop-name");
    if(fileInput){
      fileInput.addEventListener("change", function(){
        fileName.textContent = fileInput.files && fileInput.files[0]
          ? "Selected: " + fileInput.files[0].name + " — please attach this photo manually once WhatsApp opens."
          : "";
      });
    }
    contactForm.addEventListener("submit", function(e){
      e.preventDefault();
      var data = new FormData(contactForm);
      var hasPhoto = fileInput && fileInput.files && fileInput.files[0];
      var message =
        "Hi Full Throttle, I'd like to request a custom quote.\n\n" +
        "Name: " + (data.get("name") || "-") + "\n" +
        "Phone: " + (data.get("phone") || "-") + "\n" +
        "Enquiry Type: " + (data.get("need") || "-") + "\n" +
        "Vehicle Type (if relevant): " + (data.get("vehicle") || "-") + "\n" +
        "Approx. Dimensions: " + (data.get("dimensions") || "-") + "\n" +
        "Preferred Material: " + (data.get("material") || "-") + "\n" +
        "Preferred Colour: " + (data.get("colour") || "-") + "\n" +
        "Quantity: " + (data.get("quantity") || "-") + "\n" +
        "Description: " + (data.get("description") || "-") +
        (hasPhoto ? "\n\n(I have a reference photo to send — attaching separately in this chat.)" : "");
      openWhatsApp(message);
    });
  }

})();
