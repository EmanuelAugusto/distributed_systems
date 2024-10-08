
### Sistemas distribuidos

Exemplo de uma aplicação de tradução de texto distribuida em vários serviços.

Serviços:

- hello-world-api: responsável por recuperar e listar as traduções do usuário

- hello-world-front: SPA construido com vuejs para interface do usuário

- hello-world-socket: camada de socket para fornecer comunicação em tempo real entre os serviços

- hello-world-translate-service: serviço que opera com pub/sub(REDIS) responsável por fazer a operação de tradução conectando a serviçoes externos

- hello-world-auth: serviço de autenticação.


```bash
kubectl port-forward service/redis  6378:6379
kubectl port-forward service/helloworldapi 3001:3000
kubectl port-forward service/helloworldauth 3002:3005
kubectl port-forward service/helloworldsocket 3003:3001

eval $(minikube docker-env)

minikube addons enable metrics-server


minikube image load ${imagename}
```