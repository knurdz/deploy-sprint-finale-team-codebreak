FROM node:20-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# VITE_WEB3FORMS_ACCESS_KEY is a client-side form key by design (see T10) —
# it ends up in the built JS bundle intentionally, the same as in CI. It never
# reaches the final nginx stage below, since only /app/dist is copied forward.
ARG VITE_PUBLIC_URL
ARG VITE_WEB3FORMS_ACCESS_KEY
ARG GITHUB_SHA
ARG TEAM_NAME=codebreak
ENV VITE_PUBLIC_URL=${VITE_PUBLIC_URL} \
    VITE_WEB3FORMS_ACCESS_KEY=${VITE_WEB3FORMS_ACCESS_KEY} \
    GITHUB_SHA=${GITHUB_SHA} \
    TEAM_NAME=${TEAM_NAME}

RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://localhost/health/ || exit 1
