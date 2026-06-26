import {
    Box,
    Button,
    TextField,
} from "@mui/material";

import CalculateOutlinedIcon from "@mui/icons-material/CalculateOutlined";
import RestartAltOutlinedIcon from "@mui/icons-material/RestartAltOutlined";

import PageHeader from "../components/common/PageHeader";
import FormSection from "../components/common/FormSection";
import FormGrid from "../components/common/FormGrid";
import ClearableSelect from "../components/common/ClearableSelect";
import LoanSummaryCard from "../components/loans/LoanSummaryCard";

import type { LoanFrequency } from "../interfaces/loans/loan.interface";

import {
    loanFrequencyOptions,
    loanTermFrequencyOptions,
} from "../data/loanOptions";

import { formatNumberInput } from "../utils/common/numberUtils";
import { useLoanSimulator } from "../hooks/loans/useLoanSimulator";

// Página principal del simulador de préstamos.
const LoanSimulator = () => {
    const {
        form,
        result,
        errors,
        hasFormChanges,

        handleChange,
        handleNumberChange,
        handleFormattedNumberChange,
        handleSimulate,
        handleClearForm,
    } = useLoanSimulator();

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
                                helperText={errors.amount}
                                onChange={(event) =>
                                    handleFormattedNumberChange(
                                        "amount",
                                        event.target.value
                                    )
                                }
                            />

                            <TextField
                                fullWidth
                                label="% Interés"
                                type="number"
                                required
                                value={form.interestRate}
                                error={Boolean(errors.interestRate)}
                                helperText={errors.interestRate}
                                onChange={(event) =>
                                    handleNumberChange(
                                        "interestRate",
                                        event.target.value
                                    )
                                }
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
                                helperText={errors.termValue}
                                onChange={(event) =>
                                    handleNumberChange(
                                        "termValue",
                                        event.target.value
                                    )
                                }
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