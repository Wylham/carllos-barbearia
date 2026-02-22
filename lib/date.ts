// ─── Dinheiro ─────────────────────────────────────────────────────────────────

/** Formata número como moeda brasileira. Ex: 35 → "R$ 35,00" */
export function formatMoney(value: number): string {
  return `R$ ${value.toFixed(2).replace(".", ",")}`;
}

// ─── Datas ISO (YYYY-MM-DD) ───────────────────────────────────────────────────

/** Converte Date para string no formato YYYY-MM-DD. */
export function toISODate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Retorna a data de hoje no formato YYYY-MM-DD. */
export function todayISO(): string {
  return toISODate(new Date());
}

/** Verifica se uma string YYYY-MM-DD é o mesmo dia que um objeto Date. */
export function isSameDay(dateStr: string, date: Date): boolean {
  return dateStr === toISODate(date);
}

/**
 * Verifica se uma string YYYY-MM-DD pertence ao ano/mês informados.
 * @param month 0-based (como Date.getMonth())
 */
export function isSameMonth(dateStr: string, year: number, month: number): boolean {
  const [y, m] = dateStr.split("-").map(Number);
  return y === year && m === month + 1;
}

// ─── Formatação de exibição ───────────────────────────────────────────────────

/** YYYY-MM-DD → DD/MM/YYYY */
export function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split("-");
  return `${day}/${month}/${year}`;
}

/** Retorna o nome do mês em português. @param month 0-based */
export function monthName(month: number): string {
  const names = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];
  return names[month] ?? "";
}

/** Retorna o dia da semana abreviado (Dom, Seg, ...) a partir de YYYY-MM-DD. */
export function weekdayShort(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  const names = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  return names[date.getDay()] ?? "";
}

/** HH:MM — já está formatado, apenas retorna como está. */
export function formatTime(timeStr: string): string {
  return timeStr;
}

/**
 * Combina data YYYY-MM-DD + hora HH:MM em um objeto Date local.
 * Útil para comparações de conflito de horário.
 */
export function combineDatetime(dateStr: string, timeStr: string): Date {
  const [y, mo, d] = dateStr.split("-").map(Number);
  const [h, min] = timeStr.split(":").map(Number);
  return new Date(y, mo - 1, d, h, min);
}
