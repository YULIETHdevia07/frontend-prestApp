// Elimina caracteres que no sean números.
export const cleanNumberInput = (value: string) => {
    return value.replace(/\D/g, "");
};

// Formatea un número para mostrarlo con separadores de miles.
export const formatNumberInput = (value: number | "") => {
    if (value === "") return "";

    return new Intl.NumberFormat("es-CO", {
        maximumFractionDigits: 0,
    }).format(value);
};