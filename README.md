# Carllos Barbearia — Aplicativo de Gestão para Barbearia

> **Trabalho de Extensão Universitária**
> Disciplina: **PROGRAMAÇÃO PARA DISPOSITIVOS MÓVEIS EM ANDROID (305)**
> Curso: Análise e Desenvolvimento de Sistemas
> Período: 2026/1 (5°)

---

## Sobre o Projeto

O **Carllos Barbearia** é um aplicativo mobile desenvolvido como **projeto de extensão** da disciplina de Programação para Dispositivos Móveis em Android (código 305). O objetivo é aplicar, em um contexto real e útil para a comunidade, os conhecimentos adquiridos em sala — criando uma solução prática para uma barbearia local.

O aplicativo oferece uma plataforma completa de **gestão de agendamentos, barbeiros e serviços**, substituindo o controle feito em papel ou em aplicativos genéricos por uma ferramenta dedicada e intuitiva.

---

## Contexto da Extensão

A extensão universitária conecta o conhecimento acadêmico à prática social. Este projeto foi desenvolvido para atender às necessidades reais de uma barbearia de pequeno porte, demonstrando como o desenvolvimento mobile pode:

- Digitalizar processos manuais de agendamento;
- Reduzir erros operacionais e conflitos de horário;
- Fornecer métricas de desempenho ao gestor do negócio;
- Melhorar a experiência do profissional autônomo no dia a dia.

---

## Funcionalidades

### Dashboard (Início)

- Resumo do dia: total de agendamentos, concluídos, cancelados e pendentes;
- Receita do mês atual com indicador de variação;
- Próximos agendamentos em destaque;
- Acesso rápido para criar novo agendamento.

### Agenda

- Calendário interativo em português para navegação por data;
- Listagem de agendamentos com filtros por status: **Agendado**, **Concluído** e **Cancelado**;
- Criação, edição e exclusão de agendamentos;
- Campos: cliente, telefone, data, horário, barbeiro, serviço, preço e observações;
- Diálogo de confirmação antes de cancelar ou excluir;
- Animação de transição com `LayoutAnimation` no Android.

### Barbeiros

- Cadastro, edição e exclusão de barbeiros;
- Soft-delete: barbeiros com agendamentos vinculados são desativados em vez de excluídos;
- Estatísticas por barbeiro: total de agendamentos, receita gerada e número de clientes atendidos.

### Serviços

- Cadastro, edição e exclusão de serviços com nome e preço;
- Soft-delete: serviços com agendamentos vinculados são desativados em vez de excluídos.

### Tema Claro / Escuro

- Alternância automática conforme as configurações do sistema;
- Suporte manual via tela de configurações.

---

## Tecnologias Utilizadas

| Tecnologia              | Versão    | Finalidade                                 |
| ----------------------- | --------- | ------------------------------------------ |
| React Native            | 0.81.5    | Framework base para desenvolvimento mobile |
| Expo                    | ~54.0.33  | Plataforma e ferramentas de build          |
| Expo Router             | ~6.0.23   | Navegação baseada em sistema de arquivos   |
| TypeScript              | ~5.9.2    | Tipagem estática                           |
| AsyncStorage            | ^2.2.0    | Persistência de dados local                |
| React Native Calendars  | ^1.1314.0 | Componente de calendário interativo        |
| React Navigation        | ^7.4.0    | Navegação por abas                         |
| Expo Vector Icons       | ^15.0.3   | Ícones (Ionicons)                          |
| React Native Reanimated | ~4.1.1    | Animações de interface                     |

---

## Arquitetura do Projeto

```
meu-app/
 app/
    _layout.tsx          # Layout raiz (Provider de temas e dados)
    modal.tsx            # Tela modal genérica
    settings.tsx         # Configurações (tema)
    (tabs)/
        _layout.tsx      # Navegação por abas
        index.tsx        # Dashboard
        agenda.tsx       # Gestão de agendamentos
        barbeiros.tsx    # Gestão de barbeiros
        servicos.tsx     # Gestão de serviços
 components/
    AppointmentCard.tsx  # Card de agendamento
    modals/              # Formulários modais (Agendamento, Barbeiro, Serviço)
    ui/                  # Componentes reutilizáveis (Button, Card, Input, etc.)
 constants/
    theme.ts             # Design tokens (cores, espaçamentos, tipografia)
 contexts/
    AppDataContext.tsx   # Estado global (agendamentos, barbeiros, serviços)
    ThemeContext.tsx     # Estado global de tema
 hooks/
    useAppData.ts        # Hook de acesso ao contexto de dados
 lib/
    date.ts              # Utilitários de data
    storage.ts           # Abstração do AsyncStorage
 types/
     index.ts             # Tipos e interfaces (Appointment, Barber, Service)
```

---

## Modelo de Dados

### `Appointment` (Agendamento)

```ts
interface Appointment {
  id: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  clientName: string;
  phone?: string;
  serviceId: string;
  barberId: string;
  price: number;
  status: AppointmentStatus; // "scheduled" | "done" | "cancelled"
  notes?: string;
  createdAt: string;
}
```

### `Barber` (Barbeiro)

```ts
interface Barber {
  id: string;
  name: string;
  active: boolean;
  createdAt: string;
}
```

### `Service` (Serviço)

```ts
interface Service {
  id: string;
  name: string;
  price: number;
  active: boolean;
  createdAt: string;
}
```

---

## Como Executar

### Pré-requisitos

- Node.js 18+
- npm ou yarn
- Expo Go instalado no dispositivo Android **ou** Android Studio (emulador)

### Passo a passo

1. **Clone ou baixe o repositório** e acesse a pasta do projeto:

   ```bash
   cd meu-app
   ```

2. **Instale as dependências:**

   ```bash
   npm install
   ```

3. **Inicie o servidor de desenvolvimento:**

   ```bash
   npx expo start
   ```

4. **Execute no Android:**
   - **Dispositivo físico:** escaneie o QR Code com o aplicativo **Expo Go**;
   - **Emulador:** pressione `a` no terminal para abrir no emulador Android.

---

## Scripts Disponíveis

| Comando           | Descrição                            |
| ----------------- | ------------------------------------ |
| `npm start`       | Inicia o servidor Expo               |
| `npm run android` | Abre diretamente no emulador Android |
| `npm run ios`     | Abre no simulador iOS (macOS)        |
| `npm run web`     | Abre versão web no navegador         |
| `npm run lint`    | Executa o linter (ESLint)            |

---

## Aprendizados e Competências Desenvolvidas

Este projeto consolidou as seguintes competências da disciplina de **Programação para Dispositivos Móveis em Android (305)**:

- Criação de interfaces nativas com **React Native** e **StyleSheet**;
- Navegação entre telas com **Expo Router** (file-based routing) e **React Navigation**;
- Gerenciamento de estado global com **React Context API**;
- Persistência de dados local com **AsyncStorage**;
- Componentização e reutilização de componentes;
- Utilização de hooks personalizados (`useAppData`, `useTheme`);
- Animações de interface com `LayoutAnimation` e `Reanimated`;
- Suporte a temas claro e escuro;
- Tipagem de dados com **TypeScript**;
- Boas práticas de UX para dispositivos móveis Android.

---

## Licença

Este projeto foi desenvolvido exclusivamente para fins acadêmicos e de extensão universitária.
