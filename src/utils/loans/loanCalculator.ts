import type {
    LoanFrequency,
    LoanSimulationForm,
    LoanSimulationResult,
} from "../../interfaces/loans/loan.interface";

// Cantidad de días equivalentes para cada frecuencia del préstamo.
const frequencyDays: Record<LoanFrequency, number> = {
    DAILY: 1,
    WEEKLY: 7,
    BIWEEKLY: 15,
    MONTHLY: 30,
};

// Obtiene la etiqueta visible de una frecuencia del préstamo.
export const getLoanFrequencyLabel = (frequency: LoanFrequency) => {
    const labels: Record<LoanFrequency, string> = {
        DAILY: "Diario",
        WEEKLY: "Semanal",
        BIWEEKLY: "Quincenal",
        MONTHLY: "Mensual",
    };

    return labels[frequency];
};

// Formatea un valor numérico como moneda colombiana.
export const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        maximumFractionDigits: 0,
    }).format(value);
};

// Calcula la simulación completa de un préstamo.
export const calculateLoanSimulation = (
    form: LoanSimulationForm
): LoanSimulationResult => {
    const amount = Number(form.amount);
    const interestRate = Number(form.interestRate);
    const termValue = Number(form.termValue);

    const interestFrequency = form.interestFrequency as LoanFrequency;
    const termFrequency = form.termFrequency as LoanFrequency;
    const paymentFrequency = form.paymentFrequency as LoanFrequency;

    // Calcula el total de días del préstamo según el plazo seleccionado.
    const totalDays = termValue * frequencyDays[termFrequency];

    // Calcula cuántos periodos de interés aplican durante todo el préstamo.
    const interestPeriods =
        totalDays / frequencyDays[interestFrequency];

    // Calcula el total de réditos generados.
    const totalInterest =
        amount * (interestRate / 100) * interestPeriods;

    // Calcula el total a pagar sumando capital e interés.
    const totalToPay = amount + totalInterest;

    const paymentDays = frequencyDays[paymentFrequency];

    // Calcula la cantidad de cuotas según la frecuencia de pago.
    const installments = Math.ceil(totalDays / paymentDays);

    // Calcula el valor aproximado de cada cuota.
    const installmentValue = totalToPay / installments;

    return {
        amount,
        interestRate,
        interestFrequency,
        termValue,
        termFrequency,
        paymentFrequency,

        totalDays,
        interestPeriods,
        totalInterest,
        totalToPay,

        installments,
        installmentValue,
    };
};