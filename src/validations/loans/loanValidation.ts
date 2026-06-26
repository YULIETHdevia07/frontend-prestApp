import * as yup from "yup";

export const loanSimulationSchema = yup.object({
    amount: yup
        .number()
        .transform((value, originalValue) =>
            originalValue === "" ? undefined : value
        )
        .typeError("El monto prestado debe ser un número válido.")
        .required("El monto prestado es obligatorio.")
        .positive("El monto prestado debe ser mayor a 0."),

    interestRate: yup
        .number()
        .transform((value, originalValue) =>
            originalValue === "" ? undefined : value
        )
        .typeError("El porcentaje de interés debe ser un número válido.")
        .required("El porcentaje de interés es obligatorio.")
        .positive("El porcentaje de interés debe ser mayor a 0."),

    interestFrequency: yup
        .string()
        .oneOf(
            ["DAILY", "WEEKLY", "BIWEEKLY", "MONTHLY"],
            "Selecciona una frecuencia del interés válida."
        )
        .required("La frecuencia del interés es obligatoria."),

    termValue: yup
        .number()
        .transform((value, originalValue) =>
            originalValue === "" ? undefined : value
        )
        .typeError("El plazo debe ser un número válido.")
        .required("El plazo es obligatorio.")
        .positive("El plazo debe ser mayor a 0."),

    termFrequency: yup
        .string()
        .oneOf(
            ["DAILY", "WEEKLY", "BIWEEKLY", "MONTHLY"],
            "Selecciona una unidad del plazo válida."
        )
        .required("La unidad del plazo es obligatoria."),

    paymentFrequency: yup
        .string()
        .oneOf(
            ["DAILY", "WEEKLY", "BIWEEKLY", "MONTHLY"],
            "Selecciona una frecuencia de pago válida."
        )
        .required("La frecuencia de pago es obligatoria."),
});