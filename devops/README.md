# Devops

Instruction to run NMC Box in production and customize Nginx

## Running processes with Supervisor

```sh
# run the following in the root of the project so that %(ENV_PWD)s is set to path to root of the project
supervisord -c devops/neuromatch.supervisor.conf
```

This will run the following processes

- `supervisor-gatsby`: build and serve Gatsby frontend in port 9000
- `supervisor-fastapi`: serve backend FastAPI at port 8888
- `supervisor-elasticsearch`: serve Elasticsearch at port 9200

## Nginx

We use NGINX to reverse proxy of our services to the public. You can custom the configuration in `neuromatch.nginx.conf`.
To set up nginx, you can do the following:

```sh
sudo apt-get install nginx

# copy conf file to nginx configuration
sudo cp devops/neuromatch.nginx.conf /etc/nginx/conf.d/

# restart the service
sudo service nginx restart
```
