
.PHONY: up
up:
	docker-compose up -d

.PHONY: down
down:
	docker-compose down

.PHONY: clean
clean:
	docker-compose down --volumes

.PHONY: build
build:
	docker-compose build


.PHONY: node-server-sh
node-server-sh:
	docker-compose exec node-server zsh

.PHONY: node-front-sh
node-front-sh:
	docker-compose exec node-front zsh
