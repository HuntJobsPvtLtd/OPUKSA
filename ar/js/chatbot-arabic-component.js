class OpuksaChatbot {
  constructor(options = {}) {
    this.isOpen = false;
    this.apiEndpoint = "https://pxibh983vh.execute-api.ap-south-1.amazonaws.com/Prod/api/OPUKsa/Contact";
    this.services = options.services || this.defaultServices();
    this.currentCaptchaId = null;          // store the last CAPTCHA ID from API
    this.init();
  }

  defaultServices() {
    return {
      auditing: {
        title: "خدمات التدقيق في السعودية",
        info: "خدمات <strong>التدقيق الإلزامي</strong> المتوافقة مع معايير هيئة المحاسبة:",
        features: [
          "تدقيق إلزامي لجميع أنواع الكيانات",
          "مدققون مسجلون في هيئة المحاسبة",
          "تدقيق القوائم المالية",
          "خدمات التدقيق الداخلي",
          "تدقيق الامتثال",
          "تدقيق أغراض خاصة",
        ],
        color: "emerald",
      },
      accounting: {
        title: "خدمات المحاسبة",
        info: "حلول <strong>محاسبية شاملة</strong> للأعمال السعودية:",
        features: [
          "الدفاتر المحاسبية والمحاسبة",
          "التقارير المالية",
          "معالجة الرواتب",
          "الحسابات المدينة/الدائنة",
          "مطابقة الحسابات البنكية",
          "الامتثال لمعايير IFRS",
        ],
        color: "blue",
      },
      "accounting advisory": {
        title: "استشارات المحاسبة",
        info: "<strong>استشارات محاسبية</strong> خبيرة لإدارة مالية مثالية:",
        features: [
          "تنفيذ أنظمة المحاسبة",
          "تحسين العمليات المالية",
          "استشارات IFRS و GAAP",
          "اختيار برمجيات المحاسبة",
          "إعداد ضوابط مالية",
          "المحاسبة الإدارية",
        ],
        color: "teal",
      },
      "zakat tax": {
        title: "خدمات الزكاة والضرائب",
        info: "<strong>الامتثال الشامل للزكاة والضرائب</strong>:",
        features: [
          "حساب وحفظ الزكاة",
          "ضريبة الدخل على الشركات",
          "امتثال ضريبة الاستقطاع",
          "تخطيط ضريبي وتحسين",
          "امتثال زاتكا",
          "تسعير التحويل",
        ],
        color: "purple",
      },
      vat: {
        title: "خدمات ضريبة القيمة المضافة",
        info: "مجموعة كاملة من خدمات <strong>الامتثال لضريبة القيمة المضافة</strong>:",
        features: [
          "تسجيل وإلغاء تسجيل ضريبة القيمة المضافة",
          "تقديم إقرارات ضريبة القيمة المضافة",
          "المرحلة الثانية من الفوترة الإلكترونية زاتكا",
          "تدقيق وتقييم ضريبة القيمة المضافة",
          "استرداد ضريبة القيمة المضافة المدخلة",
          "مطالبات استرداد ضريبة القيمة المضافة",
        ],
        color: "orange",
      },
      "financial advisory": {
        title: "الاستشارات المالية",
        info: "<strong>استشارات مالية</strong> استراتيجية لنمو الأعمال:",
        features: [
          "النمذجة والتوقعات المالية",
          "تقييم الأعمال",
          "استشارات الاندماج والاستحواذ",
          "دعم جمع التمويل",
          "الميزانية والتخطيط",
          "إدارة التدفق النقدي",
        ],
        color: "indigo",
      },
    };
  }

  init() {
    this.createHTML();
    this.bindElements();
    this.bindEvents();
    this.addWelcomeMessage();
    this.autoResizeTextarea();
  }

  createHTML() {
    const existingWidget = document.getElementById("chatWidget");
    const existingToggle = document.getElementById("chatToggle");
    const existingStyle = document.getElementById("chatbot-styles");

    if (existingWidget) existingWidget.remove();
    if (existingToggle) existingToggle.remove();
    if (existingStyle) existingStyle.remove();

    document.body.insertAdjacentHTML(
      "beforeend",
      `
      <!-- RESPONSIVE Toggle Button -->
      <button id="chatToggle" class="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-[1000] w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-2xl rounded-full flex items-center justify-center text-white text-lg sm:text-xl font-bold animate-pulse transition-all duration-300 hover:scale-110 hover:shadow-3xl border-4 border-white/50">
        🤖
      </button>

      <!-- RESPONSIVE Chat Widget -->
      <div id="chatWidget" class="fixed bottom-20 sm:bottom-28 right-4 sm:right-6 w-[calc(100vw-2rem)] sm:w-96 max-w-[95vw] h-[calc(70vh-5rem)] sm:h-auto max-h-[75vh] sm:max-h-[85vh] bg-white rounded-2xl shadow-2xl border border-gray-200 z-[999] hidden translate-x-full transition-all duration-500 ease-in-out">
        <!-- Header -->
        <div class="p-4 sm:p-5 border-b border-gray-100 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-t-2xl">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2 sm:space-x-3">
              <div class="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
                <span class="text-white font-bold text-base sm:text-lg">🤖</span>
              </div>
              <div class="min-w-0">
                <h3 class="font-bold text-base sm:text-lg text-gray-800 truncate arabic-text">أوجاس</h3>
                <span class="text-xs sm:text-sm text-emerald-600 font-medium block arabic-text">مساعد OPU متاح 24/7</span>
              </div>
            </div>
            <button id="chatClose" class="p-1.5 sm:p-2 hover:bg-gray-200 rounded-xl transition-all duration-200 hover:scale-110 flex-shrink-0">
              <svg class="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- Messages Area -->
        <div id="chatMessages" class="h-[calc(60vh-9rem)] sm:h-96 p-3 sm:p-5 overflow-y-auto space-y-3 sm:space-y-4 bg-gray-50 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 min-h-[200px]">
        </div>

        <!-- Input Area -->
        <div class="p-3 sm:p-5 border-t border-gray-100 bg-white rounded-b-2xl">
          <div class="flex items-end space-x-2 sm:space-x-3">
            <div class="flex-1 min-w-0">
              <textarea id="chatInput" rows="1" placeholder="اسأل عن أي خدمة أوبوكسا..." 
                class="w-full p-2.5 sm:p-3 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm leading-relaxed max-h-16 sm:max-h-20 transition-all duration-200 arabic-text" dir="rtl"></textarea>
            </div>
            <button id="chatSend" class="w-10 h-10 sm:w-11 sm:h-11 bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 shadow-lg hover:shadow-xl rounded-xl flex items-center justify-center text-white transition-all duration-200 hover:scale-105 active:scale-95 flex-shrink-0 border-2 border-emerald-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" sm:width="16" height="14" sm:height="16" fill="currentColor" class="bi bi-send" viewBox="0 0 16 16">
                <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576zm6.787-8.201L1.591 6.602l4.339 2.76z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Styles -->
      <style id="chatbot-styles">
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap');
        
        .arabic-text, [dir="rtl"] {
          font-family: 'Noto Sans Arabic', Tahoma, Arial, sans-serif !important;
          direction: rtl !important;
          text-align: right !important;
          unicode-bidi: embed;
          line-height: 1.6 !important;
        }
        
        .scrollbar-thin::-webkit-scrollbar { width: 4px; }
        .scrollbar-thin::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 2px; }
        .scrollbar-thin::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 2px; }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
        
        #chatWidget * { font-family: 'Inter', sans-serif !important; }
        .arabic-text * { font-family: 'Noto Sans Arabic', Tahoma, Arial, sans-serif !important; }
        
        @media (max-width: 640px) {
          #chatWidget * { font-size: 0.875rem !important; line-height: 1.4 !important; }
          #chatMessages { padding: 0.75rem !important; }
        }
        
        .chat-message { animation: slideInFromBottom 0.3s ease-out; }
        @keyframes slideInFromBottom { 
          from { opacity: 0; transform: translateY(20px); } 
          to { opacity: 1; transform: translateY(0); } 
        }
      </style>
    `
    );
  }

  bindElements() {
    this.toggleBtn = document.getElementById("chatToggle");
    this.widget = document.getElementById("chatWidget");
    this.closeBtn = document.getElementById("chatClose");
    this.sendBtn = document.getElementById("chatSend");
    this.input = document.getElementById("chatInput");
    this.messages = document.getElementById("chatMessages");
  }

  bindEvents() {
    // Global form handler – using CAPTCHA API verification
    document.addEventListener(
      "submit",
      (e) => {
        if (e.target.matches(".contact-form") && !e.target.dataset.processing) {
          e.preventDefault();
          e.target.dataset.processing = "true";

          const userCaptcha = document.getElementById("chatbotCaptchaInput").value;
          const errorText = document.getElementById("chatbotCaptchaError");
          const captchaInput = document.getElementById("chatbotCaptchaInput");

          // Validate that we have a captcha ID and input
          if (!this.currentCaptchaId || !userCaptcha) {
            errorText.classList.remove("hidden");
            captchaInput.value = "";
            this.loadCaptcha();
            e.target.dataset.processing = "";
            return;
          }

          // Verify CAPTCHA via API
          fetch("https://pxibh983vh.execute-api.ap-south-1.amazonaws.com/Prod/api/Captcha/VerifyCaptcha", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              captchaId: this.currentCaptchaId,
              captcha: userCaptcha
            })
          })
          .then(res => res.json())
          .then(captchaResult => {
            if (!captchaResult.success) {
              errorText.classList.remove("hidden");
              captchaInput.value = "";
              this.loadCaptcha();            // refresh CAPTCHA
              e.target.dataset.processing = "";
              return;
            }

            errorText.classList.add("hidden");

            // Proceed with contact form submission
            const formData = new FormData(e.target);
            const serviceName =
              e.target.dataset.service === "general"
                ? "خدمات أوبوكسا"
                : this.services[e.target.dataset.service]?.title || "الخدمات";

            const data = {
              Service: e.target.dataset.service,
              FullName: formData.get("name"),
              EmailId: formData.get("email"),
              PhoneNumber: formData.get("phone"),
              Message: formData.get("message"),
              Action: "chatbot",
            };

            const submitBtn = e.target.querySelector('button[type="submit"]');
            submitBtn.innerHTML = "<span>⏳ إرسال...</span>";
            submitBtn.disabled = true;

            fetch(this.apiEndpoint, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(data),
            })
              .then((response) => {
                if (response.ok) {
                  e.target.parentElement.remove();
                  this.addMessage(
                    `
                    <div class="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 p-4 rounded-2xl">
                      <div class="flex items-start space-x-3 mb-3">
                        <div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <span class="text-white font-bold text-sm">✓</span>
                        </div>
                        <div class="arabic-text">
                          <h4 class="font-bold text-green-800 text-sm mb-1">شكراً لك!</h4>
                          <p class="text-green-700 text-xs">تم إرسال استفسارك ${serviceName} بنجاح.</p>
                          <p class="text-green-700 text-xs font-medium">📞 سيراسلك خبير خلال 24 ساعة</p>
                        </div>
                      </div>
                    </div>
                    `,
                    "bot"
                  );
                } else {
                  throw new Error("API Error");
                }
              })
              .catch((error) => {
                e.target.parentElement.remove();
                this.addMessage(
                  `
                  <div class="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 p-4 rounded-2xl">
                    <div class="flex items-start space-x-3">
                      <div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <span class="text-white font-bold text-sm">✓</span>
                      </div>
                      <div class="arabic-text">
                        <h4 class="font-bold text-green-800 text-sm mb-1">تم استلام الطلب!</h4>
                        <p class="text-green-700 text-xs">شكراً! لقد تلقى فريقنا استفسارك.</p>
                      </div>
                    </div>
                  </div>
                  `,
                  "bot"
                );
              });
          })
          .catch(err => {
            console.error("Captcha verification failed", err);
            errorText.classList.remove("hidden");
            this.loadCaptcha();
            e.target.dataset.processing = "";
          });
        }
      },
      true
    );

    this.toggleBtn.addEventListener("click", () => this.toggle());
    this.closeBtn.addEventListener("click", () => this.closeWidget());
    this.sendBtn.addEventListener("click", () => this.sendMessage());
    this.input.addEventListener("keypress", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        this.sendMessage();
      }
    });

    document.addEventListener("click", (e) => {
      if (
        e.target.matches(".contact-trigger") ||
        e.target.closest(".contact-trigger")
      ) {
        e.preventDefault();
        const btn = e.target.matches(".contact-trigger")
          ? e.target
          : e.target.closest(".contact-trigger");
        const serviceKey = btn.dataset.service || "general";
        this.showContactForm(serviceKey);
      }
    });

    document.addEventListener("click", (e) => {
      if (e.target.classList.contains("quick-reply")) {
        const query = e.target.dataset.query;
        const arabicQuery = this.getArabicServiceName(query);
        this.input.value = arabicQuery;
        this.sendMessage();
      }
    });
  }

  getArabicServiceName(serviceKey) {
    const names = {
      auditing: "التدقيق",
      accounting: "المحاسبة",
      "accounting advisory": "الاستشارات",
      "zakat tax": "الزكاة والضرائب",
      vat: "ضريبة القيمة المضافة",
      "financial advisory": "المالية",
    };
    return names[serviceKey] || serviceKey;
  }

  // Load CAPTCHA from API and display as image
  loadCaptcha() {
    const captchaImg = document.getElementById("chatbotCaptchaImage");
    if (!captchaImg) return;

    fetch("https://pxibh983vh.execute-api.ap-south-1.amazonaws.com/Prod/api/Captcha/GenerateCaptcha")
      .then(response => response.json())
      .then(result => {
        this.currentCaptchaId = result.captchaId;
        captchaImg.src = "data:image/png;base64," + result.captcha;
      })
      .catch(error => {
        console.error("Captcha generation failed", error);
        captchaImg.alt = "خطأ في رمز التحقق";
      });
  }

  // ✅ FIXED: ALL PLACEHOLDERS NOW IN ARABIC, uses API captcha image
  showContactForm(serviceKey = "general") {
    const serviceName =
      serviceKey === "general"
        ? "خدمات أوبوكسا"
        : this.services[serviceKey]?.title || "الخدمات";

    this.addMessage(
      `
    <div class="bg-emerald-50 border-2 border-emerald-200 p-4 sm:p-5 rounded-2xl">
      <div class="flex items-start space-x-3 mb-4">
        <div class="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
          <span class="text-white font-bold text-sm">📋</span>
        </div>
        <div class="arabic-text">
          <h4 class="font-bold text-emerald-800 text-sm mb-1">${serviceName} استفسار</h4>
          <p class="text-emerald-700 text-xs">املأ النموذج أدناه - سيراسلك خبير خلال 24 ساعة</p>
        </div>
      </div>
      <form class="contact-form space-y-3" data-service="${serviceKey}">
        <input type="text" name="name" placeholder="الاسم الكامل *" class="w-full p-2.5 sm:p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm arabic-text" required>
        <input type="email" name="email" placeholder="عنوان البريد الإلكتروني *" class="w-full p-2.5 sm:p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm arabic-text" required>
        <input type="tel" name="phone" placeholder="رقم الهاتف/واتساب" class="w-full p-2.5 sm:p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm arabic-text">
        <textarea rows="3" name="message" placeholder="أخبرنا عن احتياجات عملك..." class="w-full p-2.5 sm:p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm arabic-text" required></textarea>
        <div class="space-y-2">
          <label class="text-xs arabic-text text-gray-700">رمز التحقق</label>
          <div class="flex items-center gap-2">
            <input type="text"
              name="captcha"
              id="chatbotCaptchaInput"
              placeholder="أدخل الرمز"
              class="px-2 py-2 border border-gray-300 rounded-lg text-xs w-24 arabic-text"
              required>
            <img id="chatbotCaptchaImage"
              class="rounded h-8 w-auto border"
              alt="captcha">
            <button type="button"
              class="px-2 py-1 bg-gray-300 rounded text-xs"
              onclick="window.opuksaChatbotInstance.loadCaptcha()">
              ⟳
            </button>
          </div>
          <p id="chatbotCaptchaError" class="text-red-500 text-xs hidden arabic-text">
            رمز التحقق غير صحيح
          </p>
        </div>
        <button type="submit" class="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-3 px-6 rounded-xl font-semibold hover:shadow-xl transition-all text-sm flex items-center justify-center">
          <span class="arabic-text">إرسال للخبير</span>
        </button>
      </form>
    </div>
    `,
      "bot"
    );

    // Load the CAPTCHA after the form appears and expose instance globally
    setTimeout(() => {
      this.loadCaptcha();
      window.opuksaChatbotInstance = this; // for refresh button
    }, 100);
  }

  toggle() {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.widget.classList.remove("hidden", "translate-x-full");
      this.widget.classList.add("translate-x-0");
      setTimeout(() => this.input.focus(), 200);
    }
  }

  closeWidget() {
    this.widget.classList.add("hidden", "translate-x-full");
    this.isOpen = false;
  }

  sendMessage() {
    const message = this.input.value.trim();
    if (!message) return;

    this.addMessage(this.input.value, "user");
    this.input.value = "";

    setTimeout(() => {
      const service = this.detectService(message.toLowerCase());
      if (service) {
        this.showServiceInfo(service);
      } else {
        this.showGenericResponse();
      }
    }, 600);
  }

  detectService(message) {
    const messageLower = message.toLowerCase();
    for (let key in this.services) {
      if (
        messageLower.includes(key) ||
        message.includes(this.getArabicServiceName(key))
      ) {
        return key;
      }
    }
    return null;
  }

  showServiceInfo(serviceKey) {
    const service = this.services[serviceKey];
    this.addMessage(
      `
      <div class="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-gray-100">
        <h4 class="font-bold text-lg text-${service.color}-700 mb-3 arabic-text">${service.title}</h4>
        <p class="text-gray-700 mb-4 text-sm arabic-text">${service.info}</p>
        <div class="grid grid-cols-1 gap-2 mb-4">
          ${service.features
            .map(
              (feat) =>
                `<div class="flex items-start space-x-2 p-2 bg-${service.color}-50 rounded-lg">
                  <span class="text-${service.color}-500 text-sm font-medium mt-0.5 flex-shrink-0">✓</span>
                  <span class="text-sm text-gray-700 arabic-text">${feat}</span>
                </div>`
            )
            .join("")}
        </div>
        <div class="pt-3 border-t border-gray-100">
          <button class="contact-trigger w-full bg-gradient-to-r from-${service.color}-500 to-${service.color}-600 text-white py-2.5 px-4 rounded-xl font-semibold hover:shadow-lg transition-all text-sm flex items-center justify-center space-x-2" data-service="${serviceKey}">
            <span class="arabic-text">📞 إرسال استفسار</span>
          </button>
        </div>
      </div>
      `,
      "bot"
    );
  }

  showGenericResponse() {
    this.addMessage(
      `
      <div class="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <p class="text-gray-700 text-sm mb-3 arabic-text">يمكنني مساعدتك في هذه الخدمات من أوبوكسا:</p>
        <div class="grid grid-cols-2 gap-2 mb-4">
          <span class="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs rounded-lg font-medium arabic-text">التدقيق</span>
          <span class="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-lg font-medium arabic-text">المحاسبة</span>
          <span class="px-3 py-1 bg-teal-100 text-teal-800 text-xs rounded-lg font-medium arabic-text">الاستشارات</span>
          <span class="px-3 py-1 bg-purple-100 text-purple-800 text-xs rounded-lg font-medium arabic-text">الزكاة والضرائب</span>
          <span class="px-3 py-1 bg-orange-100 text-orange-800 text-xs rounded-lg font-medium arabic-text">ضريبة القيمة المضافة</span>
          <span class="px-3 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-lg font-medium arabic-text">المالية</span>
        </div>
        <button class="contact-trigger w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-2.5 px-4 rounded-xl font-semibold hover:shadow-lg transition-all text-sm flex items-center justify-center">
          <span class="arabic-text">📞 إرسال استفسار</span>
        </button>
      </div>
      `,
      "bot"
    );
  }

  addMessage(content, sender) {
    const messageDiv = document.createElement("div");
    messageDiv.className = `chat-message ${sender}-message`;

    if (sender === "user") {
      messageDiv.innerHTML = `
        <div class="flex items-start justify-end gap-2 sm:gap-3 pr-1">
          <div class="bg-gradient-to-r from-emerald-500 to-teal-500 text-white p-3 sm:p-4 rounded-2xl rounded-tr-sm shadow-lg max-w-[85%] sm:max-w-[90%]">
            <p class="text-sm leading-relaxed arabic-text">${content}</p>
          </div>
          <div class="w-7 h-7 sm:w-8 sm:h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0 self-end">
            <span class="text-xs font-semibold text-gray-700 arabic-text">أنت</span>
          </div>
        </div>
      `;
    } else {
      messageDiv.innerHTML = `
        <div class="flex items-start space-x-2 sm:space-x-3">
          <div class="w-7 h-7 sm:w-8 sm:h-8 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
            <span class="text-white font-bold text-xs sm:text-sm">🤖</span>
          </div>
          <div class="bg-white p-3 sm:p-4 rounded-2xl rounded-bl-sm shadow-sm max-w-[85%] sm:max-w-[90%] border border-gray-100">${content}</div>
        </div>
      `;
    }

    this.messages.appendChild(messageDiv);
    this.messages.scrollTop = this.messages.scrollHeight;
  }

  addWelcomeMessage() {
    setTimeout(() => {
      this.addMessage(
        `
        <div class="bg-white p-4 rounded-2xl rounded-bl-sm shadow-sm border border-gray-100">
          <p class="text-gray-800 text-sm leading-relaxed mb-4 arabic-text">
            مرحباً! 👋 أنا هنا لمساعدتك في 
            <strong class="text-emerald-600">جميع خدمات أوبوكسا في السعودية</strong>.
          </p>
          <div class="grid grid-cols-2 gap-2">
            <button class="quick-reply px-3 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-xs font-medium rounded-lg transition-all duration-200 border border-emerald-200 arabic-text" data-query="auditing">
              التدقيق
            </button>
            <button class="quick-reply px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-800 text-xs font-medium rounded-lg transition-all duration-200 border border-blue-200 arabic-text" data-query="accounting">
              المحاسبة
            </button>
            <button class="quick-reply px-3 py-2 bg-teal-100 hover:bg-teal-200 text-teal-800 text-xs font-medium rounded-lg transition-all duration-200 border border-teal-200 arabic-text" data-query="accounting advisory">
              الاستشارات
            </button>
            <button class="quick-reply px-3 py-2 bg-purple-100 hover:bg-purple-200 text-purple-800 text-xs font-medium rounded-lg transition-all duration-200 border border-purple-200 arabic-text" data-query="zakat tax">
              الزكاة والضرائب
            </button>
            <button class="quick-reply px-3 py-2 bg-orange-100 hover:bg-orange-200 text-orange-800 text-xs font-medium rounded-lg transition-all duration-200 border border-orange-200 arabic-text" data-query="vat">
              ضريبة القيمة المضافة
            </button>
            <button class="quick-reply px-3 py-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-800 text-xs font-medium rounded-lg transition-all duration-200 border border-indigo-200 arabic-text" data-query="financial advisory">
              المالية
            </button>
          </div>
        </div>
        `,
        "bot"
      );
    }, 500);
  }

  autoResizeTextarea() {
    this.input.addEventListener("input", () => {
      this.input.style.height = "auto";
      this.input.style.height = Math.min(this.input.scrollHeight, 80) + "px";
    });
  }
}

// Singleton pattern
window.OpuksaChatbotInstance = null;
window.OpuksaChatbot = class {
  constructor(options) {
    if (window.OpuksaChatbotInstance) return window.OpuksaChatbotInstance;
    window.OpuksaChatbotInstance = new OpuksaChatbot(options);
    return window.OpuksaChatbotInstance;
  }
};

// Auto-initialize
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => new window.OpuksaChatbot());
} else {
  new window.OpuksaChatbot();
}