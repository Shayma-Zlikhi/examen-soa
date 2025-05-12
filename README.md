# Projet SOA et Microservices : System de gestion des clients
Ce projet implémente un système de gestion de clients en utilisant une architecture microservices avec :  
 • **API REST** pour les opérations CRUD sur les clients  
 • **API GraphQL** pour les requêtes avancées et les rapports  
 • **Kafka** pour la communication événementielle entre services  
 • **API Gateway** comme point d'entrée unifié  

 
## Architecture
[Client] → [API Gateway] → [Service REST] → Kafka ← [Service GraphQL]  

## Services
**1- Service Client (REST)**  
- Port : 3001
- Endpoints :  
 -- `POST /clients` - Créer un client  
 -- `GET /clients` - Lister tous les clients  
 -- `GET /clients/:id` - Obtenir les détails d'un client  
 -- `PUT /clients/:id` - Mettre à jour un client  
 -- `DELETE /clients/:id` - Supprimer un client
  
**2- Service Reporting (GraphQL)**  
- Port : 4000  
- Requêtes :  
 -- `clients` - Lister tous les clients  
 -- `client(id)` - Obtenir un client par ID  
 -- `clientsByName(name)` - Rechercher des clients par nom

**3- API Gateway**  
- Port : 3000  
- Routes :  
 -- `/api/*` - → Service REST  
 -- `/graphql` → Service GraphQL  

**3- Kafka**
- Topics :
 -- `client-creations`  
   -- `client-creations*`  
   -- `client-creations*`

## Mise en route
**1- Démarrer les services**  
`docker-compose up --build ` 

**2- Accéder aux services**  
- API Gateway : *http://localhost:3000*  
- API REST directement : *http://localhost:3001/clients*  
- GraphQL Playground : *http://localhost:4000/graphql*  

## Tester le système
- Créer un client (REST)  
- Interroger les clients (GraphQL)

## Développement
**Structure du projet**  
├── api-gateway/          # Service API Gateway  
├── client-service/       # Service API REST  
├── reporting-service/    # Service GraphQL  
├── kafka-config/        # Configuration Kafka  
├── docker-compose.yml    # Configuration Docker  
└── README.md            # Ce fichier  

**Variables d'environnement**  
| Service          |  Variables                                              |
|:-----------------|:--------------------------------------------------------|
| Kafka            | `KAFKA_ADVERTISED_LISTENERS`, `KAFKA_ZOOKEEPER_CONNECT` | 
| Service REST     |  `KAFKA_BROKERS=kafka:9092`                             |   
| Service GraphQL  | `KAFKA_BROKERS=kafka:9092`                              |    

## Dépannage
**1- Problèmes de connexion à Kafka :**  
- Attendre que Kafka soit complètement initialisé (peut prendre 1-2 minutes)  
- Vérifier les logs : `docker-compose logs kafka`  

**2- Dépendances entre services :**  
- Les services réessayent automatiquement les connexions à Kafka  
- Utiliser `docker-compose ps` pour vérifier l'état des services  

**3- Conflits de ports :**  
-Vérifier que les ports 3000, 3001, 4000 et 9092 sont disponibles
