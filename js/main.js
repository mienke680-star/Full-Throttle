/* =========================================================
   FULL THROTTLE UPHOLSTERY & OVERLANDING GEAR — SITE SCRIPT
   ========================================================= */
(function(){
  "use strict";

  var WHATSAPP_NUMBER = "27829079166"; // 082 907 9166
  var CALL_NUMBER = "0660631757";

  function openWhatsApp(message){
    var url = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(message);
    window.open(url, "_blank", "noopener");
  }
  window.FTWhatsApp = openWhatsApp;

  /* ---------- Shared reveal-on-scroll helper ----------
     IntersectionObserver's first callback can lag on some browsers/devices,
     so elements already inside the viewport at observe-time are revealed
     immediately instead of waiting on it. */
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
      }, { threshold:0.1 });
      pending.forEach(function(el){ obs.observe(el); });
    } else {
      pending.forEach(reveal);
    }
  }

  /* ---------- Nav scroll state ---------- */
  var nav = document.querySelector(".site-nav");
  function onScroll(){
    if(!nav) return;
    if(window.scrollY > 40) nav.classList.add("scrolled");
    else nav.classList.remove("scrolled");
  }
  window.addEventListener("scroll", onScroll, { passive:true });
  onScroll();

  /* ---------- Mobile nav ---------- */
  var burger = document.querySelector(".nav-burger");
  var panel = document.querySelector(".mobile-panel");
  var panelClose = document.querySelector(".mobile-panel-close");
  function togglePanel(open){
    if(!panel) return;
    panel.classList.toggle("open", open);
    document.body.classList.toggle("nav-open", open);
  }
  if(burger) burger.addEventListener("click", function(){ togglePanel(true); });
  if(panelClose) panelClose.addEventListener("click", function(){ togglePanel(false); });
  if(panel){
    panel.querySelectorAll("a").forEach(function(a){
      a.addEventListener("click", function(){ togglePanel(false); });
    });
  }

  /* ---------- Generic WhatsApp CTA buttons ---------- */
  document.querySelectorAll("[data-wa-message]").forEach(function(btn){
    btn.addEventListener("click", function(e){
      e.preventDefault();
      openWhatsApp(btn.getAttribute("data-wa-message"));
    });
  });

  /* ---------- Scroll reveal ---------- */
  observeReveals(document.querySelectorAll(".reveal"));

  /* ---------- Mountain ridge draw-on-scroll ---------- */
  observeReveals(document.querySelectorAll(".ridge"));

  /* ---------- Process line fill ---------- */
  var processSection = document.querySelector(".process");
  if(processSection){
    var fill = processSection.querySelector(".process-line-fill");
    var steps = processSection.querySelectorAll(".process-step");
    observeReveals(steps, function(el){
      var idx = Array.prototype.indexOf.call(steps, el);
      el.classList.add("in-view");
      if(fill) fill.style.width = (((idx+1) / steps.length) * 100) + "%";
    });
  }

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
      if(skipBtn){
        skipBtn.addEventListener("click", function(){
          clearTimeout(timer);
          endIntro();
        });
      }
    }
  }

  /* ---------- Catalogue data + rendering ---------- */
  var CATALOGUE = [
    // Vehicle Upholstery
    {
      name:"Vehicle Seat Re-Upholstery",
      cat:"vehicle-upholstery",
      tags:["Vehicle Upholstery"],
      desc:"Complete restoration and re-upholstery of worn vehicle seats in automotive-grade vinyl or leatherette, with fresh foam and heavy-duty stitching.",
      img:"https://images.unsplash.com/photo-1541443131876-44b03de101c5?q=80&w=1200&auto=format&fit=crop"
    },
    {
      name:"Custom Vehicle Seat Designs",
      cat:"vehicle-upholstery",
      tags:["Vehicle Upholstery"],
      desc:"Custom-designed vehicle seating with personalised patterns, piping and contrast stitching, made in automotive vinyl or synthetic leather.",
      img:"https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=1200&auto=format&fit=crop"
    },
    {
      name:"Motorcycle & ATV Seat Upholstery",
      cat:"vehicle-upholstery",
      tags:["Vehicle Upholstery","Motorcycle"],
      desc:"Custom motorcycle, quad bike and ATV seat restoration and redesign in marine-grade vinyl with contrast stitching and embroidery.",
      img:"https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=1200&auto=format&fit=crop"
    },
    {
      name:"Custom Vehicle Boot / Cargo Liner",
      cat:"vehicle-upholstery",
      tags:["Vehicle Upholstery"],
      desc:"Protective custom liner fitted inside your vehicle's boot or cargo area, in quilted automotive vinyl with a padded, foam-backed layer.",
      img:"https://images.unsplash.com/photo-1591637333472-7d2ff5c9c395?q=80&w=1200&auto=format&fit=crop"
    },
    // Overlanding & Camping Gear
    {
      name:"Custom Roof-Rack Gear Covers",
      cat:"overlanding-camping-gear",
      tags:["Overlanding & Camping Gear"],
      desc:"Custom protective covers made for equipment carried on your roof rack, in heavy-duty waterproof canvas with reinforced webbing and buckles.",
      img:"https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=1200&auto=format&fit=crop"
    },
    {
      name:"Rooftop Tent Protective Covers",
      cat:"overlanding-camping-gear",
      tags:["Overlanding & Camping Gear"],
      desc:"Custom covers designed to protect your rooftop tent during transport and storage, in UV-resistant PVC-coated canvas with heavy-duty zips.",
      img:"https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=1200&auto=format&fit=crop"
    },
    {
      name:"Awning Protective Covers",
      cat:"overlanding-camping-gear",
      tags:["Overlanding & Camping Gear"],
      desc:"Protective covers for vehicle-mounted camping and overlanding awnings, in waterproof, UV-resistant canvas with reinforced webbing.",
      img:"https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=1200&auto=format&fit=crop"
    },
    {
      name:"Custom Overlanding Gear Bags",
      cat:"overlanding-camping-gear",
      tags:["Overlanding & Camping Gear"],
      desc:"Custom bags designed to store and transport camping and overlanding equipment, in ripstop or heavy-duty canvas with reinforced handles.",
      img:"https://images.unsplash.com/photo-1533107862482-0e6974b06ec4?q=80&w=1200&auto=format&fit=crop"
    },
    {
      name:"Cylindrical Camping / Overlanding Storage Bag",
      cat:"overlanding-camping-gear",
      tags:["Overlanding & Camping Gear"],
      desc:"Custom round gear bag for storing and carrying camping equipment, in heavy-duty ripstop canvas with a reinforced carry handle.",
      img:"https://images.unsplash.com/photo-1533107862482-0e6974b06ec4?q=80&w=1200&auto=format&fit=crop"
    },
    {
      name:"Custom Braai / Cooking Plate Carry Bag",
      cat:"overlanding-camping-gear",
      tags:["Overlanding & Camping Gear"],
      desc:"Protective carry bag made for a round braai plate, cooking plate or similar equipment, in heavy-duty canvas with padded, protective lining.",
      img:"https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=1200&auto=format&fit=crop"
    },
    {
      name:"Custom Toiletry / Utility Organiser Bag",
      cat:"overlanding-camping-gear",
      tags:["Overlanding & Camping Gear"],
      desc:"Multi-compartment organiser designed for camping, travel and overlanding, in heavy-duty canvas with clear PVC and mesh storage sections.",
      img:"https://images.unsplash.com/photo-1533107862482-0e6974b06ec4?q=80&w=1200&auto=format&fit=crop"
    },
    {
      name:"Camper / Caravan Storage Pockets",
      cat:"overlanding-camping-gear",
      tags:["Overlanding & Camping Gear"],
      desc:"Custom zippered storage compartments fitted into caravan, trailer or camper cabinetry, in heavy-duty canvas with reinforced edging.",
      img:"https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=1200&auto=format&fit=crop"
    },
    {
      name:"Camper Cabinet Zipper Inserts",
      cat:"overlanding-camping-gear",
      tags:["Overlanding & Camping Gear"],
      desc:"Custom soft-storage sections made to fit directly into camper or caravan cupboards, in outdoor-grade canvas with heavy-duty zippers.",
      img:"https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=1200&auto=format&fit=crop"
    },
    // Canvas Work
    {
      name:"Custom Bakkie / Load-Bin Canvas Canopy",
      cat:"canvas-work",
      tags:["Canvas Work"],
      desc:"Custom-made soft canopy fitted over your bakkie's load bin, built in heavy-duty waterproof canvas with reinforced seams and fastening straps.",
      img:"https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=1200&auto=format&fit=crop"
    },
    {
      name:"Camping / Overlanding Tent Enclosures",
      cat:"canvas-work",
      tags:["Canvas Work","Overlanding & Camping Gear"],
      desc:"Custom canvas rooms and tent enclosures for camping and overlanding setups, in waterproof canvas with mesh panels and heavy-duty zips.",
      img:"https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=1200&auto=format&fit=crop"
    },
    {
      name:"Patio / Lapa Canvas Enclosures",
      cat:"canvas-work",
      tags:["Canvas Work"],
      desc:"Custom outdoor canvas walls that enclose patios, entertainment areas and lapas, with clear PVC windows and reinforced eyelets.",
      img:"https://images.unsplash.com/photo-1533107862482-0e6974b06ec4?q=80&w=1200&auto=format&fit=crop"
    },
    {
      name:"Custom Outdoor Appliance Covers",
      cat:"canvas-work",
      tags:["Canvas Work"],
      desc:"Made-to-measure protective covers for outdoor appliances and equipment, in waterproof PVC-coated canvas with reinforced seams.",
      img:"https://images.unsplash.com/photo-1600661653561-629509216228?q=80&w=1200&auto=format&fit=crop"
    },
    {
      name:"Custom Outdoor Equipment Covers",
      cat:"canvas-work",
      tags:["Canvas Work"],
      desc:"Large protective covers manufactured for equipment, cabinets and storage units, in heavy-duty waterproof canvas with tie-down straps.",
      img:"https://images.unsplash.com/photo-1602868043243-cbe8811954ec?q=80&w=1200&auto=format&fit=crop"
    },
    {
      name:"Custom Double Outdoor Storage / Equipment Covers",
      cat:"canvas-work",
      tags:["Canvas Work"],
      desc:"Made-to-measure covers for larger or multiple outdoor units positioned side by side, in heavy-duty weatherproof canvas.",
      img:"https://images.unsplash.com/photo-1602868043243-cbe8811954ec?q=80&w=1200&auto=format&fit=crop"
    },
    {
      name:"Custom Protective Canvas Covers",
      cat:"canvas-work",
      tags:["Canvas Work"],
      desc:"General-purpose covers manufactured to the exact dimensions of your fridge, generator, tools or equipment, in heavy-duty canvas and PVC-coated fabric.",
      img:"https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?q=80&w=1200&auto=format&fit=crop"
    },
    // Furniture Upholstery
    {
      name:"Custom Chair Re-Upholstery",
      cat:"furniture-upholstery",
      tags:["Furniture Upholstery"],
      desc:"Restoration and modernisation of dining chairs and other furniture in upholstery vinyl or leatherette, with fresh foam and decorative stitching.",
      img:"https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=1200&auto=format&fit=crop"
    },
    {
      name:"Custom Bar Stool Upholstery",
      cat:"furniture-upholstery",
      tags:["Furniture Upholstery"],
      desc:"Custom upholstered seats for commercial or private bar stools, built in heavy-duty vinyl with reinforced seat bases and optional branding.",
      img:"https://images.unsplash.com/photo-1541443131876-44b03de101c5?q=80&w=1200&auto=format&fit=crop"
    },
    {
      name:"Furniture Re-Upholstery",
      cat:"furniture-upholstery",
      tags:["Furniture Upholstery"],
      desc:"Restoration of benches, backrests, chairs and other upholstered furniture in vinyl, leatherette or fabric with fresh foam and piping.",
      img:"https://images.unsplash.com/photo-1605559911160-a3d95d213904?q=80&w=1200&auto=format&fit=crop"
    },
    {
      name:"Custom Upholstered Furniture Panels",
      cat:"furniture-upholstery",
      tags:["Furniture Upholstery"],
      desc:"Custom padded panels added to wooden furniture, benches and backrests in high-density foam and upholstery vinyl or leatherette.",
      img:"https://images.unsplash.com/photo-1605559911160-a3d95d213904?q=80&w=1200&auto=format&fit=crop"
    },
    // Custom Manufacturing
    {
      name:"Custom Embroidery & Branding",
      cat:"custom-manufacturing",
      tags:["Custom Manufacturing"],
      desc:"Personalised branding added to upholstery, bags, stools and overlanding products using machine embroidery, patches and contrast stitching.",
      img:"https://images.unsplash.com/photo-1605559911160-a3d95d213904?q=80&w=1200&auto=format&fit=crop"
    },
    {
      name:"Industrial Sewing & Stitching",
      cat:"custom-manufacturing",
      tags:["Custom Manufacturing"],
      desc:"Heavy-duty industrial sewing for custom canvas, upholstery and overlanding products, plus reinforcement and repair stitching.",
      img:"https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=1200&auto=format&fit=crop"
    },
    {
      name:"Upholstery Repairs & Restoration",
      cat:"custom-manufacturing",
      tags:["Custom Manufacturing"],
      desc:"Repairing torn, damaged or worn upholstery on vehicle seats, motorcycle seats, furniture and commercial seating instead of full replacement.",
      img:"https://images.unsplash.com/photo-1591637333472-7d2ff5c9c395?q=80&w=1200&auto=format&fit=crop"
    }
  ];

  var catalogueGrid = document.getElementById("catalogueGrid");
  if(catalogueGrid){
    function waMessage(item){
      return "Hi Full Throttle Upholstery & Overlanding Gear! I'm interested in this item/project from your website: " + item.name +
        ".\n\nVehicle:\nMake/Model:\nYear:\nWhat I need:\n\nCould you please give me more information and a custom quote?";
    }
    function renderCatalogue(filter){
      catalogueGrid.innerHTML = "";
      CATALOGUE.filter(function(item){ return filter === "all" || item.cat === filter; })
        .forEach(function(item, i){
          var card = document.createElement("div");
          card.className = "product-card reveal" + (i % 3 === 1 ? " reveal-delay-1" : i % 3 === 2 ? " reveal-delay-2" : "");
          card.innerHTML =
            '<div class="product-media"><span class="tag gold">Custom Made</span><img loading="lazy" src="' + item.img + '" alt="' + item.name + '"></div>' +
            '<div class="product-body">' +
              '<h3>' + item.name + '</h3>' +
              '<p>' + item.desc + '</p>' +
              '<div class="product-price">Custom Quote</div>' +
              '<button class="btn btn-whatsapp btn-sm btn-block" type="button">' +
                '<svg viewBox="0 0 32 32" fill="currentColor"><path d="M16 3C9.4 3 4 8.4 4 15c0 2.4.7 4.6 1.9 6.5L4 29l7.7-1.9c1.8 1 3.9 1.6 6.3 1.6 6.6 0 12-5.4 12-12S22.6 3 16 3zm6.9 17.1c-.3.8-1.7 1.6-2.3 1.6-.6.1-1.3.1-2.1-.1-.5-.2-1.1-.4-1.9-.7-3.3-1.4-5.5-4.7-5.6-4.9-.2-.2-1.3-1.8-1.3-3.4s.8-2.4 1.1-2.8c.3-.3.7-.4.9-.4h.6c.2 0 .5 0 .7.6.3.7.9 2.4 1 2.6.1.2.2.4 0 .6-.1.2-.2.4-.4.6-.2.2-.4.5-.6.6-.2.2-.4.4-.2.8.2.4 1 1.6 2.1 2.6 1.4 1.3 2.6 1.7 3 1.9.4.2.6.2.8-.1.2-.3.9-1.1 1.2-1.4.3-.3.5-.3.8-.2.3.1 2 1 2.4 1.1.4.2.6.3.7.4.1.3.1.9-.2 1.7z"/></svg>' +
                'Enquire on WhatsApp' +
              '</button>' +
            '</div>';
          card.querySelector("button").addEventListener("click", function(){ openWhatsApp(waMessage(item)); });
          catalogueGrid.appendChild(card);
        });
      observeReveals(catalogueGrid.querySelectorAll(".reveal"));
    }
    renderCatalogue("all");
    document.querySelectorAll(".filter-btn").forEach(function(btn){
      btn.addEventListener("click", function(){
        document.querySelectorAll(".filter-btn").forEach(function(b){ b.classList.remove("active"); });
        btn.classList.add("active");
        renderCatalogue(btn.getAttribute("data-filter"));
      });
    });
  }

  /* ---------- Gallery + lightbox ---------- */
  var GALLERY = [
    { src:"https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=1400&auto=format&fit=crop", cat:"4x4", label:"Custom canopy cover — field fitment" },
    { src:"https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?q=80&w=1400&auto=format&fit=crop", cat:"covers", label:"Full vehicle cover, made-to-measure" },
    { src:"https://images.unsplash.com/photo-1541443131876-44b03de101c5?q=80&w=1400&auto=format&fit=crop", cat:"upholstery", label:"Bucket seat re-trim in progress" },
    { src:"https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=1400&auto=format&fit=crop", cat:"motorcycles", label:"Motorcycle seat upholstery detail" },
    { src:"https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=1400&auto=format&fit=crop", cat:"upholstery", label:"Interior panel stitching" },
    { src:"https://images.unsplash.com/photo-1600661653561-629509216228?q=80&w=1400&auto=format&fit=crop", cat:"covers", label:"Spare wheel cover, workshop finish" },
    { src:"https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=1400&auto=format&fit=crop", cat:"4x4", label:"Rooftop tent travel cover on site" },
    { src:"https://images.unsplash.com/photo-1591637333472-7d2ff5c9c395?q=80&w=1400&auto=format&fit=crop", cat:"motorcycles", label:"Adventure tourer seat rebuild" },
    { src:"https://images.unsplash.com/photo-1533107862482-0e6974b06ec4?q=80&w=1400&auto=format&fit=crop", cat:"custom", label:"Canvas storage roll, custom order" },
    { src:"https://images.unsplash.com/photo-1602868043243-cbe8811954ec?q=80&w=1400&auto=format&fit=crop", cat:"custom", label:"Trailer cover, bespoke project" },
    { src:"https://images.unsplash.com/photo-1605559911160-a3d95d213904?q=80&w=1400&auto=format&fit=crop", cat:"upholstery", label:"Console trim, workshop detail" },
    { src:"https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=1400&auto=format&fit=crop", cat:"4x4", label:"Recovery gear bag, field use" }
  ];

  var masonry = document.getElementById("masonryGrid");
  if(masonry){
    var currentIndex = 0;
    var visibleItems = GALLERY;

    function renderGallery(filter){
      visibleItems = GALLERY.filter(function(g){ return filter === "all" || g.cat === filter; });
      masonry.innerHTML = "";
      visibleItems.forEach(function(item, i){
        var div = document.createElement("div");
        div.className = "masonry-item reveal";
        div.innerHTML = '<img loading="lazy" src="' + item.src + '" alt="' + item.label + '"><div class="masonry-cap"><span>' + item.label + '</span></div>';
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

    function openLightbox(i){
      currentIndex = i;
      updateLightbox();
      lightbox.classList.add("open");
    }
    function updateLightbox(){
      var item = visibleItems[currentIndex];
      if(!item) return;
      lightboxImg.src = item.src;
      lightboxImg.alt = item.label;
      lightboxCap.textContent = item.label;
    }
    if(lightbox){
      lightbox.querySelector(".lightbox-close").addEventListener("click", function(){ lightbox.classList.remove("open"); });
      lightbox.querySelector(".prev").addEventListener("click", function(){
        currentIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length; updateLightbox();
      });
      lightbox.querySelector(".next").addEventListener("click", function(){
        currentIndex = (currentIndex + 1) % visibleItems.length; updateLightbox();
      });
      lightbox.addEventListener("click", function(e){ if(e.target === lightbox) lightbox.classList.remove("open"); });
      document.addEventListener("keydown", function(e){
        if(!lightbox.classList.contains("open")) return;
        if(e.key === "Escape") lightbox.classList.remove("open");
        if(e.key === "ArrowRight") { currentIndex = (currentIndex + 1) % visibleItems.length; updateLightbox(); }
        if(e.key === "ArrowLeft") { currentIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length; updateLightbox(); }
      });
    }
  }

  /* ---------- Before / after slider ---------- */
  document.querySelectorAll(".ba-slider").forEach(function(slider){
    var wrap = slider.closest(".ba-wrap");
    var after = wrap.querySelector(".ba-after");
    var handle = wrap.querySelector(".ba-handle");
    function update(){
      var val = slider.value;
      after.style.clipPath = "inset(0 0 0 " + val + "%)";
      handle.style.left = val + "%";
    }
    slider.addEventListener("input", update);
    update();
  });

  /* ---------- Contact form -> WhatsApp ---------- */
  var contactForm = document.getElementById("contactForm");
  if(contactForm){
    var fileInput = contactForm.querySelector("#photoUpload");
    var fileName = contactForm.querySelector(".file-drop-name");
    if(fileInput){
      fileInput.addEventListener("change", function(){
        if(fileInput.files && fileInput.files[0]){
          fileName.textContent = "Selected: " + fileInput.files[0].name + " — please attach this photo manually once WhatsApp opens.";
        } else {
          fileName.textContent = "";
        }
      });
    }
    contactForm.addEventListener("submit", function(e){
      e.preventDefault();
      var data = new FormData(contactForm);
      var hasPhoto = fileInput && fileInput.files && fileInput.files[0];
      var message =
        "Hi Full Throttle Upholstery & Overlanding Gear! I'd like to request a custom quote.\n\n" +
        "Name: " + (data.get("name") || "-") + "\n" +
        "Phone: " + (data.get("phone") || "-") + "\n" +
        "Email: " + (data.get("email") || "-") + "\n" +
        "Vehicle: " + (data.get("make") || "-") + " " + (data.get("model") || "-") + "\n" +
        "Year: " + (data.get("year") || "-") + "\n" +
        "What I need: " + (data.get("need") || "-") + "\n" +
        "Message: " + (data.get("message") || "-") +
        (hasPhoto ? "\n\n(I have a reference photo to send — attaching separately in this chat.)" : "");
      openWhatsApp(message);
    });
  }

})();
