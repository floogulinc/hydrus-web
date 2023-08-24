<div align="center">
<img src="https://raw.githubusercontent.com/floogulinc/hydrus-web/master/src/assets/icon.svg?sanitize=true" alt="Hydrus Web Icon" width="150"/>
<h1> Hydrus Web </h1>

Hydrus web is a web client for [Hydrus](https://hydrusnetwork.github.io/hydrus/)

</div>
<div align="center">
<br>
<img src="https://user-images.githubusercontent.com/1300395/92695467-1c69aa00-f30e-11ea-844e-5ea80cfe6fcb.png" width="40%" />
<img src="https://user-images.githubusercontent.com/1300395/92695470-1d024080-f30e-11ea-8eb9-ae3b36bfdbe3.png" width="40%" />

</div>

## Usage

### hydrus.app

[hydrus.app](https://hydrus.app/) is the recommended way to use Hydrus Web. It will always be the latest stable version (latest commit on the `master` branch) of Hydrus Web. It is automatically deployed with [Vercel](https://vercel.com/).

The latest development build (latest commit on the `dev` branch) can be found at [dev.hydrus.app](https://dev.hydrus.app/).

### Docker

A [Docker image](https://github.com/floogulinc/hydrus-web/pkgs/container/hydrus-web) is provided for Hydrus Web. 

It hosts Hydrus Web on port 80 using nginx. Hydrus Web needs to be hosted with valid HTTPS unless it is only being used on `localhost`. The Docker image is meant to be used with some proxy that can provide HTTPS (like Caddy or Traefik).

You may also want to run [Hydrus on Docker](https://hydrusnetwork.github.io/hydrus/docker.html).

## Hydrus API HTTPS

Unless you are opening Hydrus Web on the same device the Hydrus client is running on, you will need to make its API available with valid HTTPS. This will likely mean running some form of reverse proxy.

There are some guides on doing this on the [wiki](https://github.com/floogulinc/hydrus-web/wiki).

## Hydrus Version Support

The minimum versions of the Hydrus client for Hydrus Web are:

- Stable branch ([hydrus.app](https://hydrus.app/)): v500
- Dev branch ([dev.hydrus.app](https://dev.hydrus.app/)): v500
- 1.0.0+: v500
- [v0.3.2](https://github.com/floogulinc/hydrus-web/releases/tag/v0.3.2): v357 (fewer features will work with older versions)

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
