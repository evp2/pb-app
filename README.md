# SvelteKit Template App

Use this example as a starting point for building a SvelteKit app. It uses many of the best practices to help avoid common pitfalls.

-  [SvelteKit](https://kit.svelte.dev) frontend is fully static, client-side only, so that here is no need
  for NodeJS at runtime. It is generated using
  [`adapter-static`](https://github.com/sveltejs/kit/tree/master/packages/adapter-static)
  and `ssr` is OFF.
- The backend is [PocketBase](https://pocketbase.io) and can be downloaded as a single binary (see Setup instructions below).

# Setup

Follow these steps CAREFULLY or else it won't work.

## With Docker

This is the recommended method for setting up this application in most use cases.

Make sure your Docker daemon is running then complete the following steps:

1. Open a new terminal and navigate to the `/frontend` directory. Install dependencies by
   running `npx pnpm install && npx pnpm run build`
2. Change to the root project directory and run `docker build -t app:latest .`

## With PocketBase binary

This method is a good alternative for simple use cases that don't use either Docker or Go, and instead uses JavaScript-exclusive customizations.

1. [Download the latest version of PocketBase.](https://github.com/pocketbase/pocketbase/releases/latest)
    - The versions support Darwin, Linux, and Windows. Make sure that you download the correct version that supports itself within the OS that you are using.
2. Extract the `pocketbase.exe` from the `.zip` file you downloaded into the `/backend` folder within your project.
3. Set up the backend
    - Open a new terminal, navigate to the `/frontend` directory and run the command `npm run backend`
        - _For Windows:_ You will have to edit the `"backend"` script in the `./frontend/package.json` file to `cd .. && cd backend && pocketbase serve --publicDir=../frontend/build`
        - _For Mac:_ _Please contribute_
4. Set up the frontend
    - Open a new terminal, navigate to the `/frontend` directory and run the following
        - First install dependencies using `npx pnpm install`
        - Then, `npm run dev`
5. Extend JavaScript by [checking out this documentation here.](https://pocketbase.io/docs/js-overview/).

## With Go Tools

This method works if you have Go Tools installed and want to set up the machine directly on your specific OS and you don't want to use Docker.

1. Verify that the Go compiler is installed on your machine by opening a terminal and running `go version`. If there is an error, set up the go compiler in acccordance with the type of OS you are using.
2. Make sure you `go.mod` file is ready to be built by navigating to the `/backend` directory and running `go mod tidy` in the terminal, especially if the file is throwing errors.
3. In the same terminal, run `go build`. This may take a moment
    - If you want to use `modd` for live devlopment, after building, install the latest version by running `go install github.com/cortesi/modd/cmd/modd@latest`, test the installation by running `modd`. If successful, data migration should occur and a backend development server should be running. You can learn more by reading about it in the README located in the `/backend` directory.
4. Open a new terminal, and run `cd frontend && npm run develop`. When you open the localhost page in your browser, the “Hello” page should have an “Hello World” message coming from the API response

# Developing

Open a new terminal and navigate to the `/frontend` directory and run `npm run dev` to start the frontend development server.

Visit http://localhost:5173 (frontend) or http://localhost:8090 (backend)

If you are running `modd`, making changes in the Svelte code (frontend) or Go code (backend) will show
results (almost) immediately.

# Feedback

Please provide feedback by
[opening an issue](https://github.com/evp2/pb-app/issues/new)
or
[starting a discussion](https://github.com/evp2/pb-app/discussions).
