// Frecuencias disponibles para interés, plazo y pagos del préstamo.
export type LoanFrequency = "DAILY" | "WEEKLY" | "BIWEEKLY" | "MONTHLY";

// Datos del formulario para simular un préstamo.
export interface LoanSimulationForm {
    amount: number | "";
    interestRate: number | "";
    interestFrequency: LoanFrequency | "";
    termValue: number | "";
    termFrequency: LoanFrequency | "";
    paymentFrequency: LoanFrequency | "";
}

// Resultado generado después de calcular la simulación del préstamo.
export interface LoanSimulationResult {
    amount: number;
    interestRate: number;
    interestFrequency: LoanFrequency;
    termValue: number;
    termFrequency: LoanFrequency;
    paymentFrequency: LoanFrequency;

    totalDays: number;
    interestPeriods: number;
    totalInterest: number;
    totalToPay: number;

    installments: number;
    installmentValue: number;
}