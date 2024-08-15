# Uniform pull-push

This repo contains minimal setup to sync Uniform projects. 

## Setup

Do this once:

1. Create `.env` file with `UNIFORM_API_KEY=put-here-your-api-key-with-administrator-privileges`
1. Run this command
```
npm i
```

**Review `./uniform.config.ts` and include/exclude what you need (Optimize items are excluded by default)**

## How to use

### Download content from source project

**Make sure there's nothing valuable in `./content` dir –– it will be cleared**

Run this command:

```
> npm run pull
```

Paste the **SOURCE** project ID when it asks you:

```
Please specify UNIFORM_PROJECT_ID: 
```

Wait until it completes.

**Note:** YAML files will be post-processed for ease of comparison:
* `updated` and `created` fields will be removed
* properties order will be changed (where it is safe to do and does not change meaning) e.g. id, name, slug, ...

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

