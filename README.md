### Checklist do App de Controle de Estoque de Oficina de Moto

## Funcionalidades

[] Cadastro de itens

[] Nome do item

[] Quantidade

[] Descrição

[] Código de barras

[] Controle de estoque

[] Adicionar quantidade de um item

[] Remover quantidade de um item

[] Cadastrar automaticamente se não existir

## Pesquisa

[] Barra de pesquisa por nome

[] Barra de pesquisa por código de barras

[] Código de barras e imagens

[] Escanear código de barras com a câmera

[] Verificar se o item já existe

[] Buscar automaticamente imagem do item na internet

## Tecnologias

 []React Native + Expo

[] Banco de dados local (SQLite ou AsyncStorage)

[] Scanner de código de barras (expo-barcode-scanner)

[] Busca de imagens via API externa (Unsplash, Bing Image Search, etc.)

## categorias itens 

## 1.Óleo e lubrificante

Óleo do motor, transmissão, graxa, spray lubrificante

## 2.Bateria e elétrica

Baterias, lâmpadas, fusíveis, cabos e conectores

## 3.Freios e suspensão

Pastilhas, discos de freio, óleo de freio, amortecedores

## 4.Filtros e peças mecânicas

Filtros de óleo, ar e combustível, velas, correias, correntes, rolamentos

## 5.Acessórios

Espelhos, guidões, carenagens, protetores

## 6.Consumíveis/Rápidos (opcional)

Parafusos, porcas, arruelas, abraçadeiras, panos, sprays de limpeza

## Regras de Segurança do Firebase Storage

Para que o upload de imagens funcione corretamente durante o desenvolvimento, configure as regras do Storage no console do Firebase da seguinte maneira:

### Opção 1: Modo de Desenvolvimento (Somente para testes)
Permite que qualquer pessoa faça upload e leitura (útil se você ainda não implementou o login no app):

```
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if true;
    }
  }
}
```

### Opção 2: Modo Seguro (Produção)
Exige que o usuário esteja autenticado no App para fazer upload:

```
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```
**Importante:** Se usar o Modo Seguro, certifique-se de que o usuário fez login (mesmo que anônimo) antes de tentar enviar a imagem.

## Regras de Segurança do Firestore (Banco de Dados)

Se você receber o erro `Missing or insufficient permissions` ao buscar ou salvar produtos, configure as regras do **Firestore Database** assim:

### Opção 1: Modo de Desenvolvimento (Somente para testes)
Permite leitura e escrita para todos:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

### Opção 2: Modo Seguro
Exige autenticação:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```