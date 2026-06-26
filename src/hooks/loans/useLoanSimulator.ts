import { useState } from "react";
import { ValidationError } from "yup";

import type {
    LoanFrequency,
    LoanSimulationForm,
    LoanSimulationResult,
} from "../../interfaces/loans/loan.interface";

import { calculateLoanSimulation } from "../../utils/loans/loanCalculator";
import { cleanNumberInput } from "../../utils/common/numberUtils";
import { loanSimulationSchema } from "../../validations/loans/loanValidation";

// Estado inicial del formulario de simulación de préstamos.
const initialForm: LoanSimulationForm = {
    amount: "",
    interestRate: "",
    interestFrequency: "",
    termValue: "",
    termFrequency: "",
    paymentFrequency: "",
};

// Errores de validación del formulario de simulación.
type LoanFormErrors = Partial<Record<keyof LoanSimulationForm, string>>;

// Hook encargado de manejar la lógica del simulador de préstamos.
export const useLoanSimulator = () => {
    const [form, setForm] = useState<LoanSimulationForm>(initialForm);
    const [result, setResult] = useState<LoanSimulationResult | null>(null);
    const [errors, setErrors] = useState<LoanFormErrors>({});

    // Verifica si el formulario tiene cambios para habilitar el botón de limpiar.
    const hasFormChanges = JSON.stringify(form) !== JSON.stringify(initialForm);

    // Actualiza un campo del formulario y limpia su error correspondiente.
    const handleChange = (
        field: keyof LoanSimulationForm,
        value: string | number
    ) => {
        setForm((prev) => ({
            ...prev,
            [field]: value,
        }));

        setErrors((prev) => ({
            ...prev,
            [field]: "",
        }));
    };

    // Convierte el valor ingresado en número cuando el campo no está vacío.
    const handleNumberChange = (
        field: keyof LoanSimulationForm,
        value: string
    ) => {
        handleChange(field, value === "" ? "" : Number(value));
    };

    // Limpia, convierte y guarda el valor de un campo numérico formateado.
    const handleFormattedNumberChange = (
        field: keyof LoanSimulationForm,
        value: string
    ) => {
        const cleanValue = cleanNumberInput(value);
        handleChange(field, cleanValue === "" ? "" : Number(cleanValue));
    };

    // Valida el formulario usando el esquema de Yup.
    const validateForm = async () => {
        try {
            await loanSimulationSchema.validate(form, {
                abortEarly: false,
            });

            setErrors({});
            return true;
        } catch (error) {
            if (error instanceof ValidationError) {
                const validationErrors: LoanFormErrors = {};

                error.inner.forEach((currentError) => {
                    const field = currentError.path as keyof LoanSimulationForm;

                    if (field && !validationErrors[field]) {
                        validationErrors[field] = currentError.message;
                    }
                });

                setErrors(validationErrors);
            }

            return false;
        }
    };

    // Ejecuta la simulación del préstamo si el formulario es válido.
    const handleSimulate = async () => {
        const isValid = await validateForm();

        if (!isValid) {
            setResult(null);
            return;
        }

        const simulation = calculateLoanSimulation({
            ...form,
            amount: Number(form.amount),
            interestRate: Number(form.interestRate),
            termValue: Number(form.termValue),
            interestFrequency: form.interestFrequency as LoanFrequency,
            termFrequency: form.termFrequency as LoanFrequency,
            paymentFrequency: form.paymentFrequency as LoanFrequency,
        });

        setResult(simulation);
    };

    // Limpia el formulario, los errores y el resultado de la simulación.
    const handleClearForm = () => {
        setForm(initialForm);
        setResult(null);
        setErrors({});
    };

    return {
        form,
        result,
        errors,
        hasFormChanges,

        handleChange,
        handleNumberChange,
        handleFormattedNumberChange,
        handleSimulate,
        handleClearForm,
    };
};