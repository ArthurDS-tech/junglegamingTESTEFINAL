# Construix Landing Page

Landing page em React + TypeScript + Vite para uma marca de construcao premium. O foco e uma Hero cinematografica, transicoes suaves e uma estrutura de componentes simples de manter.

## Stack

- React 18
- TypeScript
- Vite
- CSS global em `src/index.css`
- Framer Motion para a topbar animada
- GSAP + ScrollTrigger para a timeline com snap scroll e profundidade 3D
- Lucide React para os icones

## Estrutura do frontend

```txt
src/
  App.tsx
  main.tsx
  index.css
  components/
    IntroSection.tsx
    BuildTimelineSection.tsx
    StatsSection.tsx
    ui/
      navigation-menu.tsx
  lib/
    utils.ts
public/
  images/
  favicon.svg
```

## Como a pagina e organizada

- `src/App.tsx` monta a pagina inteira e conecta as secoes.
- `src/components/ui/navigation-menu.tsx` controla a topbar fixa com animacao no scroll.
- `src/components/IntroSection.tsx` renderiza a secao introdutoria com imagem e CTA.
- `src/components/BuildTimelineSection.tsx` exibe a timeline com etapas navegaveis e animacao em scroll.
- `src/components/StatsSection.tsx` mostra as metricas da marca em formato de cards.
- `src/index.css` concentra o design system, responsividade e animacoes de entrada.
- `src/lib/utils.ts` fornece o helper `cn` para combinar classes.

## Design system

- Fundo escuro: `#0b0f10`, `#141414`, `#161616`
- Destaque: laranja / amber
- Titulos: branco
- Texto secundario: cinza claro
- Bordas arredondadas em imagens e cards
- Labels pequenos em uppercase com tracking amplo

## Assets

Os assets principais ficam em `public/images`:

- `hero-excavator.jpg`
- `excavator-cutout.png`
- `image.png`
- `build-foundations.png`
- `build-structure.png`

## Scripts

- `npm run dev` - ambiente de desenvolvimento
- `npm run build` - build de producao
- `npm run lint` - lint do projeto
- `npm run typecheck` - validacao TypeScript
- `npm run preview` - preview do build

## Setup local

1. Instale as dependencias com `npm install`.
2. Rode `npm run dev`.
3. Abra a aplicacao e confira a Hero, a topbar e as secoes abaixo.

## Observacoes de arquitetura

- O layout foi pensado para mobile first.
- A topbar reage ao scroll com animacao leve.
- As secoes abaixo da Hero usam reveal progressivo no scroll.
- As imagens carregam com `loading="lazy"` onde faz sentido.
