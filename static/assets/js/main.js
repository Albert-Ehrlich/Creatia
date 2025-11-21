/**
 * Template Name: MyResume
 * Updated: Nov 17 2023 with Bootstrap v5.3.2
 * Template URL: https://bootstrapmade.com/free-html-bootstrap-template-my-resume/
 * Author: BootstrapMade.com
 * License: https://bootstrapmade.com/license/
 */
(function () {
  "use strict";

  /**
   * Easy selector helper function
   */
  const select = (el, all = false) => {
    el = el.trim();
    if (all) {
      return [...document.querySelectorAll(el)];
    } else {
      return document.querySelector(el);
    }
  };

  /**
   * Easy event listener function
   */
  const on = (type, el, listener, all = false) => {
    let selectEl = select(el, all);
    if (selectEl) {
      if (all) {
        selectEl.forEach((e) => e.addEventListener(type, listener));
      } else {
        selectEl.addEventListener(type, listener);
      }
    }
  };

  /**
   * Easy on scroll event listener
   */
  const onscroll = (el, listener) => {
    el.addEventListener("scroll", listener);
  };

  /**
   * Navbar links active state on scroll
   */
  let navbarlinks = select("#navbar .scrollto", true);
  const navbarlinksActive = () => {
    let position = window.scrollY + 200;
    navbarlinks.forEach((navbarlink) => {
      if (!navbarlink.hash) return;
      let section = select(navbarlink.hash);
      if (!section) return;
      if (
        position >= section.offsetTop &&
        position <= section.offsetTop + section.offsetHeight
      ) {
        navbarlink.classList.add("active");
      } else {
        navbarlink.classList.remove("active");
      }
    });
  };
  window.addEventListener("load", navbarlinksActive);
  onscroll(document, navbarlinksActive);

  /**
   * Scrolls to an element with header offset
   */
  const scrollto = (el) => {
    let elementPos = select(el).offsetTop;
    window.scrollTo({
      top: elementPos,
      behavior: "smooth",
    });
  };

  /**
   * Back to top button
   */
  let backtotop = select(".back-to-top");
  if (backtotop) {
    const toggleBacktotop = () => {
      if (window.scrollY > 100) {
        backtotop.classList.add("active");
      } else {
        backtotop.classList.remove("active");
      }
    };
    window.addEventListener("load", toggleBacktotop);
    onscroll(document, toggleBacktotop);
  }

  /**
   * Mobile nav toggle
   */
  on("click", ".mobile-nav-toggle", function (e) {
    select("body").classList.toggle("mobile-nav-active");
    this.classList.toggle("bi-list");
    this.classList.toggle("bi-x");
  });

  /**
   * Scrool with ofset on links with a class name .scrollto
   */
  on(
    "click",
    ".scrollto",
    function (e) {
      if (select(this.hash)) {
        e.preventDefault();

        let body = select("body");
        if (body.classList.contains("7obile-nav-active")) {
          body.classList.remove("mobile-nav-active");
          let navbarToggle = select(".mobile-nav-toggle");
          navbarToggle.classList.toggle("bi-list");
          navbarToggle.classList.toggle("bi-x");
        }
        scrollto(this.hash);
      }
    },
    true
  );

  /**
   * Scroll with ofset on page load with hash links in the url
   */
  window.addEventListener("load", () => {
    if (window.location.hash) {
      if (select(window.location.hash)) {
        scrollto(window.location.hash);
      }
    }
  });

  /**
   * Preloader
   */
  let preloader = select("#preloader");
  if (preloader) {
    window.addEventListener("load", () => {
      preloader.remove();
    });
  }

  /**
   * Hero type effect
   */
  const typed = select(".typed");
  if (typed && typeof Typed !== "undefined") {
    let typed_strings = typed.getAttribute("data-typed-items");
    typed_strings = typed_strings.split(",");
    new Typed(".typed", {
      strings: typed_strings,
      loop: true,
      typeSpeed: 70,
      backSpeed: 30,
      backDelay: 2000,
    });
  }

  /**
   * Skills animation
   */
  let skilsContent = select(".skills-content");
  if (skilsContent && typeof Waypoint !== "undefined") {
    new Waypoint({
      element: skilsContent,
      offset: "80%",
      handler: function () {
        let progress = select(".progress .progress-bar", true);
        progress.forEach((el) => {
          el.style.width = el.getAttribute("aria-valuenow") + "%";
        });
      },
    });
  }

  /**
   * Porfolio isotope and filter
   */
  window.addEventListener("load", () => {
    let portfolioContainer = select(".portfolio-container");
    if (portfolioContainer && typeof Isotope !== "undefined") {
      let portfolioIsotope = new Isotope(portfolioContainer, {
        itemSelector: ".portfolio-item",
      });

      let portfolioFilters = select("#portfolio-flters li", true);

      on(
        "click",
        "#portfolio-flters li",
        function (e) {
          e.preventDefault();
          portfolioFilters.forEach(function (el) {
            el.classList.remove("filter-active");
          });
          this.classList.add("filter-active");

          portfolioIsotope.arrange({
            filter: this.getAttribute("data-filter"),
          });
          portfolioIsotope.on("arrangeComplete", function () {
            if (typeof AOS !== "undefined") {
              AOS.refresh();
            }
          });
        },
        true
      );
    }
  });

  /**
   * Initiate portfolio lightbox
   */
  const portfolioLightbox =
    typeof GLightbox !== "undefined"
      ? GLightbox({
          selector: ".portfolio-lightbox",
        })
      : null;

  /**
   * Initiate portfolio details lightbox
   */
  const portfolioDetailsLightbox =
    typeof GLightbox !== "undefined"
      ? GLightbox({
          selector: ".portfolio-details-lightbox",
          width: "90%",
          height: "90vh",
        })
      : null;

  /**
   * Portfolio details slider
   */
  if (typeof Swiper !== "undefined") {
    new Swiper(".portfolio-details-slider", {
      speed: 400,
      loop: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
      },
      pagination: {
        el: ".swiper-pagination",
        type: "bullets",
        clickable: true,
      },
    });
  }

  /**
   * Testimonials slider
   */
  if (typeof Swiper !== "undefined") {
    new Swiper(".testimonials-slider", {
      speed: 600,
      loop: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
      },
      slidesPerView: "auto",
      pagination: {
        el: ".swiper-pagination",
        type: "bullets",
        clickable: true,
      },
    });
  }

  const serviceLinks = [
    { id: "webDevServ", text: "Request for Web Development Services" },
    { id: "webDesServ", text: "Request for Web Design Services" },
    { id: "prAIServ", text: "Request for Programming and AI Services" },
    { id: "grDesServ", text: "Request for Graphics Design Services" },
    { id: "logoDesServ", text: "Request for Logo Design Services" },
    { id: "photoEdServ", text: "Request for Photo Editing Services" },
  ];

  serviceLinks.forEach(({ id, text }) => {
    const link = document.getElementById(id);
    if (!link) return;
    link.addEventListener("click", function (event) {
      event.preventDefault();
      const contact = document.getElementById("contact");
      if (contact) contact.scrollIntoView({ behavior: "smooth" });
      const subject = document.getElementById("subject");
      if (subject) subject.value = text;
    });
  });

  window.addEventListener("DOMContentLoaded", () => {
    document.body.classList.add("page-fade-ready");
  });

  const dualCalUtils = {
    toPersianDigits(value) {
      return String(value).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);
    },
    jalaliToGregorian(jy, jm, jd) {
      const jDays = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29];
      const gDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
      let jyAdj = Math.floor(jy) - 979;
      let jmAdj = Math.floor(jm) - 1;
      let jdAdj = Math.floor(jd) - 1;
      let jDayNo =
        365 * jyAdj +
        Math.floor(jyAdj / 33) * 8 +
        Math.floor(((jyAdj % 33) + 3) / 4);
      for (let i = 0; i < jmAdj; ++i) jDayNo += jDays[i];
      jDayNo += jdAdj;

      let gDayNo = jDayNo + 79;
      let gy = 1600 + 400 * Math.floor(gDayNo / 146097);
      gDayNo %= 146097;

      let leap = true;
      if (gDayNo >= 36525) {
        gDayNo--;
        gy += 100 * Math.floor(gDayNo / 36524);
        gDayNo %= 36524;
        if (gDayNo >= 365) gDayNo++;
        else leap = false;
      }

      gy += 4 * Math.floor(gDayNo / 1461);
      gDayNo %= 1461;
      if (gDayNo >= 366) {
        leap = false;
        gDayNo--;
        gy += Math.floor(gDayNo / 365);
        gDayNo %= 365;
      }

      let gm = 0;
      for (; gm < 12; gm++) {
        const days = gDays[gm] + (gm === 1 && leap ? 1 : 0);
        if (gDayNo < days) break;
        gDayNo -= days;
      }
      const gd = gDayNo + 1;
      return { year: gy, month: gm + 1, day: gd };
    },
    gregorianToJalali(gy, gm, gd) {
      const gDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
      let gDayNo =
        365 * (gy - 1600) +
        Math.floor((gy - 1600 + 3) / 4) -
        Math.floor((gy - 1600 + 99) / 100) +
        Math.floor((gy - 1600 + 399) / 400);
      for (let i = 0; i < gm - 1; ++i) gDayNo += gDays[i];
      if (gm > 2 && ((gy % 4 === 0 && gy % 100 !== 0) || gy % 400 === 0))
        gDayNo++;
      gDayNo += gd - 1;
      let jDayNo = gDayNo - 79;
      const jNp = Math.floor(jDayNo / 12053);
      jDayNo %= 12053;
      let jy = 979 + 33 * jNp + 4 * Math.floor(jDayNo / 1461);
      jDayNo %= 1461;
      if (jDayNo >= 366) {
        jy += Math.floor((jDayNo - 1) / 365);
        jDayNo = (jDayNo - 1) % 365;
      }
      const jm =
        jDayNo < 186
          ? 1 + Math.floor(jDayNo / 31)
          : 7 + Math.floor((jDayNo - 186) / 30);
      const jd = 1 + (jDayNo < 186 ? jDayNo % 31 : (jDayNo - 186) % 30);
      return { jy, jm, jd };
    },
    persianMonthName(m) {
      return [
        "فروردین",
        "اردیبهشت",
        "خرداد",
        "تیر",
        "مرداد",
        "شهریور",
        "مهر",
        "آبان",
        "آذر",
        "دی",
        "بهمن",
        "اسفند",
      ][m - 1];
    },
    gregMonthName(m) {
      return [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ][m - 1];
    },
    daysInJalaliMonth(y, m) {
      const days = [
        31,
        31,
        31,
        31,
        31,
        31,
        30,
        30,
        30,
        30,
        30,
        this.isLeapJalali(y) ? 30 : 29,
      ];
      return days[m - 1];
    },
    isLeapJalali(y) {
      return ((((y - 474) % 2820) + 474 + 38) * 682) % 2816 < 682;
    },
    todayTehran() {
      const parts = new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Tehran",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
        .formatToParts(new Date())
        .reduce((acc, part) => {
          if (part.type !== "literal") acc[part.type] = Number(part.value);
          return acc;
        }, {});
      return { gy: parts.year, gm: parts.month, gd: parts.day };
    },
  };

  class DualCalendar {
    constructor(root, taskMap = {}) {
      this.root = root;
      this.grid = root.querySelector('[data-role="grid"]');
      this.persianTitle = root
        .closest(".dual-calendar-card")
        ?.querySelector('[data-role="persian-title"]');
      this.current = null;
      this.tasks = taskMap;
      this.attachNav();
      this.setToday();
    }

    storageKey() {
      return "dualcal-tasks";
    }

    setTasks(map) {
      this.tasks = map || {};
      this.render();
    }

    attachNav() {
      const nav = this.root
        .closest(".dual-calendar-card")
        ?.querySelectorAll("[data-cal-action]");
      nav?.forEach((btn) => {
        btn.addEventListener("click", () => {
          const action = btn.dataset.calAction;
          if (action === "prev") this.shiftMonth(-1);
          if (action === "next") this.shiftMonth(1);
          if (action === "today") this.setToday();
        });
      });
    }

    attachModal() {
      if (this.modalClose) {
        this.modalClose.addEventListener("click", () => this.hideModal());
      }
    }

    setToday() {
      const today = dualCalUtils.todayTehran();
      const j = dualCalUtils.gregorianToJalali(today.gy, today.gm, today.gd);
      this.current = { jy: j.jy, jm: j.jm };
      this.render();
    }

    shiftMonth(delta) {
      let { jy, jm } = this.current;
      jm += delta;
      if (jm < 1) {
        jm = 12;
        jy -= 1;
      } else if (jm > 12) {
        jm = 1;
        jy += 1;
      }
      this.current = { jy, jm };
      this.render();
    }

    render() {
      if (!this.grid || !this.current) return;
      const { jy, jm } = this.current;
      const gregStart = dualCalUtils.jalaliToGregorian(jy, jm, 1);
      const startDay = new Date(
        gregStart.year,
        gregStart.month - 1,
        gregStart.day
      ).getDay(); // 0=Sun
      const offset = (startDay + 1) % 7; // make Saturday index 0
      const daysInMonth = dualCalUtils.daysInJalaliMonth(jy, jm);
      const prevMonth = jm === 1 ? 12 : jm - 1;
      const prevYear = jm === 1 ? jy - 1 : jy;
      const daysPrev = dualCalUtils.daysInJalaliMonth(prevYear, prevMonth);
      const totalCells = Math.ceil((offset + daysInMonth) / 7) * 7;
      const todayG = dualCalUtils.todayTehran();
      const todayJ = dualCalUtils.gregorianToJalali(
        todayG.gy,
        todayG.gm,
        todayG.gd
      );

      this.grid.innerHTML = "";
      if (this.persianTitle)
        this.persianTitle.textContent = `${dualCalUtils.persianMonthName(
          jm
        )} ${dualCalUtils.toPersianDigits(jy)}`;

      for (let i = 0; i < totalCells; i++) {
        let jyCell,
          jmCell,
          jdCell,
          type = "current";
        if (i < offset) {
          jdCell = daysPrev - offset + i + 1;
          jmCell = prevMonth;
          jyCell = prevYear;
          type = "other";
        } else if (i < offset + daysInMonth) {
          jdCell = i - offset + 1;
          jmCell = jm;
          jyCell = jy;
        } else {
          jdCell = i - (offset + daysInMonth) + 1;
          jmCell = jm === 12 ? 1 : jm + 1;
          jyCell = jm === 12 ? jy + 1 : jy;
          type = "other";
        }

        const cell = document.createElement("div");
        cell.className = `dualcal-day${
          type === "other" ? " dualcal-day--other" : ""
        }`;

        const persian = document.createElement("div");
        persian.className = "dualcal-date persian-script";
        persian.textContent = dualCalUtils.toPersianDigits(jdCell);

        const key = this.makeKey(jyCell, jmCell, jdCell);
        const dayTasks = this.tasks[key] || [];
        if (dayTasks.length) {
          const indicatorState = indicatorStateForTasks(dayTasks);
          const indicator = document.createElement("div");
          indicator.className = `dualcal-indicator dualcal-indicator--${indicatorState}`;
          indicator.setAttribute(
            "aria-label",
            `${dayTasks.length} task${dayTasks.length === 1 ? "" : "s"}`
          );
          indicator.title = `${dayTasks.length} task${
            dayTasks.length === 1 ? "" : "s"
          }`;
          cell.classList.add(
            "dualcal-day--has",
            `dualcal-day--${indicatorState}`
          );
          cell.appendChild(indicator);
        }

        cell.dataset.key = key;
        if (type === "current") {
          const isPast =
            jyCell < todayJ.jy ||
            (jyCell === todayJ.jy && jmCell < todayJ.jm) ||
            (jyCell === todayJ.jy && jmCell === todayJ.jm && jdCell < todayJ.jd);
          const allowClick = !isPast || dayTasks.length > 0;
          if (allowClick) {
            cell.classList.add("clickable");
            cell.addEventListener("click", () => {
              if (isPast) {
                if (dayTasks.length) openDayModal(jyCell, jmCell, jdCell, dayTasks);
              } else {
                if (dayTasks.length) openDayModal(jyCell, jmCell, jdCell, dayTasks);
                else openTaskModal(jyCell, jmCell, jdCell);
              }
            });
          }
          if (jyCell === todayJ.jy && jmCell === todayJ.jm) {
            if (jdCell === todayJ.jd) {
              cell.classList.add("dualcal-day--today");
              const todayTag = document.createElement("div");
              todayTag.className = "dualcal-today-label";
              todayTag.textContent = "امروز";
              cell.appendChild(todayTag);
            } else if (jdCell < todayJ.jd) {
              cell.classList.add("dualcal-day--past");
            }
          }
        }

        cell.append(persian);
        this.grid.appendChild(cell);
      }
    }

    makeKey(y, m, d) {
      return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    }

    refreshDay(y, m, d) {
      this.render();
    }
  }

  const initDualCalendars = (taskMap) => {
    const calendars = [];
    document
      .querySelectorAll("[data-dualcal]")
      .forEach((node) => calendars.push(new DualCalendar(node, taskMap)));
    return calendars;
  };

  const taskStore = {
    list: [],
    map: {},
    calendars: [],
    isAdmin: false,
    currentUserId: null,
    assignees: [],
    modal: null,
    modalContent: null,
    modalClose: null,
  };

  const initGlobalsFromDom = () => {
    const el = document.getElementById("taskGlobals");
    if (!el) return;
    const uid = Number(el.dataset.userId);
    if (!window.currentUserId) window.currentUserId = Number.isFinite(uid) ? uid : null;
    if (!window.currentUserRole) window.currentUserRole = el.dataset.userRole || "";
    if (!window.taskAssignees && el.dataset.assignees) {
      try {
        window.taskAssignees = JSON.parse(el.dataset.assignees);
      } catch {
        window.taskAssignees = [];
      }
    }
  };

  const formatJalaliDate = (iso) => {
    const parts = (iso || "").split("-");
    if (parts.length !== 3) return iso || "";
    const [gy, gm, gd] = parts.map((n) => Number(n));
    if (!gy || !gm || !gd) return iso || "";
    const j = dualCalUtils.gregorianToJalali(gy, gm, gd);
    return `${dualCalUtils.toPersianDigits(j.jd)} ${dualCalUtils.persianMonthName(j.jm)} ${dualCalUtils.toPersianDigits(j.jy)}`;
  };

  const jalaliToIso = (jy, jm, jd) => {
    const g = dualCalUtils.jalaliToGregorian(Number(jy), Number(jm), Number(jd));
    return `${g.year}-${String(g.month).padStart(2, "0")}-${String(g.day).padStart(2, "0")}`;
  };

  const buildTaskMap = (tasks) => {
    const byDate = {};
    tasks.forEach((t) => {
      const [gy, gm, gd] = (t.due_date || "").split("-").map((n) => Number(n));
      if (!gy || !gm || !gd) return;
      const j = dualCalUtils.gregorianToJalali(gy, gm, gd);
      const key = `${j.jy}-${String(j.jm).padStart(2, "0")}-${String(
        j.jd
      ).padStart(2, "0")}`;
      t._jalaliDisplay = `${dualCalUtils.toPersianDigits(
        j.jd
      )} ${dualCalUtils.persianMonthName(j.jm)} ${dualCalUtils.toPersianDigits(j.jy)}`;
      if (!byDate[key]) byDate[key] = [];
      byDate[key].push(t);
    });
    return byDate;
  };

  const relativeDueText = (iso) => {
    if (!iso) {
      return { text: "", status: "upcoming" };
    }
    const today = new Date();
    const todayMid = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const due = new Date(`${iso}T00:00:00`);
    const diffMs = due.getTime() - todayMid.getTime();
    const diffDays = Math.round(diffMs / 86400000);
    if (diffDays === 0) {
      return { text: "امروز", status: "today" };
    }
    if (diffDays < 0) {
      const days = dualCalUtils.toPersianDigits(Math.abs(diffDays));
      return { text: `${days} روز پیش`, status: "overdue" };
    }
    const days = dualCalUtils.toPersianDigits(diffDays);
    return { text: `${days} روز مانده`, status: "upcoming" };
  };

  const indicatorStateForTasks = (tasks = []) => {
    if (!tasks.length) return "active";
    const hasOverdue = tasks.some((t) => t.overdue && (t.status || "").toLowerCase() !== "done");
    if (hasOverdue) return "overdue";
    const hasActive = tasks.some((t) => (t.status || "").toLowerCase() !== "done");
    if (hasActive) return "active";
    return "done";
  };

  const renderTaskRow = (task, opts) => {
    const row = document.createElement("div");
    row.className = `task-row slim${task.overdue ? " task-row--overdue" : ""}${
      task.status === "done" ? " task-row--done" : ""
    }`;

    const title = document.createElement("span");
    title.className = "task-row__title";
    title.textContent = task.title;

    const date = document.createElement("span");
    date.className = "task-row__date";
    const readableDate =
      task._jalaliDisplay || formatJalaliDate(task.due_date) || "";
    const relative = relativeDueText(task.due_date);
    if (relative.status === "overdue") date.classList.add("task-row__date--overdue");
    else if (relative.status === "today") date.classList.add("task-row__date--today");
    else date.classList.add("task-row__date--upcoming");
    let dateText = readableDate
      ? `تاریخ سررسید: ${readableDate}${relative.text ? ` (${relative.text})` : ""}`
      : "";
    if (task.approved_at) {
      dateText += `، تاریخ تایید: ${formatJalaliDate(task.approved_at.split("T")[0])}`;
    }
    date.textContent = dateText;

    const metaHead = document.createElement("div");
    metaHead.className = "task-row__head";
    metaHead.append(title, date);

    const meta = document.createElement("div");
    meta.className = "task-row__meta";
    meta.appendChild(metaHead);

    if (opts.isAdmin && task.assigned_to?.username) {
      const assignee = document.createElement("small");
      assignee.className = "task-row__assignee";
      assignee.textContent = `→ ${task.assigned_to.username}`;
      meta.appendChild(assignee);
    }

    const actions = document.createElement("div");
    actions.className = "task-row__actions";

    const doneToggle = document.createElement("label");
    doneToggle.className = "task-row__done";
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    const shouldCheck =
      task.status === "done" || (task.approval_pending && !opts.isAdmin);
    checkbox.checked = shouldCheck;
    checkbox.addEventListener("change", () =>
      updateTaskStatus(task.id, checkbox.checked ? "done" : "pending")
    );
    const checkText = document.createElement("span");
    const createdByAdmin = task.created_by?.role === "admin";
    const assigneeRole = task.assigned_to?.role;
    const assignedToCurrent = task.assigned_to?.id === taskStore.currentUserId;
    checkText.textContent =
      !opts.isAdmin && createdByAdmin ? "Submit" : "Done";
    doneToggle.append(checkbox, checkText);
    if (task.approval_pending) {
      const waiting = document.createElement("span");
      waiting.className = "task-row__approval";
      waiting.textContent = "در انتظار تایید";
      doneToggle.appendChild(waiting);
    }

    const commentBtn = document.createElement("button");
    commentBtn.type = "button";
    commentBtn.className = "submit-btn submit-btn--small";
    commentBtn.textContent = "Comment";
    commentBtn.addEventListener("click", () => openActionModal(task, "comment"));

    const attachBtn = document.createElement("button");
    attachBtn.type = "button";
    attachBtn.className = "submit-btn submit-btn--small";
    attachBtn.textContent = "+File";
    attachBtn.addEventListener("click", () => triggerAttach(task.id));

    const viewBtn = document.createElement("button");
    viewBtn.type = "button";
    viewBtn.className = "submit-btn submit-btn--small";
    viewBtn.textContent = "View Task";
    viewBtn.addEventListener("click", () => openViewModal(task));

    const sameActor =
      task.created_by?.id &&
      task.assigned_to?.id &&
      task.created_by.id === task.assigned_to.id;
    const isSelf = sameActor && task.assigned_to?.id === taskStore.currentUserId;
    const editAllowed = opts.isAdmin || isSelf;
    const deleteAllowed = opts.isAdmin || isSelf;
    const extAllowed =
      !opts.isAdmin &&
      !task.approval_pending &&
      assignedToCurrent &&
      createdByAdmin &&
      (assigneeRole === "user" || assigneeRole === "supervisor");

    const hideDoneForResearcher =
      !opts.isAdmin && createdByAdmin && task.status === "done";
    const restrictToViewOnly =
      !opts.isAdmin && createdByAdmin && task.status === "done";

    if (!hideDoneForResearcher) {
      actions.append(doneToggle);
    }
    if (restrictToViewOnly) {
      actions.append(viewBtn);
    } else {
      actions.append(commentBtn, attachBtn, viewBtn);
    }

    if (!restrictToViewOnly && editAllowed) {
      const editBtn = document.createElement("button");
      editBtn.type = "button";
      editBtn.className = "submit-btn submit-btn--small";
      editBtn.textContent = "Edit";
      editBtn.addEventListener("click", () => openEditModal(task));
      actions.append(editBtn);
    }

    if (!restrictToViewOnly && extAllowed) {
      const extBtn = document.createElement("button");
      extBtn.type = "button";
      extBtn.className = "submit-btn submit-btn--small";
      extBtn.textContent = "Req Extension";
      extBtn.addEventListener("click", () => openActionModal(task, "extension"));
      actions.append(extBtn);
    }

    if (!restrictToViewOnly && deleteAllowed) {
      const deleteBtn = document.createElement("button");
      deleteBtn.type = "button";
      deleteBtn.className = "btn-logout submit-btn--small";
      deleteBtn.textContent = "Delete";
      deleteBtn.title = "Delete task";
      deleteBtn.addEventListener("click", async () => {
        const ok = await confirmPopup("Are you sure you want to delete the task?");
        if (ok) deleteTask(task.id);
      });
      actions.append(deleteBtn);
    }

    row.append(meta, actions);

    if (task.attachments && task.attachments.length) {
      const files = document.createElement("div");
      files.className = "task-row__attachments";
      task.attachments.forEach((att) => {
        const link = document.createElement("a");
        link.href = att.url;
        link.textContent = att.filename;
        link.target = "_blank";
        files.appendChild(link);
      });
      row.appendChild(files);
    }

    return row;
  };

  const mailUiState = {
    count: 0,
    fetched: false,
    folder: "inbox",
    polls: null,
    selected: new Set(),
    currentMailId: null,
    mails: [],
  };

  const renderMailBadge = (count) => {
    const btn = document.querySelector(".btn-mail");
    const badge = document.querySelector(".btn-mail__badge");
    if (!btn || !badge) return;
    if (count > 0) {
      badge.hidden = false;
      badge.textContent = count;
      btn.classList.add("btn-mail--attention");
    } else {
      badge.hidden = true;
      badge.textContent = "";
      btn.classList.remove("btn-mail--attention");
    }
  };

  const showMailToast = (count) => {
    if (!count) return;
    const toast = document.createElement("div");
    toast.className = "mail-toast";
    toast.textContent = `You have ${count} new mails.`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 5000);
  };

  const confirmPopup = (message) => {
    return new Promise((resolve) => {
      const overlay = document.createElement("div");
      overlay.className = "confirm-overlay";
      const dialog = document.createElement("div");
      dialog.className = "confirm-dialog";
      const msg = document.createElement("p");
      msg.textContent = message;
      const actions = document.createElement("div");
      actions.className = "confirm-actions";
      const yes = document.createElement("button");
      yes.className = "btn-logout submit-btn--small";
      yes.textContent = "yes";
      const cancel = document.createElement("button");
      cancel.className = "submit-btn";
      cancel.textContent = "cancel";
      yes.addEventListener("click", () => {
        document.body.removeChild(overlay);
        resolve(true);
      });
      cancel.addEventListener("click", () => {
        document.body.removeChild(overlay);
        resolve(false);
      });
      actions.append(yes, cancel);
      dialog.append(msg, actions);
      overlay.appendChild(dialog);
      document.body.appendChild(overlay);
    });
  };

  const fetchUnreadMailCount = async () => {
    const btn = document.querySelector(".btn-mail");
    if (!btn) return;
    const initial = Number(btn.dataset.unread || 0);
    mailUiState.count = initial;
    renderMailBadge(initial);
    try {
      const res = await fetch("/api/mails/unread_count", { credentials: "same-origin" });
      if (!res.ok) return;
      const data = await res.json();
      const count = Number(data.count || 0);
      const newlyArrived = Math.max(count - mailUiState.count, 0);
      mailUiState.count = count;
      renderMailBadge(count);
      if (newlyArrived > 0 || (!mailUiState.fetched && count > 0)) {
        showMailToast(count);
      }
    } catch (err) {
      console.error(err);
    } finally {
      mailUiState.fetched = true;
    }
  };

  const mailApi = {
    async list(folder = "inbox") {
      const res = await fetch(`/api/mails?folder=${folder}`, { credentials: "same-origin" });
      if (!res.ok) throw new Error("Mail list failed");
      return res.json();
    },
    async markRead(ids) {
      await fetch(`/api/mails/bulk`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids, action: "read" }),
      });
    },
    async delete(ids, opts = {}) {
      await fetch(`/api/mails/bulk`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids, action: opts.purge ? "purge" : "delete" }),
      });
    },
    async restore(ids) {
      await fetch(`/api/mails/bulk`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids, action: "restore" }),
      });
    },
    async move(ids, target) {
      await fetch(`/api/mails/bulk`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids, action: "move", target }),
      });
    },
    async compose(payload) {
      const res = await fetch(`/api/mails`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Compose failed");
      return res.json();
    },
  };

  const renderMailList = (mails) => {
    const list = document.getElementById("mailList");
    const detail = document.getElementById("mailDetail");
    if (!list) return;
    list.innerHTML = "";
    if (!mails.length) {
      list.innerHTML = `<div class="empty-state">No mails here.</div>`;
      detail.hidden = true;
      return;
    }
    mails.forEach((mail) => {
      const item = document.createElement("article");
      item.className = `mailbox__item ${
        mail.is_read ? "mailbox__item--read" : "mailbox__item--unread"
      }`;
      item.dataset.mailId = mail.id;
      item.draggable = true;
      item.addEventListener("dragstart", (e) => {
        const ids = mailUiState.selected.size
          ? [...mailUiState.selected]
          : [mail.id];
        e.dataTransfer.setData("text/plain", ids.join(","));
      });
      const cb = document.createElement("input");
      cb.type = "checkbox";
      cb.addEventListener("change", (e) => {
        if (e.target.checked) mailUiState.selected.add(mail.id);
        else mailUiState.selected.delete(mail.id);
        item.classList.toggle("mailbox__item--selected", e.target.checked);
      });
      item.appendChild(cb);
      const main = document.createElement("div");
      main.className = "mailbox__item-main";
      const subj = document.createElement("div");
      subj.className = "mailbox__subject";
      subj.textContent = mail.subject;
      const snippet = document.createElement("div");
      snippet.className = "mailbox__snippet";
      snippet.textContent = (mail.body || "").slice(0, 80);
      const date = document.createElement("div");
      date.className = "mailbox__date";
      const jalali = formatJalaliDate((mail.created_at || "").slice(0, 10));
      date.textContent = jalali ? `تاریخ: ${jalali}` : "";
      main.append(subj, snippet, date);
      item.appendChild(main);
      const selectItem = (checked) => {
        cb.checked = checked;
        item.classList.toggle("mailbox__item--selected", checked);
        if (checked) mailUiState.selected.add(mail.id);
        else mailUiState.selected.delete(mail.id);
      };

      item.addEventListener("click", async (e) => {
        if (e.target.tagName.toLowerCase() === "input") return;
        selectItem(true);
        await openMailDetail(mail);
        // update inline styles to reflect read state
        item.classList.remove("mailbox__item--unread");
        item.classList.add("mailbox__item--read");
        subj.style.fontWeight = "600";
      });

      if (mailUiState.selected.has(mail.id)) {
        cb.checked = true;
        item.classList.add("mailbox__item--selected");
      }
      list.appendChild(item);
    });
  };

  const openMailDetail = async (mail) => {
    const detail = document.getElementById("mailDetail");
    const subj = document.getElementById("mailDetailSubject");
    const meta = document.getElementById("mailDetailMeta");
    const body = document.getElementById("mailDetailBody");
    if (!detail || !subj || !meta || !body) return;
    subj.textContent = mail.subject;
    const jalaliDate = formatJalaliDate((mail.created_at || "").slice(0, 10));
    const dateText = jalaliDate
      ? `تاریخ ثبت: ${jalaliDate}`
      : (mail.created_at || "").replace("T", " ").slice(0, 16);
    meta.textContent = `${mail.sender || "System"} • ${dateText}`;
    body.textContent = mail.body;
    detail.hidden = false;
    mailUiState.currentMailId = mail.id;
    if (!mail.is_read) {
      await mailApi.markRead([mail.id]);
      mail.is_read = true;
      // keep local cache in sync without forcing a re-render to preserve selections
      mailUiState.mails = (mailUiState.mails || []).map((m) =>
        m.id === mail.id ? { ...m, is_read: true } : m
      );
      fetchUnreadMailCount();
    }
  };

  const refreshMails = async (showToast = true) => {
    const list = document.getElementById("mailList");
    const hadData = mailUiState.mails && mailUiState.mails.length;
    if (list && !hadData) list.innerHTML = `<div class="empty-state">Loading…</div>`;
    try {
      const prevMails = mailUiState.mails || [];
      const prevIds = prevMails.map((m) => m.id);
      const currentIndex = mailUiState.currentMailId
        ? prevIds.indexOf(mailUiState.currentMailId)
        : -1;
      const mails = await mailApi.list(mailUiState.folder);
      mailUiState.mails = mails;
      renderMailList(mails);
      if (showToast) fetchUnreadMailCount();
      if (mailUiState.currentMailId) {
        const stillHere = mails.find((m) => m.id === mailUiState.currentMailId);
        if (stillHere) {
          openMailDetail(stillHere);
        } else {
          const nextMail =
            mails[currentIndex] || mails[currentIndex - 1] || mails[0];
          if (nextMail) {
            openMailDetail(nextMail);
          } else {
            const detail = document.getElementById("mailDetail");
            if (detail) detail.hidden = true;
            mailUiState.currentMailId = null;
          }
        }
      }
    } catch (err) {
      if (list) list.innerHTML = `<div class="empty-state">Could not load mails.</div>`;
    }
  };

  const initMailboxPage = () => {
    if (!document.querySelector(".mailbox-page")) return;
    const navBtns = document.querySelectorAll(".mailbox__nav-btn");
    const dropTargets = document.querySelectorAll("[data-folder='trash'], [data-folder='saved'], [data-folder='inbox']");
    dropTargets.forEach((btn) => {
      btn.addEventListener("dragover", (e) => {
        e.preventDefault();
        btn.classList.add("active");
      });
      btn.addEventListener("dragleave", () => btn.classList.remove("active"));
      btn.addEventListener("drop", async (e) => {
        e.preventDefault();
        btn.classList.remove("active");
        const data = e.dataTransfer.getData("text/plain") || "";
        const ids = data
          .split(",")
          .map((n) => Number(n))
          .filter((n) => Number.isFinite(n));
        if (!ids.length) return;
        const target = btn.dataset.folder;
        // Restrict moves based on current folder
        const allowed = ["trash", "saved", "inbox"];
        if (!allowed.includes(target)) return;
        await mailApi.move(ids, target === "saved" ? "saved" : target);
        await refreshMails(false);
        fetchUnreadMailCount();
      });
    });
    navBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        mailUiState.folder = btn.dataset.folder;
        refreshMails();
        highlightActiveFolder();
      });
    });
    const highlightActiveFolder = () => {
      navBtns.forEach((b) => {
        const isActive = b.dataset.folder === mailUiState.folder;
        b.classList.toggle("active", isActive);
      });
    };
    highlightActiveFolder();
    const refreshBtn = document.getElementById("refreshMails");
    refreshBtn?.addEventListener("click", () => refreshMails(false));
    const selectAllBtn = document.getElementById("toggleSelectAll");
    selectAllBtn?.addEventListener("click", () => {
      const checkboxes = document.querySelectorAll(".mailbox__item input[type='checkbox']");
      const total = checkboxes.length;
      const selectedCount = mailUiState.selected.size;
      const shouldSelectAll = selectedCount !== total;
      mailUiState.selected.clear();
      checkboxes.forEach((cb) => {
        cb.checked = shouldSelectAll;
        const id = Number(cb.closest(".mailbox__item")?.dataset.mailId);
        const item = cb.closest(".mailbox__item");
        if (shouldSelectAll && id) mailUiState.selected.add(id);
        item?.classList.toggle("mailbox__item--selected", shouldSelectAll);
      });
    });
    const markRead = document.getElementById("markRead");
    markRead?.addEventListener("click", async () => {
      if (!mailUiState.selected.size) return;
      await mailApi.markRead([...mailUiState.selected]);
      await refreshMails(false);
      fetchUnreadMailCount();
    });
    const delBtn = document.getElementById("deleteMails");
    delBtn?.addEventListener("click", async () => {
      let targets = [...mailUiState.selected];
      if (!targets.length && mailUiState.currentMailId) {
        targets = [mailUiState.currentMailId];
      }
      if (!targets.length) return;
      if (mailUiState.folder === "trash") {
        const confirmed = await confirmPopup("delete the selected mails permanently?");
        if (!confirmed) return;
        await mailApi.delete(targets, { purge: true });
      } else {
        await mailApi.delete(targets);
      }
      mailUiState.selected.clear();
      await refreshMails(false);
      fetchUnreadMailCount();
    });
    const restoreBtn = document.getElementById("restoreMails");
    restoreBtn?.addEventListener("click", async () => {
      if (mailUiState.folder !== "trash") return;
      let targets = [...mailUiState.selected];
      if (!targets.length && mailUiState.currentMailId) {
        targets = [mailUiState.currentMailId];
      }
      if (!targets.length) return;
      await mailApi.restore(targets);
      mailUiState.selected.clear();
      await refreshMails(false);
      fetchUnreadMailCount();
    });
    const composePanel = document.getElementById("composePanel");
    const composeBtn = document.getElementById("composeBtn");
    const composeCancel = document.getElementById("composeCancel");
    const composeForm = document.getElementById("composeForm");
    composeBtn?.addEventListener("click", () => {
      composePanel.hidden = false;
    });
    composeCancel?.addEventListener("click", () => {
      if (composePanel) composePanel.hidden = true;
    });
    composeForm?.addEventListener("submit", async (e) => {
      e.preventDefault();
      const fd = new FormData(composeForm);
      const payload = {
        recipient_id: Number(fd.get("recipient_id")),
        subject: fd.get("subject"),
        body: fd.get("body"),
        is_draft: false,
      };
      try {
        await mailApi.compose(payload);
        composeForm.reset();
        composePanel.hidden = true;
        await refreshMails(false);
      } catch {
        alert("Could not send mail.");
      }
    });
    mailUiState.polls = setInterval(() => {
      refreshMails(false);
      fetchUnreadMailCount();
    }, 10000);
    refreshMails(false);
    fetchUnreadMailCount();
  };

  const renderTasksPanel = (container, tasks, opts) => {
    if (!container) return;
    container.innerHTML = "";
    const sections = [
      {
        title: "Active",
        filter: (t) => !t.overdue && t.status !== "done",
        empty: "No active tasks.",
      },
      {
        title: "Overdue",
        filter: (t) => t.overdue && t.status !== "done",
        empty: "No overdue tasks 🎉",
      },
      {
        title: "Done",
        filter: (t) => t.status === "done",
        empty: "No completed tasks yet.",
      },
    ];

    sections.forEach((section) => {
      const wrap = document.createElement("div");
      wrap.className = "tasks-section";
      const heading = document.createElement("h4");
      heading.textContent = section.title;
      wrap.appendChild(heading);

      const body = document.createElement("div");
      body.className = "tasks-section__body";
      const subset = tasks.filter(section.filter);
      if (!subset.length) {
        const p = document.createElement("p");
        p.className = "empty-state";
        p.textContent = section.empty;
        body.appendChild(p);
      } else {
        subset.forEach((task) => body.appendChild(renderTaskRow(task, opts)));
      }
      wrap.appendChild(body);
      container.appendChild(wrap);
    });
  };

  const fetchTasks = async (isAdmin) => {
    const res = await fetch(`/api/tasks${isAdmin ? "?all=1" : ""}`, {
      credentials: "same-origin",
      cache: "no-cache",
    });
    if (res.status === 401) {
      window.location.href = "/login";
      return [];
    }
    if (!res.ok) throw new Error("Failed to load tasks");
    return await res.json();
  };

  const updateTaskStatus = async (taskId, status) => {
    await fetch(`/api/tasks/${taskId}/status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    await reloadTasks();
  };

  const deleteTask = async (taskId) => {
    const res = await fetch(`/api/tasks/${taskId}`, { method: "DELETE" });
    if (res.ok) {
      await reloadTasks();
    } else {
      const data = await res.json().catch(() => ({}));
      alert(data.error || "Could not delete task.");
    }
  };

  const triggerAttach = (taskId) => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.style.display = "none";
    document.body.appendChild(fileInput);
    fileInput.addEventListener("change", async () => {
      const file = fileInput.files?.[0];
      if (!file) return;
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch(`/api/tasks/${taskId}/attach`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.error || "Attachment failed.");
      }
      await reloadTasks();
      document.body.removeChild(fileInput);
    });
    fileInput.click();
  };

  const ensureCalendars = (map) => {
    if (!taskStore.calendars.length) {
      taskStore.calendars = initDualCalendars(map);
    } else {
      taskStore.calendars.forEach((cal) => cal.setTasks(map));
    }
  };

  const reloadTasks = async () => {
    const panel = document.querySelector('[data-role="tasks-panel"]');
    try {
      const tasks = await fetchTasks(taskStore.isAdmin);
      taskStore.list = tasks;
      taskStore.map = buildTaskMap(tasks);
      renderTasksPanel(panel, tasks, { isAdmin: taskStore.isAdmin });
      ensureCalendars(taskStore.map);
    } catch (err) {
      if (panel) {
        panel.innerHTML = `<p class="empty-state">Could not load tasks.</p>`;
      }
      ensureCalendars(taskStore.map);
      console.error(err);
    }
  };

  const initTaskForm = () => {
    const form = document.querySelector('[data-role="task-form"]');
    if (!form) return;
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const payload = {
        title: formData.get("title"),
        due_date: formData.get("due_date"),
        assigned_to_id: Number(formData.get("assigned_to_id")),
        description: formData.get("description") || null,
      };
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.error || "Could not create task.");
        return;
      }
      form.reset();
      await reloadTasks();
    });
  };

  const ensureModal = () => {
    if (taskStore.modal) return;
    taskStore.modal = document.getElementById("taskModal");
    taskStore.modalContent = document.getElementById("taskModalContent");
    taskStore.modalClose = document.getElementById("taskModalClose");
    taskStore.modalClose?.addEventListener("click", closeTaskModal);
    taskStore.modal?.addEventListener("click", (e) => {
      if (e.target === taskStore.modal) closeTaskModal();
    });
  };

  const closeTaskModal = () => {
    if (taskStore.modal) taskStore.modal.classList.remove("open");
  };

  const openDayModal = (jy, jm, jd, tasksForDay) => {
    ensureModal();
    if (!taskStore.modal || !taskStore.modalContent) return;
    taskStore.modalContent.innerHTML = "";
    const card = document.createElement("div");
    card.className = "task-modal-card dashboard-card";

    const list = document.createElement("div");
    list.className = "modal-task-list modal-task-list--day";
    if (tasksForDay && tasksForDay.length) {
      tasksForDay.forEach((t) => {
        const row = document.createElement("div");
        row.className = "task-row slim task-row--mini";
        const title = document.createElement("div");
        title.className = "task-row__title";
        title.textContent = t.title;
        const meta = document.createElement("small");
        meta.className = "task-row__date";
        meta.textContent = `تاریخ سررسید: ${t._jalaliDisplay || formatJalaliDate(t.due_date) || ""}`;
        const status = document.createElement("small");
        status.className = "task-row__assignee";
        status.textContent = t.status === "done" ? "✔ تایید شده" : t.approval_pending ? "در انتظار تایید" : "فعال";
        row.append(title, meta, status);
        row.addEventListener("click", () =>
          openViewModal(t, { type: "day", jy, jm, jd, tasks: tasksForDay })
        );
        list.appendChild(row);
      });
    } else {
      const empty = document.createElement("p");
      empty.className = "empty-state";
      empty.textContent = "No tasks for this day.";
      list.appendChild(empty);
    }
    card.appendChild(list);

    const actions = document.createElement("div");
    actions.className = "task-modal-actions";
    const addBtn = document.createElement("button");
    addBtn.type = "button";
    addBtn.className = "submit-btn";
    addBtn.textContent = "Add Task";
    addBtn.addEventListener("click", () => {
      closeTaskModal();
      openTaskModal(jy, jm, jd);
    });
    const viewAny = document.createElement("button");
    viewAny.type = "button";
    viewAny.className = "submit-btn";
    viewAny.textContent = "View Task";
    viewAny.disabled = !tasksForDay || !tasksForDay.length;
    viewAny.addEventListener("click", () => {
      const first = tasksForDay && tasksForDay[0];
      if (first) openViewModal(first);
    });
    const closeBtn = document.createElement("button");
    closeBtn.type = "button";
    closeBtn.className = "ghost-btn ghost-btn--inline";
    closeBtn.textContent = "Close";
    closeBtn.addEventListener("click", closeTaskModal);
    actions.append(addBtn, viewAny, closeBtn);
    card.appendChild(actions);

    taskStore.modalContent.appendChild(card);
    taskStore.modal.classList.add("open");
  };

  const openTaskModal = (jy, jm, jd) => {
    ensureModal();
    if (!taskStore.modal || !taskStore.modalContent) return;
    const g = dualCalUtils.jalaliToGregorian(jy, jm, jd);
    const due_date = `${g.year}-${String(g.month).padStart(2, "0")}-${String(
      g.day
    ).padStart(2, "0")}`;

    taskStore.modalContent.innerHTML = "";
    const card = document.createElement("div");
    card.className = "task-modal-card dashboard-card";

    const heading = document.createElement("h3");
    heading.textContent = `${dualCalUtils.persianMonthName(
      jm
    )} ${dualCalUtils.toPersianDigits(jd)} - ${dualCalUtils.toPersianDigits(
      jy
    )}`;
    card.appendChild(heading);

    const form = document.createElement("form");
    form.className = "task-modal-form";
    form.innerHTML = `
      <input type="text" name="title" placeholder="Task title" required />
      <textarea name="description" rows="3" placeholder="Task description"></textarea>
      ${
        taskStore.isAdmin
          ? `<select name="assigned_to_id" required>
               ${taskStore.assignees
                 .map((u) => `<option value="${u.id}">${u.username}</option>`)
                 .join("")}
             </select>`
          : `<input type="hidden" name="assigned_to_id" value="${
              taskStore.currentUserId || ""
            }">`
      }
      <input type="file" name="attachment" aria-label="Attachment" />
    `;

    const actions = document.createElement("div");
    actions.className = "task-modal-actions";
    const submit = document.createElement("button");
    submit.type = "submit";
    submit.className = "submit-btn";
    submit.textContent = "Save Task";
    const cancel = document.createElement("button");
    cancel.type = "button";
    cancel.className = "ghost-btn ghost-btn--inline";
    cancel.textContent = "Cancel";
    cancel.addEventListener("click", closeTaskModal);
    actions.append(submit, cancel);

    form.appendChild(actions);
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const payload = {
        title: fd.get("title"),
        description: fd.get("description") || null,
        assigned_to_id: taskStore.isAdmin
          ? Number(fd.get("assigned_to_id")) || taskStore.currentUserId
          : taskStore.currentUserId,
        due_date,
      };
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.error || "Could not create task.");
        return;
      }
      const created = await res.json();
      const attachFile = fd.get("attachment");
      if (attachFile && attachFile.size) {
        const formData = new FormData();
        formData.append("file", attachFile);
        await fetch(`/api/tasks/${created.id}/attach`, { method: "POST", body: formData });
      }
      closeTaskModal();
      await reloadTasks();
    });

    card.appendChild(form);
    taskStore.modalContent.appendChild(card);
    taskStore.modal.classList.add("open");
  };

  const openActionModal = (task, mode) => {
    ensureModal();
    if (!taskStore.modal || !taskStore.modalContent) return;
    const titleText = mode === "comment" ? "Add Comment" : "Request Extension";
    const placeholder = mode === "comment" ? "Write your comment" : "Describe your extension request";

    taskStore.modalContent.innerHTML = "";
    const card = document.createElement("div");
    card.className = "task-modal-card dashboard-card";

    const heading = document.createElement("h3");
    heading.textContent = `${titleText} - ${task.title}`;
    card.appendChild(heading);

    const form = document.createElement("form");
    form.className = "task-modal-form";
    form.innerHTML = `
      <textarea name="details" rows="4" placeholder="${placeholder}"></textarea>
    `;

    const actions = document.createElement("div");
    actions.className = "task-modal-actions";
    const submit = document.createElement("button");
    submit.type = "submit";
    submit.className = "submit-btn";
    submit.textContent = "Submit";
    const cancel = document.createElement("button");
    cancel.type = "button";
    cancel.className = "submit-btn submit-btn--small";
    cancel.textContent = "Close";
    cancel.addEventListener("click", closeTaskModal);
    actions.append(submit, cancel);

    form.appendChild(actions);
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      closeTaskModal();
      alert(`${titleText} submitted.`);
    });

    card.appendChild(form);
    taskStore.modalContent.appendChild(card);
    taskStore.modal.classList.add("open");
  };

  const openViewModal = async (task) => {
    ensureModal();
    if (!taskStore.modal || !taskStore.modalContent) return;
    taskStore.modalContent.innerHTML = "";
    const card = document.createElement("div");
    card.className = "task-modal-card dashboard-card";

    const heading = document.createElement("h3");
    heading.textContent = `${task.title}`;
    card.appendChild(heading);

    const body = document.createElement("div");
    body.className = "modal-task-list";
    const desc = document.createElement("p");
    desc.textContent = task.description || "No description.";
    body.appendChild(desc);
    card.appendChild(body);

    const actions = document.createElement("div");
    actions.className = "task-modal-actions";
    if (origin && origin.type === "day") {
      const backBtn = document.createElement("button");
      backBtn.type = "button";
      backBtn.className = "ghost-btn";
      backBtn.textContent = "Back";
      backBtn.addEventListener("click", () => openDayModal(origin.jy, origin.jm, origin.jd, origin.tasks));
      actions.append(backBtn);
    }
    const closeBtn = document.createElement("button");
    closeBtn.type = "button";
    closeBtn.className = "submit-btn submit-btn--small";
    closeBtn.textContent = "Close";
    closeBtn.addEventListener("click", closeTaskModal);
    actions.append(closeBtn);
    card.appendChild(actions);

    taskStore.modalContent.appendChild(card);
    taskStore.modal.classList.add("open");

    if (task.view_status !== "seen") {
      await fetch(`/api/tasks/${task.id}/seen`, { method: "POST", headers: { "Content-Type": "application/json" } });
      await reloadTasks();
    }
  };

  const openEditModal = (task) => {
    ensureModal();
    if (!taskStore.modal || !taskStore.modalContent) return;
    taskStore.modalContent.innerHTML = "";
    const card = document.createElement("div");
    card.className = "task-modal-card dashboard-card";

    const heading = document.createElement("h3");
    heading.textContent = `Edit Task - ${task.title}`;
    card.appendChild(heading);

    const form = document.createElement("form");
    form.className = "task-modal-form";
    form.innerHTML = `
      <input type="text" name="title" value="${task.title}" placeholder="Task title" required />
      <textarea name="description" rows="3" placeholder="Task description">${task.description || ""}</textarea>
      <input type="date" name="due_date" value="${task.due_date || ""}" />
    `;

    const actions = document.createElement("div");
    actions.className = "task-modal-actions";
    const submit = document.createElement("button");
    submit.type = "submit";
    submit.className = "submit-btn";
    submit.textContent = "Save";
    const cancel = document.createElement("button");
    cancel.type = "button";
    cancel.className = "submit-btn submit-btn--small";
    cancel.textContent = "Close";
    cancel.addEventListener("click", closeTaskModal);
    actions.append(submit, cancel);

    form.appendChild(actions);
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const payload = {
        title: fd.get("title"),
        description: fd.get("description") || null,
        due_date: fd.get("due_date") || null,
      };
      const res = await fetch(`/api/tasks/${task.id}/edit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.error || "Could not edit task.");
        return;
      }
      closeTaskModal();
      await reloadTasks();
    });

    card.appendChild(form);
    taskStore.modalContent.appendChild(card);
    taskStore.modal.classList.add("open");
  };

  const initPasswordVisibility = () => {
    const passwordCheckboxes = document.querySelectorAll(".password-checkbox");
    passwordCheckboxes.forEach((checkbox) => {
      checkbox.addEventListener("change", function () {
        const passwordWrapper = this.closest(".checkbox-wrapper");
        const formGroup = passwordWrapper?.closest(".form-group");
        const passwordInput = formGroup?.querySelector(
          'input[type="password"], input[type="text"]'
        );

        if (passwordInput) {
          passwordInput.type = this.checked ? "text" : "password";
        }
      });
    });
  };

  document.addEventListener("DOMContentLoaded", () => {
    initGlobalsFromDom();
    initPasswordVisibility();
    fetchUnreadMailCount();
    initMailboxPage();

    const hasTaskContext = document.getElementById("taskGlobals");
    if (!hasTaskContext) {
      return;
    }

    taskStore.currentUserId = window.currentUserId || null;
    if (!taskStore.currentUserId) {
      return;
    }

    taskStore.isAdmin =
      (window.currentUserRole || "").toLowerCase() === "admin";
    taskStore.assignees = Array.isArray(window.taskAssignees)
      ? window.taskAssignees
      : [];
    initTaskForm();
    // Render calendars immediately (even if tasks API fails) then hydrate with tasks data
    ensureCalendars(taskStore.map);
    reloadTasks();
    setInterval(reloadTasks, 10000);
  });
  /**
   * Animation on scroll
   */
  window.addEventListener("load", () => {
    if (typeof AOS !== "undefined") {
      AOS.init({
        duration: 1000,
        easing: "ease-in-out",
        once: true,
        mirror: false,
      });
    }
  });

  /**
   * Initiate Pure Counter
   */
  if (typeof PureCounter !== "undefined") {
    new PureCounter();
  }
})();
