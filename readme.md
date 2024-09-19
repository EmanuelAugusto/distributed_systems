
### Sistemas distribuidos

Exemplo de uma aplicação de tradução de texto distribuida em vários serviços.

Serviços:

- hello-world-api: responsável por recuperar e listar as traduções do usuário

- hello-world-front: SPA construido com vuejs para interface do usuário

- hello-world-socket: camada de socket para fornecer comunicação em tempo real entre os serviços

- hello-world-translate-service: serviço que opera com pub/sub(REDIS) responsável por fazer a operação de tradução conectando a serviçoes externos