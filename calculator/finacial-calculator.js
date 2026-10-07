class FinancialCalculator extends HTMLElement {
    static observedAttributes = [
        "loan-amount",
        "interest-rate",
        "loan-term"
    ];

    constructor() {
        super();

        this.attachShadow({ mode: "open" });

        this.shadowRoot.innerHTML = `
        <link rel="stylesheet" href="./style.css">

            <div class="calculator">
                <h2>Финансовый калькулятор</h2>

                <div class="field">
                    <label>Сумма кредита</label>
                    <input id="loanAmount" type="number" min="1" step="0.01">
                    <div class="error" id="loanAmountError"></div>
                </div>

                <div class="field">
                    <label>Процентная ставка (%)</label>
                    <input id="interestRate" type="number" min="0" step="0.01">
                    <div class="error" id="interestRateError"></div>
                </div>

                <div class="field">
                    <label>Срок кредита (месяцев)</label>
                    <input id="loanTerm" type="number" min="1" step="1">
                    <div class="error" id="loanTermError"></div>
                </div>

                <div class="results">
                    <div class="result">
                        <span>Ежемесячный платёж:</span>
                        <span class="value" id="monthlyPayment">—</span>
                    </div>

                    <div class="result">
                        <span>Общая сумма:</span>
                        <span class="value" id="totalPayment">—</span>
                    </div>

                    <div class="result">
                        <span>Общий процент:</span>
                        <span class="value" id="totalInterest">—</span>
                    </div>
                </div>
            </div>
        `

        this.inputs = {
            loanAmount: this.$("#loanAmount"),
            interestRate: this.$("#interestRate"),
            loanTerm: this.$("#loanTerm")
        };

        this.errors = {
            loanAmount: this.$("#loanAmountError"),
            interestRate: this.$("#interestRateError"),
            loanTerm: this.$("#loanTermError")
        };

        this.results = {
            monthlyPayment: this.$("#monthlyPayment"),
            totalPayment: this.$("#totalPayment"),
            totalInterest: this.$("#totalInterest")
        };

        this.handleInput = this.handleInput.bind(this);
    }

    $(selector) {
        return this.shadowRoot.querySelector(selector);
    }

    connectedCallback() {
        this.setInputsFromAttributes();

        Object.values(this.inputs).forEach(input => {
            input.addEventListener("input", this.handleInput);
        });

        this.calculate();
    }

    disconnectedCallback() {
        Object.values(this.inputs).forEach(input => {
            input.removeEventListener("input", this.handleInput);
        });
    }

    attributeChangedCallback() {
        if (this.isConnected) {
            this.setInputsFromAttributes();
            this.calculate();
        }
    }

    setInputsFromAttributes() {
        this.inputs.loanAmount.value =
            this.getAttribute("loan-amount") ?? 100000;

        this.inputs.interestRate.value =
            this.getAttribute("interest-rate") ?? 10;

        this.inputs.loanTerm.value =
            this.getAttribute("loan-term") ?? 12;
    }

    handleInput(event) {
        const input = event.target;

        const attributeName = {
            loanAmount: "loan-amount",
            interestRate: "interest-rate",
            loanTerm: "loan-term"
        }[input.id];

        this.setAttribute(attributeName, input.value);

        this.calculate();
    }

    validate() {
        const values = {
            loanAmount: Number(this.inputs.loanAmount.value),
            interestRate: Number(this.inputs.interestRate.value),
            loanTerm: Number(this.inputs.loanTerm.value)
        };

        Object.values(this.errors).forEach(error => {
            error.textContent = "";
        });

        let valid = true;

        if (!Number.isFinite(values.loanAmount) || values.loanAmount <= 0) {
            this.errors.loanAmount.textContent =
                "Введите сумму больше 0";
            valid = false;
        }

        if (!Number.isFinite(values.interestRate) || values.interestRate < 0) {
            this.errors.interestRate.textContent =
                "Процентная ставка не может быть отрицательной";
            valid = false;
        }

        if (
            !Number.isInteger(values.loanTerm) ||
            values.loanTerm <= 0
        ) {
            this.errors.loanTerm.textContent =
                "Срок должен быть больше 0";
            valid = false;
        }

        return valid ? values : null;
    }

    calculate() {
        const values = this.validate();

        if (!values) {
            Object.values(this.results).forEach(result => {
                result.textContent = "—";
            });
            return;
        }

        const { loanAmount, interestRate, loanTerm } = values;

        const monthlyRate = interestRate / 100 / 12;

        const monthlyPayment = monthlyRate === 0
            ? loanAmount / loanTerm
            : loanAmount *
            (
                monthlyRate *
                Math.pow(1 + monthlyRate, loanTerm)
            ) /
            (
                Math.pow(1 + monthlyRate, loanTerm) - 1
            );

        const totalPayment = monthlyPayment * loanTerm;
        const totalInterest = totalPayment - loanAmount;

        this.results.monthlyPayment.textContent =
            this.formatCurrency(monthlyPayment);

        this.results.totalPayment.textContent =
            this.formatCurrency(totalPayment);

        this.results.totalInterest.textContent =
            this.formatCurrency(totalInterest);
    }

    formatCurrency(value) {
        return new Intl.NumberFormat("ru-RU", {
            style: "currency",
            currency: "RUB",
            minimumFractionDigits: 2
        }).format(value);
    }

    get loanAmount() {
        return Number(this.getAttribute("loan-amount"));
    }

    set loanAmount(value) {
        this.setAttribute("loan-amount", value);
    }

    get interestRate() {
        return Number(this.getAttribute("interest-rate"));
    }

    set interestRate(value) {
        this.setAttribute("interest-rate", value);
    }

    get loanTerm() {
        return Number(this.getAttribute("loan-term"));
    }

    set loanTerm(value) {
        this.setAttribute("loan-term", value);
    }
}

if (!customElements.get("financial-calculator")) {
    customElements.define(
        "financial-calculator",
        FinancialCalculator
    );
}
