# CSSECDV-2223T3

Final Project for CSSECDV2223T3

# How to Run the Program

1. Clone the repository

```
https://github.com/lorenzo-querol/CCSECDV-Final-Project.git
```

2. Navigate to the 2021T2-G05 folder and install all the required dependencies using `yarn install`
3. Make sure to have `mkcert` installed. If you haven't follow this [set-up](https://github.com/FiloSottile/mkcert/releases)
4. Once installed, install the local CA and generate locally-trusted SSL certificates

```
mkcert -install   # Install the local CA
mkcert localhost  # Generate a trusted certificate for localhost
```

5. Run the program using

```
yarn dev
```

5. Once the program is running, your command prompt should display the following:

```
> Ready on https://localhost:3000
```

6. Access the application on:

```
https://localhost:3000
```
