import { useState } from "react";
import {
    Box,
    Button,
    TextField,
} from "@mui/material";

import CalculateOutlinedIcon from "@mui/icons-material/CalculateOutlined";
import RestartAltOutlinedIcon from "@mui/icons-material/RestartAltOutlined";

import { ValidationError } from "yup";

import PageHeader from "../components/common/PageHeader";
import FormSection from "../components/common/FormSection";
import FormGrid from "../components/common/FormGrid";
import LoanSummaryCard from "../components/loans/LoanSummaryCard";

import type {
    LoanFrequency,
    LoanSimulationForm,
    LoanSimulationResult,
} from "../interfaces/loans/loan.interface";

import {
    calculateLoanSimulation,
} from "../utils/loans/loanCalculator";

import { loanSimulationSchema } from "../validations/loans/loanValidation";

import {
    loanFrequencyOptions,
    loanTermFrequencyOptions,
} from "../data/loanOptions";

import ClearableSelect from "../components/common/ClearableSelect";

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

// Página principal del simulador de préstamos.
const LoanSimulator = () => {
    const [form, setForm] = useState<LoanSimulationForm>(initialForm);
    const [result, setResult] = useState<LoanSimulationResult | null>(null);
    const [errors, setErrors] = useState<LoanFormErrors>({});

    // Verifica si el formulario tiene cambios para habilitar el botón de limpiar.
    const hasFormChanges = JSON.stringify(form) !== JSON.stringify(initialForm);

    // Mantiene el espacio visual de los mensajes de error en los campos.
    const fieldStyle = {
        "& .MuiFormHelperText-root": {
            minHeight: "20px",
        },
    };

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

    // Elimina caracteres que no sean números.
    const cleanNumberInput = (value: string) => {
        return value.replace(/\D/g, "");
    };

    // Formatea un número para mostrarlo con separadores de miles.
    const formatNumberInput = (value: number | "") => {
        if (value === "") return "";

        return new Intl.NumberFormat("es-CO", {
            maximumFractionDigits: 0,
        }).format(value);
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

        const amount = Number(form.amount);
        const interestRate = Number(form.interestRate);
        const termValue = Number(form.termValue);

        const simulation = calculateLoanSimulation({
            ...form,
            amount,
            interestRate,
            termValue,
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

    return (
        <Box sx={{ width: "100%" }}>
            <PageHeader
                title="Simulador de préstamos"
                subtitle="Calcula el interés, los réditos generados, el total a pagar, el número de cuotas y el valor de cada cuota."
                actions={
                    <>
                        <Button
                            variant="outlined"
                            startIcon={<RestartAltOutlinedIcon />}
                            onClick={handleClearForm}
                            disabled={!hasFormChanges}
                            sx={{
                                borderRadius: "8px",
                                fontWeight: 700,
                                textTransform: "none",
                            }}
                        >
                            Limpiar
                        </Button>

                        <Button
                            variant="contained"
                            startIcon={<CalculateOutlinedIcon />}
                            onClick={handleSimulate}
                            sx={{
                                borderRadius: "8px",
                                fontWeight: 700,
                                textTransform: "none",
                            }}
                        >
                            Calcular préstamo
                        </Button>
                    </>
                }
            />

            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: {
                        xs: "1fr",
                        md: "minmax(0, 1fr) 360px",
                    },
                    gap: 2,
                    alignItems: "start",
                }}
            >
                <Box
                    sx={{
                        display: "grid",
                        gap: 2,
                    }}
                >
                    <FormSection title="Información del préstamo">
                        <FormGrid
                            columns={{
                                xs: "1fr",
                                sm: "repeat(3, minmax(0, 1fr))",
                                md: "repeat(2, minmax(0, 1fr))",
                                lg: "repeat(3, minmax(0, 1fr))",
                            }}
                        >
                            <TextField
                                fullWidth
                                label="Monto prestado"
                                type="text"
                                required
                                value={formatNumberInput(form.amount)}
                                error={Boolean(errors.amount)}
                                helperText={errors.amount || " "}
                                onChange={(event) =>
                                    handleFormattedNumberChange(
                                        "amount",
                                        event.target.value
                                    )
                                }
                                sx={fieldStyle}
                            />

                            <TextField
                                fullWidth
                                label="% Interés"
                                type="number"
                                required
                                value={form.interestRate}
                                error={Boolean(errors.interestRate)}
                                helperText={errors.interestRate || " "}
                                onChange={(event) =>
                                    handleNumberChange(
                                        "interestRate",
                                        event.target.value
                                    )
                                }
                                sx={fieldStyle}
                            />

                            <ClearableSelect
                                label="Frecuencia del interés"
                                value={form.interestFrequency}
                                required
                                clearable
                                options={loanFrequencyOptions}
                                error={errors.interestFrequency}
                                onChange={(value) =>
                                    handleChange(
                                        "interestFrequency",
                                        value as LoanFrequency | ""
                                    )
                                }
                            />
                        </FormGrid>
                    </FormSection>

                    <FormSection title="Plazo del préstamo">
                        <FormGrid
                            columns={{
                                xs: "1fr",
                                md: "repeat(2, minmax(0, 1fr))",
                            }}
                        >
                            <TextField
                                fullWidth
                                label="Plazo"
                                type="number"
                                required
                                value={form.termValue}
                                error={Boolean(errors.termValue)}
                                helperText={errors.termValue || " "}
                                onChange={(event) =>
                                    handleNumberChange(
                                        "termValue",
                                        event.target.value
                                    )
                                }
                                sx={fieldStyle}
                            />

                            <ClearableSelect
                                label="Unidad del plazo"
                                value={form.termFrequency}
                                required
                                clearable
                                options={loanTermFrequencyOptions}
                                error={errors.termFrequency}
                                onChange={(value) =>
                                    handleChange(
                                        "termFrequency",
                                        value as LoanFrequency | ""
                                    )
                                }
                            />
                        </FormGrid>
                    </FormSection>

                    <FormSection title="Modalidad de pago">
                        <FormGrid
                            columns={{
                                xs: "1fr",
                                md: "repeat(3, minmax(0, 1fr))",
                            }}
                        >
                            <ClearableSelect
                                label="Frecuencia de pago"
                                value={form.paymentFrequency}
                                required
                                clearable
                                options={loanFrequencyOptions}
                                error={errors.paymentFrequency}
                                onChange={(value) =>
                                    handleChange(
                                        "paymentFrequency",
                                        value as LoanFrequency | ""
                                    )
                                }
                            />
                        </FormGrid>
                    </FormSection>
                </Box>

                <Box
                    sx={{
                        position: {
                            xs: "static",
                            lg: "sticky",
                        },
                        top: {
                            lg: 16,
                        },
                    }}
                >
                    <LoanSummaryCard result={result} />
                </Box>
            </Box>
        </Box>
    );
};

export default LoanSimulator;