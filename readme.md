# On Demand

l'application on demand est composée de d'un front end Angular et d'un backend Django.

## Installation

l'injection des des dependences peut se faire de deux façons:
### installation avec docker :

*  [docker](https://docs.docker.com/engine/install/)

se le placer a la racine du projet et lancer la commande

```bash
sudo docker-compose --up -d --build 
```

port utilisées :
* front-end : 80
* back-end : 8000
### installation native :

#### back-end : django
*  [pip](https://pip.pypa.io/en/stable/)

se le placer a la racine du projet et lancer la commande

```bash
cd django
pip install -r requirements.txt
python manage.py runserver 0.0.0.0:8000
```


#### front-end : angular
*  [Angular](https://angular.io/)

se le placer a la racine du projet et lancer la commande

```bash
cd angular
cd angular-app
npm install
ng serve
```

port utilisées :
* front-end : 4200
* back-end : 8000