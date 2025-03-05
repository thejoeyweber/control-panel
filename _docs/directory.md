Directory structure:
└── thejoeyweber-control-panel/
    ├── .cursorrules
    ├── _docs/
    │   ├── directory.md
    │   ├── next-plan.md
    │   ├── projectstructure.md
    │   ├── rebuild-plan.md
    │   ├── techstack.md
    │   └── prompts/
    │       ├── build-prompt.md
    │       └── execution-prompt.md
    ├── app/
    │   ├── README.md
    │   ├── astro.config.mjs
    │   ├── package-lock.json
    │   ├── package.json
    │   ├── tailwind.config.js
    │   ├── tsconfig.json
    │   ├── .dir
    │   ├── .gitignore
    │   ├── public/
    │   ├── src/
    │   │   ├── assets/
    │   │   ├── components/
    │   │   │   ├── Welcome.astro
    │   │   │   ├── activity/
    │   │   │   │   ├── ActivityFilters.astro
    │   │   │   │   ├── ActivityList.astro
    │   │   │   │   ├── ActivityPagination.astro
    │   │   │   │   └── ActivityStats.astro
    │   │   │   └── projects/
    │   │   │       ├── ProjectCard.astro
    │   │   │       ├── ProjectFilters.astro
    │   │   │       ├── ProjectStats.astro
    │   │   │       ├── ProjectsAttention.astro
    │   │   │       ├── RecentActivity.astro
    │   │   │       └── TechStack.astro
    │   │   ├── data/
    │   │   │   ├── ai-tools.ts
    │   │   │   ├── books.ts
    │   │   │   ├── projects.ts
    │   │   │   ├── resources.ts
    │   │   │   ├── revenue.ts
    │   │   │   └── writing.ts
    │   │   ├── layouts/
    │   │   │   ├── BaseLayout.astro
    │   │   │   └── Layout.astro
    │   │   ├── pages/
    │   │   │   ├── activity-dashboard.astro
    │   │   │   ├── ai-library.astro
    │   │   │   ├── books.astro
    │   │   │   ├── index.astro
    │   │   │   ├── login.astro
    │   │   │   ├── projects.astro
    │   │   │   ├── resources.astro
    │   │   │   ├── revenue.astro
    │   │   │   ├── writing.astro
    │   │   │   └── project/
    │   │   │       └── [id].astro
    │   │   ├── styles/
    │   │   │   └── global.css
    │   │   ├── types/
    │   │   │   └── index.ts
    │   │   └── utils/
    │   │       ├── auth.ts
    │   │       └── data.ts
    │   └── .vscode/
    │       ├── extensions.json
    │       └── launch.json
    └── prototype/
        ├── README.md
        ├── build.js
        ├── package-lock.json
        ├── package.json
        ├── postcss.config.js
        ├── tailwind.config.js
        ├── update-pages.js
        ├── .gitignore
        ├── css/
        │   ├── styles.css
        │   └── tailwind.css
        ├── dist/
        │   ├── index.html
        │   ├── activity-dashboard/
        │   │   └── index.html
        │   ├── ai-library/
        │   │   └── index.html
        │   ├── books/
        │   │   └── index.html
        │   ├── css/
        │   │   ├── styles.css
        │   │   └── tailwind.css
        │   ├── img/
        │   ├── js/
        │   │   ├── build-pages.js
        │   │   └── main.js
        │   ├── pages/
        │   │   ├── activity-dashboard.html
        │   │   ├── ai-library.html
        │   │   ├── books.html
        │   │   ├── project-detail.html
        │   │   ├── projects.html
        │   │   ├── resources.html
        │   │   ├── revenue.html
        │   │   └── writing.html
        │   ├── project-detail/
        │   │   └── index.html
        │   ├── projects/
        │   │   └── index.html
        │   ├── resources/
        │   │   └── index.html
        │   ├── revenue/
        │   │   └── index.html
        │   └── writing/
        │       └── index.html
        ├── img/
        ├── js/
        │   ├── build-pages.js
        │   └── main.js
        ├── migration-scripts/
        │   └── create-page.js
        ├── pages/
        │   ├── activity-dashboard.html
        │   ├── ai-library.html
        │   ├── books.html
        │   ├── index.html
        │   ├── project-detail.html
        │   ├── projects.html
        │   ├── resources.html
        │   ├── revenue.html
        │   └── writing.html
        └── templates/
            └── base.html
