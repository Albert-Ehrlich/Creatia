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
  const portfolioLightbox = typeof GLightbox !== "undefined"
    ? GLightbox({
        selector: ".portfolio-lightbox",
      })
    : null;

  /**
   * Initiate portfolio details lightbox
   */
  const portfolioDetailsLightbox = typeof GLightbox !== "undefined"
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

  const calendarUtils = {
    gregorianToJalali(gy, gm, gd) {
      if (gy instanceof Date) {
        gd = gy.getDate();
        gm = gy.getMonth() + 1;
        gy = gy.getFullYear();
      }

      const gDaysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
      const jDaysInMonth = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29];

      let gDayNo =
        365 * (gy - 1600) +
        Math.floor((gy - 1600 + 3) / 4) -
        Math.floor((gy - 1600 + 99) / 100) +
        Math.floor((gy - 1600 + 399) / 400);

      for (let i = 0; i < gm - 1; ++i) gDayNo += gDaysInMonth[i];
      if (gm > 2 && ((gy % 4 === 0 && gy % 100 !== 0) || gy % 400 === 0)) gDayNo++;
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

      const jm = jDayNo < 186 ? 1 + Math.floor(jDayNo / 31) : 7 + Math.floor((jDayNo - 186) / 30);
      const jd = 1 + (jDayNo < 186 ? jDayNo % 31 : (jDayNo - 186) % 30);

      return { jy, jm, jd };
    },
    jalaliToGregorian(jy, jm, jd) {
      let gy;
      if (jy > 979) {
        gy = 1600;
        jy -= 979;
      } else {
        gy = 621;
      }

      const jDaysInMonth = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29];
      let days = 365 * jy + Math.floor(jy / 33) * 8 + Math.floor(((jy % 33) + 3) / 4);
      for (let i = 0; i < jm - 1; ++i) days += jDaysInMonth[i];

      days += jd - 1;

      gy += 400 * Math.floor(days / 146097);
      days %= 146097;

      if (days > 36524) {
        gy += 100 * Math.floor(--days / 36524);
        days %= 36524;
        if (days >= 365) days++;
      }

      gy += 4 * Math.floor(days / 1461);
      days %= 1461;

      if (days > 365) {
        gy += Math.floor((days - 1) / 365);
        days = (days - 1) % 365;
      }

      const gd = days + 1;
      const salA = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
      let gm;
      for (gm = 0; gm < 13; gm++) {
        if (gd <= salA[gm]) break;
      }
      const day = gd - salA[gm - 1];
      return { year: gy, month: gm, day };
    },
    getPersianMonthDays(year, month) {
      const daysInMonth = [
        31, 31, 31, 31, 31, 31,
        30, 30, 30, 30, 30, this.isLeapYear(year) ? 30 : 29
      ];
      return daysInMonth[month - 1] || 31;
    },
    isLeapYear(year) {
      return (year - 474) % 2820 % 128 < 29;
    },
    getPersianMonthName(month) {
      const months = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'];
      return months[month - 1];
    },
    getGregorianMonthName(month) {
      const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      return months[month - 1];
    },
    getCurrentPersianDate() {
      const now = new Date();
      return this.gregorianToJalali(now.getFullYear(), now.getMonth() + 1, now.getDate());
    }
  };

  class BaseCalendar {
    constructor(storageKey, elements) {
      this.storageKey = storageKey;
      this.elements = elements;
      this.tasks = JSON.parse(localStorage.getItem(storageKey)) || {};
      this.selectedDate = null;
      this.currentDate = calendarUtils.getCurrentPersianDate();
      this.init();
    }

    init() {
      this.renderCalendar();
      this.setupEventListeners();
      this.renderTasksList();
    }

    setupEventListeners() {
      this.elements.prevMonth?.addEventListener("click", () => this.previousMonth());
      this.elements.nextMonth?.addEventListener("click", () => this.nextMonth());
      this.elements.addTaskBtn?.addEventListener("click", () => this.addTask());
      this.elements.taskInput?.addEventListener("keypress", (e) => {
        if (e.key === "Enter") this.addTask();
      });
    }

    getYearMonth() {
      return {
        year: this.currentDate.year || this.currentDate.jy,
        month: this.currentDate.month || this.currentDate.jm,
      };
    }

    renderCalendar() {
      const { year, month } = this.getYearMonth();
      const monthName = calendarUtils.getPersianMonthName(month);
      const gregDate = calendarUtils.jalaliToGregorian(year, month, 1);
      const gregorianMonth = calendarUtils.getGregorianMonthName(gregDate.month);
      this.elements.currentMonth.textContent = `${monthName} ${year} / ${gregorianMonth} ${gregDate.year}`;

      const firstDay = new Date(gregDate.year, gregDate.month - 1, gregDate.day).getDay();
      const daysInMonth = calendarUtils.getPersianMonthDays(year, month);
      const calendarGrid = this.elements.calendarGrid;
      calendarGrid.innerHTML = "";

      const prevMonth = month === 1 ? 12 : month - 1;
      const prevYear = month === 1 ? year - 1 : year;
      const daysInPrevMonth = calendarUtils.getPersianMonthDays(prevYear, prevMonth);
      const startDay = firstDay === 0 ? 6 : firstDay - 1;

      for (let i = daysInPrevMonth - startDay + 1; i <= daysInPrevMonth; i++) {
        const dayEl = document.createElement("div");
        dayEl.className = "calendar-day other-month";
        dayEl.textContent = i;
        calendarGrid.appendChild(dayEl);
      }

      const today = calendarUtils.gregorianToJalali(new Date());

      for (let i = 1; i <= daysInMonth; i++) {
        const dayEl = document.createElement("div");
        dayEl.className = "calendar-day";

        const solarDiv = document.createElement("div");
        solarDiv.className = "solar-date";
        solarDiv.textContent = i;
        dayEl.appendChild(solarDiv);

        const gregDateObj = calendarUtils.jalaliToGregorian(year, month, i);
        const gregDiv = document.createElement("div");
        gregDiv.className = "gregorian-date";
        gregDiv.textContent = gregDateObj.day;
        dayEl.appendChild(gregDiv);

        const isToday = today.jy === year && today.jm === month && today.jd === i;
        if (isToday) dayEl.classList.add("today");

        const dateKey = `${year}-${month}-${i}`;
        if (this.tasks[dateKey]) {
          dayEl.classList.add("has-task");
        }

        dayEl.addEventListener("click", () => this.selectDate(year, month, i, dayEl));
        calendarGrid.appendChild(dayEl);
      }

      const totalCells = calendarGrid.children.length;
      if (totalCells < 42) {
        for (let i = 1; i <= 42 - totalCells; i++) {
          const dayEl = document.createElement("div");
          dayEl.className = "calendar-day other-month";
          dayEl.textContent = i;
          calendarGrid.appendChild(dayEl);
        }
      }
    }

    selectDate(year, month, day, element) {
      this.elements.calendarGrid.querySelectorAll(".calendar-day.selected").forEach((el) => el.classList.remove("selected"));
      element.classList.add("selected");
      this.selectedDate = { year, month, day };
      this.updateSelectedDateDisplay();
      if (this.elements.taskInput) {
        this.elements.taskInput.focus();
        this.elements.taskInput.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }

    updateSelectedDateDisplay() {
      if (!this.selectedDate || !this.elements.selectedDateDisplay) return;
      const monthName = calendarUtils.getPersianMonthName(this.selectedDate.month);
      const gregDate = calendarUtils.jalaliToGregorian(this.selectedDate.year, this.selectedDate.month, this.selectedDate.day);
      const gregorianMonth = calendarUtils.getGregorianMonthName(gregDate.month);
      this.elements.selectedDateDisplay.textContent = `Selected: ${monthName} ${this.selectedDate.day}, ${this.selectedDate.year} / ${gregorianMonth} ${gregDate.day}, ${gregDate.year}`;
    }

    previousMonth() {
      if (this.currentDate.month === 1 || this.currentDate.jm === 1) {
        this.currentDate.month = 12;
        this.currentDate.jm = 12;
        this.currentDate.year = (this.currentDate.year || this.currentDate.jy) - 1;
        this.currentDate.jy = this.currentDate.year;
      } else {
        this.currentDate.month = (this.currentDate.month || this.currentDate.jm) - 1;
        this.currentDate.jm = this.currentDate.month;
      }
      this.renderCalendar();
    }

    nextMonth() {
      if (this.currentDate.month === 12 || this.currentDate.jm === 12) {
        this.currentDate.month = 1;
        this.currentDate.jm = 1;
        this.currentDate.year = (this.currentDate.year || this.currentDate.jy) + 1;
        this.currentDate.jy = this.currentDate.year;
      } else {
        this.currentDate.month = (this.currentDate.month || this.currentDate.jm) + 1;
        this.currentDate.jm = this.currentDate.month;
      }
      this.renderCalendar();
    }

    saveTasks() {
      localStorage.setItem(this.storageKey, JSON.stringify(this.tasks));
    }

    createActions(dateKey, task) {
      const actions = document.createElement("div");
      actions.className = "task-actions";

      const toggleBtn = document.createElement("button");
      toggleBtn.className = "task-btn toggle";
      toggleBtn.type = "button";
      toggleBtn.textContent = task.completed ? "↩" : "✓";
      toggleBtn.addEventListener("click", () => this.toggleTask(dateKey, task.id));

      const deleteBtn = document.createElement("button");
      deleteBtn.className = "task-btn delete";
      deleteBtn.type = "button";
      deleteBtn.textContent = "×";
      deleteBtn.addEventListener("click", () => this.deleteTask(dateKey, task.id));

      actions.append(toggleBtn, deleteBtn);
      return actions;
    }

    renderTasksList() {}

    toggleTask(dateKey, id) {
      const task = this.tasks[dateKey]?.find((t) => t.id === id);
      if (task) {
        task.completed = !task.completed;
        this.saveTasks();
        this.renderTasksList();
      }
    }

    deleteTask(dateKey, id) {
      if (!this.tasks[dateKey]) return;
      this.tasks[dateKey] = this.tasks[dateKey].filter((t) => t.id !== id);
      if (this.tasks[dateKey].length === 0) delete this.tasks[dateKey];
      this.saveTasks();
      this.renderCalendar();
      this.renderTasksList();
    }
  }

  class UserDashboardCalendar extends BaseCalendar {
    constructor(elements) {
      super("userTasks", elements);
    }

    addTask() {
      if (!this.selectedDate) {
        alert("Please select a date first");
        return;
      }

      const taskText = this.elements.taskInput.value.trim();
      if (!taskText) return;

      const dateKey = `${this.selectedDate.year}-${this.selectedDate.month}-${this.selectedDate.day}`;
      if (!this.tasks[dateKey]) {
        this.tasks[dateKey] = [];
      }

      this.tasks[dateKey].push({
        id: Date.now(),
        text: taskText,
        completed: false,
      });

      this.saveTasks();
      this.elements.taskInput.value = "";
      this.renderCalendar();
      this.renderTasksList();
    }

    renderTasksList() {
      const tasksList = this.elements.tasksList;
      tasksList.innerHTML = "";

      const allTasks = [];
      Object.entries(this.tasks).forEach(([dateKey, tasks]) => {
        tasks.forEach((task) => allTasks.push({ ...task, dateKey }));
      });

      if (allTasks.length === 0) {
        const emptyState = document.createElement("p");
        emptyState.className = "empty-state";
        emptyState.textContent = "No tasks yet. Add one by selecting a date!";
        tasksList.appendChild(emptyState);
        return;
      }

      allTasks.forEach((task) => {
        const [, month, day] = task.dateKey.split("-");
        const monthName = calendarUtils.getPersianMonthName(parseInt(month, 10));
        const taskEl = document.createElement("div");
        taskEl.className = `task-item ${task.completed ? "completed" : ""}`;

        const textSpan = document.createElement("span");
        textSpan.className = "task-text";
        textSpan.textContent = task.text;

        const dateSpan = document.createElement("span");
        dateSpan.className = "task-date";
        dateSpan.textContent = `${monthName} ${day}`;

        const actions = this.createActions(task.dateKey, task);
        taskEl.append(textSpan, dateSpan, actions);
        tasksList.appendChild(taskEl);
      });
    }
  }

  class AdminDashboardCalendar extends BaseCalendar {
    constructor(elements) {
      super("adminTasks", elements);
      this.userSelect = elements.userSelect;
    }

    addTask() {
      if (!this.selectedDate) {
        alert("Please select a date first");
        return;
      }

      const taskText = this.elements.taskInput.value.trim();
      const assignedUser = this.userSelect.value;

      if (!taskText || !assignedUser) {
        alert("Please enter task and select a user");
        return;
      }

      const dateKey = `${this.selectedDate.year}-${this.selectedDate.month}-${this.selectedDate.day}`;
      if (!this.tasks[dateKey]) {
        this.tasks[dateKey] = [];
      }

      this.tasks[dateKey].push({
        id: Date.now(),
        text: taskText,
        assignedTo: assignedUser,
        completed: false,
      });

      this.saveTasks();
      this.elements.taskInput.value = "";
      this.userSelect.value = "";
      this.renderCalendar();
      this.renderTasksList();
    }

    renderTasksList() {
      const tasksList = this.elements.tasksList;
      tasksList.innerHTML = "";

      const allTasks = [];
      Object.entries(this.tasks).forEach(([dateKey, tasks]) => {
        tasks.forEach((task) => allTasks.push({ ...task, dateKey }));
      });

      if (allTasks.length === 0) {
        const emptyState = document.createElement("p");
        emptyState.className = "empty-state";
        emptyState.textContent = "No tasks assigned yet.";
        tasksList.appendChild(emptyState);
        return;
      }

      allTasks.forEach((task) => {
        const [, month, day] = task.dateKey.split("-");
        const monthName = calendarUtils.getPersianMonthName(parseInt(month, 10));
        const taskEl = document.createElement("div");
        taskEl.className = `task-item ${task.completed ? "completed" : ""}`;

        const textSpan = document.createElement("span");
        textSpan.className = "task-text";
        textSpan.textContent = task.text;

        const dateSpan = document.createElement("span");
        dateSpan.className = "task-date";
        dateSpan.textContent = `${monthName} ${day}`;

        const userSpan = document.createElement("span");
        userSpan.className = "task-user";
        userSpan.textContent = `👤 ${task.assignedTo}`;

        const actions = this.createActions(task.dateKey, task);
        taskEl.append(textSpan, dateSpan, userSpan, actions);
        tasksList.appendChild(taskEl);
      });
    }
  }

  const initUserDashboardCalendar = () => {
    const wrapper = document.querySelector(".user-dashboard-page");
    if (!wrapper) return;
    const elements = {
      calendarGrid: document.getElementById("calendarGrid"),
      currentMonth: document.getElementById("currentMonth"),
      prevMonth: document.getElementById("prevMonth"),
      nextMonth: document.getElementById("nextMonth"),
      taskInput: document.getElementById("taskInput"),
      addTaskBtn: document.getElementById("addTaskBtn"),
      tasksList: document.getElementById("tasksList"),
      selectedDateDisplay: document.getElementById("selectedDateDisplay"),
    };

    if (Object.values(elements).some((el) => !el)) return;
    new UserDashboardCalendar(elements);
  };

  const initAdminDashboardCalendar = () => {
    const wrapper = document.querySelector(".admin-dashboard-page");
    if (!wrapper) return;
    const elements = {
      calendarGrid: document.getElementById("calendarGrid"),
      currentMonth: document.getElementById("currentMonth"),
      prevMonth: document.getElementById("prevMonth"),
      nextMonth: document.getElementById("nextMonth"),
      taskInput: document.getElementById("taskInput"),
      addTaskBtn: document.getElementById("addTaskBtn"),
      tasksList: document.getElementById("tasksList"),
      selectedDateDisplay: document.getElementById("selectedDateDisplay"),
      userSelect: document.getElementById("userSelect"),
    };

    if (Object.values(elements).some((el) => !el)) return;
    new AdminDashboardCalendar(elements);
  };

  const initPasswordVisibility = () => {
    const passwordCheckboxes = document.querySelectorAll(".password-checkbox");
    passwordCheckboxes.forEach((checkbox) => {
      checkbox.addEventListener("change", function () {
        const passwordWrapper = this.closest(".checkbox-wrapper");
        const formGroup = passwordWrapper?.closest(".form-group");
        const passwordInput = formGroup?.querySelector('input[type="password"], input[type="text"]');

        if (passwordInput) {
          passwordInput.type = this.checked ? "text" : "password";
        }
      });
    });
  };

  document.addEventListener("DOMContentLoaded", () => {
    initPasswordVisibility();
    initUserDashboardCalendar();
    initAdminDashboardCalendar();
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
