var PLANS = {
    arcade: 9,
    advanced: 12,
    pro: 15
};
function renderToGeneralData() {
    var $planInput = document.querySelector("input[name='plan']:checked");
    var $planName = document.querySelector('#plan-name');
    var $planPrice = document.querySelector('#plan-price');
    var $isPlanYearly = document.querySelector('input[name=period]');
    if (!($planInput === null || $planInput === void 0 ? void 0 : $planInput.value))
        return;
    $planName.textContent = $planInput.value.toLowerCase();
    $planPrice.textContent = String(PLANS[$planInput.value] * ($isPlanYearly.checked ? 10 : 1));
}
var Step = /** @class */ (function () {
    function Step(selector) {
        this.currentStep = 0;
        this.slider = document.querySelector(selector);
        this.$listButtons = Array.from(document.querySelectorAll('.footer__buttons .button'));
        this.$listSteps = Array.from(document.querySelectorAll('.step__list > .step__item'));
        this.start();
    }
    Step.prototype.start = function () {
        this.slider.style.translate = "-".concat(this.currentStep * 100, "%");
        this.buildControls();
        this.showButtonAccordingStep();
    };
    Step.prototype.buildControls = function () {
        var _this = this;
        var _a = this.$listButtons, $btnBack = _a[0], $btnNext = _a[1], $btnConfirm = _a[2];
        var $changePlan = document.querySelector('#change-plan');
        $btnBack.addEventListener('click', function () {
            _this.currentStep -= 1;
            $btnNext.removeAttribute('disabled');
            _this.moveTo(_this.currentStep);
        });
        $btnNext.addEventListener('click', function () {
            _this.currentStep += 1;
            $btnNext.setAttribute('disabled', 'true');
            _this.moveTo(_this.currentStep);
        });
        $btnConfirm.addEventListener('click', function () {
            _this.currentStep += 1;
            _this.moveTo(_this.currentStep);
        });
        $changePlan === null || $changePlan === void 0 ? void 0 : $changePlan.addEventListener('click', function () {
            _this.currentStep = 1;
            _this.moveTo(_this.currentStep);
        });
        this.setActiveStep();
    };
    Step.prototype.moveTo = function (position) {
        this.slider.style.translate = "-".concat(position * 100, "%");
        this.showButtonAccordingStep();
        this.setActiveStep();
    };
    Step.prototype.showButtonAccordingStep = function () {
        var _a = this.$listButtons, $btnBack = _a[0], $btnNext = _a[1], $btnConfirm = _a[2];
        this.$listButtons.forEach(function (button) { return button.removeAttribute('style'); });
        switch (this.currentStep) {
            case 0:
                [$btnBack, $btnConfirm].forEach(function ($button) { return $button.style.display = 'none'; });
                break;
            case 1:
            case 2:
                [$btnConfirm].forEach(function ($button) { return $button.style.display = 'none'; });
                break;
            case 3:
                [$btnNext].forEach(function ($button) { return $button.style.display = 'none'; });
                break;
            default:
                this.$listButtons[0].parentElement.style.display = 'none';
                break;
        }
    };
    Step.prototype.setActiveStep = function () {
        this.$listSteps.forEach(function (step) { return step.firstElementChild.classList.remove('active'); });
        if (this.currentStep > 3)
            return;
        this.$listSteps[this.currentStep].firstElementChild.classList.add('active');
    };
    return Step;
}());
var FormPersonal = /** @class */ (function () {
    function FormPersonal(selector) {
        this.$form = [];
        this.completedForm = {
            name: false,
            email_address: false,
            phone_number: false,
        };
        this.$form = Array.from(document.querySelectorAll(selector));
        this.listeningChanges();
    }
    FormPersonal.prototype.listeningChanges = function () {
        var _this = this;
        this.$form.forEach(function ($input) {
            $input.addEventListener('input', function (ev) {
                var target = ev.target;
                var regex = new RegExp(target.pattern);
                _this.completedForm[target.name] = regex.test(target.value);
                var action = regex.test(target.value) ? 'remove' : 'add';
                target.classList[action]('form-error');
                _this.toggleDisabledButtonNext();
            });
        });
    };
    FormPersonal.prototype.toggleDisabledButtonNext = function () {
        var button = document.querySelector('.button__next');
        button.disabled = Object.values(this.completedForm).includes(false);
    };
    return FormPersonal;
}());
var FormPlan = /** @class */ (function () {
    function FormPlan(selector) {
        this.$form = [];
        this.completedForm = {
            plan: false,
            period: true
        };
        this.$form = Array.from(document.querySelectorAll(selector));
        this.listeningChanges();
        this.changePriceAccordingPeriod();
    }
    FormPlan.prototype.changePriceAccordingPeriod = function () {
        var $amounts = document.querySelectorAll('.plan_amount');
        var $abbr_periods = document.querySelectorAll('.abbr_period');
        var input = this.$form[0].querySelector('input[name=period]');
        input.addEventListener('change', function (ev) {
            var target = ev.target;
            if (target.checked) {
                $amounts.forEach(function ($amount) {
                    var _a;
                    $amount.textContent = String(Number($amount.textContent) * 10);
                    if ((_a = $amount.parentElement) === null || _a === void 0 ? void 0 : _a.nextElementSibling) {
                        $amount.parentElement.nextElementSibling.textContent = "2 months free";
                    }
                });
                $abbr_periods.forEach(function ($abbr) { return $abbr.textContent = 'ye'; });
            }
            else {
                $amounts.forEach(function ($amount) {
                    var _a;
                    $amount.textContent = String(Number($amount.textContent) / 10);
                    if ((_a = $amount.parentElement) === null || _a === void 0 ? void 0 : _a.nextElementSibling) {
                        $amount.parentElement.nextElementSibling.textContent = "";
                    }
                });
                $abbr_periods.forEach(function ($abbr) { return $abbr.textContent = 'mo'; });
            }
        });
    };
    FormPlan.prototype.listeningChanges = function () {
        var _this = this;
        this.$form.forEach(function ($input) {
            $input.addEventListener('change', function (ev) {
                var target = ev.target;
                _this.completedForm[target.name] = Boolean(target.value);
                _this.toggleDisabledButtonNext();
                renderToGeneralData();
                var $isYearly = document.querySelector('input[name=period]');
                var $span = document.querySelector('#plan-period');
                $span.textContent = $isYearly.checked ? 'Yearly' : 'Mounthly';
            });
        });
    };
    FormPlan.prototype.toggleDisabledButtonNext = function () {
        var button = document.querySelector('.button__next');
        button.disabled = Object.values(this.completedForm).includes(false);
    };
    return FormPlan;
}());
var SERVICES = {
    online_service: 1,
    customizable_profile: 2,
    larger_storage: 2,
};
var FormAddOns = /** @class */ (function () {
    function FormAddOns(selector) {
        this.$form = [];
        this.completedForm = {
            add_ons: false
        };
        this.$form = Array.from(document.querySelectorAll(selector));
        this.$containerItems = document.querySelector('#list-items');
        this.listeningChanges();
    }
    FormAddOns.prototype.listeningChanges = function () {
        var _this = this;
        this.$form.forEach(function ($input) {
            $input.addEventListener('change', function (ev) {
                var opts = _this.$form[0].querySelectorAll('input:checked');
                _this.completedForm['add_ons'] = Boolean(opts.length);
                _this.toggleDisabledButtonNext();
                renderToGeneralData();
                _this.renderList();
            });
        });
    };
    FormAddOns.prototype.toggleDisabledButtonNext = function () {
        var button = document.querySelector('.button__next');
        button.disabled = Object.values(this.completedForm).includes(false);
    };
    FormAddOns.prototype.renderList = function () {
        var inputs = Array.from(this.$form[0].querySelectorAll('input:checked'));
        var values = inputs.map(function (c) { return c.getAttribute('value'); });
        var $isYearly = document.querySelector('input[name=period]');
        var createItem = function (name) {
            var price = $isYearly.checked ? SERVICES[name] * 10 : SERVICES[name];
            return "\n      <div class=\"description__item\">\n        <div class=\"title\">".concat(name.replace('_', ' '), "</div>\n        <div class=\"price\">\n          $").concat(price, "/<span class=\"abbr_period\">").concat($isYearly.checked ? 'ye' : 'mo', "</span>\n        </div>\n      </div>");
        };
        this.$containerItems.innerHTML = values.map(function (c) { return createItem(c); }).join('');
        // CALCULATE TOTAL
        var $plan = document.querySelector('#plan .input__checkbox:checked');
        var planPrice = $isYearly.checked ? PLANS[$plan.value] * 10 : PLANS[$plan.value];
        var totalServicePrice = values.map(function (value) { return SERVICES[value]; })
            .reduce(function (acc, c) { return (acc + ($isYearly.checked ? c * 10 : c)); }, 0);
        var $totalAmount = document.querySelector('#total-amount');
        $totalAmount.textContent = String(planPrice + totalServicePrice);
    };
    return FormAddOns;
}());
function startApp() {
    new Step('#slider-steps');
    new FormPersonal('#form-personal');
    new FormPlan('#plan');
    new FormAddOns('#pick-add-ons');
}
startApp();
