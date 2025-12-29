# 🏍️ Branco Motos - Gerenciamento de Estoque

Um aplicativo móvel robusto desenvolvido para o gerenciamento eficiente de estoque de peças e acessórios para motocicletas. O aplicativo permite o cadastro de produtos via leitura de código de barras, controle de quantidades e organização por categorias.

## 🚀 Tecnologias Utilizadas

O projeto foi construído utilizando as tecnologias mais modernas do ecossistema mobile:

*   **[React Native](https://reactnative.dev/)** - Framework principal para o desenvolvimento.
*   **[Expo (SDK 52)](https://expo.dev/)** - Plataforma para agilizar o desenvolvimento e builds nativos.
*   **[TypeScript](https://www.typescriptlang.org/)** - Linguagem para garantir tipagem estática e maior segurança no código.
*   **[React Navigation v7](https://reactnavigation.org/)** - Gerenciamento de rotas e navegação fluida entre telas.
*   **[Firebase](https://firebase.google.com/)** - Infraestrutura de Backend-as-a-Service (Analytics, Database e Storage).
*   **[Async Storage](https://react-native-async-storage.github.io/async-storage/)** - Persistência de dados local para funcionamento offline.
*   **[EAS (Expo Application Services)](https://expo.dev/eas)** - Utilizado para a geração do build Android (`.apk`).

## ✨ Funcionalidades

*   🔍 **Busca Inteligente**: Pesquisa de produtos por nome ou código de barras.
*   📸 **Scanner de Código de Barras**: Cadastro rápido utilizando a câmera do dispositivo através do `expo-camera`.
*   📦 **Controle de Estoque**: Gerenciamento detalhado de quantidades com indicadores visuais de itens esgotados.
*   🏷️ **Organização por Categorias**: Segmentação de itens (Óleos, Freios, Baterias, Filtros, Acessórios).
*   🖼️ **Galeria de Imagens**: Suporte para fotos dos produtos via `expo-image-picker`.
*   🎨 **Design Moderno**: Interface intuitiva e responsiva adaptada para Android.

## 🛠️ Ferramentas e Configuração

*   **EAS Build**: Configurado com perfis de `preview` e `production` para distribuição facilitada.
*   **Expo Fingerprint**: Garantia de consistência no ambiente nativo.
*   **Firebase Integration**: Configurado para análise de dados e suporte a armazenamento em nuvem.

## 📦 Como rodar o projeto

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/seu-usuario/App_Branco_Motos.git
    ```
2.  **Instale as dependências:**
    ```bash
    npm install
    ```
3.  **Inicie o ambiente Expo:**
    ```bash
    npx expo start
    ```
4.  **Para gerar um novo build:**
    ```bash
    eas build -p android --profile preview
    ```

---

Desenvolvido por **Alison Alves** 🚀
