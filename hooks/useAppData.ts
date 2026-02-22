/**
 * useAppData
 *
 * Re-exporta o hook de acesso ao AppDataContext.
 * A lógica completa reside em @/contexts/AppDataContext.
 * Ao usar um contexto compartilhado, todas as abas reagem
 * imediatamente a qualquer alteração nos dados.
 */
export { useAppDataContext as useAppData } from "@/contexts/AppDataContext";
