# Uniform pull-push

This repo contains minimal setup to sync Uniform projects. 

## Setup

Do this once:

1. Create `.env` file with `UNIFORM_API_KEY=put-here-your-api-key-with-administrator-privileges`
1. Run this command
```
npm i
```

## How to use

### Download content from source project

Run this command:

```
> npm run pull
```

Paste the **SOURCE** project ID when it asks you:

```
Please specify UNIFORM_PROJECT_ID: 
```

Wait until it completes.

### Push downloaded content to target project

Run this command:

```
> npm run push
```

Paste the **TARGET** project ID when it asks you:

```
Please specify UNIFORM_PROJECT_ID: 
```

Wait until it completes.

