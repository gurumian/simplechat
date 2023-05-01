# simplechat


## prerequisites

### How to install mosquitto

```
sudo apt install nginx libssl-dev libcjson-dev libxslt1-dev
```

To enable the `websocket` on `mosquitto`,
It might need to build from the source to enable it.
```
git clone https://github.com/warmcat/libwebsockets.git
cd libwebsockets
mkdir build
cmake .. -DLWS_WITH_EXTERNAL_POLL=ON
make
sudo make install
```

```
cd $HOME
git clone https://github.com/eclipse/mosquitto.git
cd mosquitto
make WITH_WEBSOCKETS=yes
sudo make install
```


### How to setup nginx for https
```
sudo certbot --nginx -d <YOUR-DOMAIN>
```

update `/etc/nginx/sites-available/default`
```
        location /chat/ {
                proxy_pass http://127.0.0.1:10089/;
        }

        location /mqtt/websocket {
                proxy_pass http://127.0.0.1:9001/;
                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection "upgrade";
        }
```

## How to build and run
```
npm i
npm run build
npm run start
```






## On m1 macOS

- In Host
```
multipass launch -c8 -m8G -d40G -nbuilder
multipass exec builder -- sudo lxd init --auto
multipass mount $HOME/workspace/simplechat builder:/home/ubuntu/workspace/simplechat
```

Open a multipass shell.

```
npm run build
```

- In multipass inside
```
snapcraft --use-lxd
```



## snap package
```
snapcraft
```

## install the snap package 
```
sudo snap install --devmode --dangerous dronepad_0.1_amd64.snap
sudo snap start dronepad
```

## To stop the service,
```
snap stop --disable dronepad
```
