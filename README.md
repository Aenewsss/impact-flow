# Aenewsss Impact Flow

O **Aenewsss Impact Flow** é um projeto que oferece um editor de fluxos interativos integrado ao Firebase e com suporte à geração automática de fluxos via IA. Ele permite a criação, visualização e persistência de diagramas de fluxo, além de gerenciar planos de usuários e integrações com serviços externos como Stripe para pagamentos.

---

## 🚀 Funcionalidades Principais

### Editor de Fluxos
- Criação e manipulação de nós e conexões em um editor visual.
- Persistência dos fluxos no Firebase Realtime Database.
- Importação e exportação de fluxos via JSON.

### Gerenciamento de Usuários
- Operações CRUD para usuários no Firebase.
- Controle de planos (free e premium) via enumeração.

### Integrações Externas
- **Firebase**: Autenticação e banco de dados em tempo real.
- **Stripe**: Processamento de pagamentos e webhooks para atualização de planos.
- **Groq API**: Geração automática de fluxos via IA.

### UI/UX
- Temas dark/light com persistência no localStorage.
- Notificações toast para feedback ao usuário.
- Interface responsiva e personalizável com Tailwind CSS.

---

## 📁 Arquivos Importantes

| Arquivo               | Descrição                                                                 |
|-----------------------|---------------------------------------------------------------------------|
| `next.config.ts`      | Configuração básica do Next.js.                                           |
| `tailwind.config.ts`  | Configuração do Tailwind CSS para estilização.                           |
| `user.service.ts`     | Serviço para operações CRUD de usuários no Firebase.                     |
| `impact.service.ts`   | Gerenciamento de fluxos e conexões no Firebase, integrado com ReactFlow. |
| `theme.store.ts`      | Gerenciamento de tema (dark/light) com Zustand.                          |
| `nodes.store.ts`      | Estado global de nós e arestas em um fluxo ReactFlow.                    |
| `edges-store.ts`      | Estado de conexões (edges) usando Zustand.                               |
| `plan.enum.ts`        | Definição dos tipos de planos (free e premium).                          |
| `firebase.ts`         | Configuração e inicialização dos serviços Firebase.                      |
| `show-toast.util.ts`  | Utilitário para exibição de notificações toast.                          |
| `layout.tsx`          | Componente raiz da aplicação, configurando fontes e provedores.          |
| `page.tsx`            | Editor de fluxo interativo com integração Firebase e IA.                 |
| `pagamento/page.tsx`  | Página de confirmação de pagamento.                                      |
| `api/stripe/checkout/route.ts` | Endpoint para criação de sessões de checkout no Stripe.          |
| `api/stripe/webhook/route.ts`  | Webhook para atualização de planos após checkout no Stripe.      |

---

## 🛠️ Instalação e Execução

### Pré-requisitos
- Node.js (versão recomendada: 16+)
- Yarn ou npm
- Conta no Firebase e Stripe (para integrações)

### Passos para Execução
1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/Aenewsss_impact-flow.git
   cd Aenewsss_impact-flow
   ```

2. Instale as dependências:
   ```bash
   yarn install
   # ou
   npm install
   ```

3. Configure as variáveis de ambiente:
   - Crie um arquivo `.env.local` na raiz do projeto.
   - Adicione as credenciais do Firebase e Stripe:
     ```env
     NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
     NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
     NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
     NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
     NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
     NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
     STRIPE_SECRET_KEY=your-stripe-secret-key
     STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret
     ```

4. Inicie o servidor de desenvolvimento:
   ```bash
   yarn dev
   # ou
   npm run dev
   ```

5. Acesse a aplicação em:
   ```bash
   http://localhost:3000
   ```

---

## 🔌 Dependências Externas

- **Firebase**: Para autenticação e banco de dados em tempo real.
- **Stripe**: Para processamento de pagamentos e assinaturas.
- **ReactFlow**: Para a criação e manipulação de fluxos interativos.
- **Tailwind CSS**: Para estilização da interface.
- **Zustand**: Para gerenciamento de estado global.
- **react-toastify**: Para exibição de notificações toast.

---

## 📜 Licença

Este projeto está sob a licença MIT. Consulte o arquivo `LICENSE` para mais informações.

---

## 🤝 Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou enviar pull requests. Certifique-se de seguir as diretrizes de contribuição do projeto.