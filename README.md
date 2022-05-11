# Visual Timer and Local Weather

Coded with React, Firebase, SASS, Tomorrow.io API

[![Visual Timer Preview Image](https://raw.githubusercontent.com/jfitzsimmons/visual-timer-react/master/preview.png)](https://visual-timer.netlify.app/ "Visual Timer Link")

**Explanation**  
I wanted a timer that would countdown, and then track how much time expired since finishing.
I also needed a replacement for the Duck Duck Go / Dark Sky weather widget integration.

## Installation

cd into cloned directory

```bash
yarn
```

remove -sample from .env-sample
Change Tomorrow.IO and Firebase credentials to your own

```bash
yarn build
yarn dev
```

## Deploy

Push code to your own repo.

For Netlify you need an account and a repo to connect to
[Netlify: Import an existing project from a Git repository](https://app.netlify.com/start)
Add .env variables to production through Netlify UI.

With continuos integration, each update to your default branch will trigger a build. I recommend pushing to a staging branch first.
