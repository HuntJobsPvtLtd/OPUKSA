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
        title: "Auditing Services in Saudi Arabia",
        info: "Professional <strong>statutory audit</strong> services compliant with SOCPA standards:",
        features: [
          "Statutory audit for all entity types",
          "SOCPA registered auditors",
          "Financial statement audits",
          "Internal audit services",
          "Compliance audits",
          "Special purpose audits",
        ],
        color: "emerald",
      },
      accounting: {
        title: "Accounting Services",
        info: "Complete <strong>accounting solutions</strong> for Saudi businesses:",
        features: [
          "Bookkeeping & accounting",
          "Financial reporting",
          "Payroll processing",
          "Accounts payable/receivable",
          "Bank reconciliation",
          "IFRS compliance",
        ],
        color: "blue",
      },
      "accounting advisory": {
        title: "Accounting Advisory",
        info: "Expert <strong>accounting advisory</strong> for optimal financial management:",
        features: [
          "Accounting system implementation",
          "Financial process optimization",
          "IFRS & GAAP advisory",
          "Accounting software selection",
          "Financial controls setup",
          "Management accounting",
        ],
        color: "teal",
      },
      "zakat tax": {
        title: "Zakat & Tax Services",
        info: "Comprehensive <strong>Zakat and tax compliance</strong>:",
        features: [
          "Zakat calculation & filing",
          "Corporate income tax",
          "Withholding tax compliance",
          "Tax planning & optimization",
          "ZATCA compliance",
          "Transfer pricing",
        ],
        color: "purple",
      },
      vat: {
        title: "VAT Services",
        info: "Full range of <strong>VAT compliance services</strong>:",
        features: [
          "VAT registration & deregistration",
          "VAT return filing",
          "ZATCA Phase 2 e-invoicing",
          "VAT audits & assessments",
          "Input VAT recovery",
          "VAT refund claims",
        ],
        color: "orange",
      },
      "financial advisory": {
        title: "Financial Advisory",
        info: "Strategic <strong>financial advisory</strong> for business growth:",
        features: [
          "Financial modeling & forecasting",
          "Business valuation",
          "M&A advisory",
          "Fundraising support",
          "Budgeting & planning",
          "Cash flow management",
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
    // Remove any previous instances
    const existingWidget = document.getElementById("chatWidget");
    const existingToggle = document.getElementById("chatToggle");
    const existingStyle = document.getElementById("chatbot-styles");

    if (existingWidget) existingWidget.remove();
    if (existingToggle) existingToggle.remove();
    if (existingStyle) existingStyle.remove();

    document.body.insertAdjacentHTML(
      "beforeend",
      `
      <!-- Toggle Button -->
      <button id="chatToggle" class="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-[1000] w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-2xl rounded-full flex items-center justify-center text-white text-lg sm:text-xl font-bold animate-pulse transition-all duration-300 hover:scale-110 hover:shadow-3xl border-4 border-white/50">
        🤖
      </button>

      <!-- Chat Widget -->
      <div id="chatWidget" class="fixed bottom-20 sm:bottom-28 right-4 sm:right-6 w-[calc(100vw-2rem)] sm:w-96 max-w-[95vw] h-[calc(70vh-5rem)] sm:h-auto max-h-[75vh] sm:max-h-[85vh] bg-white rounded-2xl shadow-2xl border border-gray-200 z-[999] hidden translate-x-full transition-all duration-500 ease-in-out">
        <!-- Header -->
        <div class="p-4 sm:p-5 border-b border-gray-100 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-t-2xl">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2 sm:space-x-3">
              <div class="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
                <span class="text-white font-bold text-base sm:text-lg">🤖</span>
              </div>
              <div class="min-w-0">
                <h3 class="font-bold text-base sm:text-lg text-gray-800 truncate">OJAS</h3>
                <span class="text-xs sm:text-sm text-emerald-600 font-medium block">OPU Assistant available 24/7</span>
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
              <textarea id="chatInput" rows="1" placeholder="Ask about any OPU service..." 
                class="w-full p-2.5 sm:p-3 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm leading-relaxed max-h-16 sm:max-h-20 transition-all duration-200"></textarea>
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
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        .scrollbar-thin::-webkit-scrollbar { width: 4px; }
        .scrollbar-thin::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 2px; }
        .scrollbar-thin::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 2px; }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
        #chatWidget * { font-family: 'Inter', sans-serif !important; }
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
            const data = {
              Service: e.target.dataset.service,
              FullName: formData.get("name"),
              EmailId: formData.get("email"),
              PhoneNumber: formData.get("phone"),
              Message: formData.get("message"),
              Action: "chatbot",
            };

            const submitBtn = e.target.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = "<span>⏳ Sending...</span>";
            submitBtn.disabled = true;

            fetch(this.apiEndpoint, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(data),
            })
              .then((response) => {
                if (response.ok) {
                  e.target.remove();
                  this.addMessage(
                    `<div class="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 p-4 rounded-2xl">
                      <div class="flex items-start space-x-3 mb-3">
                        <div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <span class="text-white font-bold text-sm">✓</span>
                        </div>
                        <div>
                          <h4 class="font-bold text-green-800 text-sm mb-1">Thank You!</h4>
                          <p class="text-green-700 text-xs">Your enquiry has been sent successfully.</p>
                          <p class="text-green-700 text-xs font-medium">📞 Expert will contact you within 24 hours</p>
                        </div>
                      </div>
                    </div>`,
                    "bot"
                  );
                } else {
                  throw new Error("API Error");
                }
              })
              .catch((error) => {
                e.target.remove();
                this.addMessage(
                  `<div class="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 p-4 rounded-2xl">
                    <div class="flex items-start space-x-3">
                      <div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <span class="text-white font-bold text-sm">✓</span>
                      </div>
                      <div>
                        <h4 class="font-bold text-green-800 text-sm mb-1">Request Received!</h4>
                        <p class="text-green-700 text-xs">Thank you! Our team received your enquiry.</p>
                      </div>
                    </div>
                  </div>`,
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

    // Toggle and send events
    this.toggleBtn.addEventListener("click", () => this.toggle());
    this.closeBtn.addEventListener("click", () => this.closeWidget());
    this.sendBtn.addEventListener("click", () => this.sendMessage());
    this.input.addEventListener("keypress", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        this.sendMessage();
      }
    });

    // Quick reply buttons
    document.addEventListener("click", (e) => {
      if (e.target.classList.contains("quick-reply")) {
        const query = e.target.dataset.query;
        this.input.value = query;
        this.sendMessage();
      }
    });

    // Contact trigger (opens form)
    document.addEventListener("click", (e) => {
      if (e.target.matches(".contact-trigger") || e.target.closest(".contact-trigger")) {
        e.preventDefault();
        const btn = e.target.matches(".contact-trigger") ? e.target : e.target.closest(".contact-trigger");
        const serviceKey = btn.dataset.service || "general";
        this.showContactForm(serviceKey);
      }
    });
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
        captchaImg.alt = "Captcha error";
      });
  }

  // Show contact form with CAPTCHA
  showContactForm(serviceKey = "general") {
    const serviceName = serviceKey === "general"
      ? "OPU Services"
      : (this.services[serviceKey]?.title || "Services");

    this.addMessage(
      `
      <div class="bg-emerald-50 border-2 border-emerald-200 p-4 sm:p-5 rounded-2xl">
        <div class="flex items-start space-x-3 mb-4">
          <div class="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <span class="text-white font-bold text-sm">📋</span>
          </div>
          <div>
            <h4 class="font-bold text-emerald-800 text-sm mb-1">${serviceName} Enquiry</h4>
            <p class="text-emerald-700 text-xs">Fill the form below – our expert will contact you within 24 hours</p>
          </div>
        </div>
        <form class="contact-form space-y-3" data-service="${serviceKey}">
          <input type="text" name="name" placeholder="Full Name *" class="w-full p-2.5 sm:p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm" required>
          <input type="email" name="email" placeholder="Email Address *" class="w-full p-2.5 sm:p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm" required>
          <input type="tel" name="phone" placeholder="Phone / WhatsApp" class="w-full p-2.5 sm:p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm">
          <textarea rows="3" name="message" placeholder="Tell us about your business needs..." class="w-full p-2.5 sm:p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm" required></textarea>
         
          <div class="mt-2">
            <label class="text-xs text-gray-700">Captcha</label>
            <div class="flex items-center gap-2 mt-1">
              <input type="text" id="chatbotCaptchaInput" placeholder="Enter code" class="px-2 py-2 border border-gray-300 rounded-lg text-xs w-24" required>
              <img id="chatbotCaptchaImage" class="rounded h-8 w-auto border" alt="captcha">
              <button type="button" class="px-2 py-1 bg-gray-300 rounded text-xs" onclick="document.querySelector('opuksa-chatbot-instance').loadCaptcha()">⟳</button>
            </div>
            <p id="chatbotCaptchaError" class="text-red-500 text-xs mt-1 hidden">Invalid captcha. Please try again.</p>
          </div>

          <button type="submit" class="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-3 px-6 rounded-xl font-semibold hover:shadow-xl transition-all text-sm flex items-center justify-center space-x-2">
            <span>Send to Expert</span>
          </button>
        </form>
      </div>
      `,
      "bot"
    );

    // Load the CAPTCHA after the form appears
    setTimeout(() => {
      this.loadCaptcha();
      // Expose this instance globally so the refresh button can call loadCaptcha()
      window.opuksaChatbotInstance = this;
    }, 100);
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
    for (let key in this.services) {
      if (message.includes(key)) {
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
        <h4 class="font-bold text-lg text-${service.color}-700 mb-3">${service.title}</h4>
        <p class="text-gray-700 mb-4 text-sm">${service.info}</p>
        <div class="grid grid-cols-1 gap-2 mb-4">
          ${service.features
            .map(
              (feat) =>
                `<div class="flex items-start space-x-2 p-2 bg-${service.color}-50 rounded-lg">
                  <span class="text-${service.color}-500 text-sm font-medium mt-0.5 flex-shrink-0">✓</span>
                  <span class="text-sm text-gray-700">${feat}</span>
                </div>`
            )
            .join("")}
        </div>
        <div class="pt-3 border-t border-gray-100">
          <button class="contact-trigger w-full bg-gradient-to-r from-${service.color}-500 to-${service.color}-600 text-white py-2.5 px-4 rounded-xl font-semibold hover:shadow-lg transition-all text-sm flex items-center justify-center space-x-2" data-service="${serviceKey}">
            📞 Send Enquiry
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
        <p class="text-gray-700 text-sm mb-3">I can help with these OPU services:</p>
        <div class="grid grid-cols-2 gap-2 mb-4">
          <span class="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs rounded-lg font-medium">Auditing</span>
          <span class="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-lg font-medium">Accounting</span>
          <span class="px-3 py-1 bg-teal-100 text-teal-800 text-xs rounded-lg font-medium">Advisory</span>
          <span class="px-3 py-1 bg-purple-100 text-purple-800 text-xs rounded-lg font-medium">Zakat & Tax</span>
          <span class="px-3 py-1 bg-orange-100 text-orange-800 text-xs rounded-lg font-medium">VAT</span>
          <span class="px-3 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-lg font-medium">Financial</span>
        </div>
        <button class="contact-trigger w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-2.5 px-4 rounded-xl font-semibold hover:shadow-lg transition-all text-sm" data-service="general">
          📞 Send Enquiry
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
            <p class="text-sm leading-relaxed">${content}</p>
          </div>
          <div class="w-7 h-7 sm:w-8 sm:h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0 self-end">
            <span class="text-xs font-semibold text-gray-700">You</span>
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
          <p class="text-gray-800 text-sm leading-relaxed mb-4">
            Hello! 👋 I'm here to help with 
            <strong class="text-emerald-600">all OPU services in Saudi Arabia</strong>.
          </p>
          <div class="grid grid-cols-2 gap-2">
            <button class="quick-reply px-3 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-xs font-medium rounded-lg transition-all duration-200 border border-emerald-200 whitespace-nowrap" data-query="auditing">
              Auditing
            </button>
            <button class="quick-reply px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-800 text-xs font-medium rounded-lg transition-all duration-200 border border-blue-200 whitespace-nowrap" data-query="accounting">
              Accounting
            </button>
            <button class="quick-reply px-3 py-2 bg-teal-100 hover:bg-teal-200 text-teal-800 text-xs font-medium rounded-lg transition-all duration-200 border border-teal-200 whitespace-nowrap" data-query="accounting advisory">
              Advisory
            </button>
            <button class="quick-reply px-3 py-2 bg-purple-100 hover:bg-purple-200 text-purple-800 text-xs font-medium rounded-lg transition-all duration-200 border border-purple-200 whitespace-nowrap" data-query="zakat tax">
              Zakat & Tax
            </button>
            <button class="quick-reply px-3 py-2 bg-orange-100 hover:bg-orange-200 text-orange-800 text-xs font-medium rounded-lg transition-all duration-200 border border-orange-200 whitespace-nowrap" data-query="vat">
              VAT
            </button>
            <button class="quick-reply px-3 py-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-800 text-xs font-medium rounded-lg transition-all duration-200 border border-indigo-200 whitespace-nowrap" data-query="financial advisory">
              Financial
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
}

// Singleton pattern to avoid multiple instances
window.OpuksaChatbotInstance = null;
window.OpuksaChatbot = class {
  constructor(options) {
    if (window.OpuksaChatbotInstance) return window.OpuksaChatbotInstance;
    window.OpuksaChatbotInstance = new OpuksaChatbot(options);
    return window.OpuksaChatbotInstance;
  }
};

// Auto-initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => new window.OpuksaChatbot());
} else {
  new window.OpuksaChatbot();
}