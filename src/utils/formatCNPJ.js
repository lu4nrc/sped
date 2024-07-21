export default function formatarCNPJ(cnpj) {
    // Remove todos os caracteres não numéricos
    cnpj = cnpj.replace(/\D/g, '');

    // Verifica se o CNPJ tem 14 dígitos
    if (cnpj.length !== 14) {
        throw new Error("O CNPJ deve conter 14 dígitos.");
    }

    // Formata o CNPJ
    return `${cnpj.slice(0, 2)}.${cnpj.slice(2, 5)}.${cnpj.slice(5, 8)}/${cnpj.slice(8, 12)}-${cnpj.slice(12, 14)}`;
}