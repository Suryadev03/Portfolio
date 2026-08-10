document.addEventListener("DOMContentLoaded",()=>{
 const q=s=>document.querySelector(s);
 const progress=q("#progress");
 addEventListener("scroll",()=>{const max=document.documentElement.scrollHeight-innerHeight; if(progress)progress.style.width=(max?scrollY/max*100:0)+"%"},{passive:true});
 document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener("click",e=>{const t=q(a.getAttribute("href"));if(t){e.preventDefault();t.scrollIntoView({behavior:"smooth"});}}));
 const slider=q("#certSlider");
 q("#certPrev")?.addEventListener("click",()=>slider?.scrollBy({left:-460,behavior:"smooth"}));
 q("#certNext")?.addEventListener("click",()=>slider?.scrollBy({left:460,behavior:"smooth"}));
 slider?.addEventListener("wheel",e=>{if(Math.abs(e.deltaY)>Math.abs(e.deltaX)){e.preventDefault();slider.scrollLeft+=e.deltaY;}},{passive:false});
});
document.addEventListener("DOMContentLoaded",()=>{
 const $=s=>document.querySelector(s), $$=s=>document.querySelectorAll(s);

 // Mobile navigation
 const menu=$("#menuBtn"), nav=document.querySelector("header nav");
 menu?.addEventListener("click",()=>nav?.classList.toggle("open"));
 nav?.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>nav.classList.remove("open")));

 // Scroll reveal
 const revealTargets=[...$$(".section,.stats,.closing,.experience-card,.project-feature-layout,.project-grid,.edu-cert")];
 revealTargets.forEach(el=>el.classList.add("reveal"));
 const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add("visible");io.unobserve(e.target)}}),{threshold:.08});
 revealTargets.forEach(el=>io.observe(el));

 // Cursor-follow spotlight
 $$(".skill-card,.project-interactive,.cert-card,.about-cards>div").forEach(el=>{
   el.addEventListener("pointermove",e=>{
     const r=el.getBoundingClientRect();
     el.style.setProperty("--mx",(e.clientX-r.left)+"px");
     el.style.setProperty("--my",(e.clientY-r.top)+"px");
   });
 });

 // Animated counters
 const counters=[...$$(".stats strong")];
 const countIO=new IntersectionObserver(entries=>{
   entries.forEach(entry=>{
     if(!entry.isIntersecting)return;
     const el=entry.target, raw=el.textContent.trim(), match=raw.match(/(\d+)/);
     if(!match)return;
     const target=Number(match[1]), suffix=raw.replace(/\d+/,"");
     let start=0, duration=1100, t0=null;
     const step=t=>{if(!t0)t0=t; const p=Math.min((t-t0)/duration,1); const eased=1-Math.pow(1-p,3); el.textContent=Math.round(target*eased)+suffix;if(p<1)requestAnimationFrame(step)};
     el.textContent="0"+suffix;requestAnimationFrame(step);countIO.unobserve(el);
   });
 },{threshold:.7});
 counters.forEach(c=>countIO.observe(c));

 // Certification scroller
 const slider=$("#certSlider");
 $("#certPrev")?.addEventListener("click",()=>slider?.scrollBy({left:-460,behavior:"smooth"}));
 $("#certNext")?.addEventListener("click",()=>slider?.scrollBy({left:460,behavior:"smooth"}));
 slider?.addEventListener("wheel",e=>{if(Math.abs(e.deltaY)>Math.abs(e.deltaX)){e.preventDefault();slider.scrollLeft+=e.deltaY;}},{passive:false});

 // Certificate image viewer
 const imageModal=$("#imageModal"), modalImage=$("#modalImage"), modalCaption=$("#modalCaption");
 const closeImage=()=>{imageModal?.classList.remove("open");imageModal?.setAttribute("aria-hidden","true")};
 $$(".cert-interactive").forEach(card=>{
   card.addEventListener("click",e=>{
     e.preventDefault();
     const href=card.getAttribute("href"), name=card.querySelector("strong")?.textContent||"Certificate";
     modalImage.src=href; modalImage.alt=name; modalCaption.textContent=name;
     imageModal.classList.add("open"); imageModal.setAttribute("aria-hidden","false");
   });
 });
 $("#modalClose")?.addEventListener("click",closeImage);
 imageModal?.addEventListener("click",e=>{if(e.target===imageModal)closeImage()});

 // Project detail viewer
 const pModal=$("#projectModal"), pImg=$("#projectModalImage"), pTitle=$("#projectModalTitle"), pMeta=$("#projectModalMeta"), pDesc=$("#projectModalDescription"), pTags=$("#projectModalTags"), pLink=$("#projectModalLink");
 const closeProject=()=>{pModal?.classList.remove("open");pModal?.setAttribute("aria-hidden","true")};
 $$(".project-interactive").forEach(card=>{
   card.addEventListener("click",e=>{
     if(e.target.closest("a")) return;
     pTitle.textContent=card.dataset.title||"Project";
     pMeta.textContent=card.dataset.meta||"PROJECT";
     pDesc.textContent=card.dataset.description||"";
     pImg.src=card.dataset.image||"";
     pImg.alt=card.dataset.title||"Project";
     pLink.href=card.dataset.link||"https://github.com/Suryadev03";
     pTags.innerHTML="";
     card.querySelectorAll(".project-tags span").forEach(s=>{const x=document.createElement("span");x.textContent=s.textContent;pTags.appendChild(x)});
     pModal.classList.add("open");pModal.setAttribute("aria-hidden","false");
   });
 });
 $("#projectModalClose")?.addEventListener("click",closeProject);
 pModal?.addEventListener("click",e=>{if(e.target===pModal)closeProject()});

 // Escape closes overlays
 addEventListener("keydown",e=>{if(e.key==="Escape"){closeImage();closeProject();nav?.classList.remove("open")}});

 // 3D tilt on desktop cards
 $$(".project-interactive,.about-cards>div").forEach(card=>{
   card.addEventListener("pointermove",e=>{
     if(innerWidth<900)return;
     const r=card.getBoundingClientRect(), x=(e.clientX-r.left)/r.width-.5, y=(e.clientY-r.top)/r.height-.5;
     card.style.transform=`perspective(800px) rotateX(${-y*3}deg) rotateY(${x*3}deg) translateY(-5px)`;
   });
   card.addEventListener("pointerleave",()=>card.style.transform="");
 });
});


/* ===== CERTIFICATION AUTO-SLIDER: ONE COLUMN PER TICK ===== */
document.addEventListener("DOMContentLoaded",()=>{
  const certSlider=document.querySelector("#certSlider");
  if(!certSlider) return;

  let timer=null, paused=false, currentColumn=0;
  const getColumnWidth=()=>{
    const first=certSlider.querySelector(".cert-card");
    if(!first) return 0;
    const styles=getComputedStyle(certSlider);
    const gap=parseFloat(styles.columnGap || styles.gap || 0);
    return first.getBoundingClientRect().width + gap;
  };
  const getColumnCount=()=>{
    const cards=certSlider.querySelectorAll(".cert-card").length;
    return Math.ceil(cards/4); // 4 rows = one moving column
  };
  const getVisibleColumns=()=>{
    const step=getColumnWidth();
    return step ? Math.max(1,Math.floor((certSlider.clientWidth+1)/step)) : 1;
  };
  const tick=()=>{
    if(paused) return;
    const step=getColumnWidth();
    const columns=getColumnCount();
    const visible=getVisibleColumns();
    const maxColumn=Math.max(0,columns-visible);
    if(!step || maxColumn<=0) return;

    currentColumn=(currentColumn+1)%(maxColumn+1);
    certSlider.classList.add("auto-transition");

    if(currentColumn===0){
      certSlider.scrollTo({left:0,behavior:"smooth"});
    }else{
      certSlider.scrollTo({left:currentColumn*step,behavior:"smooth"});
    }

    setTimeout(()=>certSlider.classList.remove("auto-transition"),650);
  };
  const start=()=>{clearInterval(timer);timer=setInterval(tick,3000)};
  const stop=()=>{paused=true;clearInterval(timer)};
  const resume=()=>{paused=false;start()};

  certSlider.addEventListener("mouseenter",stop);
  certSlider.addEventListener("mouseleave",resume);
  certSlider.addEventListener("focusin",stop);
  certSlider.addEventListener("focusout",resume);

  let touchTimer;
  certSlider.addEventListener("touchstart",()=>{paused=true;clearInterval(timer)},{passive:true});
  certSlider.addEventListener("touchend",()=>{
    clearTimeout(touchTimer);
    touchTimer=setTimeout(()=>{paused=false;start()},1200);
  },{passive:true});

  // Start at the first group, then reveal the next column every 3 seconds.
  currentColumn=0;
  certSlider.scrollLeft=0;
  start();
});

/* ===== FINAL BLUEPRINT JAVASCRIPT ===== */
document.addEventListener("DOMContentLoaded",()=>{
  const $=s=>document.querySelector(s), $$=s=>document.querySelectorAll(s);

  /* Rotating skill-position patterns: photo stays fixed, labels move. */
  const orbit=$("#skillOrbit");
  const skills=[...document.querySelectorAll("#skillOrbit .orbit-skill")];
  const patterns=[
    {
      python:{top:"3%",left:"18%",right:"auto",bottom:"auto"},
      ml:{top:"27%",right:"0%",left:"auto",bottom:"auto"},
      dl:{top:"auto",right:"1%",left:"auto",bottom:"19%"},
      genai:{top:"auto",left:"28%",right:"auto",bottom:"3%"},
      data:{top:"53%",left:"0%",right:"auto",bottom:"auto"}
    },
    {
      python:{top:"27%",right:"0%",left:"auto",bottom:"auto"},
      ml:{top:"auto",right:"1%",left:"auto",bottom:"19%"},
      dl:{top:"auto",left:"28%",right:"auto",bottom:"3%"},
      genai:{top:"53%",left:"0%",right:"auto",bottom:"auto"},
      data:{top:"3%",left:"18%",right:"auto",bottom:"auto"}
    },
    {
      python:{top:"auto",left:"28%",right:"auto",bottom:"3%"},
      ml:{top:"3%",left:"18%",right:"auto",bottom:"auto"},
      dl:{top:"27%",right:"0%",left:"auto",bottom:"auto"},
      genai:{top:"auto",right:"1%",left:"auto",bottom:"19%"},
      data:{top:"53%",left:"0%",right:"auto",bottom:"auto"}
    },
    {
      python:{top:"53%",left:"0%",right:"auto",bottom:"auto"},
      ml:{top:"auto",left:"28%",right:"auto",bottom:"3%"},
      dl:{top:"3%",left:"18%",right:"auto",bottom:"auto"},
      genai:{top:"27%",right:"0%",left:"auto",bottom:"auto"},
      data:{top:"auto",right:"1%",left:"auto",bottom:"19%"}
    }
  ];
  let pi=0;
  function applyPattern(){
    const p=patterns[pi];
    skills.forEach(el=>{
      const pos=p[el.dataset.skill]; if(!pos)return;
      el.classList.add("repositioning");
      Object.entries(pos).forEach(([k,v])=>el.style[k]=v);
    });
    setTimeout(()=>skills.forEach(el=>el.classList.remove("repositioning")),350);
    pi=(pi+1)%patterns.length;
  }
  if(orbit&&skills.length){applyPattern();setInterval(applyPattern,4200)}

  /* Pipeline sequential highlight. */
  const pipe=$("#pipeline");
  if(pipe){
    const steps=[...pipe.querySelectorAll(".pipeline-step")];
    let running=false, timer;
    const start=()=>{
      if(running)return; running=true; let i=0;
      timer=setInterval(()=>{
        steps.forEach(s=>s.classList.remove("active"));
        if(i<steps.length)steps[i].classList.add("active");
        i=(i+1)%steps.length;
      },650);
    };
    const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){start();io.disconnect()}}),{threshold:.3});
    io.observe(pipe);
  }

  /* Terminal type-on effect for a polished entry. */
  const terminal=$("#terminalBody");
  if(terminal){
    const lines=[...terminal.children];
    lines.forEach((line,i)=>{line.style.opacity="0";line.style.transform="translateX(-8px)";});
    const tio=new IntersectionObserver(es=>es.forEach(e=>{
      if(!e.isIntersecting)return;
      lines.forEach((line,i)=>setTimeout(()=>{line.style.transition="opacity .35s ease,transform .35s ease";line.style.opacity="1";line.style.transform="none"},i*170));
      tio.disconnect();
    }),{threshold:.35});
    tio.observe(terminal);
  }
});


/* ==========================================================
   UPDATED CAROUSELS
   ========================================================== */
document.addEventListener("DOMContentLoaded",()=>{
  /* Other projects: 3 visible, advance exactly 1 card every 3s. */
  const other=document.querySelector("#otherProjectsCarousel");
  if(other){
    const cards=[...other.querySelectorAll(".project-card")];
    let index=0, timer=null, paused=false;

    const gap=()=>parseFloat(getComputedStyle(other).columnGap||"14")||14;
    const step=()=>cards.length ? cards[0].getBoundingClientRect().width+gap() : 0;

    const move=()=>{
      if(paused || !step()) return;
      index=(index+1)%cards.length;
      other.classList.add("is-moving");
      other.scrollTo({left:index*step(),behavior:"smooth"});
      setTimeout(()=>other.classList.remove("is-moving"),650);
    };
    const start=()=>{
      clearInterval(timer);
      timer=setInterval(move,3000);
    };
    other.addEventListener("mouseenter",()=>{paused=true;clearInterval(timer)});
    other.addEventListener("mouseleave",()=>{paused=false;start()});
    other.addEventListener("focusin",()=>{paused=true;clearInterval(timer)});
    other.addEventListener("focusout",()=>{paused=false;start()});
    start();
    window.addEventListener("resize",()=>{index=0;other.scrollLeft=0});
  }

  /* Certifications: move one card column at a time.
     With the 4-row grid, one column means 4 certificates. */
  const cert=document.querySelector("#certSlider");
  if(cert){
    const cards=[...cert.querySelectorAll(".cert-card")];
    let column=0, timer=null, paused=false;

    const cardWidth=()=>{
      if(!cards[0]) return 0;
      const r=cards[0].getBoundingClientRect();
      const cs=getComputedStyle(cert);
      return r.width+(parseFloat(cs.columnGap||cs.gap||"12")||12);
    };
    const columnsVisible=()=>{
      if(!cards.length) return 1;
      const w=cardWidth();
      return w ? Math.max(1,Math.floor((cert.clientWidth+12)/w)) : 1;
    };
    const maxColumn=()=>{
      const visible=columnsVisible();
      return Math.max(0,Math.ceil(cards.length/4)-visible);
    };
    const move=()=>{
      if(paused) return;
      const visible=columnsVisible();
      const max=maxColumn();
      if(max<=0) return;
      column=(column+1>max)?0:column+1;
      cert.classList.add("auto-transition");
      cert.scrollTo({left:column*cardWidth(),behavior:"smooth"});
      setTimeout(()=>cert.classList.remove("auto-transition"),700);
    };
    const start=()=>{
      clearInterval(timer);
      timer=setInterval(move,3000);
    };
    cert.addEventListener("mouseenter",()=>{paused=true;clearInterval(timer)});
    cert.addEventListener("mouseleave",()=>{paused=false;start()});
    cert.addEventListener("focusin",()=>{paused=true;clearInterval(timer)});
    cert.addEventListener("focusout",()=>{paused=false;start()});
    start();
    window.addEventListener("resize",()=>{column=0;cert.scrollLeft=0});
  }
});


/* ===== FINAL FIX: ONE-BY-ONE OTHER PROJECTS + CRISS-CROSS ===== */
document.addEventListener("DOMContentLoaded",()=>{
  const other=document.querySelector("#otherProjectsCarousel");
  if(other){
    const cards=[...other.querySelectorAll(".project-card")];
    let idx=0, timer=null, paused=false;
    const gap=()=>parseFloat(getComputedStyle(other).gap||"16")||16;
    const step=()=>cards[0] ? cards[0].getBoundingClientRect().width+gap() : 0;
    const start=()=>{clearInterval(timer);timer=setInterval(()=>{
      if(paused || !step()) return;
      idx=(idx+1)%cards.length;
      other.scrollTo({left:idx*step(),behavior:"smooth"});
    },3000)};
    const stop=()=>{paused=true;clearInterval(timer)};
    const resume=()=>{paused=false;start()};
    other.addEventListener("mouseenter",stop);
    other.addEventListener("mouseleave",resume);
    other.addEventListener("focusin",stop);
    other.addEventListener("focusout",resume);
    window.addEventListener("resize",()=>{idx=0;other.scrollLeft=0});
    start();
  }

  const track=document.querySelector("#crisscrossTrack");
  if(track){
    const nodes=[...track.querySelectorAll(".criss-node")];
    let i=0;
    const io=new IntersectionObserver(entries=>{
      if(!entries.some(e=>e.isIntersecting)) return;
      nodes.forEach(n=>n.classList.remove("active"));
      i=0;
      const timer=setInterval(()=>{
        nodes.forEach(n=>n.classList.remove("active"));
        nodes[i].classList.add("active");
        i=(i+1)%nodes.length;
      },520);
      io.disconnect();
    },{threshold:.25});
    io.observe(track);
  }
});


/* ===== SILENT PROJECT/CERTIFICATION AUTO-MOVEMENT ===== */
document.addEventListener("DOMContentLoaded",()=>{
  const carousel=document.querySelector("#otherProjectsCarousel");
  if(carousel){
    const cards=[...carousel.querySelectorAll(".project-card")];
    let i=0, timer;
    const step=()=>cards[0] ? cards[0].getBoundingClientRect().width + (parseFloat(getComputedStyle(carousel).gap)||16) : 0;
    const move=()=>{
      if(!step()) return;
      i=(i+1)%cards.length;
      carousel.scrollTo({left:i*step(),behavior:"smooth"});
    };
    timer=setInterval(move,3000);
    carousel.addEventListener("mouseenter",()=>clearInterval(timer));
    carousel.addEventListener("mouseleave",()=>timer=setInterval(move,3000));
    window.addEventListener("resize",()=>{i=0;carousel.scrollLeft=0});
  }

  const cert=document.querySelector("#certSlider");
  if(cert){
    const track=cert.querySelector(".cert-track");
    const cards=[...cert.querySelectorAll(".cert-card")];
    let col=0,timer;
    const step=()=>cards[0] ? cards[0].getBoundingClientRect().width + (parseFloat(getComputedStyle(track).columnGap)||12) : 0;
    const visible=()=>Math.max(1,Math.floor(cert.clientWidth/step()));
    const move=()=>{
      if(!step()) return;
      const max=Math.max(0,Math.ceil(cards.length/2)-visible());
      if(max<=0) return;
      col=(col+1>max)?0:col+1;
      cert.scrollTo({left:col*step(),behavior:"smooth"});
    };
    timer=setInterval(move,3000);
    cert.addEventListener("mouseenter",()=>clearInterval(timer));
    cert.addEventListener("mouseleave",()=>timer=setInterval(move,3000));
  }
});

/* ============================================================
   SILENT CERTIFICATE AUTO-SCROLL
   4 rows, advances one visible column at a time.
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  const slider = document.querySelector("#certSlider");
  const track = slider?.querySelector(".cert-track");
  const cards = track ? [...track.querySelectorAll(".actual-cert-card")] : [];

  if (!slider || !track || cards.length < 2) return;

  let column = 0;
  let timer = null;
  let paused = false;

  const gap = () => {
    const cs = getComputedStyle(track);
    return parseFloat(cs.columnGap || cs.gap || "12") || 12;
  };

  const step = () => cards[0].getBoundingClientRect().width + gap();

  const visibleColumns = () => {
    const value = step();
    return value ? Math.max(1, Math.floor((slider.clientWidth + gap()) / value)) : 1;
  };

  const totalColumns = () => Math.ceil(cards.length / 4);

  const move = () => {
    if (paused) return;

    const max = Math.max(0, totalColumns() - visibleColumns());
    if (max <= 0) return;

    column = column >= max ? 0 : column + 1;

    slider.scrollTo({
      left: column * step(),
      behavior: "smooth"
    });
  };

  const start = () => {
    clearInterval(timer);
    timer = setInterval(move, 3000);
  };

  slider.addEventListener("mouseenter", () => {
    paused = true;
    clearInterval(timer);
  });

  slider.addEventListener("mouseleave", () => {
    paused = false;
    start();
  });

  window.addEventListener("resize", () => {
    column = 0;
    slider.scrollLeft = 0;
  });

  start();
});


/* ============================================================
   SILENT PROJECT AUTO-SCROLL
   One project at a time, three visible on desktop.
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  const carousel = document.querySelector("#otherProjectsCarousel");
  const cards = carousel ? [...carousel.querySelectorAll(".project-card")] : [];

  if (!carousel || !cards.length) return;

  let index = 0;
  let timer = null;
  let paused = false;

  const gap = () => {
    const cs = getComputedStyle(carousel);
    return parseFloat(cs.columnGap || cs.gap || "14") || 14;
  };

  const step = () => cards[0].getBoundingClientRect().width + gap();

  const move = () => {
    if (paused) return;

    index = (index + 1) % cards.length;

    carousel.scrollTo({
      left: index * step(),
      behavior: "smooth"
    });
  };

  const start = () => {
    clearInterval(timer);
    timer = setInterval(move, 3000);
  };

  carousel.addEventListener("mouseenter", () => {
    paused = true;
    clearInterval(timer);
  });

  carousel.addEventListener("mouseleave", () => {
    paused = false;
    start();
  });

  window.addEventListener("resize", () => {
    index = 0;
    carousel.scrollLeft = 0;
  });

  start();
});
/* ============================================================
   TECHNICAL SKILL HOVER INFORMATION
   Each skill gets a contextual explanation on mouse hover/focus.
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  const skillCards = [...document.querySelectorAll("#skills .skill-card")];
  if (!skillCards.length) return;

  const info = {
    "Python": "Primary programming language used across data analysis, machine learning, automation and application development.",
    "SQL": "Used to query, filter, join and analyze structured data for analytics and database-backed applications.",
    "Pandas": "Python library used for data cleaning, transformation, exploration and tabular analysis.",
    "NumPy": "Provides efficient numerical arrays and mathematical operations used as a foundation for data and ML workflows.",
    "Matplotlib": "Python visualization library used to turn analytical results and trends into clear charts.",
    "Scikit-learn": "Machine-learning toolkit used for preprocessing, feature engineering, model training and evaluation.",
    "TensorFlow / Keras": "Deep-learning framework used for building and training neural-network models, including CNN workflows.",
    "PyTorch": "Deep-learning framework for experimenting with and developing neural-network models.",
    "Computer Vision": "Techniques for understanding images and video, including visual classification and frame-level analysis.",
    "NLP": "Natural-language processing techniques used to work with text, matching, retrieval and language-based applications.",
    "Generative AI": "AI techniques used to generate or transform content and build modern AI-powered applications.",
    "RAG": "Retrieval-Augmented Generation combines document retrieval with an LLM to produce answers grounded in a knowledge base.",
    "Machine Learning": "Core modeling discipline used to learn patterns from data and turn them into predictions or decisions.",
    "HTML": "Markup language used to structure portfolio pages and web application content.",
    "CSS": "Styling language used to create the portfolio's layout, responsive design, visual effects and interactions.",
    "JavaScript": "Adds browser-side behavior such as animations, auto-scrolling, interactions and dynamic UI effects.",
    "Flask": "Lightweight Python web framework used to expose ML or application functionality through web interfaces and routes.",
    "Streamlit": "Python framework for quickly turning data and machine-learning workflows into interactive web applications.",
    "Power BI": "Business-intelligence platform used to build interactive dashboards, reports and KPI-focused visualizations.",
    "Tableau": "Business-intelligence and visualization platform used to explore data and communicate analytical insights.",
    "Power Apps": "Low-code platform used to build business applications and forms around organizational data and processes.",
    "Power Automate": "Workflow automation platform used to reduce repetitive manual processes and connect business services.",
    "AWS": "Cloud platform knowledge used as part of the broader toolkit for understanding cloud-based application and data workflows.",
    "Git / GitHub": "Version-control and collaboration tools used to manage source code, track changes and publish projects.",
    "MySQL": "Relational database system used to store, query and manage structured application data."
  };

  let tooltip = document.querySelector(".skill-tooltip");
  if (!tooltip) {
    tooltip = document.createElement("div");
    tooltip.className = "skill-tooltip";
    tooltip.setAttribute("role", "tooltip");
    tooltip.innerHTML = `
      <div class="skill-tooltip-title"><span class="skill-tooltip-icon"></span><span class="skill-tooltip-name"></span><span class="skill-tooltip-percent"></span></div>
      <div class="skill-tooltip-text"></div>
      <div class="skill-tooltip-hint">Hover another skill to explore</div>`;
    document.body.appendChild(tooltip);
  }

  const titleEl = tooltip.querySelector(".skill-tooltip-name");
  const iconEl = tooltip.querySelector(".skill-tooltip-icon");
  const percentEl = tooltip.querySelector(".skill-tooltip-percent");
  const textEl = tooltip.querySelector(".skill-tooltip-text");

  let activeCard = null;

  const positionTooltip = (card) => {
    const r = card.getBoundingClientRect();
    const tw = tooltip.offsetWidth;
    const th = tooltip.offsetHeight;
    const gap = 12;
    let left = r.left + (r.width - tw) / 2;
    let top = r.bottom + gap;

    if (left < 14) left = 14;
    if (left + tw > window.innerWidth - 14) left = window.innerWidth - tw - 14;
    if (top + th > window.innerHeight - 14) top = r.top - th - gap;
    if (top < 14) top = 14;

    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;
  };

  const show = (card) => {
    const name = card.querySelector(".skill-top strong")?.textContent.trim();
    if (!name || !info[name]) return;

    activeCard = card;
    const icon = card.querySelector(".skill-top span")?.textContent.trim() || "✦";
    const percent = card.querySelector(".skill-top b")?.textContent.trim() || "";

    titleEl.textContent = name;
    iconEl.textContent = icon;
    percentEl.textContent = percent;
    textEl.textContent = info[name];
    tooltip.classList.add("is-visible");
    positionTooltip(card);
  };

  const hide = (card) => {
    if (activeCard === card) {
      activeCard = null;
      tooltip.classList.remove("is-visible");
    }
  };

  skillCards.forEach(card => {
    card.addEventListener("mouseenter", () => show(card));
    card.addEventListener("mouseleave", () => hide(card));
    card.addEventListener("focusin", () => show(card));
    card.addEventListener("focusout", () => hide(card));
  });

  window.addEventListener("scroll", () => {
    if (activeCard) positionTooltip(activeCard);
  }, {passive:true});

  window.addEventListener("resize", () => {
    if (activeCard) positionTooltip(activeCard);
  });
});
