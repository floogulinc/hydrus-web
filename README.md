<div align="center">
<img src="https://raw.githubusercontent.com/floogulinc/hydrus-web/master/src/assets/icon.svg?sanitize=true" alt="Hydrus Web Icon" width="150"/>
<h1 style="border-bottom: 0px; margin-bottom: 0px"> Hydrus Web </h1>

[![Docker Hub build](https://img.shields.io/docker/cloud/build/floogulinc/hydrus-web.svg)](https://hub.docker.com/r/floogulinc/hydrus-web/)

Hydrus web is a web client for [Hydrus](https://hydrusnetwork.github.io/hydrus/)

</div>
<div align="center">
<br>
<img src="https://i.vgy.me/wkx8qQ.png" width="45%" />
<img src="https://i.vgy.me/8aMaai.png" width="45%" />

</div>

## Usage

### hydrus.app

[hydrus.app](https://hydrus.app/) is the recommended way to use Hydrus Web. It will always be the latest stable version (latest commit on the `master` branch) of Hydrus Web. It is automatically deployed with [ZEIT Now](https://zeit.co/).

The latest development build (latest commit on the `dev` branch) can be found at [dev.hydrus.app](https://dev.hydrus.app/).

### Docker

A [Docker image](https://hub.docker.com/r/floogulinc/hydrus-web) is provided for Hydrus Web. 

```sh
docker pull floogulinc/hydrus-web
```

It hosts Hydrus Web on port 80 using nginx. Hydrus Web needs to be hosted with valid HTTPS unless it is only being used on `localhost`. The Docker image is meant to be used with some proxy that can provide HTTPS (like Caddy or Traefik).

You may also want to run [Hydrus on Docker](https://hub.docker.com/r/suika/hydrus).

## Hydrus API HTTPS

Unless you are opening Hydrus Web on the same device the Hydrus client is running on, you will need to make its API available with valid HTTPS. This will likely mean running some form of reverse proxy.

### Caddy

I personally use [Caddy](https://caddyserver.com/) and have a subdomain pointed at my local network address that it can obtain a SSL certificate on with Let's Encrypt. This is what my `Caddyfile` looks like:

```caddyfile
https://1.8.local.floogulinc.com {
	proxy / 127.0.0.1:45869 # proxy the Hydrus client API
	gzip
	tls {
		dns cloudflare # Use TLS based verification for Let's Encrypt (need env variables set)
	}
}
```

Here is a different `Caddyfile` that proxies the API to `/hydrus` on a domain with a public IP:

```caddyfile
https://public.example.com {
	proxy /hydrus 127.0.0.1:45869 {
      without /hydrus
    }
	gzip
}
```

## Development

### Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

### Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

### Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

### Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

### Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
