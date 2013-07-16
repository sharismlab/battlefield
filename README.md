# Battlefield

The battlefield for data journalism
Real-time analytics

## Test the battlefield

    git clone https://github.com/sharismlab/battlefield.git

    cd news-crawler && npm install & cd ..
    bash news-crawler/demo/urls.sh
    # exec "${CUR}/news-crawler/node_modules/camel/bin/camel" "${CUR}/news-crawler/scripts/news-crawler.coffee"

    cd weibo-crawler && npm install & cd ..
    cp weibo-crawler/config/weibo.coffee.sample weibo-crawler/config/weibo.coffee
    # fill credentials
    # exec "${CUR}/weibo-crawler/node_modules/camel/bin/camel" "${CUR}/weibo-crawler/scripts/weibo-crawler.coffee"

    # run server
    nginx -p ${CUR} -c ${CUR}/nginx-conf/nginx.conf
    
    # run elastic search on default 9200
    sudo service elasticsearch start

    # sandbox
    bash sandbox/*.sh # add search index queue
    bash curl.sh # check elastic search


## Setup on Ubuntu 12.04

### Basics

    sudo apt-get -y install build-essential libssl-dev curl git redis-server
    apt-get upgrade

### Node

    cd
    git clone git://github.com/creationix/nvm.git
    . ~/nvm/nvm.sh

    nvm install v0.8.8
    nvm use v0.8.8
    nvm alias default v0.8.8

### Nginx

    # install latest version
    sudo apt-get install python-software-properties
    sudo add-apt-repository ppa:nginx/stable
    sudo apt-get update
    sudo apt-get install nginx
    sudo service nginx start

 
### Elastic Search

    wget https://download.elasticsearch.org/elasticsearch/elasticsearch/elasticsearch-0.90.0.deb
    sudo dpkg -i elasticsearch-0.90.0.deb
    sudo service elasticsearch start
