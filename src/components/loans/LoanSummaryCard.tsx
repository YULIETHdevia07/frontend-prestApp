import { Box, Divider, Paper, Typography } from "@mui/material";

import type { LoanSimulationResult } from "../../interfaces/loans/loan.interface";

import {
    formatCurrency,
    getLoanFrequencyLabel,
} from "../../utils/loans/loanCalculator";

interface LoanSimulationResultCardProps {
    result: LoanSimulationResult | null;
}

// Tarjeta lateral para mostrar el resultado de la simulación del préstamo.
const LoanSummaryCard = ({ result }: LoanSimulationResultCardProps) => {
    if (!result) {
        return (
            <Paper
                elevation={0}
                sx={{
                    borderRadius: "8px",
                    overflow: "hidden",
                    backgroundColor: "background.paper",
                    boxShadow: "0 4px 14px rgba(15, 23, 42, 0.08)",
                }}
            >
                <Box
                    sx={{
                        px: 2,
                        py: 1.2,
                        borderBottom: "1px solid",
                        borderColor: "divider",
                    }}
                >
                    <Typography
                        variant="subtitle1"
                        sx={{
                            fontWeight: 700,
                            color: "text.primary",
                        }}
                    >
                        Resultado de la simulación
                    </Typography>
                </Box>

                <Box sx={{ p: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                        Ingresa los datos del préstamo y presiona calcular préstamo.
                    </Typography>
                </Box>
            </Paper>
        );
    }

    const interestText = `${result.interestRate}% ${getLoanFrequencyLabel(
        result.interestFrequency
    ).toLowerCase()}`;

    return (
        <Paper
            elevation={0}
            sx={{
                borderRadius: "8px",
                overflow: "hidden",
                backgroundColor: "background.paper",
                boxShadow: "0 4px 14px rgba(15, 23, 42, 0.08)",
            }}
        >
            <Box
                sx={{
                    px: 2,
                    py: 1.2,
                    borderBottom: "1px solid",
                    borderColor: "divider",
                }}
            >
                <Typography
                    variant="subtitle1"
                    sx={{
                        fontWeight: 700,
                        color: "text.primary",
                    }}
                >
                    Resultado de la simulación
                </Typography>
            </Box>

            <Box sx={{ p: 2 }}>
                <Typography
                    variant="body2"
                    sx={{
                        color: "text.secondary",
                        mb: 0.5,
                    }}
                >
                    Total a pagar
                </Typography>

                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: 800,
                        color: "primary.main",
                        mb: 2,
                    }}
                >
                    {formatCurrency(result.totalToPay)}
                </Typography>

                <Divider sx={{ mb: 2 }} />

                <Box
                    sx={{
                        display: "grid",
                        gap: 1.4,
                    }}
                >
                    <ResultRow
                        label="Monto prestado"
                        value={formatCurrency(result.amount)}
                    />

                    <ResultRow label="Interés" value={interestText} />

                    <ResultRow
                        label="Réditos generados"
                        value={formatCurrency(result.totalInterest)}
                    />

                    <ResultRow
                        label="Tiempo total"
                        value={`${result.totalDays} días`}
                    />

                    <ResultRow
                        label="Número de cuotas"
                        value={`${result.installments}`}
                    />

                    <ResultRow
                        label="Valor por cuota"
                        value={formatCurrency(result.installmentValue)}
                    />
                </Box>
            </Box>
        </Paper>
    );
};

interface ResultRowProps {
    label: string;
    value: string;
}

const ResultRow = ({ label, value }: ResultRowProps) => {
    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "space-between",
                gap: 2,
                alignItems: "center",
            }}
        >
            <Typography
                variant="body2"
                sx={{
                    color: "text.secondary",
                }}
            >
                {label}
            </Typography>

            <Typography
                variant="body2"
                sx={{
                    fontWeight: 700,
                    color: "text.primary",
                    textAlign: "right",
                }}
            >
                {value}
            </Typography>
        </Box>
    );
};

export default LoanSummaryCard;